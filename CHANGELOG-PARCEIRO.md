# Changelog — Atualização da Plataforma

**Data:** 28 de maio de 2026  
**Versão:** Permissões de Equipa + Vídeos YouTube

---

## O que foi adicionado

### 1. Sistema de Permissões por Perfil de Utilizador

A plataforma agora tem três tipos de perfis distintos, cada um com acessos diferentes:

| Perfil | O que pode fazer |
|---|---|
| **Administrador** | Acesso total — publica, edita e apaga qualquer conteúdo, gere utilizadores |
| **Editor** | Cria notícias e eventos, mas o conteúdo fica em **rascunho** até o Administrador aprovar e publicar |
| **Cronista** | Acede apenas à área de Crónicas, cria e edita as suas próprias crónicas |

**Regras importantes:**
- O Editor não consegue publicar diretamente — o botão de publicação não aparece para ele
- O Editor não consegue editar ou apagar conteúdo criado por outra pessoa
- O Cronista não tem acesso à área de Notícias nem Eventos
- Nenhum utilizador consegue alterar o seu próprio perfil de permissões

---

### 2. Gestão de Utilizadores (área exclusiva do Administrador)

Foi criada uma nova página no painel: **Utilizadores**.

Nessa página, o Administrador consegue:
- Ver todos os membros da equipa com email e data de registo
- Alterar o perfil de qualquer utilizador (Admin → Editor → Cronista e vice-versa) com um simples dropdown

---

### 3. Vídeos YouTube nas Notícias

Ao criar ou editar uma notícia, agora existe um novo campo: **Vídeo YouTube (opcional)**.

- Basta colar o link do YouTube (ex.: `https://www.youtube.com/watch?v=abc123`)
- O sistema mostra uma miniatura de pré-visualização na hora
- Na página pública da notícia, o vídeo aparece incorporado logo abaixo do texto, responsivo em qualquer dispositivo
- O campo é completamente opcional — notícias sem vídeo funcionam exatamente como antes

---

## Como testar

### Testar os perfis de utilizador

1. No **Supabase Dashboard**, cria dois utilizadores novos em **Authentication → Users**
2. Acede ao painel de administração e vai a **Utilizadores**
3. Define um utilizador como **Editor** e outro como **Cronista**
4. Faz login com o utilizador Editor e confirma que:
   - Consegue criar uma notícia — mas o campo de publicação mostra "Rascunho — aguarda aprovação"
   - Não consegue editar notícias criadas por outros
5. Faz login com o utilizador Cronista e confirma que:
   - Só vê o menu "Crónicas"
   - Não tem acesso a criar notícias ou eventos

### Testar os vídeos YouTube

1. Faz login como Administrador
2. Vai a **Nova notícia** ou edita uma notícia existente
3. No painel lateral, encontras o campo **"Vídeo YouTube (opcional)"**
4. Cola um link do YouTube — uma miniatura aparece automaticamente a confirmar que foi detetado
5. Guarda a notícia e publica-a
6. Abre a notícia no site público — o vídeo aparece incorporado após o texto do artigo

---

## Notas técnicas (para o socio)

- As migrações de base de dados precisam de ser aplicadas no Supabase antes de testar (`0010_roles_permissions.sql` e `0011_youtube_url.sql`)
- Todos os utilizadores existentes antes desta atualização foram automaticamente promovidos a **Administrador** na migração — nenhum acesso foi perdido
- O campo YouTube aceita os formatos `youtube.com/watch?v=`, `youtu.be/` e `youtube.com/embed/`
