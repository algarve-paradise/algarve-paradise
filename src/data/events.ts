import { siteRoutes } from "@/lib/site";
import type { EventItem } from "@/types/content";

export const events: EventItem[] = [
  {
    slug: "festival-cultural-lagos",
    title: "Festival Cultural de Lagos",
    date: "12 Abril 2026",
    location: "Lagos",
    description:
      "Programa cultural com musica, arte urbana e atividades abertas a residentes e visitantes.",
    href: `${siteRoutes.events}#festival-cultural-lagos`,
    imageLabel: "Palco ao ar livre com publico e bandeiras regionais",
  },
  {
    slug: "feira-gastronomica-faro",
    title: "Feira Gastronomica de Faro",
    date: "18 Abril 2026",
    location: "Faro",
    description:
      "Encontro de sabores algarvios com chefs locais, produtores e atividades para familias.",
    href: `${siteRoutes.events}#feira-gastronomica-faro`,
    imageLabel: "Bancas gastronomicas com pratos regionais e visitantes",
  },
  {
    slug: "encontro-empresarial-portimao",
    title: "Encontro Empresarial de Portimao",
    date: "24 Abril 2026",
    location: "Portimao",
    description:
      "Sessao dedicada a economia regional, inovacao e cooperacao entre entidades do Algarve.",
    href: `${siteRoutes.events}#encontro-empresarial-portimao`,
    imageLabel: "Auditorio com painel institucional e publico",
  },
];
