import type { FeatureCard, HeroBlock } from "@/types/content";
import { siteRoutes } from "@/lib/site";
import { editorialStats } from "@/data/site";

export const homeHero: HeroBlock = {
  eyebrow: "Portal de informação regional",
  title: "Tudo o que acontece no Algarve, num só lugar",
  description:
    "Notícias, eventos e informações atualizadas para quem quer acompanhar de perto tudo o que acontece na região.",
  primaryCta: { label: "Ver notícias", href: siteRoutes.news },
  secondaryCta: {
    label: "Explorar conteúdos",
    href: siteRoutes.events,
    variant: "outline",
  },
  stats: editorialStats,
  highlight:
    "Informação atualizada diariamente, foco exclusivo no Algarve e acesso simples em qualquer dispositivo.",
};

export const homePillars: FeatureCard[] = [
  {
    tag: "Informação",
    title: "Notícias com leitura imediata",
    description:
      "A Home destaca atualidade regional com hierarquia forte, linguagem clara e ritmo de portal noticioso.",
    bullets: ["Destaques no topo", "Cobertura regional", "Leitura rápida em mobile"],
  },
  {
    tag: "Comunidade",
    title: "Participação simples e visível",
    description:
      "A comunidade tem espaço próprio para mensagens, sugestões e proximidade com o projeto.",
    bullets: ["Formulário curto", "Tom acessível", "Ligação aos municípios"],
  },
  {
    tag: "Apoio",
    title: "Credibilidade para parceiros e patrocinadores",
    description:
      "A camada institucional sustenta a imagem do projeto junto de entidades e parceiros locais.",
    bullets: ["Parcerias visiveis", "Doacoes", "Patrocinio preparado"],
  },
];

export const homeEditorialLabels = [
  "Notícias",
  "Informação útil",
  "Agenda regional",
  "Comunidade",
  "Parcerias",
];

export const homeClosing = {
  eyebrow: "Missão regional",
  title: "Um projeto feito para o Algarve",
  description:
    "O Algarve TV Paradise nasce com o objetivo de dar mais visibilidade à região, aproximar pessoas e valorizar tudo o que acontece localmente.",
  primaryCta: { label: "Entrar em contacto", href: siteRoutes.contact },
  secondaryCta: { label: "Participar na comunidade", href: siteRoutes.community, variant: "outline" },
};
