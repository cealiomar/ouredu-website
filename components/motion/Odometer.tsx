"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/motion/primitives";

/* Each digit is a column of numerals that rolls into place, like a mechanical
   counter. Two full cycles run before it lands, so the movement reads as a roll.

   The column is rendered *already at its final offset* via CSS and GSAP only
   animates back from zero. The correct number is therefore on screen before any
   JavaScript runs, and under reduced motion there is nothing to undo. */

const CYCLES = 2;
const ROW = "1.12em"; // taller than the glyph box, so nothing is clipped
const ROWS = CYCLES * 10 + 10;

function Digit({ value, index }: { value: number; index: number }) {
  const col = useRef<HTMLSpanElement>(null);
  const steps = CYCLES * 10 + value;
  /* Expressed as a percentage of the column, not calc() in em: GSAP cannot
     parse a calc() transform, and trying to animate from one crashed the page. */
  const rest = -(steps / ROWS) * 100;

  useGSAP(
    () => {
      if (prefersReducedMotion() || !col.current) return;
      /* GSAP reads the inline transform back as a pixel offset, so animating
         yPercent on top of it doubled the travel and rolled the column clean
         past its last row (the numbers vanished). Zero `y` and own the
         position entirely from here. */
      /* The row height is in `em`, so it changes the moment the webfont swaps
         in. Re-seating the column on every such change keeps the digit exactly
         in the window instead of a fraction of a row short. */
      const place = () => gsap.set(col.current, { y: 0, yPercent: rest });
      place();
      document.fonts?.ready.then(place);

      gsap.from(col.current, {
        yPercent: 0,
        duration: 1.5,
        delay: index * 0.07,
        ease: "power4.out",
        /* hold the real number until the roll actually starts */
        immediateRender: false,
        onComplete: place,
        scrollTrigger: { trigger: col.current, start: "top 92%", once: true },
      });

      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    },
    { scope: col, dependencies: [] },
  );

  const items = Array.from({ length: ROWS }, (_, i) => i % 10);

  return (
    <span
      className="relative inline-block overflow-hidden align-top"
      style={{ height: ROW }}
      aria-hidden="true"
    >
      <span
        ref={col}
        className="flex flex-col will-change-transform"
        style={{ transform: `translateY(${rest}%)` }}
      >
        {items.map((n, i) => (
          <span key={i} className="flex items-center justify-center leading-none" style={{ height: ROW }}>
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({ value, className = "" }: { value: string; className?: string }) {
  let digitIndex = -1;

  return (
    <span className={`tabular inline-flex items-start ${className}`}>
      {/* screen readers get the plain number, not the rolling columns */}
      <span className="sr-only">{value}</span>
      {value.split("").map((ch, i) => {
        if (/\d/.test(ch)) {
          digitIndex += 1;
          return <Digit key={i} value={Number(ch)} index={digitIndex} />;
        }
        return (
          <span
            key={i}
            aria-hidden="true"
            /* separators share the digit row so the baseline stays level */
            className="inline-flex items-center justify-center leading-none"
            style={{ height: ROW }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
