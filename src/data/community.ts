import type { CommunityMessage } from "@/types/content";
import { siteRoutes } from "@/lib/site";

export const communityIntro = {
  eyebrow: "Participação",
  title: "A sua participação",
  description:
    "Este projeto também é feito pela comunidade. Se tiver uma sugestão, notícia ou evento, pode partilhar connosco.",
  primaryCta: { label: "Enviar mensagem", href: `${siteRoutes.community}#participar` },
};

export const communityMessages: CommunityMessage[] = [
  {
    name: "Ana Martins",
    municipality: "Faro",
    message:
      "Seria importante acompanhar com regularidade as iniciativas culturais de proximidade e os projetos jovens da região. O Algarve tem muito talento que merece visibilidade.",
  },
  {
    name: "Pedro Gonçalves",
    municipality: "Loulé",
    message:
      "Uma plataforma regional clara pode aproximar muito a informação local das pessoas que vivem e trabalham no Algarve. Parabéns pela iniciativa.",
  },
  {
    name: "Sofia Ribeiro",
    municipality: "Tavira",
    message:
      "Gostava de ver mais destaque para histórias da comunidade e para eventos de associações locais. O interior do Algarve também tem histórias para contar.",
  },
];
