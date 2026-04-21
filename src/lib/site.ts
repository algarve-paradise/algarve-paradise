export const siteConfig = {
  name: "O Portal do Algarve",
  shortName: "Algarve Portal",
  description:
    "Portal digital regional dedicado a notícias, política, sociedade e eventos do Algarve, numa abordagem editorial e clássica.",
  url: "https://algarveportal.pt",
  email: "redacao@algarveportal.pt",
  phone: "+351 289 000 000",
  location: "Algarve, Portugal",
  tagline: "O grande jornal digital do sul do país.",
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
