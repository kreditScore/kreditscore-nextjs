-- ================================================================
-- KreditScore — Full Supabase PostgreSQL Schema
-- Run this ONCE in Supabase SQL Editor
-- Architecture: Firebase (OTP auth only) + Supabase (all data)
-- ================================================================


-- ================================================================
-- 1. USERS TABLE
-- Synced from Firebase after every login (upsert on firebase_uid)
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid  TEXT          NOT NULL UNIQUE,
  phone_e164    TEXT,                               -- +919876543210
  email         TEXT,
  display_name  TEXT,
  photo_url     TEXT,
  provider      TEXT          NOT NULL DEFAULT 'phone',  -- phone | google
  role          TEXT          NOT NULL DEFAULT 'user',   -- user | admin
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users (firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_phone        ON users (phone_e164);
CREATE INDEX IF NOT EXISTS idx_users_email        ON users (email);


-- ================================================================
-- 2. LOAN APPLICATIONS TABLE
-- Stores every form submission with full payload as JSONB
-- ================================================================
CREATE TABLE IF NOT EXISTS loan_applications (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid    TEXT          NOT NULL,
  phone_e164      TEXT,
  source          TEXT          NOT NULL,   -- page slug: 'instant-personal-loan-online' etc
  display_name    TEXT,
  -- Flattened key fields for easy filtering in admin
  loan_amount     NUMERIC,
  city            TEXT,
  employment_type TEXT,
  company_name    TEXT,
  net_salary      NUMERIC,
  -- Full form payload for all other fields
  payload         JSONB         NOT NULL DEFAULT '{}',
  status          TEXT          NOT NULL DEFAULT 'pending',  -- pending | processing | approved | rejected
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (firebase_uid) REFERENCES users (firebase_uid) ON DELETE SET NULL
);

DROP TRIGGER IF EXISTS loan_applications_updated_at ON loan_applications;
CREATE TRIGGER loan_applications_updated_at
  BEFORE UPDATE ON loan_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_apps_firebase_uid ON loan_applications (firebase_uid);
CREATE INDEX IF NOT EXISTS idx_apps_status       ON loan_applications (status);
CREATE INDEX IF NOT EXISTS idx_apps_created_at   ON loan_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apps_source       ON loan_applications (source);
CREATE INDEX IF NOT EXISTS idx_apps_payload      ON loan_applications USING gin (payload);


-- ================================================================
-- 3. COMPANIES TABLE
-- Migrated from bank_companies.db via scripts/migrate_to_supabase.py
-- ================================================================
CREATE TABLE IF NOT EXISTS companies (
  id         BIGSERIAL  PRIMARY KEY,
  company    TEXT       NOT NULL,
  bank       TEXT,
  category   TEXT,
  segment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_unique ON companies (UPPER(company), UPPER(COALESCE(bank, '')));
CREATE INDEX IF NOT EXISTS idx_companies_company_trgm  ON companies USING gin (company gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_companies_bank          ON companies (UPPER(bank));
CREATE INDEX IF NOT EXISTS idx_companies_category      ON companies (UPPER(category));

-- Enable pg_trgm for fast ILIKE search
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ================================================================
-- 4. RLS POLICIES
-- ================================================================

-- USERS: users can only read/update their own row
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (firebase_uid = current_setting('app.firebase_uid', true));

CREATE POLICY "Service role full access to users"
  ON users FOR ALL TO service_role USING (true) WITH CHECK (true);


-- LOAN APPLICATIONS: users see only their own applications
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own applications"
  ON loan_applications FOR SELECT
  USING (firebase_uid = current_setting('app.firebase_uid', true));

CREATE POLICY "Users can insert own application"
  ON loan_applications FOR INSERT
  WITH CHECK (firebase_uid = current_setting('app.firebase_uid', true));

CREATE POLICY "Service role full access to applications"
  ON loan_applications FOR ALL TO service_role USING (true) WITH CHECK (true);


-- COMPANIES: public read-only (not sensitive)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read companies"
  ON companies FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Service role manages companies"
  ON companies FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ================================================================
-- 5. HELPER RPC FUNCTIONS
-- ================================================================

-- Bank stats for /api/company-category/stats
CREATE OR REPLACE FUNCTION get_company_bank_stats()
RETURNS TABLE (bank TEXT, cnt BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT bank, COUNT(*) AS cnt
  FROM companies
  WHERE bank IS NOT NULL
  GROUP BY bank
  ORDER BY cnt DESC;
$$;

-- Upsert user after Firebase login (called from /api/auth/sync)
CREATE OR REPLACE FUNCTION upsert_firebase_user(
  p_firebase_uid TEXT,
  p_phone        TEXT DEFAULT NULL,
  p_email        TEXT DEFAULT NULL,
  p_display_name TEXT DEFAULT NULL,
  p_photo_url    TEXT DEFAULT NULL,
  p_provider     TEXT DEFAULT 'phone'
)
RETURNS users
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result users;
BEGIN
  INSERT INTO users (firebase_uid, phone_e164, email, display_name, photo_url, provider, last_login_at)
  VALUES (p_firebase_uid, p_phone, p_email, p_display_name, p_photo_url, p_provider, NOW())
  ON CONFLICT (firebase_uid) DO UPDATE SET
    phone_e164    = COALESCE(EXCLUDED.phone_e164,    users.phone_e164),
    email         = COALESCE(EXCLUDED.email,         users.email),
    display_name  = COALESCE(EXCLUDED.display_name,  users.display_name),
    photo_url     = COALESCE(EXCLUDED.photo_url,     users.photo_url),
    provider      = EXCLUDED.provider,
    last_login_at = NOW()
  RETURNING * INTO result;
  RETURN result;
END;
$$;
