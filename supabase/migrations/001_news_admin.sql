create extension if not exists pgcrypto;

create type public.news_status as enum ('draft', 'published');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users (id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null check (category in ('Algarve', 'Municipios', 'Economia', 'Turismo', 'Seguranca', 'Eventos')),
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

insert into storage.buckets (id, name, public)
values ('news-covers', 'news-covers', true)
on conflict (id) do nothing;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists news_posts_set_updated_at on public.news_posts;
create trigger news_posts_set_updated_at
before update on public.news_posts
for each row
execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.news_posts enable row level security;

drop policy if exists "Authenticated users can view profiles" on public.profiles;
create policy "Authenticated users can view profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can update own profile" on public.profiles;
create policy "Authenticated users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Published news is public" on public.news_posts;
create policy "Published news is public"
on public.news_posts
for select
to anon, authenticated
using (status = 'published' or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert news" on public.news_posts;
create policy "Authenticated users can insert news"
on public.news_posts
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update news" on public.news_posts;
create policy "Authenticated users can update news"
on public.news_posts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete news" on public.news_posts;
create policy "Authenticated users can delete news"
on public.news_posts
for delete
to authenticated
using (true);

drop policy if exists "Public can read news covers" on storage.objects;
create policy "Public can read news covers"
on storage.objects
for select
to public
using (bucket_id = 'news-covers');

drop policy if exists "Authenticated users can upload news covers" on storage.objects;
create policy "Authenticated users can upload news covers"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'news-covers');

drop policy if exists "Authenticated users can update news covers" on storage.objects;
create policy "Authenticated users can update news covers"
on storage.objects
for update
to authenticated
using (bucket_id = 'news-covers')
with check (bucket_id = 'news-covers');

drop policy if exists "Authenticated users can delete news covers" on storage.objects;
create policy "Authenticated users can delete news covers"
on storage.objects
for delete
to authenticated
using (bucket_id = 'news-covers');
