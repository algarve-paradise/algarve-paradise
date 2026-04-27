# Guia de Automacao por IA — Algarve TV

> Documento para apresentacao interna ao nucleo de contratantes.
> Cobre todas as funcionalidades de IA presentes na plataforma, fluxo de
> auto-publicacao, custos estimados e integracao com provedores de imagens.

---

## 1. O que a IA faz na plataforma

A plataforma inclui um motor de automacao editorial completo que:

1. **Monitoriza fontes de noticias e eventos** do Algarve em tempo real
   (jornais regionais, agendas municipais, portais de turismo).
2. **Reescreve o conteudo original** com linguagem propria, em PT-PT, sem
   copiar frases da fonte original.
3. **Categoriza automaticamente** a noticia/evento numa das categorias
   editoriais (Algarve, Municipios, Economia, Turismo, Seguranca, Eventos).
4. **Decide se precisa de imagem** e pesquisa automaticamente uma fotografia
   com licenca livre (Pexels ou Unsplash) quando aplicavel.
5. **Cria um rascunho** no painel de administracao com grau de confianca,
   countdown de revisao e ligacao para a fonte original.
6. **Publica automaticamente** o rascunho quando a janela de revisao expira
   e o grau de confianca e suficiente — sem intervencao humana.

---

## 2. Funcionalidades presentes — lista completa

### 2.1 Ingestao de conteudo

| Funcionalidade | Descricao |
|---|---|
| **RSS** | Le feeds RSS 2.0 / Atom de jornais regionais (Sul Informacao, Postal do Algarve, Barlavento, etc.) |
| **Sitemap** | Navega o sitemap.xml e extrai o artigo de cada pagina — para sites sem feed RSS |
| **HTML** | Monitoriza uma pagina unica (ex.: comunicados de camara) |
| **iCal** | Importa eventos de ficheiros .ics (agendas das Camaras Municipais) |
| **API JSON** | Consome endpoints publicos de parceiros (Visit Algarve, etc.) |
| **Deduplicacao** | Hash unico por URL+titulo — nunca processa o mesmo item duas vezes |
| **Rate limiting** | Intervalo configuravel entre pedidos por fonte (default 5 min) |
| **Budget por run** | Limite de items por fonte e por run — controla custos de API |

### 2.2 Reescrita por IA

| Funcionalidade | Descricao |
|---|---|
| **Multi-provider** | Suporta Anthropic Claude, OpenAI GPT e Google Gemini — escolha no painel |
| **PT-PT nativo** | Todos os prompts forcam portugues europeu correto |
| **Grau de confianca** | A IA avalia 0-1 a qualidade do output; items abaixo do threshold nao sao auto-publicados |
| **Slug automatico** | Gera URL amigavel a partir do titulo, com deduplicacao de slugs duplicados |
| **Categoria editorial** | Classifica em Algarve / Municipios / Economia / Turismo / Seguranca / Eventos |
| **Citacao da fonte** | Insere automaticamente "Com informacao de [nome]." no final de cada artigo |
| **Decisao de imagem** | Avalia se o artigo beneficia de fotografia (noticias administrativas nao recebem foto generica) |

### 2.3 Gestao de imagens

| Funcionalidade | Descricao |
|---|---|
| **Pexels** | Provider default; pesquisa por query gerada pela IA em ingles |
| **Unsplash** | Provider alternativo; mesma logica |
| **Nenhum** | Opcao "none" para desactivar completamente a busca de imagens |
| **Credito automatico** | "Foto: Autor / Pexels" e inserido no corpo do artigo |
| **So quando relevante** | A IA decide `needsImage: true/false` — noticias juridicas/eleitorais nao recebem foto |

### 2.4 Painel de administracao

| Pagina | O que permite |
|---|---|
| `/admin` | Dashboard: estatisticas, fila de revisao IA (noticias + eventos com paginacao), lista geral |
| `/admin/fontes` | CRUD completo de fontes: adicionar, editar, pausar, eliminar; score por fonte e por categoria |
| `/admin/configuracoes` | Provider de IA, janela de revisao (horas), confianca minima, toggle on/off |
| `/admin/noticias/[id]` | Editor completo de noticia (manual + IA); aprovar ou rejeitar rascunho IA |
| `/admin/eventos/[id]` | Editor de evento; aprovar ou rejeitar |

### 2.5 Auto-publicacao

| Funcionalidade | Descricao |
|---|---|
| **Janela configuravel** | Cada rascunho IA tem um prazo de revisao humana (default 6h, ajustavel em runtime) |
| **Threshold de confianca** | Apenas drafts com score >= min_confidence sao auto-publicados (default 0.75) |
| **Countdown visual** | Painel mostra "Xh Ym ate auto-publicar" ou "Pronto a publicar" em tempo real |
| **Cron diario** | Auto-publish corre automaticamente as 16:00 UTC (Vercel Hobby: 1x/dia) |
| **Toggle global** | Botao no painel para ligar/desligar toda a automacao sem alterar env vars ou fazer deploy |

---

## 3. Fluxo completo de auto-publicacao

```
Hora 08:00 UTC  — Cron ingest corre
                   └── Le RSS/sitemap/HTML/API de cada fonte activa
                   └── Deduplica por hash
                   └── Chama IA → reescreve → confianca → categoria → slug
                   └── (Opcional) Pexels/Unsplash → foto de capa
                   └── Insere em news_posts com status='draft',
                       ai_review_deadline = agora + 6h (= 14:00 UTC)

Hora 08:00-14:00 — Janela de revisao humana
                   └── Admin ve fila em /admin
                   └── Pode APROVAR (publica imediatamente)
                   └── Pode REJEITAR (apaga rascunho)
                   └── Pode EDITAR e publicar manualmente

Hora 14:00 UTC  — ai_review_deadline expira
                   └── UI mostra "Pronto a publicar"
                   └── (Aguarda proximo cron)

Hora 16:00 UTC  — Cron auto-publish corre
                   └── Busca: ai_generated=true, status='draft',
                              ai_review_deadline <= agora
                   └── Filtra: confidence >= 0.75
                   └── Actualiza: status='published', published_at=agora
                   └── Incrementa total_published na fonte
                   └── Artigo aparece no site publico
```

**Nota Vercel Hobby:** Cada cron corre 1x por dia. No plano Pro, e possivel
configurar frequencia horaria para publicacao mais proxima do tempo real.

---

## 4. API keys necessarias

A plataforma suporta tres providers de IA (apenas um activo por vez).
O administrador escolhe qual usar no painel sem necessidade de novo deploy.

### 4.1 Provider de IA (obrigatorio — escolher um)

| Provider | Onde obter a API key | Env var no Vercel |
|---|---|---|
| **Anthropic Claude** | console.anthropic.com → API Keys | `ANTHROPIC_API_KEY` |
| **OpenAI GPT** | platform.openai.com → API Keys | `OPENAI_API_KEY` |
| **Google Gemini** | aistudio.google.com → Get API key | `GEMINI_API_KEY` |

> Pode ter as tres configuradas ao mesmo tempo. O painel mostra quais estao
> activas e permite trocar o provider default sem deploy.

### 4.2 Provider de imagens (opcional)

| Provider | Onde obter | Env var no Vercel |
|---|---|---|
| **Pexels** (default) | pexels.com/api → Your API Keys | `PEXELS_API_KEY` |
| **Unsplash** | unsplash.com/developers → New Application | `UNSPLASH_ACCESS_KEY` |

Para desactivar imagens: definir `IMAGE_PROVIDER=none` no Vercel.

### 4.3 Outras variaveis obrigatorias

| Env var | Como gerar | Para que serve |
|---|---|---|
| `CRON_SECRET` | `openssl rand -hex 32` | Protege os endpoints de cron contra chamadas nao autorizadas |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | Acesso admin a base de dados |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | Acesso publico (leitura) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | URL do projeto Supabase |

---

## 5. Custos estimados por provider

### Consumo por item

Cada noticia consome ~1100 tokens (500 entrada + 600 saida).
Cada evento consome ~550 tokens (300 entrada + 250 saida).

### Custo mensal estimado (noticias)

| Volume | Claude Haiku 4.5 | GPT-4o-mini | Gemini 2.5 Flash |
|---|---|---|---|
| 100 noticias/mes | ~$0,11 | ~$0,11 | ~$0,02 |
| 500 noticias/mes | ~$0,55 | ~$0,55 | ~$0,11 |
| 1000 noticias/mes | ~$1,10 | ~$1,10 | ~$0,22 |
| 3000 noticias/mes | ~$3,30 | ~$3,30 | ~$0,66 |

> **Com 10 fontes activas × 5 itens/fonte × 1 run/dia = ~150 noticias/mes**
> Custo aproximado: $0,15/mes (Claude Haiku) ou $0,03/mes (Gemini 2.5 Flash).

### Custo de imagens

- **Pexels**: gratuito (limite de 200 pedidos/hora na API gratuita)
- **Unsplash**: gratuito ate 50 pedidos/hora; plano pago para maior volume

### Custo total realista (plataforma completa)

| Componente | Custo mensal |
|---|---|
| IA (Claude Haiku, 150 noticias/mes) | ~$0,15 |
| Imagens (Pexels, gratuito) | $0 |
| Vercel Hobby (cron 1x/dia) | $0 |
| Supabase Free Tier | $0 |
| **Total estimado** | **~$0,15/mes** |

Para volumes maiores (Pro Vercel + ingest mais frequente):

| Componente | Custo mensal |
|---|---|
| IA (Gemini 2.5 Flash, 1000 noticias/mes) | ~$0,22 |
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| **Total estimado** | **~$45/mes** |

---

## 6. Esquema IA + Pexels/Unsplash — como funciona a decisao de imagem

### O que acontece em cada noticia

```
1. IA reescreve o artigo
2. No mesmo output JSON, a IA avalia:
   needsImage: true | false
   imageQuery: "algarve summer festival beach" (em ingles, para melhor resultado)

3. Se needsImage = false → sem foto (noticias juridicas, eleitorais, orcamentos, etc.)

4. Se needsImage = true → pipeline chama Pexels/Unsplash com imageQuery
   → devolve URL de foto com licenca livre
   → URL guardado em cover_image_url
   → "Foto: [Autor] / Pexels" inserido no corpo do artigo
```

### Criterios que a IA usa para decidir

**needsImage = TRUE** (foto beneficia o artigo):
- Turismo, praias, festivais, gastronomia, desporto
- Obras publicas, inauguracoes, natureza, mercados
- Qualquer tema com cena visual clara e segura

**needsImage = FALSE** (sem foto):
- Decisoes camararias, orcamentos, eleicoes, justica
- Comunicados oficiais sem elemento visual especifico
- Situacoes onde uma foto generica seria enganosa

### Garantias de licenciamento

- Pexels: todas as fotos sao CC0 ou licenca Pexels (uso comercial livre)
- Unsplash: licenca Unsplash (uso comercial livre, credito recomendado)
- Credito sempre inserido automaticamente no corpo do artigo
- Imagens NUNCA copiadas das fontes originais

---

## 7. Adicionar uma nova fonte de noticias

### Pelo painel (recomendado)

1. Aceder a `/admin/fontes`
2. Clicar em "Adicionar fonte"
3. Preencher: Nome, URL do feed/sitemap, Tipo (RSS recomendado), Regiao, Categoria padrao
4. Activar a fonte
5. Na proxima execucao do cron (08:00 UTC), a fonte e incluida automaticamente

### Tipos e URLs esperados

| Tipo | URL esperada | Exemplo |
|---|---|---|
| RSS | URL do feed | `https://sulinformacao.pt/feed/` |
| Sitemap | URL do sitemap.xml | `https://exemplo.pt/sitemap.xml` |
| HTML | URL da pagina | `https://cm-faro.pt/noticias` |
| iCal | URL do ficheiro .ics | `https://cm-faro.pt/agenda.ics` |
| API JSON | URL do endpoint | `https://api.parceiro.pt/news` |

Para fontes de **eventos**: seleccionar "Conteudo = Eventos" e "Tipo = iCal" ou "API JSON".

---

## 8. Toggle de automacao — ligar e desligar sem deploy

Em `/admin/configuracoes`:

- **Botao "Desactivar automacao"**: para todos os cron jobs de ingestao e eventos.
  Os drafts existentes ainda sao auto-publicados ao fim da janela (esse
  comportamento e intencional — sao compromissos ja assumidos).
- **Botao "Activar automacao"**: retoma o pipeline no proximo cron.

Nenhum deploy ou alteracao de env var e necessario.

---

## 9. Resumo para apresentacao comercial

> **"A plataforma Algarve TV inclui um motor de automacao editorial por IA
> que capta noticias e eventos regionais de multiplas fontes, reescreve-os
> automaticamente em PT-PT com grau de confianca, e publica-os no site sem
> intervencao humana — com custo inferior a 50 centimos por mes para volumes
> tipicos de uma redacao regional."**

**Diferenciais chave:**
- Zero intervencao humana quando a confianca e alta
- Janela de revisao editavel (editor pode sempre aprovar/rejeitar antes)
- Multi-provider: troca entre Claude, GPT e Gemini num clique
- Custo previsivel e controlado (budget por run configuravel)
- Fontes geridas pelo proprio admin, sem programadores
- Toggle global para pausar a automacao instantaneamente
- Imagens com licenca livre, nunca copiadas dos jornais originais
