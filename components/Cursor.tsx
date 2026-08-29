"use client";

import { useRef } from "react";
import { useCopy } from "@/lib/copy";
import { gsap, useGSAP } from "@/components/motion/primitives";

/* A two-part pointer: a small solid dot that tracks exactly, and a ring that
   trails behind and swells over anything interactive. Pointer devices only —
   touch and reduced-motion users keep the native cursor. */
export function Cursor() {
  const { cursor: words } = useCopy();
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-custom-cursor");
    const d = dot.current!;
    const r = ring.current!;
    const c = chip.current!;
    gsap.set(wrap.current, { display: "block" });
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(c, { autoAlpha: 0, scale: 0.9, transformOrigin: "0% 0%" });

    const dx = gsap.quickTo(d, "x", { duration: 0.1, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.1, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power2.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power2.out" });
    /* the word rides its own, slightly lazier spring so it settles after the
       ring rather than moving as one rigid object */
    const cx = gsap.quickTo(c, "x", { duration: 0.55, ease: "power2.out" });
    const cy = gsap.quickTo(c, "y", { duration: 0.55, ease: "power2.out" });

    /* No "is it visible?" bookkeeping — a stale flag was the reason the cursor
       could vanish and never come back. Movement always makes it visible. */
    const show = () => gsap.to([d, r], { autoAlpha: 1, duration: 0.18, overwrite: "auto" });
    const hide = () => gsap.to([d, r, c], { autoAlpha: 0, duration: 0.16, overwrite: "auto" });

    const move = (e: PointerEvent) => {
      if (gsap.getProperty(d, "autoAlpha") !== 1) show();
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      cx(e.clientX + 20);
      cy(e.clientY + 18);
    };

    const INTERACTIVE = 'a, button, input, textarea, select, summary, [role="button"], [role="slider"], [role="tab"], [data-cursor]';

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (!t) return;
      const key = t.getAttribute("data-cursor") ?? "";
      /* the word inside the ring is read like any other label, so it is
         translated rather than left in English on the Arabic page */
      const text = key ? (words[key] ?? key) : "";
      if (label.current) label.current.textContent = text;
      /* Deliberately translucent and small. A 76px opaque disc sat on top of
         whatever it was labelling — over the nav it covered the links outright.
         The ring tints, it never blocks. */
      gsap.to(r, {
        width: 44,
        height: 44,
        borderColor: "rgba(0,172,237,0.9)",
        backgroundColor: "rgba(0,172,237,0.10)",
        duration: 0.34,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(d, { scale: 0, duration: 0.26, ease: "power2.out", overwrite: "auto" });
      gsap.to(c, {
        autoAlpha: text ? 1 : 0,
        scale: text ? 1 : 0.9,
        duration: 0.26,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const out = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(INTERACTIVE);
      if (!t) return;
      /* ignore moves between children of the same interactive element */
      const to = (e as PointerEvent & { relatedTarget: HTMLElement | null }).relatedTarget;
      if (to && t.contains(to)) return;
      gsap.to(r, {
        width: 30,
        height: 30,
        borderColor: "rgba(10,10,10,0.28)",
        backgroundColor: "rgba(0,0,0,0)",
        duration: 0.36,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(d, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      gsap.to(c, { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    };

    const down = () => gsap.to(r, { scale: 0.86, duration: 0.16, ease: "power2.out" });
    const up = () => gsap.to(r, { scale: 1, duration: 0.3, ease: "power2.out" });

    /* Only hide when the pointer really leaves the window. Listening for
       pointerleave on `document` fires for every child element, which is what
       made the cursor blink out in the middle of the page. */
    const onDocLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) hide();
    };
    /* Safety net: if anything ever leaves it hidden while the pointer is still
       over the page, the next frame with movement brings it back. */
    const onEnter = () => show();

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, true);
    document.addEventListener("pointerout", out, true);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", onDocLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", onEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over, true);
      document.removeEventListener("pointerout", out, true);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", onEnter);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300] hidden">
      <div
        ref={ring}
        className="fixed left-0 top-0 size-[30px] rounded-full border border-[rgba(10,10,10,0.28)]
          will-change-transform"
      />
      <div
        ref={chip}
        className="fixed left-0 top-0 rounded-full bg-ink px-2.5 py-1 will-change-transform"
      >
        <span
          ref={label}
          className="block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-paper"
        />
      </div>
      <div ref={dot} className="fixed left-0 top-0 size-[5px] rounded-full bg-ink will-change-transform" />
    </div>
  );
}
