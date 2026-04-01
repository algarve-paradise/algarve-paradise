import type { FeatureCard, FounderItem } from "@/types/content";

export const aboutStory = {
  eyebrow: "Sobre o projeto",
  title: "Uma plataforma regional para informar, conectar e valorizar o Algarve",
  description:
    "A Algarve Paradise Media nasce para aproximar comunidade, instituicoes e informacao relevante com uma presenca digital moderna, clara e credivel.",
};

export const missionVisionValues: FeatureCard[] = [
  {
    tag: "Missao",
    title: "Informar, conectar e valorizar o Algarve",
    description:
      "A comunicacao deve ser acessivel, relevante e util para residentes, visitantes e entidades locais.",
    bullets: ["Linguagem clara", "Enfoque regional", "Utilidade publica"],
  },
  {
    tag: "Visao",
    title: "Ser uma referencia regional na comunicacao digital",
    description:
      "O projeto pretende consolidar uma presenca editorial e institucional que una pessoas e iniciativas locais.",
    bullets: ["Presenca digital forte", "Relacao com entidades", "Crescimento sustentado"],
  },
  {
    tag: "Valores",
    title: "Transparencia, proximidade, credibilidade e inovacao",
    description:
      "A identidade do site deve refletir rigor editorial sem perder calor humano e proximidade regional.",
    bullets: ["Transparencia", "Proximidade", "Credibilidade"],
  },
];

export const founders: FounderItem[] = [
  {
    name: "Joao Silva",
    role: "Fundador e responsavel pela area de comunicacao",
    description:
      "Coordena a orientacao editorial e a ligacao do projeto com a comunidade e parceiros locais.",
    imageLabel: "Retrato profissional de fundador em contexto media",
  },
  {
    name: "Maria Fernandes",
    role: "Coordenadora de conteudos e relacoes institucionais",
    description:
      "Garante coerencia institucional, relacoes com entidades e acompanhamento da agenda regional.",
    imageLabel: "Retrato profissional de coordenadora institucional",
  },
  {
    name: "Carlos Almeida",
    role: "Responsavel tecnico e desenvolvimento digital",
    description:
      "Assegura a base tecnica da plataforma e a sua evolucao para novos formatos e canais.",
    imageLabel: "Retrato profissional de responsavel tecnico",
  },
];
