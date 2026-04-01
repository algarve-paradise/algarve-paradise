# Starter Base

Base reutilizável para websites 1:1 de alta qualidade.

## Uso rápido

1. Duplique este repositório para o novo cliente.
2. Ajuste `src/lib/site.ts` com branding, contactos e rotações de navegação.
3. Substitua os mock data em `src/data/` pelo briefing real.
4. Troque imagens em `public/images/`.
5. Adapte páginas e secções ao nicho do projeto.

## Stack

- Next.js App Router
- TypeScript estrito
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion

## Comandos

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Estrutura

- `src/app/` rotas, layout e estados do App Router
- `src/components/` UI, layout, secções e componentes partilhados
- `src/data/` conteúdos mockados e facilmente substituíveis
- `src/lib/` utilitários e configuração base
- `src/styles/` tokens e estilos globais
- `directives/` fluxo interno de produção e briefing
