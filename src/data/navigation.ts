import { siteRoutes } from "@/lib/site";
import type { NavItem } from "@/types/content";

export const navigationMain: NavItem[] = [
  { label: "Home", href: siteRoutes.home },
  { label: "Sobre", href: siteRoutes.about },
  { label: "Noticias", href: siteRoutes.news },
  { label: "TV", href: siteRoutes.tv },
  { label: "Eventos", href: siteRoutes.events },
  { label: "Comunidade", href: siteRoutes.community },
  { label: "Apoie", href: siteRoutes.support, cta: true },
  { label: "Contactos", href: siteRoutes.contact },
];

export const navigationFooter: NavItem[] = [
  { label: "Sobre a associacao", href: siteRoutes.about },
  { label: "Noticias", href: siteRoutes.news },
  { label: "TV e videos", href: siteRoutes.tv },
  { label: "Agenda regional", href: siteRoutes.events },
  { label: "Comunidade", href: siteRoutes.community },
  { label: "Apoie o projeto", href: siteRoutes.support },
  { label: "Contactos", href: siteRoutes.contact },
];
