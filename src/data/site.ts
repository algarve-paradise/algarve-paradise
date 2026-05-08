import type { CtaLink, Stat } from "@/types/content";
import { siteRoutes } from "@/lib/site";

export const editorialStats: Stat[] = [
  { value: "06", label: "Áreas editoriais e institucionais organizadas" },
  { value: "03", label: "Eixos centrais: notícias, eventos e comunidade" },
  { value: "24/7", label: "Linguagem pensada para atualidade e proximidade" },
];

export const globalCtas: { primary: CtaLink; secondary: CtaLink } = {
  primary: { label: "Ver notícias", href: siteRoutes.news },
  secondary: {
    label: "Fazer parte da comunidade",
    href: siteRoutes.community,
    variant: "outline",
  },
};

export const newsroomLabels = {
  channel: "TV Algarve",
  live: "Em direto",
  edition: "Edição Regional",
};
