-- SQL to create company_category_list table for Supabase/Postgres

CREATE TABLE IF NOT EXISTS public.company_category_list (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  name_normalized TEXT NOT NULL,
  category TEXT,
  details TEXT,
  source_filename TEXT,
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- optional index to speed up provider+name lookups
CREATE INDEX IF NOT EXISTS idx_company_provider_name ON public.company_category_list (provider, name_normalized);

-- ensure uniqueness per provider + normalized name
CREATE UNIQUE INDEX IF NOT EXISTS uq_company_provider_name ON public.company_category_list (provider, name_normalized);
