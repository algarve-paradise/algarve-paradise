"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, {
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | undefined;
    let observer: MutationObserver | undefined;
    let isCancelled = false;
    let revealTimer: number | undefined;
    let revealFrame: number | undefined;
    let revealFrameAfterPaint: number | undefined;

    // Setup Lenis smooth scroll
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshScrollTrigger = () => ScrollTrigger.refresh();

    const setupRevealAnimations = () => {
      if (isCancelled) return;

      ctx = gsap.context(() => {
        // WeakSet avoids mutating the DOM with data-revealed attributes,
        // which would cause React hydration mismatches.
        const animated = new WeakSet<HTMLElement>();

        const setupReveals = () => {
          // Simple fade-up reveals
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
            if (animated.has(el)) return;
            animated.add(el);
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
            if (animated.has(el)) return;
            animated.add(el);
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
            if (animated.has(el)) return;
            animated.add(el);
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
            if (animated.has(el)) return;
            animated.add(el);
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
            if (animated.has(el)) return;
            animated.add(el);
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

          // Grid sweep - children appear with diagonal stagger
          gsap.utils.toArray<HTMLElement>("[data-reveal-grid]").forEach((el) => {
            if (animated.has(el)) return;
            animated.add(el);
            const children = Array.from(el.children).filter(
              (c) => !c.classList.contains("tech-card"),
            ) as HTMLElement[];
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
        observer = new MutationObserver(() => {
          setupReveals();
          ScrollTrigger.refresh();
        });
        const main = document.querySelector("main");
        if (main) {
          observer.observe(main, { childList: true, subtree: true });
        }

      });
    };

    let idleHandle: number | undefined;

    const queueRevealAnimations = () => {
      // requestIdleCallback fires when the browser is truly idle — after React
      // has finished hydrating all components and the main thread is free.
      // This prevents GSAP from setting inline styles during React's hydration
      // comparison, which would cause a hydration mismatch error.
      if (typeof requestIdleCallback !== "undefined") {
        idleHandle = window.requestIdleCallback(
          () => { if (!isCancelled) setupRevealAnimations(); },
          { timeout: 2000 },
        );
      } else {
        revealFrame = window.requestAnimationFrame(() => {
          revealFrameAfterPaint = window.requestAnimationFrame(() => {
            revealTimer = window.setTimeout(() => {
              if (!isCancelled) setupRevealAnimations();
            }, 300);
          });
        });
      }
    };

    if (!prefersReducedMotion) {
      if (document.readyState === "complete") {
        queueRevealAnimations();
      } else {
        window.addEventListener("load", queueRevealAnimations, { once: true });
      }
    }

    // Refresh after fonts/images load
    window.addEventListener("load", refreshScrollTrigger);

    return () => {
      isCancelled = true;
      if (idleHandle !== undefined && typeof cancelIdleCallback !== "undefined") {
        window.cancelIdleCallback(idleHandle);
      }
      if (revealTimer) {
        window.clearTimeout(revealTimer);
      }
      if (revealFrame) {
        window.cancelAnimationFrame(revealFrame);
      }
      if (revealFrameAfterPaint) {
        window.cancelAnimationFrame(revealFrameAfterPaint);
      }
      window.removeEventListener("load", queueRevealAnimations);
      window.removeEventListener("load", refreshScrollTrigger);
      observer?.disconnect();
      gsap.ticker.remove(raf);
      lenisRef.current = null;
      lenis.destroy();
      ctx?.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
