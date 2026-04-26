import type { CtaLink, Stat } from "@/types/content";
import { siteRoutes } from "@/lib/site";

export const editorialStats: Stat[] = [
  { value: "06", label: "areas editoriais e institucionais organizadas" },
  { value: "03", label: "eixos centrais: noticias, comunidade e apoio" },
  { value: "24/7", label: "linguagem pensada para atualidade e proximidade" },
];

export const globalCtas: { primary: CtaLink; secondary: CtaLink } = {
  primary: { label: "Ver noticias", href: siteRoutes.news },
  secondary: {
    label: "Fazer parte da comunidade",
    href: siteRoutes.community,
    variant: "outline",
  },
};

export const newsroomLabels = {
  channel: "TV Algarve",
  live: "Em direto",
  edition: "Edicao Regional",
};
