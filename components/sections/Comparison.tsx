"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronsLeftRight, Lock, Check } from "lucide-react";
import { Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker } from "@/components/ui";
import { useCopy } from "@/lib/copy";

export function Comparison() {
  const { comparison, a11y, compareUI } = useCopy();
  const stage = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  /* The divider is placed with a logical property so it mirrors on its own,
     but clip-path is physical — left as-is the two came apart in Arabic, the
     wipe cutting from one side while the handle sat on the other. */
  const rtl = () => typeof document !== "undefined" && document.documentElement.dir === "rtl";

  const apply = useCallback((v: number) => {
    const clamped = Math.min(100, Math.max(0, v));
    setPct(clamped);
    if (before.current) {
      before.current.style.clipPath = rtl()
        ? `inset(0 0 0 ${100 - clamped}%)`
        : `inset(0 ${100 - clamped}% 0 0)`;
    }
  }, []);

  useEffect(() => {
    apply(pct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fromPointer = useCallback(
    (clientX: number) => {
      const r = stage.current!.getBoundingClientRect();
      const from = rtl() ? r.right - clientX : clientX - r.left;
      apply((from / r.width) * 100);
    },
    [apply],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") { e.preventDefault(); apply(pct - step); }
    if (e.key === "ArrowRight") { e.preventDefault(); apply(pct + step); }
    if (e.key === "Home") { e.preventDefault(); apply(0); }
    if (e.key === "End") { e.preventDefault(); apply(100); }
  };

  return (
    <section className="rule-b" aria-labelledby="compare-heading">
      <div className="shell section-y">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[740px]">
            <Kicker>{comparison.kicker}</Kicker>
            <Lines
              id="compare-heading"
              lines={comparison.headline}
              className="mt-5 font-display text-[clamp(30px,4.4vw,50px)] font-extrabold display-leading tracking-[-0.035em]"
            />
          </div>
          <FadeUp className="lg:w-[400px] lg:shrink-0">
            <p className="text-[16.5px] leading-[1.72] text-ink-70">{comparison.intro}</p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="head-gap">
          {/* Labels sit above the stage, never inside the clipped layers, so they
              can never overlap each other at the cut line. */}
          <div className="mb-3 flex items-center justify-between gap-4">
            <p
              className={`mono-label transition-colors ${pct > 18 ? "text-ink-45" : "text-ink-25"}`}
            >
              {comparison.beforeLabel}
            </p>
            <p
              className={`mono-label text-end transition-colors ${pct < 82 ? "text-blue-ink" : "text-ink-25"}`}
            >
              {comparison.afterLabel}
            </p>
          </div>

          <div
            ref={stage}
            onPointerDown={(e) => {
              /* capture is a nicety — if it throws the drag must still start */
              try {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              } catch {}
              dragging.current = true;
              fromPointer(e.clientX);
            }}
            /* an explicit flag rather than `buttons === 1`: a touch contact does
               not reliably report a pressed button, so the drag died on a phone */
            onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            /* pan-y, not none: the browser keeps vertical scrolling over the
               stage, but stops swallowing the sideways drag as a scroll gesture
               — without this no pointermove ever arrived on touch */
            style={{ touchAction: "pan-y" }}
            className="relative h-[clamp(330px,38vw,430px)] cursor-ew-resize select-none overflow-hidden
              rounded-xl border border-line bg-off"
          >
            {/* ---------- WITH OUREDU: the base layer ---------- */}
            <div className="absolute inset-0 flex flex-col p-4 sm:p-6">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-paper">
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-off px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <Image src="/logo.svg" alt="" width={56} height={16} aria-hidden="true" />
                    <span className="text-[12.5px] font-semibold">{compareUI.workspace}</span>
                  </span>
                  <span className="hidden items-center gap-1.5 rounded-full bg-blue-bg px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-blue-ink sm:inline-flex">
                    <Check size={11} /> {compareUI.oneLogin}
                  </span>
                </div>

                {/* Six cells on one surface, not six full-width rows. Stretched
                    across the frame the label sat at one end and the figure at
                    the other with a hand's width of nothing between them, and
                    the eye had to travel to pair them up. Paired in a cell they
                    read as one fact. */}
                <ul className="grid min-h-0 flex-1 grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2">
                  {comparison.unified.map((r) => (
                    <li
                      key={r.system}
                      /* one column on a phone, two from sm — so the rule that
                         separates a cell differs by breakpoint */
                      /* One column on a phone, two from sm, three from lg — so
                         which edge carries a rule changes twice. Written as
                         explicit nth-child rules rather than stacked ternaries,
                         which had put the divider on the wrong cells. */
                      className="flex min-w-0 flex-col justify-center gap-1.5 border-line-2 px-4 py-2
                        [&:not(:first-child)]:border-t
                        sm:[&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(even)]:border-s
                        lg:[&:nth-child(3)]:border-t-0 lg:[&:nth-child(3)]:border-s
                        lg:[&:nth-child(5)]:border-s lg:[&:nth-child(4)]:border-s-0"
                    >
                      <span className="flex items-center gap-2">
                        <span className="size-1 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                        <span className="mono-label truncate text-ink-45">{r.system}</span>
                      </span>
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-display text-[clamp(15px,1.5vw,19px)] font-extrabold leading-none tracking-[-0.03em]">
                          {r.value}
                        </span>
                        <span className="truncate font-mono text-[9.5px] text-ink-45">{r.unit}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="shrink-0 border-t border-line bg-off px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-ink">
                  {comparison.unifiedFoot}
                </p>
              </div>
            </div>

            {/* ---------- TODAY: clipped to the handle ---------- */}
            <div
              ref={before}
              className="absolute inset-0 flex flex-col bg-off p-4 sm:p-6"
              style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
              suppressHydrationWarning
            >
              <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-2.5 sm:grid-cols-3 sm:grid-rows-2">
                {comparison.tools.map((t, i) => (
                  <div
                    key={t.app}
                    className="flex min-h-0 flex-col overflow-hidden border border-line bg-paper"
                    /* deliberately inconsistent — six vendors, six house styles */
                    style={{ borderRadius: i % 3 === 0 ? 6 : i % 3 === 1 ? 2 : 10 }}
                  >
                    <div className="shrink-0 truncate border-b border-line bg-[#F3F4F5] px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-ink-45">
                      {t.app}
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col justify-center gap-2 px-2.5 py-2 sm:justify-start sm:py-2.5">
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-display text-[clamp(15px,1.8vw,20px)] font-extrabold leading-none tracking-[-0.03em]">
                          {t.value}
                        </span>
                        <span className="truncate font-mono text-[8.5px] text-ink-45">{t.unit}</span>
                      </span>
                      {/* the rest of a screen nobody is looking at — enough to
                          read as an interface without inventing figures. Hidden
                          on a phone, where the card is 92px and the bars had
                          nowhere to go but zero height. */}
                      <span className="hidden min-h-0 flex-1 flex-col justify-start gap-1.5 sm:flex" aria-hidden="true">
                        <span className="block h-1 w-full rounded-full bg-line-2" />
                        <span className="block h-1 w-[72%] rounded-full bg-line-2" />
                        <span className="block h-1 w-[45%] rounded-full bg-line-2" />
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 border-t border-line-2 px-2.5 py-1.5">
                      <Lock size={9} className="shrink-0 text-ink-25" aria-hidden="true" />
                      <span className="truncate font-mono text-[8px] uppercase tracking-[0.1em] text-ink-25">
                        {t.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- divider + handle ---------- */}
            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 pin-inline bg-ink"
              style={{ insetInlineStart: `${pct}%` }}
              aria-hidden="true"
            />
            <div
              role="slider"
              tabIndex={0}
              aria-label={a11y.compare}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
              aria-valuetext={`${Math.round(pct)}%`}
              onKeyDown={onKeyDown}
              data-cursor="drag"
              className="pin-inline-mid absolute top-1/2 flex size-11 cursor-ew-resize
                items-center justify-center rounded-full border-2 border-ink bg-paper
                shadow-[0_3px_12px_rgba(10,20,30,0.2)] focus-visible:outline-2 focus-visible:outline-blue"
              style={{ insetInlineStart: `clamp(22px, ${pct}%, calc(100% - 22px))` }}
            >
              <ChevronsLeftRight size={19} strokeWidth={1.75} aria-hidden="true" />
            </div>
          </div>
        </FadeUp>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="font-display text-[clamp(20px,2.7vw,32px)] font-extrabold display-leading tracking-[-0.028em]">
            {comparison.punchLead}
            <span className="text-blue-ink">{comparison.punchBlue}</span>
          </p>
          <p className="mono-label text-ink-25">{comparison.hint}</p>
        </div>
      </div>
    </section>
  );
}
