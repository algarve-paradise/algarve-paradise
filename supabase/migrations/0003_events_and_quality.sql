-- Phase 6 — Events pipeline + source quality scoring + HTML parser support.

-- ---------------------------------------------------------------------------
-- 1. Events table (mirror of news_posts shape, scoped to event metadata)
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null,
  category text not null default 'Eventos',
  cover_image_url text,
  cover_image_path text,
  source_name text,
  source_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  region text not null default 'algarve',
  ai_generated boolean not null default false,
  ai_provider text,
  ai_model text,
  ai_confidence numeric(3, 2),
  ai_review_deadline timestamptz,
  ingest_item_id uuid references public.ingest_items(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists events_status_starts_at_idx
  on public.events (status, starts_at desc);
create index if not exists events_ai_pending_idx
  on public.events (ai_review_deadline)
  where ai_generated = true and status = 'draft';

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

drop policy if exists "events public read published" on public.events;
create policy "events public read published"
  on public.events
  for select
  to anon, authenticated
  using (status = 'published' and starts_at >= now() - interval '1 day');

drop policy if exists "events service role" on public.events;
create policy "events service role"
  on public.events
  for all
  to service_role
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- 2. Source-level quality scoring + content kind discrimination
-- ---------------------------------------------------------------------------
alter table public.ingest_sources
  add column if not exists content_kind text not null default 'news'
    check (content_kind in ('news', 'events')),
  add column if not exists total_rewritten integer not null default 0,
  add column if not exists total_rejected integer not null default 0,
  add column if not exists total_published integer not null default 0,
  add column if not exists total_failed integer not null default 0;

-- Quality score is computed live so it always reflects the latest counters.
create or replace view public.ingest_source_quality as
select
  s.*,
  case
    when (s.total_rewritten + s.total_rejected + s.total_failed) = 0 then 0.5
    else (
      (s.total_published::numeric * 1.0 + s.total_rewritten::numeric * 0.3)
      / nullif(s.total_rewritten + s.total_rejected + s.total_failed, 0)
    )
  end as quality_score
from public.ingest_sources s;

-- Atomic counter bump used by the pipeline / approve / reject flows.
create or replace function public.bump_source_counter(
  p_source_id uuid,
  p_field text
) returns void as $$
begin
  if p_source_id is null then
    return;
  end if;
  if p_field = 'rewritten' then
    update public.ingest_sources set total_rewritten = total_rewritten + 1 where id = p_source_id;
  elsif p_field = 'rejected' then
    update public.ingest_sources set total_rejected = total_rejected + 1 where id = p_source_id;
  elsif p_field = 'published' then
    update public.ingest_sources set total_published = total_published + 1 where id = p_source_id;
  elsif p_field = 'failed' then
    update public.ingest_sources set total_failed = total_failed + 1 where id = p_source_id;
  end if;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------------
-- 3. Discriminate ingest_items by kind so events and news cohabit safely
-- ---------------------------------------------------------------------------
alter table public.ingest_items
  add column if not exists kind text not null default 'news'
    check (kind in ('news', 'event')),
  add column if not exists raw_starts_at timestamptz,
  add column if not exists raw_ends_at timestamptz,
  add column if not exists raw_location text;

-- Allow ingest_items.news_post_id to point to an event row when kind='event'.
-- We keep a separate column for clarity rather than reusing news_post_id.
alter table public.ingest_items
  add column if not exists event_id uuid references public.events(id) on delete set null;
