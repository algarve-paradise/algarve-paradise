-- AI Ingestion Pipeline
-- Adds tables for source registry and raw ingestion log,
-- and extends news_posts with AI metadata.

-- ---------------------------------------------------------------------------
-- 1. Source registry: where the pipeline pulls content from
-- ---------------------------------------------------------------------------
create table if not exists public.ingest_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  type text not null check (type in ('rss', 'sitemap', 'html', 'ical', 'api')),
  region text not null default 'algarve',
  default_category text not null default 'Algarve',
  enabled boolean not null default true,
  rate_limit_seconds integer not null default 60,
  last_fetched_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (url)
);

create index if not exists ingest_sources_region_idx
  on public.ingest_sources (region) where enabled = true;

-- ---------------------------------------------------------------------------
-- 2. Raw ingestion log (one row per item discovered, used for dedupe + audit)
-- ---------------------------------------------------------------------------
create table if not exists public.ingest_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.ingest_sources(id) on delete set null,
  hash text not null,
  raw_url text not null,
  raw_title text,
  raw_summary text,
  raw_published_at timestamptz,
  raw_payload jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'rewritten', 'rejected', 'duplicate', 'failed')),
  failure_reason text,
  news_post_id uuid,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (hash)
);

create index if not exists ingest_items_status_idx
  on public.ingest_items (status, created_at desc);
create index if not exists ingest_items_source_idx
  on public.ingest_items (source_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 3. Extend news_posts with AI metadata + region
-- ---------------------------------------------------------------------------
alter table public.news_posts
  add column if not exists region text not null default 'algarve',
  add column if not exists ai_generated boolean not null default false,
  add column if not exists ai_provider text,
  add column if not exists ai_model text,
  add column if not exists ai_confidence numeric(3, 2),
  add column if not exists ingest_item_id uuid references public.ingest_items(id) on delete set null,
  add column if not exists ai_review_deadline timestamptz;

create index if not exists news_posts_ai_pending_idx
  on public.news_posts (ai_review_deadline)
  where ai_generated = true and status = 'draft';

-- Late FK from ingest_items -> news_posts (needs both tables to exist)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'ingest_items_news_post_id_fkey'
  ) then
    alter table public.ingest_items
      add constraint ingest_items_news_post_id_fkey
      foreign key (news_post_id)
      references public.news_posts(id)
      on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.ingest_sources enable row level security;
alter table public.ingest_items enable row level security;

-- Only the service role (used by the cron + admin endpoints) can read/write
-- these tables. No anon access. Authenticated admin reads happen via server
-- routes that use the service role client, so we don't need a public policy.
drop policy if exists "ingest_sources service role" on public.ingest_sources;
create policy "ingest_sources service role"
  on public.ingest_sources
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists "ingest_items service role" on public.ingest_items;
create policy "ingest_items service role"
  on public.ingest_items
  for all
  to service_role
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- 5. updated_at trigger for ingest_sources
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ingest_sources_set_updated_at on public.ingest_sources;
create trigger ingest_sources_set_updated_at
  before update on public.ingest_sources
  for each row execute function public.set_updated_at();
