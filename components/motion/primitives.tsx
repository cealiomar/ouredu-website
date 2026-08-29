"use client";

import { useRef, useEffect, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
  (window as unknown as Record<string, unknown>).__gsap = gsap;
}

/* Every animation is registered through matchMedia so `prefers-reduced-motion`
   gets the finished state immediately and mobile can opt out of pinning. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

/* Plain media checks rather than gsap.matchMedia: under React StrictMode the
   effect runs twice and a matchMedia context reverted on the first pass takes
   its ScrollTriggers with it, leaving dead pin-spacers behind. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
export const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

/* The preloader resolves this; above-the-fold animations wait on it so the
   hero does not play behind the loading panel. */
let resolveReady: (() => void) | null = null;
export const pageReady: Promise<void> = new Promise((res) => {
  resolveReady = res;
});
export function markPageReady() {
  resolveReady?.();
  resolveReady = null;
}

/* One eased scroll, without pulling ScrollToPlugin in for a single call. */
export function scrollToY(y: number, duration = 0.6) {
  const proxy = { y: window.scrollY };
  gsap.to(proxy, {
    y,
    duration,
    ease: "power2.inOut",
    overwrite: true,
    onUpdate: () => window.scrollTo(0, proxy.y),
  });
}

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  soft: "power1.out",
} as const;

/* Web fonts change line heights, which moves every ScrollTrigger start point.
   Recalculate once they land. */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    let cancelled = false;
    const refresh = () => !cancelled && ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    const t = window.setTimeout(refresh, 600);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);
}

type Common = {
  className?: string;
  delay?: number;
  /* above the fold: run on mount instead of waiting for a scroll position */
  immediate?: boolean;
};

/* ------------------------------------------------------------------
   Lines — a heading that reveals one line at a time from behind a mask.
   Lines are authored explicitly rather than split at runtime, so there is
   no layout shift and the text stays intact for screen readers.
   ------------------------------------------------------------------ */
export function Lines({
  as: Tag = "h2",
  lines,
  className = "",
  delay = 0,
  stagger = 0.07,
  immediate = false,
  id,
}: Common & { as?: ElementType; lines: ReactNode[]; stagger?: number; id?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(".line-mask > span", root.current);
      if (prefersReducedMotion()) return;

      const tween = gsap.from(targets, {
          yPercent: 115,
          duration: 0.75,
          delay,
          stagger,
          ease: EASE.out,
        paused: immediate,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: root.current, start: "top 88%", once: true } }),
      });
      if (immediate) pageReady.then(() => tween.play());
    },
    { scope: root, dependencies: [] },
  );

  return (
    <Tag ref={root} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   FadeUp — the default entrance for everything that is not a heading.
   ------------------------------------------------------------------ */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 14,
  stagger,
  immediate = false,
}: Common & { children: ReactNode; y?: number; stagger?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const targets = stagger
        ? gsap.utils.toArray<HTMLElement>(Array.from(root.current!.children))
        : [root.current!];

      const tween = gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 0.6,
          delay,
          stagger,
          ease: EASE.out,
        paused: immediate,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: root.current, start: "top 92%", once: true } }),
      });
      if (immediate) pageReady.then(() => tween.play());
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   Counter — counts up once in view. The final value is already in the DOM,
   so it is correct before JS runs and under reduced motion.
   ------------------------------------------------------------------ */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    prefix +
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const state = { n: 0 };
        gsap.to(state, {
          n: value,
          duration: 1.2,
          ease: EASE.soft,
          /* without this the tween renders its 0 state on creation and the
             number sits at zero until the trigger fires */
          immediateRender: false,
          onStart: () => gsap.set(state, { n: 0 }),
          onUpdate: () => {
            if (el.current) el.current.textContent = format(state.n);
          },
        scrollTrigger: { trigger: el.current, start: "top 92%", once: true },
      });
    },
    { scope: el, dependencies: [] },
  );

  return (
    <span ref={el} className={`tabular ${className}`}>
      {format(value)}
    </span>
  );
}

export { gsap, ScrollTrigger, useGSAP };
