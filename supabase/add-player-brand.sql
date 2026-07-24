-- Add brand tracking to players
-- Run this in Supabase SQL Editor

-- Brand at registration (immutable) + last brand used (updated on login)
ALTER TABLE players
ADD COLUMN IF NOT EXISTS brand text DEFAULT 'kanuuna',
ADD COLUMN IF NOT EXISTS last_brand text DEFAULT 'kanuuna';

CREATE INDEX IF NOT EXISTS idx_players_brand ON players(brand);
CREATE INDEX IF NOT EXISTS idx_players_last_brand ON players(last_brand);

-- Constrain to known brands
DO $$ BEGIN
  ALTER TABLE players
    ADD CONSTRAINT players_brand_check
    CHECK (brand IN ('lonkero', 'kanuuna', 'fyffe'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE players
    ADD CONSTRAINT players_last_brand_check
    CHECK (last_brand IN ('lonkero', 'kanuuna', 'fyffe'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Refresh player_summary view to include brand fields
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
