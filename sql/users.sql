-- ============================================================
-- KreditScore: users table
-- Run this in Supabase SQL Editor (or psql)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid  TEXT          NOT NULL UNIQUE,
  phone_e164    TEXT,                          -- e.g. +919876543210
  email         TEXT,
  display_name  TEXT,
  photo_url     TEXT,
  provider      TEXT          NOT NULL DEFAULT 'phone', -- 'phone' | 'google'
  role          TEXT          NOT NULL DEFAULT 'user',  -- 'user' | 'admin'
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row change
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

-- Index for fast firebase_uid lookups (used in every API call)
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users (firebase_uid);

-- Index for phone lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone_e164);
