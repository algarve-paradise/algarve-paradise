import type { FeatureCard, HeroBlock } from "@/types/content";
import { siteRoutes } from "@/lib/site";
import { editorialStats } from "@/data/site";

export const homeHero: HeroBlock = {
  eyebrow: "Media regional do Algarve",
  title: "A voz do Algarve, em direto para si",
  description:
    "Informacao, eventos e comunidade reunidos numa so plataforma, com uma linguagem editorial moderna e proximidade real ao territorio algarvio.",
  primaryCta: { label: "Ver noticias", href: siteRoutes.news },
  secondaryCta: {
    label: "Fazer parte da comunidade",
    href: siteRoutes.community,
    variant: "outline",
  },
  stats: editorialStats,
  highlight:
    "Cobertura regional, agenda do territorio e participacao da comunidade com presenca institucional clara.",
};

export const homePillars: FeatureCard[] = [
  {
    tag: "Informacao",
    title: "Noticias e reportagens com leitura imediata",
    description:
      "A Home destaca atualidade regional com hierarquia forte, linguagem clara e ritmo de portal noticioso.",
    bullets: ["Destaques no topo", "Cobertura regional", "Leitura rapida em mobile"],
  },
  {
    tag: "Comunidade",
    title: "Participacao simples e visivel",
    description:
      "A comunidade tem espaco proprio para mensagens, sugestoes e proximidade com o projeto.",
    bullets: ["Formulario curto", "Tom acessivel", "Ligacao aos municipios"],
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
  "Noticias",
  "Reportagens",
  "Agenda regional",
  "Comunidade",
  "Parcerias",
];

export const homeClosing = {
  eyebrow: "Missao regional",
  title: "Uma plataforma criada para aproximar o Algarve da sua propria voz",
  description:
    "A Algarve Paradise Media junta informacao, participacao e credibilidade institucional para reforcar a ligacao entre pessoas, iniciativas e entidades da regiao.",
  primaryCta: { label: "Entrar em contacto", href: siteRoutes.contact },
  secondaryCta: { label: "Participar na comunidade", href: siteRoutes.community, variant: "outline" },
};
