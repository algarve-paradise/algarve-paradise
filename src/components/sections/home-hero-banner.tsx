"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles, TrendingUp } from "lucide-react";
import gsap from "gsap";

import type { NewsItem, Stat } from "@/types/content";

type HomeHeroBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlight?: string;
  stats: Stat[];
  featured: NewsItem | null;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export function HomeHeroBanner({
  eyebrow,
  title,
  description,
  highlight,
  stats,
  featured,
  primaryCta,
  secondaryCta,
}: HomeHeroBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-rise]", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll("[data-hero-word]");
        gsap.from(words, {
          yPercent: 110,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.05,
        });
      }

      gsap.from("[data-hero-image]", {
        scale: 1.08,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
      });

      gsap.from("[data-hero-stat]", {
        y: 12,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.6,
      });

      gsap.to("[data-hero-orb]", {
        y: 14,
        x: -8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  const titleWords = title.split(" ");

  return (
    <div
      ref={bannerRef}
      className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
    >
      {/* LEFT — Editorial / CTA */}
      <div className="relative flex flex-col justify-between rounded-[2rem] sm:rounded-[2.5rem] bg-white p-6 sm:p-10 lg:p-12 overflow-hidden glow-ring/0 hover:glow-ring transition-shadow duration-700">
        {/* subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[var(--dt-color-accent-soft)] blur-3xl pointer-events-none" data-hero-orb />
        <div className="absolute -left-20 bottom-0 size-60 rounded-full bg-[var(--dt-color-mint)] opacity-60 blur-3xl pointer-events-none" data-hero-orb />

        <div className="relative space-y-7">
          <div className="flex flex-wrap items-center gap-2" data-hero-rise>
            <span className="pill pill-soft">
              <Sparkles className="size-3" />
              {eyebrow}
            </span>
            <span className="pill">
              <TrendingUp className="size-3" />
              Edição de hoje
            </span>
          </div>

          <h1
            ref={titleRef}
            className="font-heading text-[2.4rem] sm:text-5xl lg:text-[3.6rem] leading-[1.02] tracking-[-0.02em] text-foreground"
          >
            {titleWords.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                <span data-hero-word className="inline-block">
                  {word.replace(/[^a-zA-ZÀ-ÿ]/g, "") === "Algarve" ? (
                    <em className="not-italic text-[var(--dt-color-accent)]">{word}</em>
                  ) : (
                    word
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground" data-hero-rise>
            {description}
          </p>

          {highlight ? (
            <div
              className="relative max-w-md rounded-3xl border border-foreground/10 bg-foreground/5 p-5"
              data-hero-rise
            >
              <span className="absolute -left-2 -top-2 inline-flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs">
                ❝
              </span>
              <p className="font-heading text-[15px] italic leading-snug text-foreground">
                {highlight}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3" data-hero-rise>
            <Link
              href={primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[13px] font-semibold text-background transition-all duration-300 hover:bg-[var(--dt-color-accent)] hover:shadow-[0_18px_40px_-14px_rgba(255,91,46,0.65)]"
            >
              {primaryCta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/60 backdrop-blur-md px-5 py-3 text-[13px] font-semibold text-foreground transition-all duration-300 hover:border-foreground"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="relative mt-10 grid gap-3 sm:grid-cols-3 pt-8 border-t border-foreground/8">
          {stats.slice(0, 3).map((stat) => (
            <div
              key={stat.label}
              data-hero-stat
              className="space-y-1"
            >
              <div className="font-heading text-2xl text-foreground">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Featured banner */}
      <FeaturedBanner featured={featured} />
    </div>
  );
}

function FeaturedBanner({ featured }: { featured: NewsItem | null }) {
  if (!featured) {
    return (
      <div
        data-hero-rise
        className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A0A0A] text-white p-8 lg:p-12 min-h-[420px] overflow-hidden flex flex-col justify-end"
      >
        <div className="absolute inset-0 bg-grid-dark opacity-50" />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[var(--dt-color-accent)]/30 blur-3xl" />
        <div className="relative space-y-3">
          <span className="pill pill-soft">Algarve</span>
          <h2 className="font-heading text-4xl tracking-tight">O portal digital do sul do País</h2>
          <p className="text-white/70 max-w-md">
            Informação, eventos e comunidade reunidos numa só plataforma regional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={featured.href}
      data-hero-image
      className="group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A0A0A] text-white min-h-[420px] lg:min-h-[560px] flex flex-col justify-end p-7 sm:p-10"
    >
      {featured.imageUrl ? (
        <Image
          src={featured.imageUrl}
          alt={featured.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="absolute inset-0 h-full w-full object-cover scale-100 transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
      ) : null}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-dark opacity-30 mix-blend-overlay" />

      {/* Floating live badge */}
      <div className="absolute left-5 top-5 z-10">
        <span className="surface-acrylic-dark inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
          <span className="relative inline-flex size-1.5 rounded-full bg-[var(--dt-color-accent)]">
            <span className="absolute inset-0 rounded-full bg-[var(--dt-color-accent)] animate-pulse-dot" />
          </span>
          Em destaque
        </span>
      </div>

      {/* Floating play button */}
      <div className="absolute right-5 top-5 z-10">
        <span className="surface-acrylic-dark flex size-12 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          <Play className="size-5 fill-current" />
        </span>
      </div>

      {/* Decorative chip */}
      <div className="absolute bottom-5 right-5 z-10 hidden sm:block">
        <div className="surface-acrylic-dark rounded-2xl px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/80">
          {new Date(featured.date).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
          })}
        </div>
      </div>

      <div className="relative z-10 max-w-xl space-y-4">
        <span className="pill pill-glass text-foreground">{featured.category}</span>
        <h2 className="font-heading text-3xl sm:text-[2.4rem] lg:text-[2.8rem] leading-[1.05] tracking-tight">
          {featured.title}
        </h2>
        <p className="text-white/75 text-sm leading-relaxed line-clamp-2 max-w-md">
          {featured.excerpt}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/40" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">
              {featured.authorName ?? "Redação"}
            </span>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-foreground transition-transform duration-300 group-hover:translate-x-1">
            Ler mais
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
