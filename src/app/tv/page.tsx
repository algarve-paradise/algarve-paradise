import type { Metadata } from "next";
import { Clapperboard, PlayCircle } from "lucide-react";

import { VideoCard } from "@/components/cards/video-card";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { videoItems } from "@/data/videos";
import { siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "TV",
  description: "Pagina de videos e reportagens da Algarve Paradise Media.",
};

export default function TvPage() {
  const [featured, ...rest] = videoItems;

  return (
    <PageShell
      eyebrow="TV e videos"
      title="Grelha editorial inspirada em canal de televisao digital"
      description="A pagina de TV organiza reportagens, entrevistas e clips da comunidade numa estrutura visual pronta para thumbnails reais."
      primaryCta={{ label: "Ver noticias", href: siteRoutes.news }}
      secondaryCta={{ label: "Agenda de eventos", href: siteRoutes.events }}
    >
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <VideoCard item={featured} featured anchorId={featured.slug} />
        <Card className="border border-[#10345f] bg-[#04162f] text-white shadow-[0_24px_60px_rgba(4,22,47,0.24)]">
          <CardContent className="space-y-5 pt-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
              <Clapperboard className="size-4 text-[var(--color-signal)]" />
              Canal digital
            </div>
            <h2 className="font-heading text-3xl">Grelha de reportagens e formatos de proximidade</h2>
            <p className="text-sm leading-7 text-white/74">
              Esta pagina foi desenhada como uma extensao natural da identidade de canal de TV:
              thumbnails fortes, destaques editoriais e leitura imediata entre reportagem, agenda e comunidade.
            </p>
            <div className="grid gap-3">
              {rest.slice(0, 3).map((item) => (
                <div
                  key={item.slug}
                  className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <PlayCircle className="mt-0.5 size-4 shrink-0 text-[var(--color-signal)]" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/55">
                      {item.category} · {item.duration}
                    </div>
                    <div className="mt-1 font-heading text-lg">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Reportagem em destaque"
          title="Formato principal para video hero"
          description="Area preparada para um destaque forte e uma grelha secundaria de conteudos."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.slice(0, 3).map((item) => (
            <VideoCard key={item.slug} item={item} anchorId={item.slug} />
          ))}
        </div>
      </section>

      <section className="space-y-6 py-10">
        <SectionHeading
          eyebrow="Arquivo"
          title="Base pronta para crescer em colecoes, programas e rubricas"
          description="Nesta fase o objetivo e deixar clara a estrutura de card, grelha e destaque."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videoItems.map((item) => (
            <VideoCard key={item.slug} item={item} anchorId={item.slug} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
