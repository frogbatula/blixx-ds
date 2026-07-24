-- Player Management System Schema
-- Run this in Supabase SQL Editor

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE player_status AS ENUM ('active', 'suspended', 'self_excluded', 'closed');
CREATE TYPE player_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE attribution_source AS ENUM ('organic', 'affiliate', 'social', 'referral', 'paid_ad');
CREATE TYPE wallet_type AS ENUM ('real_money', 'bonus');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'bet', 'win', 'bonus_credit', 'bonus_conversion', 'adjustment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE bet_outcome AS ENUM ('pending', 'win', 'loss', 'void', 'cashout');
CREATE TYPE game_type AS ENUM ('casino', 'sports');
CREATE TYPE free_bet_status AS ENUM ('active', 'used', 'expired');
CREATE TYPE kyc_level AS ENUM ('none', 'basic', 'verified', 'enhanced');
CREATE TYPE rg_control_type AS ENUM ('deposit_limit', 'loss_limit', 'session_limit', 'product_break', 'full_break', 'account_closure');
CREATE TYPE rg_product AS ENUM ('casino', 'sports', 'all');
CREATE TYPE limit_period AS ENUM ('daily', 'weekly', 'monthly');

-- ===========================================
-- PLAYERS TABLE
-- ===========================================

CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  phone_verified boolean DEFAULT false,
  email text,
  display_name text,
  first_name text,
  last_name text,
  date_of_birth date,
  country_code text DEFAULT 'FI',
  locale text DEFAULT 'en',
  status player_status DEFAULT 'active',
  tier player_tier DEFAULT 'bronze',
  tier_override boolean DEFAULT false,
  brand text DEFAULT 'kanuuna' CHECK (brand IN ('lonkero', 'kanuuna', 'fyffe')),
  last_brand text DEFAULT 'kanuuna' CHECK (last_brand IN ('lonkero', 'kanuuna', 'fyffe')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_players_phone ON players(phone);
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_tier ON players(tier);
CREATE INDEX idx_players_brand ON players(brand);
CREATE INDEX idx_players_last_brand ON players(last_brand);

-- ===========================================
-- PLAYER SESSIONS (for phone OTP login)
-- ===========================================

CREATE TABLE player_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_player_sessions_token ON player_sessions(token);
CREATE INDEX idx_player_sessions_player ON player_sessions(player_id);

-- ===========================================
-- OTP CODES (for mock SMS verification)
-- ===========================================

CREATE TABLE otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  purpose text DEFAULT 'login', -- 'login' or 'register'
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_otp_codes_phone ON otp_codes(phone);

-- ===========================================
-- PLAYER ATTRIBUTION
-- ===========================================

CREATE TABLE player_attribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  source attribution_source DEFAULT 'organic',
  source_code text, -- affiliate code, referral code
  campaign text,
  landing_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referred_by_player_id uuid REFERENCES players(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id)
);

CREATE INDEX idx_attribution_source ON player_attribution(source);
CREATE INDEX idx_attribution_code ON player_attribution(source_code);

-- ===========================================
-- WALLETS
-- ===========================================

CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  type wallet_type NOT NULL,
  currency text DEFAULT 'EUR',
  balance numeric(15, 2) DEFAULT 0,
  locked_balance numeric(15, 2) DEFAULT 0, -- for wagering requirements
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(player_id, type, currency)
);

CREATE INDEX idx_wallets_player ON wallets(player_id);

-- ===========================================
-- TRANSACTIONS
-- ===========================================

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount numeric(15, 2) NOT NULL,
  balance_before numeric(15, 2) NOT NULL,
  balance_after numeric(15, 2) NOT NULL,
  reference_id text, -- links to bet_id, game_session_id, etc.
  reference_type text, -- 'bet', 'game_session', 'bonus', etc.
  status transaction_status DEFAULT 'completed',
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_transactions_player ON transactions(player_id);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ===========================================
-- FREE BETS
-- ===========================================

CREATE TABLE free_bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  amount numeric(15, 2) NOT NULL,
  currency text DEFAULT 'EUR',
  game_type game_type, -- null means all games
  min_odds numeric(5, 2), -- for sports bets
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz NOT NULL,
  used_at timestamptz,
  used_bet_id uuid, -- will reference bets(id)
  status free_bet_status DEFAULT 'active',
  source text, -- 'welcome_bonus', 'promotion', 'manual', etc.
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_free_bets_player ON free_bets(player_id);
CREATE INDEX idx_free_bets_status ON free_bets(status);

-- ===========================================
-- GAME SESSIONS
-- ===========================================

CREATE TABLE game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  game_id text NOT NULL, -- references games from CMS
  game_name text,
  game_provider text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  total_bets numeric(15, 2) DEFAULT 0,
  total_wins numeric(15, 2) DEFAULT 0,
  bet_count integer DEFAULT 0,
  currency text DEFAULT 'EUR'
);

CREATE INDEX idx_game_sessions_player ON game_sessions(player_id);
CREATE INDEX idx_game_sessions_game ON game_sessions(game_id);
CREATE INDEX idx_game_sessions_started ON game_sessions(started_at DESC);

-- ===========================================
-- BETS
-- ===========================================

CREATE TABLE bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  game_session_id uuid REFERENCES game_sessions(id),
  game_id text,
  game_type game_type NOT NULL,
  stake numeric(15, 2) NOT NULL,
  currency text DEFAULT 'EUR',
  free_bet_id uuid REFERENCES free_bets(id),
  outcome bet_outcome DEFAULT 'pending',
  payout numeric(15, 2),
  odds numeric(10, 4), -- for sports bets
  is_first_bet boolean DEFAULT false,
  bet_details jsonb DEFAULT '{}', -- game-specific details
  placed_at timestamptz DEFAULT now(),
  settled_at timestamptz
);

CREATE INDEX idx_bets_player ON bets(player_id);
CREATE INDEX idx_bets_game_session ON bets(game_session_id);
CREATE INDEX idx_bets_outcome ON bets(outcome);
CREATE INDEX idx_bets_placed ON bets(placed_at DESC);
CREATE INDEX idx_bets_first ON bets(player_id, is_first_bet) WHERE is_first_bet = true;

-- Add FK for free_bets.used_bet_id
ALTER TABLE free_bets ADD CONSTRAINT fk_free_bets_used_bet 
  FOREIGN KEY (used_bet_id) REFERENCES bets(id);

-- ===========================================
-- KYC STATUS
-- ===========================================

CREATE TABLE kyc_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL UNIQUE,
  level kyc_level DEFAULT 'none',
  documents_submitted jsonb DEFAULT '[]', -- [{type, url, uploaded_at}]
  rejection_reason text,
  verified_at timestamptz,
  verified_by uuid, -- CMS user who verified
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_kyc_player ON kyc_status(player_id);
CREATE INDEX idx_kyc_level ON kyc_status(level);

-- ===========================================
-- RESPONSIBLE GAMING CONTROLS
-- ===========================================

CREATE TABLE responsible_gaming (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  control_type rg_control_type NOT NULL,
  product rg_product DEFAULT 'all',
  limit_value numeric(15, 2), -- for limits (deposit, loss)
  limit_period limit_period, -- daily, weekly, monthly
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz, -- null = indefinite
  reason text,
  set_by_player boolean DEFAULT true, -- false if set by admin
  set_by_admin_id uuid, -- CMS user if admin-set
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancelled_reason text
);

CREATE INDEX idx_rg_player ON responsible_gaming(player_id);
CREATE INDEX idx_rg_active ON responsible_gaming(player_id, is_active) WHERE is_active = true;
CREATE INDEX idx_rg_type ON responsible_gaming(control_type);

-- ===========================================
-- PLAYER NOTES (for CMS admins)
-- ===========================================

CREATE TABLE player_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  author_id uuid NOT NULL, -- CMS user
  author_email text,
  content text NOT NULL,
  is_important boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notes_player ON player_notes(player_id);

-- ===========================================
-- VIEWS
-- ===========================================

-- Player summary for CMS
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
  -- Wallets
  COALESCE(rw.balance, 0) as real_balance,
  COALESCE(bw.balance, 0) as bonus_balance,
  -- KYC
  COALESCE(k.level, 'none') as kyc_level,
  -- Attribution
  a.source as attribution_source,
  a.source_code as attribution_code,
  -- Stats
  COALESCE(ts.total_deposits, 0) as total_deposits,
  COALESCE(ts.total_withdrawals, 0) as total_withdrawals,
  COALESCE(ts.total_bets, 0) as total_bets,
  COALESCE(ts.total_wins, 0) as total_wins,
  COALESCE(bs.bet_count, 0) as bet_count,
  bs.first_bet_at,
  bs.last_bet_at,
  -- Active RG controls
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

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsible_gaming ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_notes ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated users (CMS admins can access all)
-- Players can only access their own data via custom auth

CREATE POLICY "Authenticated full access" ON players FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON player_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON otp_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON player_attribution FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON wallets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON free_bets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON game_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON bets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON kyc_status FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON responsible_gaming FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access" ON player_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Anon policies for player self-service (OTP flow)
CREATE POLICY "Anon can create OTP" ON otp_codes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read OTP" ON otp_codes FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can update OTP" ON otp_codes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can create player" ON players FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read player by phone" ON players FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create session" ON player_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read session" ON player_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create attribution" ON player_attribution FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can create wallets" ON wallets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read wallets" ON wallets FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can create kyc" ON kyc_status FOR INSERT TO anon WITH CHECK (true);

-- Grant access to the view
GRANT SELECT ON player_summary TO authenticated;
GRANT SELECT ON player_summary TO anon;

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to create initial wallets for a player
CREATE OR REPLACE FUNCTION create_player_wallets()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (player_id, type, currency) VALUES 
    (NEW.id, 'real_money', 'EUR'),
    (NEW.id, 'bonus', 'EUR');
  
  INSERT INTO kyc_status (player_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_player_wallets
  AFTER INSERT ON players
  FOR EACH ROW
  EXECUTE FUNCTION create_player_wallets();

-- Function to mark first bet
CREATE OR REPLACE FUNCTION check_first_bet()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM bets WHERE player_id = NEW.player_id AND id != NEW.id) THEN
    NEW.is_first_bet := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_first_bet
  BEFORE INSERT ON bets
  FOR EACH ROW
  EXECUTE FUNCTION check_first_bet();

-- Function to auto-recalculate tier from deposits + bet activity
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

CREATE TRIGGER trigger_update_tier_on_bet
  AFTER INSERT ON bets
  FOR EACH ROW
  EXECUTE FUNCTION update_player_tier_on_bet();
