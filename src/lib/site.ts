export const siteConfig = {
  name: "Algarve TV Paradise",
  shortName: "Algarve TV Paradise",
  description:
    "Plataforma digital de notícias, eventos e informação dedicada ao Algarve.",
  url: "https://medialgarveparadise.pt",
  email: "media@algarvetvparadise.com",
  phone: "+351 964 431 933",
  location: "Algarve, Portugal",
  tagline: "Tudo o que acontece no Algarve, num só lugar.",
  social: {
    instagram: "https://instagram.com/algarveparadisemedia",
    facebook: "https://facebook.com/algarveparadisemedia",
    youtube: "https://youtube.com/@algarveparadisemedia",
  },
} as const;

export const siteRoutes = {
  home: "/",
  about: "/sobre",
  news: "/noticias",
  login: "/login",
  admin: "/admin",
  events: "/eventos",
  community: "/comunidade",
  support: "/apoie",
  contact: "/contactos",
  privacyPolicy: "/politica-de-privacidade",
  cookiePolicy: "/politica-de-cookies",
} as const;

export const previewPrefix = "/visualizar";

export function isPrelaunchMode() {
  return process.env.PRELAUNCH_MODE === "true";
}

export function hasPreviewPrefix(pathname: string) {
  return pathname === previewPrefix || pathname.startsWith(`${previewPrefix}/`);
}

export function stripPreviewPrefix(pathname: string) {
  if (!hasPreviewPrefix(pathname)) return pathname;
  return pathname.slice(previewPrefix.length) || "/";
}

function shouldUsePreviewPrefix() {
  if (typeof window === "undefined") {
    return isPrelaunchMode();
  }

  return hasPreviewPrefix(window.location.pathname);
}

export function withPreviewPrefix(href: string) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/") ||
    hasPreviewPrefix(href)
  ) {
    return href;
  }

  if (!shouldUsePreviewPrefix()) return href;

  return `${previewPrefix}${href === "/" ? "" : href}`;
}
