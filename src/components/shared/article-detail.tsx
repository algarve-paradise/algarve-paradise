"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import gsap from "gsap";

import { Container } from "@/components/layout/container";

export type ArticleDetailProps = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string | null;
  authorName?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  region?: string | null;
  content?: string | null;
  readingMinutes?: number;
  meta?: Array<{ label: string; value: string; icon?: "calendar" | "clock" | "tag" | "map" }>;
  backLabel: string;
  backHref: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

const iconMap = {
  calendar: Calendar,
  clock: Clock,
  tag: Tag,
  map: MapPin,
};

export function ArticleDetail({
  category,
  title,
  excerpt,
  date,
  imageUrl,
  authorName,
  sourceName,
  sourceUrl,
  region,
  content,
  readingMinutes,
  meta,
  backLabel,
  backHref,
  primaryAction,
  secondaryAction,
}: ArticleDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-detail-rise]", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
      });
      gsap.from("[data-detail-image]", {
        scale: 1.06,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const paragraphs = (content ?? "").split("\n").filter(Boolean);
  const calculatedReading =
    readingMinutes ??
    Math.max(
      2,
      Math.round(((content ?? "").split(/\s+/).filter(Boolean).length || 0) / 220),
    );

  const metaList = meta ?? [
    {
      label: "Publicado",
      value: new Date(date).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      icon: "calendar" as const,
    },
    {
      label: "Leitura",
      value: `${calculatedReading} min`,
      icon: "clock" as const,
    },
    {
      label: "Categoria",
      value: category,
      icon: "tag" as const,
    },
    ...(region
      ? [
          {
            label: "Região",
            value: region,
            icon: "map" as const,
          },
        ]
      : []),
  ];

  return (
    <div ref={rootRef} className="relative pb-16">
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-[420px] -z-10">
        <div className="absolute left-1/2 top-0 size-[640px] -translate-x-1/2 rounded-full opacity-25 bg-aurora" />
      </div>

      <Container className="pt-6 sm:pt-8">
        {/* Breadcrumb / Back */}
        <div className="flex items-center justify-between mb-6" data-detail-rise>
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/60 backdrop-blur-md px-4 py-2 text-[12px] font-medium text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-white/60 backdrop-blur-md text-foreground transition-colors hover:bg-foreground hover:text-background"
              aria-label="Partilhar"
            >
              <Share2 className="size-4" />
            </button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-white/60 backdrop-blur-md text-foreground transition-colors hover:bg-foreground hover:text-background"
              aria-label="Guardar"
            >
              <Bookmark className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:gap-12">
          {/* LEFT — Image + content */}
          <div className="space-y-8">
            <div
              data-detail-image
              className="group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-muted aspect-[16/11] sm:aspect-[16/10]"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-grid opacity-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute left-5 top-5">
                <span className="surface-acrylic-dark inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                  <Sparkles className="size-3" />
                  {category}
                </span>
              </div>

              {authorName ? (
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <div className="surface-acrylic-dark flex items-center gap-3 rounded-2xl px-3 py-2 text-white">
                    <span className="size-8 rounded-full bg-white/20 ring-1 ring-white/40" />
                    <div className="leading-tight">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                        Por
                      </div>
                      <div className="text-sm font-semibold">{authorName}</div>
                    </div>
                  </div>
                  {sourceName ? (
                    <div className="surface-acrylic-dark hidden sm:flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white">
                      <ExternalLink className="size-3" />
                      {sourceName}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Title block */}
            <div className="space-y-5" data-detail-rise>
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill pill-soft">
                  <Tag className="size-3" />
                  {category}
                </span>
                {region ? (
                  <span className="pill">
                    <MapPin className="size-3" />
                    {region}
                  </span>
                ) : null}
                <span className="pill">
                  <Clock className="size-3" />
                  {calculatedReading} min
                </span>
              </div>
              <h1 className="font-heading text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] leading-[1.05] tracking-[-0.02em] text-foreground">
                {title}
              </h1>
              <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
                {excerpt}
              </p>
            </div>

            {/* Article body */}
            {paragraphs.length > 0 ? (
              <article
                data-detail-rise
                className="prose-tech relative space-y-5 text-[16.5px] leading-[1.8] text-foreground"
              >
                {paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? "first-letter:font-heading first-letter:text-6xl first-letter:font-medium first-letter:leading-none first-letter:mr-3 first-letter:float-left first-letter:text-[var(--dt-color-accent)]"
                        : ""
                    }
                  >
                    {p}
                  </p>
                ))}
              </article>
            ) : null}

            {(primaryAction || secondaryAction) && (
              <div className="flex flex-wrap gap-3 pt-4" data-detail-rise>
                {primaryAction ? (
                  <Link
                    href={primaryAction.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[13px] font-semibold text-background transition-all duration-300 hover:bg-[var(--dt-color-accent)]"
                  >
                    {primaryAction.label}
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ) : null}
                {secondaryAction ? (
                  <Link
                    href={secondaryAction.href}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/60 backdrop-blur-md px-5 py-3 text-[13px] font-semibold text-foreground transition-colors hover:border-foreground"
                  >
                    {secondaryAction.label}
                  </Link>
                ) : null}
              </div>
            )}
          </div>

          {/* RIGHT — sticky meta sidebar */}
          <aside className="relative" data-detail-rise>
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="rounded-[1.6rem] border border-foreground/8 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="pill pill-soft">
                    <Sparkles className="size-3" />
                    Detalhes
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Ficha
                  </span>
                </div>

                <dl className="mt-5 space-y-3">
                  {metaList.map(({ label, value, icon }) => {
                    const Icon = icon ? iconMap[icon] : Sparkles;
                    return (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4 border-b border-foreground/8 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          <Icon className="size-3.5" />
                          {label}
                        </div>
                        <div className="text-right text-sm font-medium text-foreground">
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </dl>

                {sourceUrl ? (
                  <Link
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-full bg-foreground px-4 py-2.5 text-[12px] font-semibold text-background transition-all duration-300 hover:bg-[var(--dt-color-accent)]"
                  >
                    {sourceName ? `Ver fonte: ${sourceName}` : "Ver fonte original"}
                    <ExternalLink className="size-3.5" />
                  </Link>
                ) : null}
              </div>

              <div className="relative overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-foreground p-6 text-background">
                <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[var(--dt-color-accent)]/30 blur-3xl" />
                <div className="relative space-y-3">
                  <span className="pill pill-glass text-foreground">
                    Newsletter
                  </span>
                  <h3 className="font-heading text-xl leading-tight">
                    Receba o melhor do Algarve por email
                  </h3>
                  <p className="text-xs text-white/70">
                    Edição editorial regional, sem spam. Pode anular a qualquer momento.
                  </p>
                  <Link
                    href="/comunidade"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-foreground transition-all duration-300 hover:bg-[var(--dt-color-accent)] hover:text-white"
                  >
                    Subscrever
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
