-- Crónicas da Semana
create table if not exists cronicas (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  content      text not null,
  author_name  text not null,
  author_role  text,
  author_avatar_url text,
  week_label   text not null,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cronicas_updated_at
  before update on cronicas
  for each row execute procedure set_updated_at();

-- RLS
alter table cronicas enable row level security;

create policy "Public can read published cronicas"
  on cronicas for select
  using (status = 'published');

create policy "Authenticated users can manage cronicas"
  on cronicas for all
  using (auth.role() = 'authenticated');
