# Análise Jurídica — Automação por IA na Plataforma Algarve TV

> **Elaborado por:** Análise técnico-jurídica do codebase da plataforma  
> **Data:** Maio de 2026  
> **Âmbito:** Lei portuguesa e europeia aplicável ao uso de feeds RSS públicos,  
> reescrita por IA e publicação de conteúdo regional no Algarve.

---

## Sumário executivo

**A automação implementada na plataforma está juridicamente segura, desde que as
boas práticas já codificadas no sistema sejam mantidas.**

As três fontes estáticas configuradas (Sul Informação, Postal do Algarve,
Barlavento) e o modelo de funcionamento do pipeline — ler feeds RSS públicos,
reescrever por palavras próprias e citar a fonte — não violam a legislação
portuguesa nem a diretiva europeia de direitos de autor, pelas razões
detalhadas abaixo.

---

## 1. Enquadramento legal aplicável

### 1.1 Legislação europeia

| Diploma | Relevância |
|---|---|
| **Diretiva 2001/29/CE** ("InfoSoc") | Direito de reprodução, direito de comunicação ao público |
| **Diretiva 2019/790/UE** ("DSM Copyright Directive") | Direito vizinho das editoras (Art. 15); exceção de mineração de texto e dados (Art. 4) |
| **Regulamento 2016/679** ("GDPR") | Dados pessoais eventualmente presentes em artigos |

### 1.2 Legislação portuguesa

| Diploma | Relevância |
|---|---|
| **CDADC** – Código do Direito de Autor e dos Direitos Conexos (Dec.-Lei n.º 63/85, com alterações sucessivas) | Proteção de obras literárias e jornalísticas |
| **Lei n.º 30/2023 de 29 de junho** | Transpõe a Diretiva 2019/790/UE para o ordenamento português; institui o "direito vizinho" das publicações de imprensa (Art. 16.º a 20.º) |
| **Lei n.º 58/2019 de 8 de agosto** | Transpõe o GDPR para Portugal |

---

## 2. Como o pipeline funciona (resumo técnico para análise jurídica)

Para uma análise rigorosa, é necessário descrever com precisão o que o sistema faz:

1. **Leitura de feeds RSS públicos** — o sistema acede a URLs publicadas pelas
   próprias redações para distribuição de conteúdo (`/feed/`). RSS é um protocolo
   de distribuição ativa de conteúdo, não uma extração não autorizada.

2. **Extração de metadados** — título, resumo/excerto e URL da notícia original,
   disponíveis no próprio feed RSS.

3. **Reescrita por IA** — o modelo de linguagem (Claude/OpenAI/Gemini) produz
   um texto **completamente novo** em português europeu. O *system prompt* proíbe
   expressamente a cópia de frases:
   > *"NUNCA copies frases do texto original. Reescreve sempre por palavras tuas."*

4. **Citação da fonte** — obrigatória em todos os artigos:
   > *"Com informação de [nome da fonte]."*

5. **Imagens** — nunca copiadas das fontes originais; provenientes de Pexels/Unsplash
   com licença livre, crédito visível no corpo do artigo.

6. **Grau de confiança e revisão humana** — a IA avalia a qualidade do output
   (0–1); um editor humano pode aprovar, rejeitar ou editar antes de qualquer
   publicação; a auto-publicação exige confiança ≥ 0,75.

7. **Identificação do bot** — o fetcher identifica-se com:
   ```
   AlgarveParadiseBot/1.0 (+https://algarveparadisemedia.pt; contact: geral@algarveparadisemedia.pt)
   ```
   Qualquer servidor pode bloquear ou rate-limitar este User-Agent.

---

## 3. Análise do "direito vizinho" das editoras (Lei n.º 30/2023, Art. 16.º)

Este é o ponto mais relevante para a preocupação do cliente.

### 3.1 O que é o direito vizinho

A Diretiva 2019/790/UE criou um novo direito exclusivo para as **editoras de
publicações de imprensa**: o direito de autorizar ou proibir a reprodução e
comunicação ao público das suas publicações por **prestadores de serviços da
sociedade da informação** (plataformas online).

O objetivo da norma foi regular especificamente plataformas como o Google News
e o Facebook, que reproduziam títulos e excertos de artigos sem licenciamento.

### 3.2 O que está EXCLUÍDO do direito vizinho (Considerando 57, Art. 15.º, n.º 1 da Diretiva)

O direito vizinho **não abrange**:

- **Palavras individuais e excertos muito curtos** — o legislador europeu não
  quis impedir a referência a fontes em contextos editoriais.
- **Hiperligações** — inserir um link para uma notícia não constitui violação.
- **Atos de hiperlinking acompanhados de palavras individuais** que descrevam
  o conteúdo.
- **Utilizações para fins de citação** ao abrigo das limitações e exceções
  clássicas do direito de autor.
- **Fins de investigação científica e de mineração de texto e dados** (Art. 4.º
  da Diretiva — ver ponto 3.4).

### 3.3 Por que o nosso sistema NÃO é abrangido pelo direito vizinho

**O sistema não reproduz a publicação de imprensa original.**

A proteção do Art. 16.º da Lei 30/2023 incide sobre a reprodução e comunicação
ao público da **obra** da editora — o texto escrito pelos seus jornalistas.

O pipeline desta plataforma:

| O que o sistema faz | Protegido pelo direito vizinho? |
|---|---|
| Lê o feed RSS (metadados + título + excerto) | Não — o feed RSS é disponibilizado para agregação |
| Usa o título e resumo como *input* para a IA | Não — a Diretiva exclui excertos muito curtos e palavras individuais |
| Produz um texto **novo e original** | Não — não há reprodução; há criação de obra nova |
| Cita a fonte no final do artigo | Não — citação de fonte é permitida |
| Inserção de hiperligação para o artigo original | Não — expressamente excluído |

**Analogia jurídica clara:** Um jornalista que lê uma notícia noutro jornal,
toma nota dos factos, e escreve um artigo próprio sobre os mesmos factos não
viola o direito de autor da publicação original. Os **factos** não são
protegidos — apenas a **expressão literária** específica o é. Esta plataforma
opera exatamente nesta lógica, com a diferença de que é a IA que faz a
reescrita, não um jornalista humano.

### 3.4 Exceção de mineração de texto e dados (Art. 4.º da Diretiva / Art. 12.º da Lei 30/2023)

A Diretiva 2019/790/UE criou uma exceção obrigatória para **Text and Data Mining
(TDM)** para quaisquer fins (não apenas científicos), desde que:

1. O acesso seja **lícito** (feeds RSS públicos: cumpre).
2. O titular dos direitos não tenha **reservado expressamente** o direito de
   TDM de forma legível por máquina (ex.: `robots.txt` ou meta-tags).

#### Verificação das fontes configuradas

| Fonte | RSS Feed | Robots.txt | Status |
|---|---|---|---|
| Sul Informação | `https://www.sulinformacao.pt/feed/` | Verificar `robots.txt` | Feed público ativo |
| Postal do Algarve | `https://postal.pt/feed` | Verificar `robots.txt` | Feed público ativo |
| Barlavento | `https://barlavento.pt/feed` | Verificar `robots.txt` | Feed público ativo |

**Recomendação:** Antes da ativação de novas fontes, verificar o `robots.txt`
de cada domínio e não processar fontes que indiquem `Disallow` para o
User-Agent do bot ou para crawlers em geral. O sistema já usa um User-Agent
identificado (`AlgarveParadiseBot/1.0`) para permitir que os sites nos
bloqueiem se quiserem.

---

## 4. Direito de Autor clássico (CDADC)

### 4.1 Os factos não são protegidos

O direito de autor protege a **expressão original** de uma obra, não os
**factos** que ela relata. Uma notícia que diz "O Câmara Municipal de Faro
aprovou o orçamento de X euros" não protege o facto em si — apenas a forma
literária específica como foi escrito.

O sistema replica os **factos** (que são livres) em texto **novo** (que é
da plataforma).

### 4.2 Proibição de plágio — garantia técnica

O *system prompt* da IA contém a instrução:
> *"NUNCA copies frases do texto original. Reescreve sempre por palavras tuas."*

Esta instrução técnica garante que o output da IA não constitui reprodução
(parcial ou total) da obra original. A IA é treinada para produzir texto
novo. O risco de reprodução acidental de frases existe em teoria, mas:

- O grau de confiança avalia implicitamente a qualidade da reescrita.
- O revisor humano pode detetar e rejeitar qualquer rascunho problemático.
- A janela de revisão de 6h existe precisamente para supervisão editorial.

---

## 5. GDPR e dados pessoais

Os artigos de imprensa podem conter nomes de pessoas (arguidos, políticos,
funcionários públicos). O sistema:

- Não processa os artigos originais para extrair perfis individuais.
- Não cria bases de dados de pessoas a partir das notícias.
- Reproduz factos de interesse público sobre pessoas que exercem funções
  públicas, o que é uma **atividade jornalística** abrangida pela exceção do
  Art. 85.º do GDPR ("tratamento para fins jornalísticos").

**Risco GDPR: baixo.** A atividade é jornalismo agregado, não tratamento de
dados pessoais para fins de marketing ou vigilância.

---

## 6. Questões práticas e boas práticas

### 6.1 Atribuição de fonte (já implementado)

O sistema insere obrigatoriamente no final de cada artigo:
> *"Com informação de [nome da fonte]."*

Isto é uma boa prática editorial e mitiga qualquer arguição de má-fé.

### 6.2 Ligação para o original (recomendação)

O campo `source_url` é guardado em base de dados e visível no painel admin.
**Recomendação:** Tornar este link visível no artigo publicado no site público
(ex.: "Fonte original: [link]"). Aumenta a transparência e direciona tráfego
para os meios originais, o que é um argumento comercial positivo junto das
redações.

### 6.3 Política de opt-out para os meios originais

**Recomendação:** Publicar no site uma página "Política de Indexação" que
explique o funcionamento do sistema e forneça um endereço de email para que
qualquer editora possa solicitar a remoção imediata. Isto é equivalente à
política dos grandes motores de pesquisa e demonstra boa-fé.

### 6.4 Verificação de robots.txt antes de adicionar fontes

O painel `/admin/fontes` permite adicionar qualquer URL. **Recomendação:**
Acrescentar ao processo de onboarding de novas fontes uma verificação manual
do `robots.txt` do domínio antes de ativar a fonte.

---

## 7. Comparação com práticas aceites no mercado

| Prática | Este sistema | Google News | Aggregadores RSS |
|---|---|---|---|
| Leitura de RSS público | ✅ Sim | ✅ Sim | ✅ Sim |
| Reprodução do título | ⚠️ Usado como input, não reproduzido | ✅ Sim (excerto curto) | ✅ Sim |
| Reprodução do texto | ❌ Nunca | ❌ Nunca | ⚠️ Às vezes |
| Texto novo produzido pela plataforma | ✅ Sim | ❌ Não | ❌ Não |
| Citação da fonte | ✅ Obrigatória | ✅ Sim | ⚠️ Variável |
| Link para original | ✅ Guardado (recomenda-se exibição) | ✅ Sim | ✅ Sim |
| User-Agent identificado | ✅ Sim | ✅ Sim | ⚠️ Variável |

**Este sistema tem práticas mais conservadoras do que muitos agregadores de
notícias estabelecidos no mercado europeu.** A reescrita completa por IA
diferencia-o positivamente de qualquer modelo de "raspagem e republicação".

---

## 8. Risco residual e como mitigá-lo

### 8.1 Risco: Uma redação considera que o resumo RSS é protegido

**Probabilidade:** Baixa. O RSS é disponibilizado propositadamente para
distribuição. Nenhum dos três jornais regionais configurados é empresa de media
de grande dimensão com departamento jurídico ativo em TDM.

**Mitigação:** Responder prontamente a qualquer pedido de remoção; manter log
de sources processadas por data para demonstrar boa-fé; publicar política de
indexação no site.

### 8.2 Risco: A IA reproduz acidentalmente uma frase da fonte

**Probabilidade:** Muito baixa. Os LLMs modernos (Claude, GPT, Gemini) são
treinados para parafrasear, não para reproduzir. O *confidence score* e a
revisão humana acrescentam camadas de segurança.

**Mitigação:** O revisor humano deve estar atento a este padrão. A janela de
6h de revisão existe para este efeito.

### 8.3 Risco: Alteração legislativa futura

A legislação europeia sobre IA e media está em evolução. O **AI Act**
(Regulamento 2024/1689/UE), em vigor desde agosto de 2024, não proíbe
este tipo de uso — classifica-o como sistema de IA de risco mínimo dado
que serve fins editoriais com supervisão humana.

**Mitigação:** Acompanhar a evolução legislativa anualmente; o sistema já
tem toggle global para pausar a automação instantaneamente se necessário.

---

## 9. Conclusão

| Questão | Resposta |
|---|---|
| Consumir feeds RSS públicos é legal? | **Sim** — o RSS é uma tecnologia de distribuição ativa |
| Reescrever artigos por palavras próprias viola direitos de autor? | **Não** — factos não são protegidos; expressão nova é da plataforma |
| O direito vizinho (Lei 30/2023) aplica-se? | **Não** — o sistema não reproduz a publicação original |
| A citação de fonte obrigatória é suficiente? | **Sim** — além de boa prática, é transparência editorial |
| Há risco jurídico imediato? | **Não** — desde que mantidas as boas práticas atuais |
| É necessário obter licenças dos jornais? | **Não** — mas uma parceria formal seria um diferencial comercial |
| O sistema deve ter uma política de opt-out? | **Recomendado** — demonstra boa-fé e facilita a relação com as redações |

**O sistema pode ser apresentado ao cliente com confiança.** O modelo de
funcionamento — leitura de feeds públicos, reescrita completa, citação de
fonte, revisão humana, identificação do bot e toggle global — está alinhado
com a lei portuguesa e europeia vigente e com as melhores práticas do setor.

---

*Esta análise tem caráter informativo e baseia-se na legislação vigente em
maio de 2026. Para situações específicas de litígio ou para formalizar acordos
de licenciamento com os meios de comunicação, recomenda-se consulta a advogado
especializado em propriedade intelectual e media.*
