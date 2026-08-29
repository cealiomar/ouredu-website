"use client";

import { useRef, useState, useCallback } from "react";
import { Check, Upload, GripVertical, Circle, CircleCheck, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, EASE, scrollToY, prefersReducedMotion } from "@/components/motion/primitives";
import { Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker } from "@/components/ui";
import { useCopy } from "@/lib/copy";

/* ---------------- little UI panels, one per group ----------------
   Each shows the work the systems actually do — filling a form, building a
   lesson, writing a question, setting up a programme — rather than a chart. */

function Chrome({ title, meta, badge, children }: { title: string; meta: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-[0_8px_22px_-6px_rgba(10,20,30,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-off px-4 py-2.5">
        <span className="flex min-w-0 items-baseline gap-2.5">
          <span className="truncate text-[12.5px] font-semibold">{title}</span>
          <span className="hidden font-mono text-[11px] sm:text-[9px] uppercase tracking-[0.12em] text-ink-45 sm:inline">
            {meta}
          </span>
        </span>
        <span className="shrink-0 rounded bg-blue-bg px-2 py-1 font-mono text-[10.5px] sm:text-[8.5px] uppercase tracking-[0.12em] text-blue-ink">
          {badge}
        </span>
      </div>
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  w = "",
  ltr = false,
}: {
  label: string;
  value: string;
  w?: string;
  /* dates and phone numbers keep Latin order even on an Arabic page */
  ltr?: boolean;
}) {
  return (
    <label className={`block ${w}`}>
      <span className="text-[11.5px] sm:text-[9.5px] font-medium text-ink-45">{label}</span>
      <span
        className={`mt-1.5 flex h-8 items-center rounded-md border border-line px-2.5 text-[13.5px] sm:text-[11.5px] ${
          ltr ? "ltr-run" : ""
        }`}
      >
        {value}
      </span>
    </label>
  );
}

function AdmissionsUI() {
  const { systemMocks } = useCopy();
  const m = systemMocks.admissions;
  return (
    <Chrome title={m.title} meta={m.meta} badge={m.badge}>
      <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2.5">
          <Field label={m.fullName} value={m.nameValue} />
          <div className="flex gap-2.5">
            <Field label={m.dob} value="12 / 04 / 2010" w="flex-1" ltr />
            <Field label={m.grade} value={m.gradeValue} w="flex-1" />
          </div>
          <Field label={m.mobile} value="+966 5XX XXX XXX" ltr />
          <div className="mt-3 flex items-center justify-between rounded-md bg-off px-3 py-2.5">
            <span>
              <span className="block font-mono text-[10.5px] sm:text-[8.5px] uppercase tracking-[0.12em] text-ink-45">
                {m.fee}
              </span>
              <span className="font-display text-[15px] font-extrabold">{m.feeValue}</span>
            </span>
            <span className="rounded-md bg-blue px-3 py-1.5 text-[13px] sm:text-[11px] font-semibold text-ink">
              {m.pay}
            </span>
          </div>
        </div>

        <div className="w-full space-y-2 sm:w-[168px]">
          <p className="font-mono text-[10.5px] sm:text-[8.5px] uppercase tracking-[0.12em] text-ink-45">{m.docs}</p>
          {m.docList.map((n, di) => {
            const done = di < 3;
            return (
            <div
              key={n as string}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] sm:text-[10px] ${
                done ? "border-line" : "border-blue"
              }`}
            >
              {done ? (
                <CircleCheck size={13} className="shrink-0 text-blue" />
              ) : (
                <Upload size={13} className="shrink-0 text-blue-ink" />
              )}
              <span className="truncate">{n as string}</span>
            </div>
            );
          })}
        </div>
      </div>
    </Chrome>
  );
}

function LessonUI() {
  const { systemMocks } = useCopy();
  const m = systemMocks.lesson;
  return (
    <Chrome title={m.title} meta={m.meta} badge={m.badge}>
      <div className="space-y-2">
        {m.blocks.map((title, bi) => {
          const kind = m.kinds[bi];
          const active = bi === 0;
          return (
          <div
            key={title as string}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
              active ? "border-blue bg-blue-bg" : "border-line"
            }`}
          >
            <span
              className={`shrink-0 rounded px-2 py-1 font-mono text-[10px] sm:text-[8px] uppercase tracking-[0.1em] ${
                active ? "bg-blue text-ink" : "bg-line-2 text-ink-70"
              }`}
            >
              {kind as string}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] sm:text-[11.5px] font-medium">{title as string}</span>
            <GripVertical size={13} className="shrink-0 text-ink-25" />
          </div>
          );
        })}
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line py-2.5 text-[13px] sm:text-[11px] text-ink-45">
          <Plus size={13} /> {m.add}
        </div>
      </div>
    </Chrome>
  );
}

function TestUI() {
  const { systemMocks } = useCopy();
  const m = systemMocks.test;
  return (
    <Chrome title={m.title} meta={m.meta} badge={m.badge}>
      <p className="font-mono text-[10.5px] sm:text-[8.5px] uppercase tracking-[0.12em] text-ink-45">{m.answerType}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {m.types.map((t, i) => (
          <span
            key={t}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] sm:text-[10.5px] ${
              i === 0 ? "border-blue bg-blue-bg font-semibold" : "border-line text-ink-70"
            }`}
          >
            <span className={`size-2 rounded-full ${i === 0 ? "bg-blue" : "border border-ink-25"}`} />
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 rounded-md border-[1.5px] border-ink px-3 py-2.5 text-[13.5px] sm:text-[11.5px] font-medium">
        {m.question}
      </p>
      <div className="mt-2.5 space-y-1.5">
        {m.options.map((v, oi) => {
          const k = ["A", "B", "C", "D"][oi];
          const ok = oi === 2;
          return (
          <div
            key={k as string}
            className={`flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-[13px] sm:text-[11px] ${
              ok ? "border-blue bg-blue-bg" : "border-line"
            }`}
          >
            {ok ? <CircleCheck size={14} className="text-blue" /> : <Circle size={14} className="text-ink-25" />}
            <span className="font-mono text-[11.5px] sm:text-[9.5px] text-ink-45">{k as string}</span>
            <span className={ok ? "font-semibold" : ""}>{v as string}</span>
            {ok && (
              <span className="ms-auto font-mono text-[10.5px] sm:text-[8.5px] uppercase tracking-[0.12em] text-blue-ink">
                {m.correct}
              </span>
            )}
          </div>
          );
        })}
      </div>
    </Chrome>
  );
}

function ProgrammeUI() {
  const { systemMocks } = useCopy();
  const m = systemMocks.programme;
  return (
    <Chrome title={m.title} meta={m.meta} badge={m.badge}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2.5">
          <Field label={m.name} value={m.nameValue} />
          <div className="flex gap-2.5">
            <Field label={m.hours} value="24" w="flex-1" />
            <Field label={m.sessions} value="6" w="flex-1" />
          </div>
          <Field label={m.template} value={m.templateValue} />
        </div>
        <div className="w-full space-y-2 sm:w-[168px]">
          <p className="font-mono text-[10.5px] sm:text-[8.5px] uppercase tracking-[0.12em] text-ink-45">{m.trainees}</p>
          {m.people.map((n, i) => (
            <div key={n} className="flex items-center gap-2 rounded-md border border-line px-2 py-1.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-bg text-[10px] sm:text-[8px] font-semibold text-blue-ink">
                {n.split(" ").map((p) => p[0]).join("")}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12px] sm:text-[10px]">{n}</span>
              {i < 2 && <Check size={12} className="shrink-0 text-blue" />}
            </div>
          ))}
          <div className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-line py-1.5 text-[12px] sm:text-[10px] text-ink-45">
            <Plus size={12} /> {m.add}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

const PANELS = [AdmissionsUI, LessonUI, TestUI, ProgrammeUI];

/* In a right-to-left page the row is laid out from the right edge, so the
   later cards sit at negative offsets and the track has to travel the other
   way to reveal them. */
const rtlSign = () =>
  typeof document !== "undefined" && document.documentElement.dir === "rtl" ? -1 : 1;

export function SystemsDeck() {
  const { systemGroups, systems } = useCopy();
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  /* A real horizontal scroller: native scrolling with snap points, so a
     trackpad, a touch swipe, the arrow buttons and the keyboard all work and
     the vertical page scroll is never taken over. */
  const onScroll = useCallback(() => {
    /* the viewport is what scrolls, not the row inside it — reading the row's
       scrollLeft always returned zero, so the counter never moved on touch */
    const el = viewport.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    /* right-to-left reports a negative scrollLeft */
    const left = Math.abs(el.scrollLeft);
    setProgress(max > 0 ? left / max : 0);
    const card = track.current?.firstElementChild as HTMLElement | null;
    if (card) {
      const step = card.offsetWidth + 24;
      setIndex(Math.min(systemGroups.length - 1, Math.round(left / step)));
    }
  }, [systemGroups.length]);

  /* On desktop the section is held and the vertical wheel drives the row
     sideways, so the arrows move the page rather than the element. */
  const go = (dir: -1 | 1) => {
    const st = pinRef.current;
    const el = viewport.current;
    if (st && el) {
      const steps = systemGroups.length - 1;
      const target = Math.min(steps, Math.max(0, index + dir)) / steps;
      const y = st.start + (st.end - st.start) * target;
      /* the same eased scroll the nav uses; native smooth scrolling fights the
         scrubbed timeline this section is driven by */
      scrollToY(y, 0.55);
      return;
    }
    if (!el) return;
    const card = track.current?.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: dir * step * rtlSign(), behavior: "smooth" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const el = track.current!;
      const view = viewport.current!;

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 800px)", () => {
        const distance = () => Math.max(0, el.scrollWidth - view.clientWidth);

        /* One trigger drives both the hold and the sideways travel. Running two
           separate triggers over the same pinned element left the row at x:0,
           because the second one measured a layout the pin had already changed. */
        const tween = gsap.to(el, {
          x: () => -distance() * rtlSign(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.8,
            invalidateOnRefresh: true,
            /* Measure the row from a clean slate. Without this the width is read
               while the row is already translated, so the travel distance came
               back far too short and the cards stopped after ~100px. */
            onRefreshInit: () => gsap.set(el, { x: 0 }),
            onUpdate: (self) => {
              setProgress(self.progress);
              setIndex(Math.round(self.progress * (systemGroups.length - 1)));
            },
          },
        });
        pinRef.current = tween.scrollTrigger ?? null;

        return () => {
          pinRef.current = null;
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(el, { x: 0 });
        };
      });

      /* touch and reduced motion keep plain native scrolling */
      mm.add("(max-width: 1023px), (max-height: 799px), (prefers-reduced-motion: reduce)", () => {
        view.style.overflowX = "auto";
        if (!prefersReducedMotion()) {
          gsap.from(".sys-card", {
            y: 30,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: EASE.out,
            scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
          });
        }
        return () => {
          view.style.overflowX = "";
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} id="systems" className="rule-b bg-off" aria-labelledby="systems-heading">
      {/* Held full-screen while the rail travels: the section is exactly one
          viewport tall on desktop and split into a fixed header and a flexible
          rail, so a card can never be cut off by the fold. */}
      <div
        className="stage-screen"
      >
        <div className="shell md:shrink-0">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="lg:max-w-[740px]">
              <Kicker>{systems.kicker}</Kicker>
              <Lines
                id="systems-heading"
                lines={systems.headline}
                className="mt-3 font-display text-[clamp(26px,min(4.4vw,5.4vh),50px)] font-extrabold display-leading tracking-[-0.035em] sm:mt-5"
              />
            </div>
            <FadeUp className="lg:w-[400px] lg:shrink-0">
              <p className="text-[14.5px] leading-[1.62] text-ink-70 sm:text-[16.5px] sm:leading-[1.72]">{systems.intro}</p>
            </FadeUp>
          </div>

          {/* controls: counter, progress, arrows */}
          <div className="mt-7 flex items-center justify-between gap-6 sm:mt-[clamp(24px,4vh,56px)]">
            <div className="flex items-center gap-4">
              <span className="mono-label tabular ltr-run text-ink">
                {String(index + 1).padStart(2, "0")}
                <span className="text-ink-25"> / {String(systemGroups.length).padStart(2, "0")}</span>
              </span>
              <span className="h-px w-[clamp(80px,18vw,220px)] bg-line" aria-hidden="true">
                <span
                  className="block h-px bg-blue transition-[width] duration-300"
                  style={{ width: `${Math.max(8, progress * 100)}%` }}
                />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={systems.prev}
                disabled={index === 0}
                className="flex size-11 items-center justify-center rounded-full border border-line bg-paper
                  transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line"
              >
                <ArrowLeft size={17} className="icon-dir" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={systems.next}
                disabled={index === systemGroups.length - 1}
                className="flex size-11 items-center justify-center rounded-full border border-line bg-paper
                  transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-line"
              >
                <ArrowRight size={17} className="icon-dir" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* the rail bleeds to the viewport edge so it is obvious it continues */}
        <div
          ref={viewport}
          onScroll={onScroll}
          tabIndex={0}
          role="region"
          aria-label={systems.railLabel}
          className="stage-frame-x no-scrollbar mt-7 pb-4 focus-visible:outline-2 focus-visible:outline-blue
            md:mt-[clamp(20px,3vh,36px)] md:pb-0"
        >
          <div
            ref={track}
            className="flex h-full snap-x snap-mandatory gap-6 px-[clamp(20px,5.5vw,80px)] will-change-transform
              md:snap-none"
          >
          {systemGroups.map((g, i) => {
            const Panel = PANELS[i];
            return (
              <article
                key={g.index}
                aria-label={g.title.join(" ")}
                className="sys-card w-[min(1100px,86vw)] shrink-0 snap-center md:h-full"
              >
                <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_18px_44px_-14px_rgba(10,20,30,0.08)] lg:grid-cols-[minmax(0,420px)_1fr]">
                  <div className="flex min-h-0 flex-col overflow-hidden p-5 sm:p-8">
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-[12px] tracking-[0.16em] text-blue-ink sm:text-[10px]">
                        {g.index}
                      </span>
                      <span className="h-px w-7 bg-blue" aria-hidden="true" />
                      <span className="mono-label text-ink-25">{g.count}</span>
                    </div>

                    <h3 className="mt-5 font-display text-[clamp(26px,3.4vw,42px)] font-extrabold display-leading tracking-[-0.035em]">
                      {g.title.map((t) => (
                        <span key={t} className="block">
                          {t}
                        </span>
                      ))}
                    </h3>

                    <p className="mt-4 text-[15px] leading-[1.68] text-ink-70">{g.description}</p>

                    {/* Arabic names run longer than the English ones, so the list is allowed to
                        scroll inside the card rather than lose its last row. */}
                    <ul className="no-scrollbar mt-6 min-h-0 overflow-y-auto border-t border-line lg:mt-auto">
                      {g.systems.map((sy) => (
                        <li key={sy.name} className="border-b border-line py-3">
                          <p className="text-[14.5px] font-semibold tracking-[-0.01em]">{sy.name}</p>
                          <p className="mt-1 text-[12.5px] leading-[1.6] text-ink-45">{sy.blurb}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="min-h-0 overflow-hidden border-t border-line bg-off p-4 sm:p-6 lg:border-s lg:border-t-0">
                    <div className="h-full min-h-[210px] sm:min-h-[300px]">
                      <Panel />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
