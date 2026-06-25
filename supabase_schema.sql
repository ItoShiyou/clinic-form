-- Supabase SQL Editor で実行してください

create table clinics (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  name text not null,
  plan text not null default 'lite' check (plan in ('lite', 'standard', 'clinic')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  response_count_this_month integer not null default 0,
  created_at timestamptz not null default now()
);

create table forms (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  title text not null,
  description text,
  fields jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms(id) on delete cascade,
  clinic_id uuid not null references clinics(id) on delete cascade,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- インデックス
create index on forms(clinic_id);
create index on responses(clinic_id);
create index on responses(form_id);
create index on responses(created_at desc);

-- 月次リセット用（毎月1日に実行するCronを設定）
-- update clinics set response_count_this_month = 0;

-- Row Level Security（オプション、サービスロールキー使用なら不要）
alter table clinics enable row level security;
alter table forms enable row level security;
alter table responses enable row level security;
