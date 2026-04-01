export const siteConfig = {
  name: "Algarve Paradise Media",
  shortName: "TV Algarve",
  description:
    "Plataforma digital regional dedicada a noticias, eventos, comunidade e apoio institucional no Algarve.",
  url: "https://algarveparadisemedia.pt",
  email: "geral@algarveparadisemedia.pt",
  phone: "+351 289 000 000",
  location: "Algarve, Portugal",
  tagline: "A voz do Algarve, em direto para si",
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
  tv: "/tv",
  events: "/eventos",
  community: "/comunidade",
  support: "/apoie",
  contact: "/contactos",
} as const;
