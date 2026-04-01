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
    title: "Novo projeto aprovado para a marina de Portimao",
    excerpt:
      "A proposta avanca com foco em requalificacao urbana, dinamizacao economica e valorizacao da frente ribeirinha.",
    date: "2026-04-02",
    category: "Economia",
    href: `${siteRoutes.news}#marina-portimao`,
    imageLabel: "Vista costeira com marina e embarcacoes em Portimao",
    featured: true,
    live: true,
  },
  {
    slug: "turismo-sustentavel",
    title: "Algarve reforca estrategia de turismo sustentavel em 2026",
    excerpt:
      "Entidades regionais apresentam novas medidas de equilibrio entre crescimento turistico e preservacao territorial.",
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
      "A iniciativa junta associacoes, artistas locais e espacos publicos com atividades abertas a toda a comunidade.",
    date: "2026-03-29",
    category: "Eventos",
    href: `${siteRoutes.news}#faro-cultura-bairro`,
    imageLabel: "Praca urbana com concerto ao final da tarde",
    featured: true,
  },
  {
    slug: "lagos-mobilidade",
    title: "Lagos apresenta reforco de mobilidade para zonas historicas",
    excerpt:
      "O plano inclui ajustes de circulacao, acessibilidade pedonal e melhoria da experiencia de residentes e visitantes.",
    date: "2026-03-27",
    category: "Municipios",
    href: `${siteRoutes.news}#lagos-mobilidade`,
    imageLabel: "Rua historica com circulacao pedonal e comercio local",
  },
  {
    slug: "apoio-pescas",
    title: "Setor das pescas recebe novo pacote de apoio regional",
    excerpt:
      "Medidas procuram reforcar competitividade local e preservar atividades economicas tradicionais do Algarve.",
    date: "2026-03-22",
    category: "Algarve",
    href: `${siteRoutes.news}#apoio-pescas`,
    imageLabel: "Porto de pesca com barcos e trabalhadores",
  },
  {
    slug: "protecao-civil-pascoa",
    title: "Protecao civil prepara plano especial para periodo da Pascoa",
    excerpt:
      "As autoridades reforcam operacao, informacao preventiva e articulacao entre municipios e servicos de emergencia.",
    date: "2026-03-18",
    category: "Seguranca",
    href: `${siteRoutes.news}#protecao-civil-pascoa`,
    imageLabel: "Veiculos de emergencia e equipa operacional",
  },
];
