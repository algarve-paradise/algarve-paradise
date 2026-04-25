-- Seed initial RSS sources for the Algarve region.
-- Add or remove rows here, or insert via the future admin UI.
-- All URLs below are public RSS feeds. Verify each portal's terms of use
-- before enabling in production.

insert into public.ingest_sources (name, url, type, region, default_category, enabled, rate_limit_seconds)
values
  ('Sul Informacao', 'https://www.sulinformacao.pt/feed/', 'rss', 'algarve', 'Algarve', false, 300),
  ('Postal do Algarve', 'https://postal.pt/feed', 'rss', 'algarve', 'Algarve', false, 300),
  ('Barlavento', 'https://barlavento.pt/feed', 'rss', 'algarve', 'Algarve', false, 300),
  ('RTP - Algarve', 'https://www.rtp.pt/noticias/rss/pais', 'rss', 'algarve', 'Algarve', false, 600),
  ('Publico - Local', 'https://feeds.feedburner.com/publicoRSS', 'rss', 'algarve', 'Algarve', false, 600)
on conflict (url) do nothing;

-- All sources start disabled. Enable them one by one after confirming
-- terms of use and that the feed is well-formed.
