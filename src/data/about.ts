import type { FeatureCard, FounderItem } from "@/types/content";

export const aboutStory = {
  eyebrow: "Sobre o projeto",
  title: "Uma plataforma criada para dar voz ao Algarve",
  description:
    "O Algarve TV Paradise é uma plataforma digital criada para dar voz à região do Algarve. Num contexto onde a informação local é muitas vezes limitada ou dispersa, este projeto surge para reunir, organizar e divulgar conteúdos relevantes de forma simples e acessível.",
};

export const missionVisionValues: FeatureCard[] = [
  {
    tag: "Missão",
    title: "Informar, conectar e valorizar o Algarve",
    description:
      "A comunicação deve ser acessível, relevante e útil para residentes, visitantes e entidades locais.",
    bullets: ["Linguagem clara", "Enfoque regional", "Utilidade publica"],
  },
  {
    tag: "Visão",
    title: "Ser uma referência regional na comunicação digital",
    description:
      "O projeto pretende consolidar uma presença editorial e institucional que una pessoas e iniciativas locais.",
    bullets: ["Presenca digital forte", "Relacao com entidades", "Crescimento sustentado"],
  },
  {
    tag: "Valores",
    title: "Transparência, proximidade, credibilidade e inovação",
    description:
      "A identidade do site deve refletir rigor editorial sem perder calor humano e proximidade regional.",
    bullets: ["Transparencia", "Proximidade", "Credibilidade"],
  },
];

export const founders: FounderItem[] = [
  {
    name: "Joao Silva",
    role: "Fundador e responsável pela área de comunicação",
    description:
      "Coordena a orientação editorial e a ligação do projeto com a comunidade e parceiros locais.",
    imageLabel: "Retrato profissional de fundador em contexto media",
  },
  {
    name: "Maria Fernandes",
    role: "Coordenadora de conteúdos e relações institucionais",
    description:
      "Garante coerência institucional, relações com entidades e acompanhamento da agenda regional.",
    imageLabel: "Retrato profissional de coordenadora institucional",
  },
  {
    name: "Carlos Almeida",
    role: "Responsável técnico e desenvolvimento digital",
    description:
      "Assegura a base técnica da plataforma e a sua evolução para novos formatos e canais.",
    imageLabel: "Retrato profissional de responsavel tecnico",
  },
];
