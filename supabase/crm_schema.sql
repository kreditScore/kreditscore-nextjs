-- KreditScore CRM schema for Supabase/PostgreSQL
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.team_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  email text not null unique,
  mobile varchar(10) not null unique,
  role text not null check (role in ('super_admin', 'admin', 'team_lead', 'executive')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_code text not null unique,
  applicant_name text not null,
  mobile varchar(10) not null,
  source text not null check (source in ('website', 'campaign', 'manual', 'api')),
  campaign text,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'form_sent', 'form_submitted', 'follow_up_pending', 'qualified', 'closed')
  ),
  assigned_to uuid references public.team_users(id),
  notes text,
  next_follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  applicant_dob date,
  pan_card_no varchar(10),
  aadhaar_card_no varchar(12),
  father_name text,
  mother_name text,
  spouse_name text,
  education text,
  personal_email text,
  residence_address text,
  residence_landline_no text,
  residence_type text,
  years_at_current_address numeric(5,2),
  permanent_address text,
  permanent_mobile_no varchar(10),
  company_name text,
  office_address text,
  official_landline_no text,
  official_email text,
  years_at_current_job numeric(5,2),
  department text,
  designation text,
  total_work_experience numeric(5,2),
  reference_1_name text,
  reference_1_mobile varchar(10),
  reference_1_address text,
  reference_1_relationship text,
  reference_2_name text,
  reference_2_mobile varchar(10),
  reference_2_address text,
  reference_2_relationship text,
  loan_type text,
  required_loan_amount numeric(14,2),
  preferred_tenure_months integer,
  completion_status text not null default 'draft' check (completion_status in ('draft', 'partial', 'completed', 'verified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_events (
  id bigserial primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_user_id uuid references public.team_users(id),
  event_type text not null,
  event_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_mobile on public.leads(mobile);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_lead_events_lead_id on public.lead_events(lead_id);

-- Keep updated_at in sync automatically
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_team_users_updated_at on public.team_users;
create trigger trg_team_users_updated_at
before update on public.team_users
for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists trg_customer_profiles_updated_at on public.customer_profiles;
create trigger trg_customer_profiles_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

-- RLS helpers
create or replace function public.current_team_role()
returns text
language sql
stable
as $$
  select role
  from public.team_users
  where auth_user_id = auth.uid()
    and is_active = true
  limit 1
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_team_role() in ('super_admin', 'admin'), false)
$$;

create or replace function public.is_team_user()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_team_role() in ('super_admin', 'admin', 'team_lead', 'executive'), false)
$$;

-- Enable RLS
alter table public.team_users enable row level security;
alter table public.leads enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.lead_events enable row level security;

-- Clean existing policies for repeat-safe execution
drop policy if exists team_users_admin_read on public.team_users;
drop policy if exists team_users_admin_write on public.team_users;
drop policy if exists team_users_self_read on public.team_users;
drop policy if exists leads_team_read on public.leads;
drop policy if exists leads_team_update on public.leads;
drop policy if exists leads_team_insert on public.leads;
drop policy if exists profiles_team_read on public.customer_profiles;
drop policy if exists profiles_team_write on public.customer_profiles;
drop policy if exists events_team_read on public.lead_events;
drop policy if exists events_team_insert on public.lead_events;

-- team_users policies
create policy team_users_admin_read
on public.team_users
for select
using (public.is_admin_user());

create policy team_users_admin_write
on public.team_users
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy team_users_self_read
on public.team_users
for select
using (auth_user_id = auth.uid());

-- leads policies
create policy leads_team_read
on public.leads
for select
using (public.is_team_user());

create policy leads_team_insert
on public.leads
for insert
with check (public.is_team_user());

create policy leads_team_update
on public.leads
for update
using (
  public.is_admin_user()
  or (
    public.current_team_role() in ('team_lead', 'executive')
    and assigned_to in (
      select id from public.team_users where auth_user_id = auth.uid()
    )
  )
)
with check (
  public.is_admin_user()
  or (
    public.current_team_role() in ('team_lead', 'executive')
    and assigned_to in (
      select id from public.team_users where auth_user_id = auth.uid()
    )
  )
);

-- customer_profiles policies
create policy profiles_team_read
on public.customer_profiles
for select
using (public.is_team_user());

create policy profiles_team_write
on public.customer_profiles
for all
using (public.is_team_user())
with check (public.is_team_user());

-- lead_events policies
create policy events_team_read
on public.lead_events
for select
using (public.is_team_user());

create policy events_team_insert
on public.lead_events
for insert
with check (public.is_team_user());
