"use client";

import { useRef, useState } from "react";
import { ProgressRail } from "@/components/ui/ProgressRail";
import Image from "next/image";
import { Printer, FileDown, CircleCheck, MapPin, Flag } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, EASE, scrollToY, prefersReducedMotion, Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker } from "@/components/ui";
import { useCopy } from "@/lib/copy";

function Head({ title, meta, status }: { title: string; meta: string; status: string }) {
  const { outputPanels: o } = useCopy();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <p className="truncate font-display text-[clamp(15px,1.8vw,19px)] font-extrabold tracking-[-0.02em]">
          {title}
        </p>
        <p className="mono-label mt-1">{meta}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-bg px-2.5 py-1.5 text-[13.5px] sm:text-[11.5px] font-medium text-blue-ink">
          <span className="size-1.5 rounded-full bg-blue" aria-hidden="true" />
          {status}
        </span>
        <span className="hidden items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-[12px] text-ink-70 sm:inline-flex">
          <Printer size={13} /> {o.print}
        </span>
        <span className="hidden items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-[12px] text-ink-70 sm:inline-flex">
          <FileDown size={13} /> {o.export}
        </span>
      </div>
    </div>
  );
}

const STOP_STATS = [
  { key: "s1", time: "07:05", onBoard: 9, waiting: 33 },
  { key: "s2", time: "07:12", onBoard: 16, waiting: 26 },
  { key: "s3", time: "07:19", onBoard: 27, waiting: 15 },
  { key: "s4", time: "07:26", onBoard: 33, waiting: 9 },
  { key: "s5", time: "07:34", onBoard: 38, waiting: 4 },
  { key: "s6", time: "07:48", onBoard: 38, waiting: 4 },
];

function RouteSheet() {
  /* Selecting a stop is a real interaction: the summary on the right recalculates
     for whichever stop you pick, so the panel behaves like the product does. */
  const { outputPanels } = useCopy();
  const o = outputPanels.route;
  const STOPS = STOP_STATS.map((st, i) => ({ ...st, name: o.stops[i], boarded: o.boarded[i] }));
  const [stop, setStop] = useState(4);
  const s = STOPS[stop];

  return (
    <>
      <Head title={o.title} meta={o.meta} status={o.status} />
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_290px]">
        <div className="min-h-0 flex-1 p-5 sm:p-6">
          <p className="mono-label">{o.stopsLabel}</p>
          <div className="mt-4">
            <ProgressRail
              done={5}
              size="sm"
              selectable
              onSelect={setStop}
              items={STOPS.map((st, i) => ({
                key: st.key,
                eyebrow: st.time,
                title: st.name,
                sub: st.boarded,
                icon: i === STOPS.length - 1 ? <Flag size={17} strokeWidth={1.75} /> : <MapPin size={17} strokeWidth={1.75} />,
              }))}
            />
          </div>

          <dl className="mt-[clamp(20px,3.5vh,36px)] grid grid-cols-3 border-t border-line pt-5">
            {[
              [o.distance, stop === 5 ? "14.2 km" : `${(2.4 * (stop + 1)).toFixed(1)} km`],
              [o.arrives, "07:48"],
              [o.ahead, o.aheadValue],
            ].map(([k, v], i) => (
              <div key={k} className={i > 0 ? "border-s border-line ps-5" : ""}>
                <dt className="mono-label">{k}</dt>
                <dd className="mt-2 font-display text-[clamp(17px,2vw,22px)] font-extrabold tracking-[-0.025em]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-line bg-off p-5 sm:p-6 lg:border-s lg:border-t-0">
          <div className="grid h-full grid-cols-2 gap-x-5 lg:grid-cols-1 lg:content-between">
          <div>
          <p className="mono-label">{o.onBoardAt} {s.time}</p>
          <p className="mt-2 font-display text-[clamp(30px,4.4vh,38px)] font-extrabold leading-none tracking-[-0.04em]">
            {s.onBoard} <span className="text-[15px] font-normal text-ink-45">{o.of}</span>
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-blue transition-[width] duration-500"
              style={{ width: `${(s.onBoard / 42) * 100}%` }}
            />
          </div>

          </div>
          <div className="border-s border-line ps-5 lg:mt-7 lg:border-s-0 lg:border-t lg:ps-0 lg:pt-5">
          <p className="mono-label lg:mt-0 lg:pt-0">{o.waiting} · {s.waiting}</p>
          <ul className="mt-2.5 space-y-2 text-[12.5px] text-ink-70">
            {o.notBoarded.slice(0, Math.min(3, s.waiting)).map((n) => (
              <li key={n} className="flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-ink-25" aria-hidden="true" />
                {n}
              </li>
            ))}
            {s.waiting > 3 && (
              <li className="font-mono text-[12px] sm:text-[10px] text-ink-25">+ {s.waiting - 3} {o.more}</li>
            )}
          </ul>

          <button
            type="button"
            data-cursor="send"
            className="mt-[clamp(16px,2.6vh,28px)] flex h-10 w-full items-center justify-center rounded-lg bg-blue text-[13.5px]
              font-semibold text-ink transition-[filter] hover:brightness-[1.06]"
          >
            {o.notify}
          </button>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EnrolmentRecord() {
  const { outputPanels } = useCopy();
  const o = outputPanels.enrolment;
  return (
    <>
      <Head title={o.title} meta={o.meta} status={o.status} />
      <div className="min-h-0 flex-1 p-5">
        <p className="mono-label">{o.stagesLabel}</p>
        <ol className="mt-6 grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {o.stages.map(({ when: t, name, note }) => (
            <li key={name} className="border-t border-blue pt-4 pe-3">
              <span className="font-mono text-[12px] sm:text-[10px] text-blue-ink">{t}</span>
              <p className="mt-2 text-[13px] font-semibold">{name}</p>
              <p className="mt-1 font-mono text-[11.5px] sm:text-[9.5px] text-ink-45">{note}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
          {o.docs.map((d) => (
            <li key={d}>
              <span className="flex items-center gap-2 text-[12.5px] font-medium">
                <CircleCheck size={15} className="shrink-0 text-blue" aria-hidden="true" />
                {d}
              </span>
              <span className="mono-label mt-1.5 block">{o.verified}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const BLOCK_STATS = [
  { w: 11, bg: "bg-ink" },
  { w: 27, bg: "bg-blue" },
  { w: 33, bg: "bg-blue" },
  { w: 22, bg: "bg-ink-25" },
  { w: 7, bg: "bg-ink" },
];

function LessonPlan() {
  const { outputPanels } = useCopy();
  const o = outputPanels.lesson;
  const blocks = BLOCK_STATS.map((b, i) => [o.blocks[i], o.durations[i], b.w, b.bg] as const);
  return (
    <>
      <Head title={o.title} meta={o.meta} status={o.status} />
      <div className="min-h-0 flex-1 p-5">
        <p className="mono-label">{o.structure}</p>
        <div className="mt-5 flex gap-[3px]">
          {blocks.map(([n, , w, bg]) => (
            <span key={n} className={`h-10 rounded-[3px] ${bg}`} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-3 flex gap-[3px]">
          {blocks.map(([n, dur, w]) => (
            <div key={n} style={{ width: `${w}%` }} className="min-w-0 pe-2">
              <p className="font-mono text-[11.5px] sm:text-[9.5px] text-blue-ink">{dur}</p>
              <p className="mt-1 truncate text-[13.5px] sm:text-[11.5px] font-medium">{n}</p>
            </div>
          ))}
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-5 border-t border-line pt-5 sm:grid-cols-3">
          {o.objectives.map((line, i) => (
            <li key={line} className={i > 0 ? "sm:border-s sm:border-line sm:ps-5" : ""}>
              <p className="mono-label">
                {o.objective} 0{i + 1}
              </p>
              <p className="mt-2 text-[13px] leading-[1.6]">{line}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Certificate() {
  const { outputPanels } = useCopy();
  const o = outputPanels.certificate;
  return (
    <>
      <Head title={o.title} meta={o.meta} status={o.status} />
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-0 flex-col p-5">
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-line bg-off px-6 py-[clamp(18px,3vh,36px)] text-center">
            <Image src="/logo.svg" alt="" width={84} height={24} aria-hidden="true" />
            <p className="mono-label mt-[clamp(10px,2vh,16px)]">{o.heading}</p>
            <p className="mt-[clamp(10px,2vh,16px)] font-display text-[clamp(22px,3.4vw,34px)] font-extrabold tracking-[-0.03em]">
              {o.name}
            </p>
            <p className="mt-3 text-[12.5px] text-ink-45">{o.completed}</p>
            <p className="mt-1.5 text-[15px] font-semibold">{o.programme}</p>
            <dl className="mt-[clamp(16px,3vh,28px)] grid w-full grid-cols-3 border-t border-line pt-[clamp(12px,2.2vh,20px)]">
              {o.facts.map(({ value: v, label: k }, i) => (
                <div key={k} className={i > 0 ? "border-s border-line" : ""}>
                  <dd className="font-display text-[16px] font-extrabold tracking-[-0.02em]">{v}</dd>
                  <dt className="mono-label mt-1">{k}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="border-t border-line bg-off p-5 lg:border-s lg:border-t-0">
          <p className="mono-label">{o.verification}</p>
          <p className="mt-2 font-display text-[34px] font-extrabold leading-none tracking-[-0.04em]">0148</p>
          <dl className="mt-5 border-t border-line text-[12.5px]">
            {o.rows.map(({ k, v }) => (
                <div key={k} className="flex justify-between border-b border-line-2 py-2.5">
                  <dt className="text-ink-45">{k}</dt>
                  <dd className="font-mono text-[13px] sm:text-[11px]">{v}</dd>
                </div>
              ),
            )}
          </dl>
          <p className="mt-4 text-[12px] leading-[1.6] text-ink-45">
            {o.note}
          </p>
        </div>
      </div>
    </>
  );
}

const PANELS = [RouteSheet, EnrolmentRecord, LessonPlan, Certificate];

export function Outputs() {
  const { outputs } = useCopy();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const pin = useRef<ScrollTrigger | null>(null);
  const n = PANELS.length;

  /* The tabs are controls on every screen. On a phone they simply swap the
     panel; while the section is held they scroll to that panel's place in the
     hold, so the same click means the same thing either way. */
  const choose = (i: number) => {
    const st = pin.current;
    if (!st) {
      setActive(i);
      return;
    }
    scrollToY(st.start + ((st.end - st.start) * i) / (n - 1));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray<HTMLElement>(".out-panel", root.current);

      /* Held in place while the outputs change over — one screen of scroll per
         output, then the page carries on. */
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 800px)", () => {
        /* A hand-over, not a dissolve: every panel is opaque and simply moves
           out of the frame as the next one moves in, so two of them are never
           translucent on top of each other. */
        gsap.set(panels, { yPercent: 105, autoAlpha: 1 });
        gsap.set(panels[0], { yPercent: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".out-stage",
            start: "top top",
            end: () => "+=" + (n - 1) * window.innerHeight * 0.9,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
          },
        });
        pin.current = tl.scrollTrigger ?? null;

        for (let i = 0; i < n - 1; i++) {
          tl.to(panels[i], { yPercent: -105, duration: 1, ease: EASE.inOut }, i)
            .to(panels[i + 1], { yPercent: 0, duration: 1, ease: EASE.inOut }, i);
        }

        return () => {
          pin.current = null;
          gsap.set(panels, { clearProps: "all" });
        };
      });

      /* phones and reduced motion: everything stacked, nothing held */
      mm.add("(max-width: 1023px), (max-height: 799px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(panels, { clearProps: "all" });
        return () => gsap.set(panels, { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} className="rule-b bg-tint" aria-labelledby="outputs-heading">
      {/* The heading is inside the held frame, not above it: pinning only the
          panels meant you arrived on a certificate with nothing left on screen
          saying which section you were in. */}
      <div
        className="out-stage stage-screen relative z-20 bg-tint shell"
      >
        <div className="md:shrink-0">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="lg:max-w-[740px]">
              <Kicker>{outputs.kicker}</Kicker>
              <Lines
                id="outputs-heading"
                lines={outputs.headline}
                className="mt-4 font-display text-[clamp(28px,min(4.4vw,5.4vh),50px)] font-extrabold display-leading tracking-[-0.035em] sm:mt-5"
              />
            </div>
            <FadeUp className="lg:w-[400px] lg:shrink-0">
              <p className="text-[15.5px] leading-[1.66] text-ink-70 lg:text-[16.5px]">{outputs.intro}</p>
            </FadeUp>
          </div>

          {/* index — reflects whichever output is on screen */}
          {/* On a phone this is an accordion, not a tab strip: the names stack
              and the chosen output opens directly beneath its own name, so you
              are never reading a label at the top and its content a scroll away.
              CSS `order` interleaves the panel frame between the names without
              rendering the panels twice. */}
          <div className="no-scrollbar head-gap-vh flex flex-col lg:flex-row lg:gap-x-8
            lg:border-b lg:border-line">
            {outputs.tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => choose(i)}
                aria-current={active === i ? "true" : undefined}
                aria-expanded={active === i}
                data-cursor="view"
                className={`flex shrink-0 items-center justify-between gap-3 border-b border-line py-3
                  text-start transition-colors lg:block lg:border-b-2 lg:py-3 ${
                    active === i
                      ? "border-ink lg:border-ink"
                      : "lg:border-transparent lg:hover:border-line"
                  }`}
              >
                <span
                  className={`block text-[14.5px] transition-colors ${
                    active === i ? "font-semibold text-ink" : "text-ink-45"
                  }`}
                >
                  {t.label}
                </span>
                {/* the system a given output comes from is supporting detail —
                    on a phone it doubled the height of every row */}
                <span
                  className={`mt-0.5 hidden font-mono text-[8.5px] uppercase tracking-[0.14em] lg:block ${
                    active === i ? "text-blue-ink" : "text-ink-25"
                  }`}
                >
                  {t.source}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 hidden items-center gap-4 lg:flex">
            <span className="mono-label tabular ltr-run text-ink">
              {String(active + 1).padStart(2, "0")}
              <span className="text-ink-25"> / {String(n).padStart(2, "0")}</span>
            </span>
            <span className="h-px flex-1 bg-line" aria-hidden="true">
              <span
                className="block h-px bg-blue transition-[width] duration-300"
                style={{ width: `${((active + 1) / n) * 100}%` }}
              />
            </span>
          </div>
        </div>

        {/* the panels swap in the same frame instead of stacking down the page */}
        <div className="stage-frame relative mt-4 lg:mt-[clamp(16px,2.5vh,28px)]">
          {PANELS.map((Panel, i) => (
            <div
              key={outputs.tabs[i].label}
              data-active={active === i ? "true" : undefined}
              className="out-panel stage-panel inset-0 flex-col overflow-hidden rounded-xl border border-line
                bg-paper shadow-[0_14px_36px_-12px_rgba(10,20,30,0.08)]"
            >
              <Panel />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
