import type { FeatureCard, SupportCard } from "@/types/content";
import { siteRoutes } from "@/lib/site";

export const supportIntro = {
  eyebrow: "Apoie o projeto",
  title: "Este projeto e feito para o Algarve",
  description:
    "Com apoio da comunidade e de entidades parceiras, a plataforma ganha capacidade para informar melhor, chegar mais longe e reforcar a ligacao regional.",
};

export const supportOptions: SupportCard[] = [
  {
    title: "Doacao pontual",
    description:
      "Preparado para integrar uma solucao simples de apoio direto sem backend nesta fase.",
    cta: { label: "Doar agora", href: siteRoutes.support },
  },
  {
    title: "Patrocinio institucional",
    description:
      "Estrutura pronta para apresentar parceiros, contrapartidas editoriais e proximos passos comerciais.",
    cta: {
      label: "Tornar-se patrocinador",
      href: siteRoutes.contact,
      variant: "outline",
    },
  },
];

export const supportReasons: FeatureCard[] = [
  {
    tag: "Impacto",
    title: "Mais informacao regional e mais proximidade",
    description:
      "O apoio ajuda a produzir noticias, videos e cobertura local com foco na utilidade publica.",
    bullets: ["Noticias", "Reportagens", "Agenda regional"],
  },
  {
    tag: "Credibilidade",
    title: "Projeto independente com ambicao institucional",
    description:
      "A base visual e editorial deve mostrar rigor suficiente para entidades publicas e parceiros privados.",
    bullets: ["Tom institucional", "Presenca moderna", "Escalabilidade futura"],
  },
];
