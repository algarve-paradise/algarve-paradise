import Image from "next/image";
import { ArrowUpRight, PenLine, UserRound } from "lucide-react";

import { Container } from "@/components/layout/container";
import { getLatestCronica } from "@/lib/cronicas";

export async function CronicaDaSemanaSection() {
  const cronica = await getLatestCronica();

  if (!cronica) return null;

  const previewLines = cronica.content.split("\n").filter(Boolean).slice(0, 4).join(" ");
  const preview =
    previewLines.length > 320 ? previewLines.slice(0, 320).trimEnd() + "…" : previewLines;

  return (
    <section className="relative py-12 sm:py-20 overflow-hidden bg-[#0A0A0A] text-white">
      {/* Background texture */}
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute -right-48 top-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[var(--dt-color-accent)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-32 bottom-0 size-80 rounded-full bg-[var(--dt-color-mint)]/8 blur-3xl pointer-events-none" />

      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 items-center">
          {/* Left — metadata */}
          <div data-reveal-children className="space-y-8">
            <div data-reveal-child className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                  <PenLine className="size-3" />
                  Crónica da Semana
                </span>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                {cronica.weekLabel}
              </p>
              <h2 className="font-heading text-[2rem] sm:text-[2.6rem] leading-[1.06] tracking-tight text-white">
                {cronica.title}
              </h2>
            </div>

            {/* Author */}
            <div data-reveal-child className="flex items-center gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                {cronica.authorAvatarUrl ? (
                  <Image
                    src={cronica.authorAvatarUrl}
                    alt={cronica.authorName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="size-6 text-white/50" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{cronica.authorName}</p>
                {cronica.authorRole ? (
                  <p className="text-xs text-white/50">{cronica.authorRole}</p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right — content preview */}
          <div data-reveal-children className="space-y-6">
            <blockquote
              data-reveal-child
              className="relative rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-9 backdrop-blur-sm"
            >
              <span className="absolute -left-2 -top-3 font-heading text-6xl leading-none text-[var(--dt-color-accent)]/60 select-none">
                ❝
              </span>
              <p className="text-[15px] leading-[1.8] text-white/80 italic">
                {preview}
              </p>
            </blockquote>

            <div data-reveal-child>
              <a
                href="#cronica-completa"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/15"
                aria-label={`Ler crónica completa: ${cronica.title}`}
                id="cronica-link"
              >
                Ler crónica completa
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Full text (expanded) */}
        <div id="cronica-completa" className="mt-12 border-t border-white/10 pt-10">
          <div className="mx-auto max-w-3xl">
            <p className="whitespace-pre-line text-[15px] leading-[1.9] text-white/75">
              {cronica.content}
            </p>
            <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                {cronica.authorAvatarUrl ? (
                  <Image
                    src={cronica.authorAvatarUrl}
                    alt={cronica.authorName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="size-4 text-white/50" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{cronica.authorName}</p>
                {cronica.authorRole ? (
                  <p className="text-[11px] text-white/40">{cronica.authorRole}</p>
                ) : null}
              </div>
              <p className="ml-auto text-[11px] uppercase tracking-[0.18em] text-white/30">
                {cronica.weekLabel}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
