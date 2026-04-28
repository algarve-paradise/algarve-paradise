-- Manual editorial support for events and TV reports.

alter table public.news_posts
  drop constraint if exists news_posts_category_check;

alter table public.news_posts
  add constraint news_posts_category_check
  check (category in (
    'Algarve',
    'Municipios',
    'Economia',
    'Turismo',
    'Seguranca',
    'Eventos',
    'Reportagem'
  ));

drop policy if exists "events authenticated read all" on public.events;
create policy "events authenticated read all"
  on public.events
  for select
  to authenticated
  using (true);

drop policy if exists "events authenticated insert" on public.events;
create policy "events authenticated insert"
  on public.events
  for insert
  to authenticated
  with check (true);

drop policy if exists "events authenticated update" on public.events;
create policy "events authenticated update"
  on public.events
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "events authenticated delete" on public.events;
create policy "events authenticated delete"
  on public.events
  for delete
  to authenticated
  using (true);
