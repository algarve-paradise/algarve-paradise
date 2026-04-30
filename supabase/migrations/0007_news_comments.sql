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

drop policy if exists "Approved news comments are public" on public.news_comments;
create policy "Approved news comments are public"
on public.news_comments
for select
to anon, authenticated
using (approved = true);

drop policy if exists "Public can create news comments" on public.news_comments;
create policy "Public can create news comments"
on public.news_comments
for insert
to anon, authenticated
with check (
  approved = true
  and length(trim(name)) between 2 and 80
  and length(trim(comment)) between 3 and 800
);

