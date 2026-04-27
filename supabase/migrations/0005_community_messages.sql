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
on public.community_messages
for select
to anon, authenticated
using (approved = true);

create policy "Anyone can submit a message"
on public.community_messages
for insert
to anon, authenticated
with check (true);
