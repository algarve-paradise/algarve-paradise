import type { CommunityMessage, FeatureCard } from "@/types/content";
import { siteRoutes } from "@/lib/site";

export const communityIntro = {
  eyebrow: "Participacao",
  title: "A sua voz tambem faz parte do Algarve",
  description:
    "Este espaco foi pensado para aproximar residentes, associacoes e iniciativas locais atraves de mensagens, sugestoes e participacao civica simples.",
  primaryCta: { label: "Enviar mensagem", href: `${siteRoutes.community}#participar` },
};

export const communityFeatures: FeatureCard[] = [
  {
    tag: "Opiniao",
    title: "Espaco para mensagens e sugestoes",
    description:
      "Os formularios ficam preparados para integracao futura, mantendo desde ja clareza de uso e contexto institucional.",
    bullets: ["Nome", "Mensagem", "Acao preparada para integracao"],
  },
  {
    tag: "Proximidade",
    title: "Ligacao direta com a regiao",
    description:
      "A interacao da comunidade deve ser visivel e enquadrada por contexto regional realista.",
    bullets: ["Municipio", "Tom respeitoso", "Representacao regional"],
  },
];

export const communityMessages: CommunityMessage[] = [
  {
    name: "Ana Martins",
    municipality: "Faro",
    message:
      "Seria importante acompanhar com regularidade as iniciativas culturais de proximidade e os projetos jovens da regiao.",
  },
  {
    name: "Pedro Goncalves",
    municipality: "Loule",
    message:
      "Uma plataforma regional clara pode aproximar muito a informacao local das pessoas que vivem e trabalham no Algarve.",
  },
  {
    name: "Sofia Ribeiro",
    municipality: "Tavira",
    message:
      "Gostava de ver mais destaque para historias da comunidade e para eventos de associacoes locais.",
  },
];
