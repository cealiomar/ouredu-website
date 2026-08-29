"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, markPageReady, EASE } from "@/components/motion/primitives";
import { Mark } from "@/components/brand/Mark";
import { useCopy } from "@/lib/copy";

/* First-load experience, in four beats.

   The mark is drawn blade by blade rather than faded in, the finished logo is
   given a beat to simply sit there — a logo that arrives and leaves in the same
   breath never registers — and only then does the panel hand over to the site
   with a wipe. Shown once per session; skipped entirely for reduced motion. */
export function Preloader() {
  const { preloader } = useCopy();
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const seen = sessionStorage.getItem("ouredu:loaded") === "1";

      if (reduce || seen) {
        setDone(true);
        markPageReady();
        return;
      }

      document.documentElement.style.overflow = "hidden";

      const petals = gsap.utils.toArray<SVGPathElement>(".mark-petal", root.current);
      const dots = gsap.utils.toArray<SVGCircleElement>(".mark-dot", root.current);
      const counter = { n: 0 };
      const ORIGIN = "210.65 35";

      /* Two separate moments. The site is released as the curtain starts to
         lift, so the hero is already playing when it becomes visible — waiting
         for the panel to finish left a beat of dead page. Unmounting happens
         afterwards, once the panel is actually gone. */
      const release = () => {
        document.documentElement.style.overflow = "";
        markPageReady();
      };
      const finish = () => {
        sessionStorage.setItem("ouredu:loaded", "1");
        setDone(true);
      };

      const tl = gsap.timeline({ onComplete: finish });

      /* same dev-only hook the motion primitives expose: the load sequence is
         over before a remote inspector can attach, so let it be scrubbed */
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as Record<string, unknown>).__preTl = tl;
      }

      /* Written on an absolute clock rather than relative offsets. Chained
         "-=" positions kept compounding into stretches where nothing on screen
         moved; here every beat has a stated time, so the sequence can be read
         and tuned like a storyboard. */
      tl.set(petals, { svgOrigin: ORIGIN, scale: 0, rotate: -75, opacity: 0 })
        .set(dots, { svgOrigin: ORIGIN, scale: 0, opacity: 0 })
        .set(".pre-word", { autoAlpha: 0, y: 14 })
        .set(".pre-tag", { autoAlpha: 0, y: 10 })
        .set(".pre-meta", { autoAlpha: 0 })

        /* ---- 0.2s · the mark assembles, one blade at a time ---- */
        .to(petals, { scale: 1, rotate: 0, opacity: 1, duration: 1.0,
          stagger: 0.1, ease: "back.out(1.4)" }, 0.2)
        .to(dots, { scale: 1, opacity: 1, duration: 0.55,
          stagger: 0.08, ease: "back.out(1.8)" }, 1.25)

        /* ---- 1.5s · it turns once and takes a breath ---- */
        .to(".mark-spin", { rotate: 360, svgOrigin: ORIGIN, duration: 1.4, ease: "power1.inOut" }, 1.5)
        .to(".pre-mark", { scale: 1.03, duration: 0.7, ease: "sine.inOut" }, 1.5)
        .to(".pre-mark", { scale: 1, duration: 0.7, ease: "sine.inOut" }, 2.2)

        /* ---- 1.75s · the lockup completes under it ---- */
        .to(".pre-word", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.75)
        .to(".pre-rule", { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 2.3)
        .to(".pre-tag", { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 2.55)
        .to(".pre-meta", { autoAlpha: 1, duration: 0.4 }, 2.85)

        /* ---- 3.0s · the number runs ---- */
        .to(counter, { n: 100, duration: 1.3, ease: "power1.inOut",
          onUpdate: () => {
            if (pct.current) pct.current.textContent = String(Math.round(counter.n)).padStart(3, "0");
          } }, 3.0)
        .to(".pre-bar-fill", { scaleX: 1, duration: 1.3, ease: "power1.inOut" }, 3.0)

        /* ---- 4.3s · the finished logo simply sits there ---- */

        /* ---- 4.95s · everything leaves, the mark last ---- */
        .to(".pre-meta", { autoAlpha: 0, y: -12, duration: 0.4, ease: "power2.out" }, 4.95)
        .to(".pre-rule", { scaleX: 0, duration: 0.38, ease: "power2.in" }, 5.05)
        .to(".pre-tag", { autoAlpha: 0, y: -10, duration: 0.38, ease: "power2.out" }, 5.05)
        .to(".pre-word", { autoAlpha: 0, y: -12, duration: 0.42, ease: "power2.out" }, 5.15)
        .to(".pre-mark", { y: -30, scale: 0.36, autoAlpha: 0, duration: 0.8, ease: "power3.inOut" }, 5.3)

        /* ---- 5.55s · a curtain, not a fade. The page is already whole behind it,
               and the site is released while the wipe is still moving. ---- */
        .fromTo(root.current,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" }, 5.55)
        .add(release, 5.75);

      /* An intro nobody can leave is a toll gate. A click, a key or a scroll
         attempt runs the remaining beats out fast rather than cutting hard, so
         the hand-over still reads as a hand-over. */
      const skip = () => {
        if (tl.progress() > 0.92) return;
        gsap.to(tl, { timeScale: 6, duration: 0.4, ease: "power2.in", overwrite: true });
      };
      window.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", skip);
      window.addEventListener("wheel", skip, { passive: true });

      return () => {
        document.documentElement.style.overflow = "";
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("wheel", skip);
      };
    },
    { scope: root, dependencies: [] },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-paper"
      aria-hidden="true"
    >
      <div className="pre-mark">
        <Mark size={112} />
      </div>

      <p className="pre-word mt-8 font-display text-[clamp(20px,2.4vw,27px)] font-extrabold tracking-[-0.03em]">
        {preloader.wordmark}
      </p>

      <span className="pre-rule mt-6 block h-px w-[64px] origin-center scale-x-0 bg-blue" aria-hidden="true" />

      <p className="pre-tag mono-label mt-6 text-ink-45">{preloader.tagline}</p>

      <div className="pre-meta mt-12 flex w-[220px] flex-col items-center gap-4">
        <div className="h-px w-full overflow-hidden bg-line">
          <div className="pre-bar-fill h-full w-full origin-left scale-x-0 bg-blue" />
        </div>
        <span className="mono-label tabular ltr-run text-ink-45">
          <span ref={pct}>000</span> %
        </span>
      </div>
    </div>
  );
}
