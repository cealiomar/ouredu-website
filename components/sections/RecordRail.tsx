"use client";

import { useRef } from "react";
import { FileText, UserRoundCheck, BookOpen, Bus, MessagesSquare, type LucideIcon } from "lucide-react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/components/motion/primitives";
import { useCopy } from "@/lib/copy";

/* keyed on a stable id rather than the visible label: matching on the English
   words meant the Arabic page looked every icon up and found nothing */
const ICONS: Record<string, LucideIcon> = {
  application: FileText,
  enrolment: UserRoundCheck,
  lessons: BookOpen,
  bus: Bus,
  updates: MessagesSquare,
};

export function RecordRail() {
  const { rail } = useCopy();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* The rail is rendered twice — a vertical timeline for phones and a
         horizontal one above md. Each branch must only ever touch its own copy;
         animating all ten cells made the line run ahead of stages that were in
         the hidden layout. */
      const q = (sel: string, within: string) =>
        gsap.utils.toArray<HTMLElement>(`${within} ${sel}`, root.current);

      const finish = () => {
        gsap.set(".rail-cell", { opacity: 1 });
        gsap.set(".rail-icon", { scale: 1, opacity: 1 });
        gsap.set(".rail-text", { y: 0, opacity: 1 });
        gsap.set(".rail-fill-h", { scaleX: 1 });
        gsap.set(".rail-fill-v", { scaleY: 1 });
      };

      const mm = gsap.matchMedia();

      /* Plays itself once the record is on screen, rather than being scrubbed.
         This is the second section on the page, so a scrub had almost no scroll
         distance in front of it: the range came out at -195 to 429, meaning it
         was already part-filled before the page could be scrolled at all, and
         the line only finished if you kept going. Playing it through needs no
         scroll distance and always completes. */
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const cells = q(".rail-cell", ".rail-desktop");
        gsap.set(cells, { opacity: 0.2 });
        gsap.set(q(".rail-icon", ".rail-desktop"), { scale: 0.4, opacity: 0 });
        gsap.set(q(".rail-text", ".rail-desktop"), { y: 10, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        const n = cells.length;
        gsap.set(".rail-fill-h", { scaleX: 0 });

        /* Retimed for playback rather than scrubbing: at the scrub's spacing
           the sequence ran for five seconds on its own, which is a long time to
           watch a line cross a screen. */
        cells.forEach((cell, i) => {
          const at = i * 0.4;
          /* the line stops exactly at the stage that is lighting up, rather than
             running ahead of it */
          tl.to(".rail-fill-h", { scaleX: (i + 1) / n, duration: 0.4, ease: "none" }, at)
            .to(cell, { opacity: 1, duration: 0.4, ease: EASE.out }, at);
          const icon = cell.querySelector(".rail-icon");
          if (icon) tl.to(icon, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(2.2)" }, at + 0.06);
          const text = cell.querySelectorAll(".rail-text");
          if (text.length)
            tl.to(text, { y: 0, opacity: 1, duration: 0.38, stagger: 0.05, ease: EASE.out }, at + 0.1);
        });

        return () => finish();
      });

      /* phones and reduced motion: the same sequence, just played as each item
         arrives — nothing is ever held */
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        if (prefersReducedMotion()) {
          finish();
          return;
        }
        const cells = q(".rail-cell", ".rail-mobile");
        gsap.set(cells, { opacity: 0.2 });
        gsap.set(q(".rail-icon", ".rail-mobile"), { scale: 0.4, opacity: 0 });
        gsap.set(q(".rail-text", ".rail-mobile"), { y: 10, opacity: 0 });

        gsap.to(".rail-fill-v", {
          scaleY: 1,
          duration: cells.length * 0.36,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });

        cells.forEach((cell) => {
          const tl = gsap
            .timeline({ scrollTrigger: { trigger: cell, start: "top 82%", once: true } })
            .to(cell, { opacity: 1, duration: 0.35, ease: EASE.out });
          const icon = cell.querySelector(".rail-icon");
          if (icon) tl.to(icon, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.2)" }, 0.05);
          const text = cell.querySelectorAll(".rail-text");
          if (text.length) tl.to(text, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: EASE.out }, 0.1);
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="rule-t rule-b bg-off" aria-labelledby="rail-label">
      <div className="shell section-y-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p id="rail-label" className="flex items-center gap-2.5">
            <span className="block size-1.5 rounded-full bg-blue" aria-hidden="true" />
            <span className="mono-label">{rail.label}</span>
          </p>
          <p className="mono-label hidden text-ink-25 sm:block">{rail.meta}</p>
        </div>

        {/* mobile: the journey reads better as a vertical timeline */}
        <ol className="rail-mobile relative mt-10 md:hidden">
          <span className="absolute inset-y-0 start-[21px] w-px bg-line" aria-hidden="true" />
          <span
            className="rail-fill-v absolute inset-y-0 start-[21px] w-px origin-top bg-blue"
            aria-hidden="true"
          />
          {rail.stages.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.name} className="rail-cell relative flex gap-5 pb-9 last:pb-0">
                <span
                  className="rail-icon relative z-10 flex size-11 shrink-0 items-center justify-center
                    rounded-xl border border-blue/25 bg-blue-bg text-blue-ink"
                  aria-hidden="true"
                >
                  <Icon size={19} strokeWidth={1.75} />
                </span>
                <div className="pt-1.5">
                  <span className="rail-text block font-mono text-[10.5px] tracking-[0.1em] text-blue-ink">{s.index}</span>
                  <p className="rail-text mt-1.5 text-[17px] font-semibold tracking-[-0.01em]">{s.name}</p>
                  <p className="rail-text mt-1 font-mono text-[11px] text-ink-45">{s.system}</p>
                  <p className="rail-text mt-0.5 font-mono text-[10.5px] text-ink-25">{s.when}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* desktop: horizontal rail across five columns */}
        <div className="rail-desktop relative mt-12 hidden md:block">
          <span className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
          <span
            className="rail-fill-h absolute inset-x-0 top-0 h-px origin-left bg-blue"
            aria-hidden="true"
          />
          <ol className="grid grid-cols-5">
            {rail.stages.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <li key={s.name} className="rail-cell pe-6 pt-7">
                  <span
                    className="rail-icon mb-5 flex size-11 items-center justify-center rounded-xl
                      border border-blue/25 bg-blue-bg text-blue-ink"
                    aria-hidden="true"
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="rail-text block font-mono text-[10.5px] tracking-[0.1em] text-blue-ink">{s.index}</span>
                  <p className="mt-3 text-[clamp(15px,1.3vw,17px)] font-semibold tracking-[-0.01em]">
                    {s.name}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-ink-45">{s.system}</p>
                  <p className="mt-1 font-mono text-[10.5px] text-ink-25">{s.when}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
