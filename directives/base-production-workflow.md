# Fluxo Base de Produção

## Objetivo

Construir websites 1:1 com rapidez, consistência visual e baixa necessidade de retrabalho.

## Passo a passo

1. Ler o briefing e identificar objetivo comercial, páginas necessárias e prova social disponível.
2. Atualizar `src/lib/site.ts` com branding, links e contactos.
3. Substituir dados mockados em `src/data/` por conteúdo real.
4. Selecionar as secções necessárias e remover as não usadas.
5. Trocar imagens de `public/images/` e validar placeholders.
6. Ajustar copy, CTAs e hierarquia de conversão.
7. Validar mobile, acessibilidade básica, estados vazios e links.
8. Rodar `pnpm lint`, `pnpm typecheck` e `pnpm build`.

## Regras

- Não transformar a base num monólito.
- Não misturar dados com componentes.
- Preferir reutilização a customização isolada.
- Se um bloco começar a repetir lógica, extrair para `shared/` ou `ui/`.
