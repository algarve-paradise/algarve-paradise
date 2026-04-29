"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const REVEAL_QUERY =
  "[data-reveal], [data-reveal-children], [data-reveal-clip], [data-reveal-line], [data-reveal-scale], [data-reveal-grid]";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Setup Lenis smooth scroll
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Set up scroll reveal animations on initial load + when DOM mutates
    const ctx = gsap.context(() => {
      const setupReveals = () => {
        // Simple fade-up reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (el.dataset.revealed === "true") return;
          el.dataset.revealed = "true";
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // Stagger children reveal
        gsap.utils.toArray<HTMLElement>("[data-reveal-children]").forEach((el) => {
          if (el.dataset.revealed === "true") return;
          el.dataset.revealed = "true";
          const children = el.querySelectorAll<HTMLElement>("[data-reveal-child]");
          if (!children.length) return;
          gsap.fromTo(
            children,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // Clip reveal (element appears as if being constructed from bottom)
        gsap.utils.toArray<HTMLElement>("[data-reveal-clip]").forEach((el) => {
          if (el.dataset.revealed === "true") return;
          el.dataset.revealed = "true";
          gsap.fromTo(
            el,
            {
              clipPath: "inset(0 0 100% 0)",
              y: 24,
              opacity: 0.3,
            },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // Line draw (horizontal scaleX)
        gsap.utils.toArray<HTMLElement>("[data-reveal-line]").forEach((el) => {
          if (el.dataset.revealed === "true") return;
          el.dataset.revealed = "true";
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // Scale-in (image / banner)
        gsap.utils.toArray<HTMLElement>("[data-reveal-scale]").forEach((el) => {
          if (el.dataset.revealed === "true") return;
          el.dataset.revealed = "true";
          gsap.fromTo(
            el,
            { scale: 0.94, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // Grid sweep — children appear with diagonal stagger
        gsap.utils.toArray<HTMLElement>("[data-reveal-grid]").forEach((el) => {
          if (el.dataset.revealed === "true") return;
          el.dataset.revealed = "true";
          const children = Array.from(el.children) as HTMLElement[];
          if (!children.length) return;
          gsap.fromTo(
            children,
            { y: 40, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.95,
              ease: "power3.out",
              stagger: { each: 0.09, from: "start" },
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      };

      setupReveals();

      // re-scan if route changes inject new content
      const observer = new MutationObserver(() => {
        setupReveals();
        ScrollTrigger.refresh();
      });
      const main = document.querySelector("main");
      if (main) {
        observer.observe(main, { childList: true, subtree: true });
      }

      // Refresh after fonts/images load
      window.addEventListener("load", () => ScrollTrigger.refresh());

      return () => observer.disconnect();
    });

    if (prefersReducedMotion) {
      // Reveal everything immediately if user prefers reduced motion
      document.querySelectorAll<HTMLElement>(REVEAL_QUERY).forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.clipPath = "none";
      });
    }

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
