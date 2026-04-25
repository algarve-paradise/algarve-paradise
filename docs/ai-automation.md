# Automacao de noticias e eventos por IA

Pipeline que captura noticias e eventos de fontes regionais, reescreve por
IA e publica como rascunho em `news_posts` / `events`. Drafts nao revistos
sao publicados automaticamente ao fim de uma janela configuravel.

## Arquitetura

```
ingest_sources (registry, content_kind = 'news' | 'events')
       │
       ├─── RSS / sitemap / HTML ──► news pipeline ──► news_posts (draft)
       │
       └─── iCal              ─────► events pipeline ─► events (draft)
                                              │
                                  ┌───────────┴───────────┐
                                  ▼                       ▼
                          Aprovar manual          Auto-publish (cron)
                          no painel admin         apos AUTO_PUBLISH_AFTER_HOURS
                                                  se confidence >= MIN
```

Cada draft AI tambem chama o provider de imagens (Pexels por defeito) para
sugerir uma capa com licenca livre. Se a chamada falhar, o draft segue
sem capa e o revisor escolhe.

## Fontes suportadas

| Tipo | Parser | Uso tipico |
|---|---|---|
| `rss` | RSS 2.0 + Atom | Noticias (Sul Informacao, Postal, Barlavento, etc.) |
| `sitemap` | sitemap.xml + extracao HTML por pagina | Sites sem RSS |
| `html` | Extracao de pagina unica | Pagina especifica monitorizada |
| `ical` | iCalendar / .ics | Agendas municipais (Faro, Lagos, Portimao) |
| `api` | (placeholder, nao implementado) | Endpoints publicos JSON |

## Variaveis de ambiente

| Var | Default | Descricao |
|---|---|---|
| `AI_PROVIDER` | `anthropic` | `anthropic` ou `openai` |
| `ANTHROPIC_API_KEY` | — | Obrigatoria se provider = anthropic |
| `OPENAI_API_KEY` | — | Obrigatoria se provider = openai |
| `CRON_SECRET` | — | Obrigatoria. `openssl rand -hex 32` |
| `AUTO_PUBLISH_AFTER_HOURS` | `6` | Janela de revisao humana |
| `AUTO_PUBLISH_MIN_CONFIDENCE` | `0.75` | 0 = publica tudo apos a janela |
| `INGEST_MAX_ITEMS_PER_SOURCE` | `5` | Limite por fonte por run |
| `INGEST_MAX_SOURCES_PER_RUN` | `10` | Limite de fontes por run |
| `IMAGE_PROVIDER` | `pexels` | `pexels`, `unsplash` ou `none` |
| `PEXELS_API_KEY` | — | Necessario se provider = pexels |
| `UNSPLASH_ACCESS_KEY` | — | Necessario se provider = unsplash |

## Setup

### 1. Migrations

```bash
psql "$DATABASE_URL" -f supabase/migrations/0001_ai_ingestion.sql
psql "$DATABASE_URL" -f supabase/migrations/0002_seed_algarve_sources.sql
psql "$DATABASE_URL" -f supabase/migrations/0003_events_and_quality.sql
```

### 2. Cadastrar fontes de eventos

```sql
insert into public.ingest_sources
  (name, url, type, region, default_category, content_kind, enabled)
values
  ('Faro Eventos', 'https://www.cm-faro.pt/calendario.ics', 'ical', 'algarve', 'Eventos', 'events', true),
  ('Loule Eventos', 'https://www.cm-loule.pt/agenda.ics', 'ical', 'algarve', 'Eventos', 'events', true);
```

### 3. Vercel Cron

`vercel.json` ja inclui:

- `0 6,12,18,22 * * *` — `/api/cron/ingest`     (noticias, 4x/dia)
- `15 7,19 * * *`     — `/api/cron/events`      (eventos, 2x/dia)
- `30 * * * *`        — `/api/cron/auto-publish` (cada hora)

### 4. Smoke tests

```bash
# Sem custo de IA
curl -H "x-cron-secret: $CRON_SECRET" "https://your-site.com/api/cron/ingest?dry=1"
curl -H "x-cron-secret: $CRON_SECRET" "https://your-site.com/api/cron/events?dry=1"

# Run completo
curl -H "x-cron-secret: $CRON_SECRET" "https://your-site.com/api/cron/ingest?region=algarve"
curl -H "x-cron-secret: $CRON_SECRET" "https://your-site.com/api/cron/events?region=algarve"
```

## Score de qualidade por fonte

Cada fonte mantem contadores:

- `total_rewritten` — drafts criados pela IA
- `total_published` — drafts efetivamente publicados (manual + auto)
- `total_rejected` — drafts rejeitados manualmente
- `total_failed` — falhas (rede, IA, schema)

A view `ingest_source_quality` calcula `quality_score` em tempo real:

```
quality_score = (published * 1.0 + rewritten * 0.3) / (rewritten + rejected + failed)
```

`listEnabledSources` ja ordena por `quality_score DESC`, fazendo as
melhores fontes serem processadas primeiro a cada run. Fontes novas
(sem historico) recebem score 0.5 e disputam pela ordem `last_fetched_at`.

## Fluxo de revisao humana

1. IA gera rascunho (`news_posts` ou `events`) com `ai_review_deadline = now() + AUTO_PUBLISH_AFTER_HOURS`.
2. No painel admin (`/admin`):
   - Card "Pendentes da IA" mostra a contagem total (noticias + eventos).
   - Tabelas separadas: "Fila de revisao da IA — Noticias" e "Fila de revisao da IA — Eventos".
   - **Aprovar** → publica imediatamente, bumpa `total_published` da fonte.
   - **Rejeitar** → apaga rascunho, marca `ingest_item` rejeitado, bumpa `total_rejected`.
   - **Editar** → abre o editor padrao.
3. Se ninguem agir ate `ai_review_deadline` e `confidence >= AUTO_PUBLISH_MIN_CONFIDENCE`,
   o cron `auto-publish` publica e bumpa `total_published`.

## Direitos autorais

A IA e instruida no system prompt a:
- Reescrever sempre por palavras proprias (nunca copiar frases).
- Citar a fonte no fim do conteudo: "Com informacao de [nome]."
- Usar apenas factos seguros do original.

`source_name` e `source_url` ficam guardados em cada draft. Imagens NUNCA
sao copiadas das fontes originais — vem do Pexels/Unsplash com credito
visivel ("Foto: Nome / Pexels") anexado ao corpo.

## Custos estimados

Por noticia (~500 in + ~600 out tokens) ou evento (~300 in + ~250 out):

| Modelo | $/noticia | $/evento | 1000 noticias + 200 eventos |
|---|---|---|---|
| Claude Haiku 4.5 | ~$0,001 | ~$0,0005 | ~$1,1 |
| GPT-4o-mini | ~$0,001 | ~$0,0005 | ~$1,1 |

Limites em `INGEST_MAX_ITEMS_PER_SOURCE` × `INGEST_MAX_SOURCES_PER_RUN`
× runs/dia controlam o gasto maximo diario.

## Adicionar nova regiao

```sql
insert into public.ingest_sources
  (name, url, type, region, default_category, content_kind, enabled)
values
  ('Diario do Alentejo', 'https://...', 'rss', 'alentejo', 'Algarve', 'news', true);
```

O cron ja processa todas as regioes; passe `?region=alentejo` para limitar.

## Roadmap restante

- [ ] Substituir parser HTML por `cheerio` + `@mozilla/readability` quando
      surgir uma fonte sem RSS que exija extracao mais robusta.
- [ ] Endpoint API para fontes (`type = 'api'`) para integracoes oficiais
      (ex: Visit Algarve).
- [ ] Score por categoria, alem de por fonte.
