import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/shared/page-intro";
import { Reveal } from "@/components/shared/reveal";
import type { CtaLink, Stat } from "@/types/content";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  stats?: Stat[];
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  stats,
  children,
}: PageShellProps) {
  return (
    <Container className="py-8 sm:py-10">
      <Reveal>
        <PageIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          stats={stats}
        />
      </Reveal>
      <div className="space-y-10 pb-14 sm:space-y-12 sm:pb-20">{children}</div>
    </Container>
  );
}
