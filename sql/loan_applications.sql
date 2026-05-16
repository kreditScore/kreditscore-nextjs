-- Run against your PostgreSQL instance (e.g. Cloud SQL, Neon, Railway).
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL,
  phone_e164 TEXT NOT NULL,
  source TEXT NOT NULL,
  display_name TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS loan_applications_created_at_idx
  ON loan_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS loan_applications_source_idx
  ON loan_applications (source);
