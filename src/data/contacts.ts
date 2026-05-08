import { siteConfig } from "@/lib/site";
import type { ContactFormField, ContactLink, SocialLink } from "@/types/content";

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    label: "Localizacao",
    value: siteConfig.location,
    href: "#",
  },
];

export const contactFormFields: ContactFormField[] = [
  {
    label: "Nome",
    name: "nome",
    type: "text",
    placeholder: "O seu nome",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "nome@exemplo.pt",
  },
  {
    label: "Mensagem",
    name: "mensagem",
    type: "textarea",
    placeholder: "Partilhe o motivo do seu contacto.",
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    handle: "@algarveparadisemedia",
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    handle: "Algarve Paradise Media",
  },
  {
    label: "YouTube",
    href: siteConfig.social.youtube,
    handle: "@algarveparadisemedia",
  },
];
