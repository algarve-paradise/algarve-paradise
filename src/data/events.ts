import { siteRoutes } from "@/lib/site";
import type { EventItem } from "@/types/content";

export const events: EventItem[] = [
  {
    slug: "festival-cultural-lagos",
    title: "Festival Cultural de Lagos",
    date: "12 Abril 2026",
    location: "Lagos",
    description:
      "Programa cultural com música, arte urbana e atividades abertas a residentes e visitantes.",
    href: `${siteRoutes.events}#festival-cultural-lagos`,
    imageLabel: "Palco ao ar livre com público e bandeiras regionais",
  },
  {
    slug: "feira-gastronomica-faro",
    title: "Feira Gastronómica de Faro",
    date: "18 Abril 2026",
    location: "Faro",
    description:
      "Encontro de sabores algarvios com chefs locais, produtores e atividades para famílias.",
    href: `${siteRoutes.events}#feira-gastronomica-faro`,
    imageLabel: "Bancas gastronómicas com pratos regionais e visitantes",
  },
  {
    slug: "encontro-empresarial-portimao",
    title: "Encontro Empresarial de Portimão",
    date: "24 Abril 2026",
    location: "Portimão",
    description:
      "Sessão dedicada à economia regional, inovação e cooperação entre entidades do Algarve.",
    href: `${siteRoutes.events}#encontro-empresarial-portimao`,
    imageLabel: "Auditório com painel institucional e público",
  },
];
