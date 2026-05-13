-- =============================================================================
-- ALGARVE TV — Manual Deploy Setup
-- Run this single file on a fresh Supabase project for the manual-only system.
-- When the AI automation tier is enabled later, run the ai_upgrade_setup.sql.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Base types
-- ---------------------------------------------------------------------------
create type public.news_status as enum ('draft', 'published');

-- ---------------------------------------------------------------------------
-- 2. Shared trigger function (used by multiple tables)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Alias used by the news/profiles triggers defined below
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

alter table public.profiles enable row level security;

create policy "Authenticated users can view profiles"
  on public.profiles for select to authenticated using (true);

create policy "Authenticated users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. News posts
-- ---------------------------------------------------------------------------
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users (id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null check (category in (
    'Algarve', 'Municipios', 'Economia', 'Turismo', 'Seguranca', 'Eventos', 'Reportagem'
  )),
  cover_image_url text,
  cover_image_path text,
  source_name text,
  source_url text,
  featured boolean not null default false,
  live boolean not null default false,
  status public.news_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists news_posts_set_updated_at on public.news_posts;
create trigger news_posts_set_updated_at
  before update on public.news_posts
  for each row execute function public.handle_updated_at();

alter table public.news_posts enable row level security;

create policy "Published news is public"
  on public.news_posts for select to anon, authenticated
  using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated users can insert news"
  on public.news_posts for insert to authenticated with check (true);

create policy "Authenticated users can update news"
  on public.news_posts for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete news"
  on public.news_posts for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 5. Storage bucket for news cover images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('news-covers', 'news-covers', true)
on conflict (id) do nothing;

create policy "Public can read news covers"
  on storage.objects for select to public
  using (bucket_id = 'news-covers');

create policy "Authenticated users can upload news covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'news-covers');

create policy "Authenticated users can update news covers"
  on storage.objects for update to authenticated
  using (bucket_id = 'news-covers') with check (bucket_id = 'news-covers');

create policy "Authenticated users can delete news covers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'news-covers');

-- ---------------------------------------------------------------------------
-- 6. Events (manual editorial — no AI columns, no ingest FK)
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists events_status_starts_at_idx
  on public.events (status, starts_at desc);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "events public read published"
  on public.events for select to anon, authenticated
  using (status = 'published' and starts_at >= now() - interval '1 day');

create policy "events authenticated read all"
  on public.events for select to authenticated using (true);

create policy "events authenticated insert"
  on public.events for insert to authenticated with check (true);

create policy "events authenticated update"
  on public.events for update to authenticated using (true) with check (true);

create policy "events authenticated delete"
  on public.events for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 7. Community messages
-- ---------------------------------------------------------------------------
create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  municipality text,
  message text not null,
  approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.community_messages enable row level security;

create policy "Approved messages are public"
  on public.community_messages for select to anon, authenticated
  using (approved = true);

create policy "Anyone can submit a message"
  on public.community_messages for insert to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- 8. News comments
-- ---------------------------------------------------------------------------
create table if not exists public.news_comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null references public.news_posts (slug) on delete cascade,
  name text not null,
  comment text not null,
  approved boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists news_comments_article_slug_created_idx
  on public.news_comments (article_slug, created_at desc);

alter table public.news_comments enable row level security;

create policy "Approved news comments are public"
  on public.news_comments for select to anon, authenticated
  using (approved = true);

create policy "Public can create news comments"
  on public.news_comments for insert to anon, authenticated
  with check (
    approved = true
    and length(trim(name)) between 2 and 80
    and length(trim(comment)) between 3 and 800
  );

-- ---------------------------------------------------------------------------
-- 9. Crónicas da Semana
-- ---------------------------------------------------------------------------
create table if not exists public.cronicas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_name text not null,
  author_role text,
  author_avatar_url text,
  week_label text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists cronicas_updated_at on public.cronicas;
create trigger cronicas_updated_at
  before update on public.cronicas
  for each row execute function public.set_updated_at();

alter table public.cronicas enable row level security;

create policy "Public can read published cronicas"
  on public.cronicas for select
  using (status = 'published');

create policy "Authenticated users can manage cronicas"
  on public.cronicas for all
  using (auth.role() = 'authenticated');
