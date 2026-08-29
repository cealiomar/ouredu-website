"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion, Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker } from "@/components/ui";
import { useCopy } from "@/lib/copy";

/* Line drawings, not icons. Each one is a small schematic of the claim it sits
   above — a permissions grid, a hosting boundary, a backup timeline — drawn in
   the same hairline language as the rest of the page and traced in on scroll. */

const W = 340;
const H = 148;
const LINE = "#C9CED3";
const INK = "#0A0A0A";
const BLUE = "#00ACED";

function Wire({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-hidden="true">
        {children}
      </svg>
    </div>
  );
}

/* 01 — who can see what: four roles, four kinds of data, most cells closed */
function PermissionsWire() {
  const rows = [
    { label: 62, cells: [1, 1, 1, 1] },
    { label: 48, cells: [1, 1, 0, 0] },
    { label: 54, cells: [1, 0, 0, 0] },
    { label: 44, cells: [1, 0, 0, 0] },
  ];
  return (
    <Wire>
      {rows.map((r, i) => {
        const y = 26 + i * 28;
        return (
          <g key={i}>
            <rect x={16} y={y + 4} width={r.label} height={7} rx={3.5} fill={LINE} />
            {r.cells.map((on, c) => {
              const x = 104 + c * 58;
              return on ? (
                <rect key={c} x={x} y={y} width={44} height={15} rx={3} fill={BLUE} />
              ) : (
                <rect
                  key={c}
                  x={x}
                  y={y}
                  width={44}
                  height={15}
                  rx={3}
                  fill="none"
                  stroke={LINE}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              );
            })}
          </g>
        );
      })}
      <line x1={94} y1={14} x2={94} y2={134} stroke={LINE} strokeWidth={1} />
    </Wire>
  );
}

/* 02 — a boundary the data does not leave */
function ResidencyWire() {
  return (
    <Wire>
      <rect
        x={92}
        y={20}
        width={232}
        height={108}
        rx={8}
        fill="none"
        stroke={INK}
        strokeWidth={1.4}
        strokeDasharray="6 5"
      />
      <rect x={104} y={12} width={58} height={16} rx={4} fill="#fff" stroke={LINE} />
      <rect x={112} y={18} width={42} height={4} rx={2} fill={LINE} />

      {[0, 1, 2].map((i) => {
        const y = 42 + i * 28;
        return (
          <g key={i}>
            <rect x={110} y={y} width={196} height={20} rx={4} fill="none" stroke={LINE} />
            <circle cx={122} cy={y + 10} r={3.5} fill={BLUE} />
            <rect x={134} y={y + 7} width={92 - i * 16} height={6} rx={3} fill={LINE} />
          </g>
        );
      })}

      {/* a request from outside stops at the boundary */}
      <line x1={16} y1={74} x2={78} y2={74} stroke={LINE} strokeWidth={1.4} strokeDasharray="4 4" />
      <path d="M70 68l8 6-8 6" fill="none" stroke={LINE} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 68l10 12M94 68l-10 12" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
    </Wire>
  );
}

/* 03 — snapshots on a timeline, and a restore reaching back */
function BackupWire() {
  const marks = [46, 106, 166, 226, 286];
  return (
    <Wire>
      <line x1={16} y1={104} x2={324} y2={104} stroke={LINE} strokeWidth={1.2} />
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={i} x1={22 + i * 25} y1={100} x2={22 + i * 25} y2={108} stroke={LINE} strokeWidth={1} />
      ))}

      {marks.map((x, i) => {
        const last = i === marks.length - 1;
        return (
          <g key={x}>
            <line x1={x} y1={70} x2={x} y2={100} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
            <rect
              x={x - 7}
              y={56}
              width={14}
              height={14}
              rx={3}
              fill={last ? BLUE : "none"}
              stroke={last ? BLUE : LINE}
              strokeWidth={1.3}
            />
          </g>
        );
      })}

      {/* restore: the newest snapshot rolls the system back */}
      <path
        d="M286 46C286 22 166 22 166 46"
        fill="none"
        stroke={INK}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <path d="M160 40l6 7 6-7" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={16} y={126} width={52} height={6} rx={3} fill={LINE} />
    </Wire>
  );
}

const WIRES = [PermissionsWire, ResidencyWire, BackupWire];

export function Security() {
  const { security } = useCopy();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".sec-wire", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: EASE.out,
        scrollTrigger: { trigger: root.current, start: "top 76%", once: true },
      });

      /* trace every stroked shape so the diagram appears to be drawn */
      gsap.utils.toArray<SVGGeometryElement>(".sec-wire svg *", root.current).forEach((el, i) => {
        if (typeof el.getTotalLength !== "function") return;
        const len = el.getTotalLength();
        if (!len || len > 2000) return;
        gsap.fromTo(
          el,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 0.7,
            delay: (i % 14) * 0.03,
            ease: EASE.inOut,
            scrollTrigger: { trigger: root.current, start: "top 74%", once: true },
          },
        );
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="rule-b bg-off" aria-labelledby="security-heading">
      <div className="shell section-y">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[740px]">
            <Kicker>{security.kicker}</Kicker>
            <Lines
              id="security-heading"
              lines={security.headline}
              className="mt-5 font-display text-[clamp(30px,4.4vw,50px)] font-extrabold display-leading tracking-[-0.035em]"
            />
          </div>
          <FadeUp className="lg:w-[400px] lg:shrink-0">
            <p className="text-[16.5px] leading-[1.72] text-ink-70">{security.intro}</p>
          </FadeUp>
        </div>

        <ol className="head-gap grid grid-cols-1 lg:grid-cols-3">
          {security.pillars.map((p, i) => {
            const Diagram = WIRES[i];
            return (
              <li
                key={p.index}
                className="relative border-t border-line py-9 md:py-10 lg:px-9
                  lg:[&:not(:nth-child(3n+1))]:border-s"
              >
                <div className="sec-wire">
                  <Diagram />
                </div>
                <span className="mono-label mt-7 block text-ink-25">{p.index}</span>
                <h3 className="mt-3 text-[20px] font-semibold leading-[1.32] tracking-[-0.014em]">{p.title}</h3>
                <p className="mt-4 text-[14.5px] leading-[1.72] text-ink-45">{p.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
