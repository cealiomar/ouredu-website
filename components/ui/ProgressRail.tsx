"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/components/motion/primitives";

export type RailItem = {
  key: string;
  eyebrow: string; // 01 / 07:05 / 04 Jan
  title: string;
  sub?: string;
  meta?: string;
  icon?: ReactNode;
};

/* One progress pattern used everywhere a sequence appears — the record rail,
   the bus route sheet, the admissions stages. Horizontal on wide screens,
   vertical on narrow ones, filled by scroll, and selectable with mouse or
   keyboard so it is a real control rather than a picture of one. */
export function ProgressRail({
  items,
  done,
  size = "md",
  selectable = false,
  onSelect,
}: {
  items: RailItem[];
  /** how many leading items count as complete */
  done: number;
  size?: "sm" | "md";
  selectable?: boolean;
  onSelect?: (index: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(done - 1);

  useGSAP(
    () => {
      const cells = gsap.utils.toArray<HTMLElement>(".pr-cell", root.current);
      const pct = (done / items.length) * 100;

      if (prefersReducedMotion()) {
        gsap.set(cells, { opacity: 1 });
        gsap.set(".pr-icon", { scale: 1, opacity: 1 });
        gsap.set(".pr-fill-h", { width: `${pct}%` });
        gsap.set(".pr-fill-v", { height: `${pct}%` });
        return;
      }

      gsap.set(cells, { opacity: 0.26 });
      gsap.set(".pr-icon", { scale: 0.5, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 82%", end: "bottom 62%", scrub: 0.8 },
      });

      tl.fromTo(".pr-fill-h", { width: "0%" }, { width: `${pct}%`, ease: "none", duration: items.length }, 0)
        .fromTo(".pr-fill-v", { height: "0%" }, { height: `${pct}%`, ease: "none", duration: items.length }, 0);

      cells.forEach((cell, i) => {
        const at = i * 0.9;
        tl.to(cell, { opacity: 1, duration: 0.4, ease: EASE.out }, at);
        const icon = cell.querySelector(".pr-icon");
        if (icon) tl.to(icon, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, at + 0.04);
      });
    },
    { scope: root, dependencies: [done, items.length] },
  );

  const choose = (i: number) => {
    if (!selectable) return;
    setActive(i);
    onSelect?.(i);
  };

  const Cell = ({ item, i, vertical }: { item: RailItem; i: number; vertical: boolean }) => {
    const isDone = i < done;
    const isActive = selectable && i === active;
    const Tag = (selectable ? "button" : "div") as "button" | "div";

    return (
      <Tag
        {...(selectable
          ? {
              type: "button" as const,
              onClick: () => choose(i),
              "aria-pressed": isActive,
              "data-cursor": "view",
            }
          : {})}
        className={`pr-cell block w-full text-start transition-colors ${
          vertical ? "flex gap-4 pb-5 sm:pb-7" : `pe-5 pt-5 ${size === "sm" ? "pt-4" : ""}`
        } ${selectable ? "rounded-lg focus-visible:outline-2 focus-visible:outline-blue" : ""}`}
      >
        {item.icon && (
          <span
            className={`pr-icon flex items-center justify-center rounded-xl border transition-colors ${
              size === "sm" ? "size-8 sm:size-9" : "size-9 sm:size-11"
            } ${vertical ? "relative z-10 shrink-0" : "mb-4"} ${
              isActive || isDone ? "border-blue/25 bg-blue-bg text-blue-ink" : "border-line bg-off text-ink-25"
            }`}
            aria-hidden="true"
          >
            {item.icon}
          </span>
        )}
        <span className={vertical ? "block pt-1" : "block"}>
          <span
            className={`block font-mono tracking-[0.1em] ${size === "sm" ? "text-[11.5px] sm:text-[9.5px]" : "text-[12.5px] sm:text-[10.5px]"} ${
              isDone ? "text-blue-ink" : "text-ink-25"
            }`}
          >
            {item.eyebrow}
          </span>
          <span
            className={`mt-1.5 block font-semibold tracking-[-0.01em] ${
              size === "sm" ? "text-[13px]" : "text-[clamp(15px,1.3vw,17px)]"
            } ${isActive ? "text-blue-ink" : isDone ? "text-ink" : "text-ink-45"}`}
          >
            {item.title}
          </span>
          {item.sub && <span className="mt-1.5 block font-mono text-[13px] sm:text-[11px] text-ink-45">{item.sub}</span>}
          {item.meta && <span className="mt-1 block font-mono text-[12.5px] sm:text-[10.5px] text-ink-25">{item.meta}</span>}
        </span>
      </Tag>
    );
  };

  return (
    <div ref={root}>
      {/* narrow: vertical timeline */}
      <ol className="relative md:hidden">
        <span className="absolute inset-y-0 start-[17px] sm:start-[21px] w-px bg-line" aria-hidden="true" />
        <span className="pr-fill-v absolute top-0 start-[17px] sm:start-[21px] w-px bg-blue" aria-hidden="true" />
        {items.map((it, i) => (
          <li key={it.key}>
            <Cell item={it} i={i} vertical />
          </li>
        ))}
      </ol>

      {/* wide: horizontal rail */}
      <div className="relative hidden md:block">
        <span className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
        <span className="pr-fill-h absolute top-0 start-0 h-px bg-blue" aria-hidden="true" />
        <ol
          className="grid"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((it, i) => (
            <li key={it.key} className={i < done ? "border-t border-transparent" : ""}>
              <Cell item={it} i={i} vertical={false} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
