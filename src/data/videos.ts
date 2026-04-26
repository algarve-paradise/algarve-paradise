import { siteRoutes } from "@/lib/site";
import type { VideoItem } from "@/types/content";

export const videoItems: VideoItem[] = [
  {
    slug: "turismo-sustentavel-2026",
    title: "Algarve reforca turismo sustentavel em 2026",
    excerpt:
      "Reportagem sobre novas medidas para equilibrio entre atratividade turistica e preservacao ambiental.",
    duration: "04:32",
    category: "Reportagem",
    href: `${siteRoutes.tv}#turismo-sustentavel-2026`,
    imageLabel: "Camera de reportagem com paisagem costeira",
    featured: true,
  },
  {
    slug: "agenda-cultural-lagos",
    title: "Agenda cultural de Lagos ganha nova escala regional",
    excerpt:
      "Cobertura de iniciativas que unem programacao artistica, espaco publico e participacao comunitaria.",
    duration: "03:18",
    category: "Agenda",
    href: `${siteRoutes.tv}#agenda-cultural-lagos`,
    imageLabel: "Palco cultural com luzes e publico",
  },
  {
    slug: "entrevista-empreendedorismo",
    title: "Empreendedorismo local em destaque no litoral algarvio",
    excerpt:
      "Conversa com agentes regionais sobre inovacao, economia e desenvolvimento local.",
    duration: "06:05",
    category: "Entrevista",
    href: `${siteRoutes.tv}#entrevista-empreendedorismo`,
    imageLabel: "Estudio improvisado com microfones e convidados",
  },
  {
    slug: "comunidade-em-foco",
    title: "Comunidade em foco: historias de proximidade no Algarve",
    excerpt:
      "Pequenos relatos locais mostram o impacto de iniciativas comunitarias e associativas.",
    duration: "02:44",
    category: "Comunidade",
    href: `${siteRoutes.tv}#comunidade-em-foco`,
    imageLabel: "Pessoas da comunidade em ambiente exterior",
  },
];
