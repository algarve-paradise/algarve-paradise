import { CheckCircle2, Globe2 } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";

const reasons = [
  "Informação atualizada diariamente",
  "Conteúdos organizados num só lugar",
  "Foco exclusivo no Algarve",
  "Acesso simples em qualquer dispositivo",
];

export function HomeIntroSection() {
  return (
    <SectionShell
      eyebrow="O que é"
      title="O que é o Algarve TV Paradise?"
      description="O Algarve TV Paradise é uma plataforma digital de informação dedicada ao Algarve. Aqui reunimos notícias, conteúdos e atualizações relevantes da região, organizadas de forma simples para que qualquer pessoa possa acompanhar o que realmente importa."
      withDivider={false}
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div
          data-reveal-clip
          className="relative overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-[var(--dt-color-brand)] p-7 text-background sm:p-9"
        >
          <div className="absolute -right-24 -top-24 size-64 rounded-full bg-[var(--dt-color-accent)]/24 blur-3xl" />
          <div className="relative space-y-4">
            <span className="pill pill-glass text-foreground">
              <Globe2 className="size-3" />
              Informação regional
            </span>
            <h3 className="font-heading text-3xl leading-tight">Um ponto central sobre o Algarve</h3>
            <p className="text-sm leading-7 text-white/74">
              Notícias locais, eventos, informações úteis e ligação com a comunidade, dentro e fora
              da região.
            </p>
          </div>
        </div>

        <div data-reveal-grid className="grid gap-3 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason}
              className="flex min-h-28 items-start gap-3 rounded-[1.2rem] border border-foreground/10 bg-white p-5 shadow-[0_16px_40px_rgba(7,32,67,0.06)]"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--dt-color-accent)]" />
              <span className="text-sm font-medium leading-6 text-foreground">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
