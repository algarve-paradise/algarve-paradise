import { siteRoutes } from "@/lib/site";
import type { NewsCategory, NewsItem } from "@/types/content";

export const newsCategories: NewsCategory[] = [
  "Algarve",
  "Municipios",
  "Economia",
  "Turismo",
  "Seguranca",
  "Eventos",
];

export const newsItems: NewsItem[] = [
  {
    slug: "marina-portimao",
    title: "Novo projeto aprovado para a marina de Portimão",
    excerpt:
      "A proposta avança com foco em requalificação urbana, dinamização económica e valorização da frente ribeirinha.",
    date: "2026-04-02",
    category: "Economia",
    href: `${siteRoutes.news}#marina-portimao`,
    imageLabel: "Vista costeira com marina e embarcações em Portimão",
    featured: true,
    live: true,
  },
  {
    slug: "turismo-sustentavel",
    title: "Algarve reforça estratégia de turismo sustentável em 2026",
    excerpt:
      "Entidades regionais apresentam novas medidas de equilíbrio entre crescimento turístico e preservação territorial.",
    date: "2026-04-01",
    category: "Turismo",
    href: `${siteRoutes.news}#turismo-sustentavel`,
    imageLabel: "Falesias, mar e visitantes em trilho costeiro",
    featured: true,
  },
  {
    slug: "faro-cultura-bairro",
    title: "Faro alarga programa cultural de bairro para a primavera",
    excerpt:
      "A iniciativa junta associações, artistas locais e espaços públicos com atividades abertas a toda a comunidade.",
    date: "2026-03-29",
    category: "Eventos",
    href: `${siteRoutes.news}#faro-cultura-bairro`,
    imageLabel: "Praça urbana com concerto ao final da tarde",
    featured: true,
  },
  {
    slug: "lagos-mobilidade",
    title: "Lagos apresenta reforço de mobilidade para zonas históricas",
    excerpt:
      "O plano inclui ajustes de circulação, acessibilidade pedonal e melhoria da experiência de residentes e visitantes.",
    date: "2026-03-27",
    category: "Municipios",
    href: `${siteRoutes.news}#lagos-mobilidade`,
    imageLabel: "Rua histórica com circulação pedonal e comércio local",
  },
  {
    slug: "apoio-pescas",
    title: "Setor das pescas recebe novo pacote de apoio regional",
    excerpt:
      "Medidas procuram reforçar competitividade local e preservar atividades económicas tradicionais do Algarve.",
    date: "2026-03-22",
    category: "Algarve",
    href: `${siteRoutes.news}#apoio-pescas`,
    imageLabel: "Porto de pesca com barcos e trabalhadores",
  },
  {
    slug: "protecao-civil-pascoa",
    title: "Proteção civil prepara plano especial para período da Páscoa",
    excerpt:
      "As autoridades reforçam operação, informação preventiva e articulação entre municípios e serviços de emergência.",
    date: "2026-03-18",
    category: "Seguranca",
    href: `${siteRoutes.news}#protecao-civil-pascoa`,
    imageLabel: "Veículos de emergência e equipa operacional",
  },
];
