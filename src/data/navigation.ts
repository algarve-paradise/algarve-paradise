import { siteRoutes } from "@/lib/site";
import type { NavItem } from "@/types/content";

export const navigationMain: NavItem[] = [
  { label: "Home", href: siteRoutes.home },
  { label: "Sobre", href: siteRoutes.about },
  { label: "Notícias", href: siteRoutes.news },
  { label: "Eventos", href: siteRoutes.events },
  { label: "Comunidade", href: siteRoutes.community },
  { label: "Contactos", href: siteRoutes.contact },
];

export const navigationFooter: NavItem[] = [
  { label: "Sobre", href: siteRoutes.about },
  { label: "Notícias", href: siteRoutes.news },
  { label: "Eventos", href: siteRoutes.events },
  { label: "Comunidade", href: siteRoutes.community },
  { label: "Contactos", href: siteRoutes.contact },
];
