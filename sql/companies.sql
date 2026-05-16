-- ============================================================
-- KreditScore: companies table for company-category search
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS companies (
  id          BIGSERIAL     PRIMARY KEY,
  company     TEXT          NOT NULL,
  bank        TEXT,
  category    TEXT,
  segment     TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes for fast search (used in /api/company-category)
CREATE INDEX IF NOT EXISTS idx_companies_company  ON companies USING gin(to_tsvector('simple', company));
CREATE INDEX IF NOT EXISTS idx_companies_bank     ON companies (UPPER(bank));
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies (UPPER(category));

-- Full text search index for fast LIKE queries
CREATE INDEX IF NOT EXISTS idx_companies_company_upper ON companies (UPPER(company) text_pattern_ops);

-- Enable RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Public read-only access (company list is not sensitive data)
CREATE POLICY "Public read companies"
  ON companies
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Service role manages companies"
  ON companies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
