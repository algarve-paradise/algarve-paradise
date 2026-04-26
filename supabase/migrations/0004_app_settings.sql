-- Runtime configuration store.
-- Lets the admin override env defaults without redeploying — currently used
-- to switch the AI provider (anthropic / openai / gemini) and tweak the
-- auto-publish thresholds from the dashboard.

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

alter table public.app_settings enable row level security;

-- Authenticated admins can read; only service role can write (the API
-- route uses the service-role client when persisting changes).
drop policy if exists "app_settings authenticated read" on public.app_settings;
create policy "app_settings authenticated read"
  on public.app_settings
  for select
  to authenticated
  using (true);

drop policy if exists "app_settings service role" on public.app_settings;
create policy "app_settings service role"
  on public.app_settings
  for all
  to service_role
  using (true)
  with check (true);
