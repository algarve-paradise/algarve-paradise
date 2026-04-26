# TV Algarve — Algarve Paradise Media

> **A voz do Algarve, em direto para si.**

Plataforma digital regional dedicada à informação, eventos, comunidade e apoio institucional no Algarve. Um canal de comunicação moderno que liga cidadãos, municípios e associações locais numa única presença digital.

---

## Sobre o Projeto

A **Algarve Paradise Media** nasce com o objetivo de dar voz à região do Algarve, criando uma ponte entre a comunidade, as instituições e a informação relevante. Este projeto surge da necessidade de modernizar a comunicação regional, tornando-a mais acessível, dinâmica e próxima das pessoas.

### Missão
Informar, conectar e valorizar o Algarve através de uma comunicação moderna, acessível e relevante.

### Visão
Ser uma referência regional na comunicação digital, aproximando pessoas, instituições e iniciativas locais.

---

## Funcionalidades

- 📰 **Notícias** — Portal de notícias regional com categorias (Algarve, Municípios, Economia, Turismo, Segurança, Eventos)
- 🎥 **TV / Vídeos** — Reportagens e conteúdos em formato de canal de televisão digital
- 📅 **Eventos** — Agenda regional com datas, locais e descrições
- 🤝 **Comunidade** — Espaço de participação e interação com a comunidade
- 💙 **Apoio** — Sistema de doações e patrocínios para sustentação do projeto
- 🏛️ **Institucional** — Apresentação da associação, missão, visão e equipa fundadora
- 📬 **Contactos** — Formulário de contacto e informações institucionais

---

## Stack Tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | App Router, SSR, rotas |
| [TypeScript](https://www.typescriptlang.org) | 5 | Tipagem estrita |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Estilização utilitária |
| [shadcn/ui](https://ui.shadcn.com) | — | Componentes de UI acessíveis |
| [Framer Motion](https://www.framer.com/motion) | 12 | Animações e transições |
| [Lucide React](https://lucide.dev) | — | Ícones SVG |
| [pnpm](https://pnpm.io) | — | Gestor de pacotes |

---

## Instalação e Desenvolvimento

### Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9

### Início rápido

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor ficará disponível em [http://localhost:3000](http://localhost:3000).

### Comandos disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor de produção
pnpm lint         # Verificação de código (ESLint)
pnpm typecheck    # Verificação de tipos (TypeScript)
```

---

## Estrutura do Projeto

```
algarve-tv-demo/
├── src/
│   ├── app/                  # Rotas e layout (Next.js App Router)
│   │   ├── page.tsx          # Página inicial
│   │   ├── sobre/            # Sobre a associação
│   │   ├── noticias/         # Portal de notícias
│   │   ├── tv/               # TV e vídeos
│   │   ├── eventos/          # Agenda de eventos
│   │   ├── comunidade/       # Interação com a comunidade
│   │   ├── apoie/            # Doações e patrocínios
│   │   └── contactos/        # Contactos
│   ├── components/
│   │   ├── layout/           # Header, footer e navegação
│   │   ├── sections/         # Secções das páginas
│   │   ├── shared/           # Componentes reutilizáveis
│   │   └── ui/               # Primitivos de UI (shadcn/ui)
│   ├── data/                 # Conteúdos e dados da plataforma
│   ├── lib/                  # Utilitários e configuração base
│   │   ├── site.ts           # Branding, contactos e rotas
│   │   ├── motion.ts         # Variantes de animação
│   │   └── utils.ts          # Funções auxiliares
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # Tokens e estilos globais
│   └── types/                # Tipos TypeScript partilhados
├── public/                   # Imagens e ficheiros estáticos
├── directives/               # Briefing e fluxo de produção (interno)
└── next.config.ts            # Configuração Next.js
```

---

## Rotas

| Rota | Página |
|---|---|
| `/` | Página inicial |
| `/sobre` | Sobre a Algarve Paradise Media |
| `/noticias` | Portal de notícias |
| `/tv` | TV e reportagens em vídeo |
| `/eventos` | Agenda de eventos regionais |
| `/comunidade` | Comunidade e participação |
| `/apoie` | Doações e patrocínios |
| `/contactos` | Contactos |

---

## Identidade Visual

- **Cores:** Azul, vermelho e branco — inspirado em canais de televisão e portais de media
- **Tipografia:** Manrope · Space Grotesk · IBM Plex Mono
- **Estilo:** Moderno, limpo e profissional, com elementos visuais inspirados em TV (barras, destaques, "em direto")

---

## Contacto

- 🌐 [algarveparadisemedia.pt](https://algarveparadisemedia.pt)
- 📧 geral@algarveparadisemedia.pt
- 📍 Algarve, Portugal
- 📷 [@algarveparadisemedia](https://instagram.com/algarveparadisemedia)
- 🎬 [YouTube](https://youtube.com/@algarveparadisemedia)
- 👍 [Facebook](https://facebook.com/algarveparadisemedia)

---

<p align="center">Feito com ❤️ para o Algarve</p>
