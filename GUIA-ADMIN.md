# Guia de Administração Editorial — Algarve TV

Este documento explica como gerir o conteúdo editorial do portal Algarve TV através do painel de administração. Inclui a criação de notícias, eventos e crónicas, bem como a gestão de estados de publicação.

---

## 1. Acesso ao Painel

O painel de administração é uma área restrita, acessível apenas a utilizadores com credenciais válidas.

**URL de acesso:**
```
/admin
```

Ao aceder a esta página sem sessão iniciada, será redirecionado automaticamente para a página de autenticação.

### Como iniciar sessão

1. Introduza o seu **endereço de e-mail** institucional no campo correspondente.
2. Introduza a sua **palavra-passe**.
3. Clique em **"Entrar no painel"**.

Caso as credenciais sejam inválidas, será apresentada uma mensagem de erro a vermelho por baixo do formulário. Em caso de dúvida ou esquecimento de palavra-passe, contacte o administrador técnico da plataforma.

---

## 2. Dashboard — Visão Geral

Após autenticar-se, é redirecionado para o **Dashboard Editorial**. Esta página apresenta:

| Indicador | Descrição |
|---|---|
| Total de notícias | Número total de notícias cadastradas na base de dados |
| Eventos | Total de eventos (calendário e notícias da categoria Eventos) |
| Publicadas | Notícias com estado "Publicado" |
| Destaques | Notícias marcadas para aparecer em destaque na homepage |
| Crónicas | Total de crónicas cadastradas |

Abaixo dos indicadores encontram-se duas tabelas:

- **Eventos cadastrados** — listagem de eventos com data, local e estado.
- **Notícias cadastradas** — listagem de notícias com filtros por estado.

### Filtros de notícias

Na tabela de notícias pode filtrar por:
- **Todas** — mostra toda a lista.
- **Publicadas** — mostra apenas as notícias com estado "Publicado".
- **Rascunhos** — mostra apenas os rascunhos ainda não publicados.

A paginação é feita por grupos de 8 itens, com botões **Anterior** e **Seguinte**.

---

## 3. Criar uma Notícia

Para criar uma nova notícia, clique em **"Nova notícia"** na barra de navegação do painel ou aceda diretamente a:
```
/admin/noticias/nova
```

### Campos do formulário

#### Coluna principal

| Campo | Obrigatório | Descrição |
|---|---|---|
| **Título** | Sim | Título da notícia. O slug é gerado automaticamente a partir deste campo. |
| **Slug** | Não | Identificador único na URL (gerado automaticamente; pode ser editado manualmente). |
| **Resumo** | Sim | Texto curto que aparece nos cartões da homepage e nas listagens. |
| **Corpo da notícia** | Sim | Conteúdo completo da notícia. |

#### Coluna lateral

| Campo | Obrigatório | Descrição |
|---|---|---|
| **Categoria** | Sim | Selecione uma das categorias disponíveis (ver lista abaixo). |
| **Fonte** | Não | Nome da entidade ou redação de origem. |
| **URL da fonte** | Não | Endereço web da fonte original. |
| **Imagem de capa** | Não | Ficheiro JPG, PNG ou WebP. Notícias sem imagem são apresentadas com um espaço neutro. |
| **Destacar na homepage** | Não | Assinale para colocar a notícia na secção de destaque da página principal. |
| **Em foco / direto** | Não | Assinale para marcar a notícia como cobertura em direto. |
| **Estado** | Sim | Escolha entre **Rascunho** ou **Publicado**. |

### Categorias disponíveis

- Algarve
- Municípios
- Economia
- Turismo
- Segurança
- Eventos

### Publicar ou guardar como rascunho

- **Rascunho** — o conteúdo é guardado mas não fica visível no site.
- **Publicado** — o conteúdo fica imediatamente disponível para os visitantes.

Clique em **"Criar notícia"** para guardar. Será redirecionado para o dashboard.

---

## 4. Editar ou Eliminar uma Notícia

Na tabela de notícias do dashboard, cada linha apresenta as opções:

- **Editar** — abre o formulário de edição da notícia.
- **Ver no site** — abre a notícia publicada numa nova aba.

Na página de edição, após realizar as alterações pretendidas, clique em **"Guardar alterações"**.

---

## 5. Criar um Evento

Para criar um novo evento, clique em **"Novo evento"** na barra de navegação ou aceda a:
```
/admin/eventos/novo
```

### Campos do formulário

#### Coluna principal

| Campo | Obrigatório | Descrição |
|---|---|---|
| **Título** | Sim | Nome do evento. O slug é gerado automaticamente. |
| **Slug** | Não | Identificador único na URL (editável manualmente). |
| **Descrição** | Sim | Texto descritivo do evento. |
| **Início** | Sim | Data e hora de início (formato `DD/MM/AAAA HH:MM`). |
| **Fim** | Não | Data e hora de término do evento. |

#### Coluna lateral

| Campo | Obrigatório | Descrição |
|---|---|---|
| **Local** | Sim | Nome ou morada do local onde o evento se realiza. |
| **Fonte** | Não | Entidade organizadora ou de origem da informação. |
| **URL da fonte** | Não | Endereço web do organizador ou página oficial. |
| **Imagem de capa** | Não | JPG, PNG ou WebP. Eventos sem imagem apresentam um cartão com espaço neutro. |
| **Estado** | Sim | **Rascunho** (não visível) ou **Publicado** (visível no site). |

Clique em **"Criar evento"** para guardar. Será redirecionado para o dashboard.

---

## 6. Editar ou Eliminar um Evento

Na tabela de eventos do dashboard:

- **Editar** — abre o formulário de edição do evento.
- **Ver no site** — abre a página do evento no portal.

---

## 7. Gerir Crónicas

As crónicas são artigos de opinião ou reflexão, associados a um autor e a uma semana editorial. Para aceder à gestão de crónicas, clique em **"Crónicas"** na barra de navegação ou aceda a:
```
/admin/cronicas
```

### Criar uma nova crónica

Na listagem de crónicas, clique em **"Nova crónica"** ou aceda a:
```
/admin/cronicas/nova
```

#### Campos do formulário

**Coluna principal**

| Campo | Obrigatório | Descrição |
|---|---|---|
| **Título da crónica** | Sim | Título do texto. |
| **Texto da crónica** | Sim | Conteúdo completo do texto de opinião. |

**Coluna lateral**

| Campo | Obrigatório | Descrição |
|---|---|---|
| **Rótulo da semana** | Sim | Identificação da semana editorial, ex.: `Semana de 6 a 12 de Maio, 2026`. |
| **Nome do autor** | Sim | Nome completo do cronista. |
| **Cargo / descrição do autor** | Não | Breve descrição do autor, ex.: `Jornalista e cronista`. |
| **URL da foto do autor** | Não | Endereço de imagem (https) para o avatar do autor. |
| **Estado** | Sim | **Rascunho** ou **Publicado**. |

Clique em **"Criar crónica"** para guardar.

### Editar uma crónica

Na listagem de crónicas, clique em **"Editar"** na linha correspondente. Após editar, clique em **"Guardar alterações"**.

### Eliminar uma crónica

Na página de edição de uma crónica, está disponível o botão **"Apagar"** (vermelho, no canto inferior esquerdo do formulário). Será pedida confirmação antes de a eliminação ser concretizada. **Esta acção é irreversível.**

---

## 8. Estados de Publicação

Todos os tipos de conteúdo (notícias, eventos e crónicas) suportam dois estados:

| Estado | Visibilidade |
|---|---|
| **Rascunho** | Apenas visível no painel de administração. Não aparece no site público. |
| **Publicado** | Visível para todos os visitantes do portal. |

Pode alternar o estado em qualquer altura editando o conteúdo e alterando o campo **"Estado"**.

---

## 9. Carregar Imagens

O upload de imagens está disponível nos formulários de notícias e eventos. Para carregar uma imagem:

1. Clique na área de upload com a indicação **"Selecionar imagem (opcional)"**.
2. Escolha um ficheiro no formato **JPG, PNG ou WebP**.
3. Aguarde a mensagem **"A enviar imagem..."** desaparecer.
4. A pré-visualização da imagem carregada aparecerá automaticamente.

Para remover uma imagem já carregada, clique em **"Remover"** junto à miniatura.

> As imagens são guardadas em armazenamento externo e referenciadas por URL. A eliminação da imagem no formulário remove apenas a referência, não o ficheiro do servidor.

---

## 10. Terminar Sessão

Para sair do painel de administração, clique em **"Sair"** na barra de navegação. A sessão é terminada de imediato e será redirecionado para a página de autenticação.

---

## Resumo dos Atalhos de Navegação

| Acção | Caminho |
|---|---|
| Dashboard | `/admin` |
| Nova notícia | `/admin/noticias/nova` |
| Novo evento | `/admin/eventos/novo` |
| Listagem de crónicas | `/admin/cronicas` |
| Nova crónica | `/admin/cronicas/nova` |
| Configurações | `/admin/configuracoes` |

---

*Documento interno — Algarve TV. Para questões técnicas, contacte a equipa de desenvolvimento.*
