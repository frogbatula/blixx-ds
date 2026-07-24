-- Add Player Tiers (migration for existing databases)
-- Run this in Supabase SQL Editor if you already applied player-schema.sql without tiers

-- Create tier enum (ignore if exists)
DO $$ BEGIN
  CREATE TYPE player_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add tier columns to players table
ALTER TABLE players
ADD COLUMN IF NOT EXISTS tier player_tier DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS tier_override boolean DEFAULT false;

-- Create index for tier filtering
CREATE INDEX IF NOT EXISTS idx_players_tier ON players(tier);

-- Update the player_summary view to include tier
DROP VIEW IF EXISTS player_summary;

CREATE OR REPLACE VIEW player_summary AS
SELECT
  p.id,
  p.phone,
  p.email,
  p.display_name,
  p.first_name,
  p.last_name,
  p.country_code,
  p.status,
  p.tier,
  p.tier_override,
  p.brand,
  p.last_brand,
  p.created_at,
  p.updated_at,
  COALESCE(rw.balance, 0) as real_balance,
  COALESCE(bw.balance, 0) as bonus_balance,
  COALESCE(k.level, 'none') as kyc_level,
  a.source as attribution_source,
  a.source_code as attribution_code,
  COALESCE(ts.total_deposits, 0) as total_deposits,
  COALESCE(ts.total_withdrawals, 0) as total_withdrawals,
  COALESCE(ts.total_bets, 0) as total_bets,
  COALESCE(ts.total_wins, 0) as total_wins,
  COALESCE(bs.bet_count, 0) as bet_count,
  bs.first_bet_at,
  bs.last_bet_at,
  COALESCE(rg.active_controls, 0) as active_rg_controls
FROM players p
LEFT JOIN wallets rw ON rw.player_id = p.id AND rw.type = 'real_money'
LEFT JOIN wallets bw ON bw.player_id = p.id AND bw.type = 'bonus'
LEFT JOIN kyc_status k ON k.player_id = p.id
LEFT JOIN player_attribution a ON a.player_id = p.id
LEFT JOIN LATERAL (
  SELECT
    SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as total_deposits,
    SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END) as total_withdrawals,
    SUM(CASE WHEN type = 'bet' THEN amount ELSE 0 END) as total_bets,
    SUM(CASE WHEN type = 'win' THEN amount ELSE 0 END) as total_wins
  FROM transactions WHERE player_id = p.id
) ts ON true
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) as bet_count,
    MIN(placed_at) as first_bet_at,
    MAX(placed_at) as last_bet_at
  FROM bets WHERE player_id = p.id
) bs ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as active_controls
  FROM responsible_gaming WHERE player_id = p.id AND is_active = true
) rg ON true;

GRANT SELECT ON player_summary TO authenticated;
GRANT SELECT ON player_summary TO anon;

-- Recalculate tier from deposits + bet activity
CREATE OR REPLACE FUNCTION recalculate_player_tier(p_player_id uuid)
RETURNS void AS $$
DECLARE
  v_total_deposits numeric;
  v_bet_count integer;
  v_tier_override boolean;
  v_new_tier player_tier;
BEGIN
  SELECT tier_override INTO v_tier_override FROM players WHERE id = p_player_id;
  IF v_tier_override THEN
    RETURN;
  END IF;

  SELECT COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END), 0)
  INTO v_total_deposits
  FROM transactions
  WHERE player_id = p_player_id;

  SELECT COUNT(*) INTO v_bet_count FROM bets WHERE player_id = p_player_id;

  IF v_total_deposits >= 50000 AND v_bet_count >= 5000 THEN
    v_new_tier := 'diamond';
  ELSIF v_total_deposits >= 10000 AND v_bet_count >= 1000 THEN
    v_new_tier := 'platinum';
  ELSIF v_total_deposits >= 2000 AND v_bet_count >= 200 THEN
    v_new_tier := 'gold';
  ELSIF v_total_deposits >= 500 AND v_bet_count >= 50 THEN
    v_new_tier := 'silver';
  ELSE
    v_new_tier := 'bronze';
  END IF;

  UPDATE players
  SET tier = v_new_tier, updated_at = now()
  WHERE id = p_player_id AND (tier IS DISTINCT FROM v_new_tier);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_player_tier_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type IN ('deposit', 'bet') THEN
    PERFORM recalculate_player_tier(NEW.player_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tier_on_deposit ON transactions;
DROP TRIGGER IF EXISTS trigger_update_tier_on_transaction ON transactions;
CREATE TRIGGER trigger_update_tier_on_transaction
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_player_tier_on_transaction();

CREATE OR REPLACE FUNCTION update_player_tier_on_bet()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalculate_player_tier(NEW.player_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tier_on_bet ON bets;
CREATE TRIGGER trigger_update_tier_on_bet
  AFTER INSERT ON bets
  FOR EACH ROW
  EXECUTE FUNCTION update_player_tier_on_bet();

-- Backfill tiers for existing players
UPDATE players p
SET tier = CASE
  WHEN COALESCE(stats.total_deposits, 0) >= 50000 AND COALESCE(stats.bet_count, 0) >= 5000 THEN 'diamond'::player_tier
  WHEN COALESCE(stats.total_deposits, 0) >= 10000 AND COALESCE(stats.bet_count, 0) >= 1000 THEN 'platinum'::player_tier
  WHEN COALESCE(stats.total_deposits, 0) >= 2000 AND COALESCE(stats.bet_count, 0) >= 200 THEN 'gold'::player_tier
  WHEN COALESCE(stats.total_deposits, 0) >= 500 AND COALESCE(stats.bet_count, 0) >= 50 THEN 'silver'::player_tier
  ELSE 'bronze'::player_tier
END
FROM (
  SELECT
    p2.id as player_id,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions t WHERE t.player_id = p2.id AND t.type = 'deposit') as total_deposits,
    (SELECT COUNT(*) FROM bets b WHERE b.player_id = p2.id) as bet_count
  FROM players p2
) stats
WHERE p.id = stats.player_id
  AND COALESCE(p.tier_override, false) = false;
