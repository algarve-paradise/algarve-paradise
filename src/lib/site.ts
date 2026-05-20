export const siteConfig = {
  name: "Algarve TV Paradise",
  shortName: "Algarve TV Paradise",
  description:
    "Plataforma digital de notícias, eventos e informação dedicada ao Algarve.",
  url: "https://algarvetvparadise.com",
  email: "Media@algarvetvparadise.com",
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
