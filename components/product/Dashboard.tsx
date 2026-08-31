"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid, UserRoundPlus, BookOpen, CalendarCheck, PlayCircle, Bus, CalendarDays,
  Sparkles, Gamepad2, Search, Bell, ChevronDown, Plus, Library, Copy, Upload, type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP, EASE, prefersReducedMotion } from "@/components/motion/primitives";
import { useCopy } from "@/lib/copy";

const NAV_ICONS: LucideIcon[] = [
  LayoutGrid, UserRoundPlus, BookOpen, CalendarCheck, PlayCircle, Bus, CalendarDays,
];
const NAV_BADGES: (string | undefined)[] = [undefined, "12", undefined, undefined, undefined, undefined, "3"];
const TOOL_ICONS: LucideIcon[] = [Sparkles, Gamepad2];

const SERIES = [91,93,90,94,92,95,93,96,94,92,95,97,94,96,93,95,98,96,94,97,95,93,96,94,97,95,98,96,94,92,95,97,96,98,95,97,94,96,98,95,93,96,98,97,95,98];

const COURSE_STATS = [
  { pct: 68, students: 32 },
  { pct: 74, students: 28 },
  { pct: 41, students: 25 },
  { pct: 86, students: 31 },
  { pct: 55, students: 30 },
];

const FUNNEL_STATS = [
  { value: "1,284", pct: 100 },
  { value: "940", pct: 73 },
  { value: "712", pct: 55 },
  { value: "648", pct: 50, done: true },
];

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const BUS_STATS = [
  { id: "07", cap: "38 / 42", arrived: false },
  { id: "03", cap: "41 / 45", arrived: true },
  { id: "12", cap: "29 / 40", arrived: false },
];

export function Dashboard() {
  const { product: t } = useCopy();
  const VIEWS = t.views;
  const PERIODS = t.periods;
  const NAV = t.nav.map((label, i) => ({ label, icon: NAV_ICONS[i], badge: NAV_BADGES[i] }));
  const TOOLS = t.tools.map((label, i) => ({ label, icon: TOOL_ICONS[i] }));
  const COURSES = t.courses.list.slice(0, 3).map((c, i) => ({ ...c, ...COURSE_STATS[i] }));
  const EXTRA_COURSES = t.courses.list.slice(3).map((c, i) => ({ ...c, ...COURSE_STATS[i + 3] }));
  const FUNNEL = t.enrolment.funnel.map((label, i) => ({ label, ...FUNNEL_STATS[i] }));
  const BUSES = BUS_STATS.map((b, i) => ({
    id: `${t.transport.bus} ${b.id}`,
    cap: b.cap,
    route: t.transport.routes[i],
    status: b.arrived ? t.transport.arrived : t.transport.enRoute,
    arrived: b.arrived,
  }));
  const root = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(0);
  const [period, setPeriod] = useState(1);
  const [nav, setNav] = useState(3);
  const [menu, setMenu] = useState(false);
  const [typed, setTyped] = useState("");
  const [rateText, setRateText] = useState("96.4%");
  const [enrolled, setEnrolled] = useState("648");
  const pane = useRef<HTMLDivElement>(null);

  /* The view tabs scroll sideways on a phone. Selecting one — by hand or by the
     demonstration — has to bring it into the strip, or the screen you just
     switched to is named by a tab sitting off the edge. */
  useEffect(() => {
    const tab = root.current?.querySelector<HTMLElement>(`[data-demo="view-${view}"]`);
    const strip = tab?.parentElement;
    if (!tab || !strip || strip.scrollWidth <= strip.clientWidth) return;
    const t = tab.getBoundingClientRect();
    const s = strip.getBoundingClientRect();
    if (t.left < s.left || t.right > s.right) {
      strip.scrollTo({
        left: strip.scrollLeft + (t.left - s.left) - (s.width - t.width) / 2,
        behavior: "smooth",
      });
    }
  }, [view]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !pane.current) return;
      gsap.fromTo(
        pane.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE.out },
      );
    },
    { dependencies: [view] },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setMenu(true);
        return;
      }

      /* A short scripted run so the panel demonstrates itself: a pointer moves
         between real controls, the search is typed into, the numbers count up
         and the add-course menu opens — the same states a visitor can trigger
         by hand afterwards. */
      const el = root.current!;
      const cur = el.querySelector<HTMLElement>(".db-cursor")!;
      const at = (sel: string) => {
        const t = el.querySelector<HTMLElement>(`[data-demo="${sel}"]`);
        if (!t) return null;
        const a = el.getBoundingClientRect();
        const b = t.getBoundingClientRect();
        return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 };
      };
      /* The pointer re-aims on every frame of its travel instead of locking a
         destination when the tween begins.

         Resolving once at the start was still a race: the screen behind the
         control is swapped by a React state change, and if the commit had not
         landed yet the tween aimed at where the button used to be and pressed a
         hundred pixels of empty panel. Easing towards a target that is read
         fresh each frame cannot be wrong, whenever the layout settles. */
      const moveTo = (tl: gsap.core.Timeline, sel: string, dur = 0.7) => {
        const state = { p: 0 };
        let from = { x: 0, y: 0 };
        tl.to(state, {
          p: 1,
          duration: dur,
          ease: "power2.inOut",
          onStart() {
            state.p = 0;
            from = {
              x: gsap.getProperty(cur, "x") as number,
              y: gsap.getProperty(cur, "y") as number,
            };
          },
          onUpdate() {
            const t = at(sel);
            if (!t) return;
            const k = state.p;
            gsap.set(cur, {
              x: from.x + (t.x - from.x) * k,
              y: from.y + (t.y - from.y) * k,
            });
          },
        });
      };

      const press = (tl: gsap.core.Timeline) =>
        tl.to(cur, { scale: 0.7, duration: 0.1 }).to(cur, { scale: 1, duration: 0.18 });

      /* Two timelines. The numbers settle once — replaying them would read as
         the figure breaking and recovering over and over — and the pointer
         demonstration loops for as long as the panel is on screen. */
      const intro = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
      const loop = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1.1,
        defaults: { overwrite: "auto" },
        /* re-resolve every coordinate on each pass, so a resize between loops
           does not leave the pointer aiming at where a control used to be */
        onRepeat() {
          this.invalidate();
        },
      });

      intro
        .set(cur, {
          x: () => at("view-0")?.x ?? 60,
          y: () => at("view-0")?.y ?? 60,
          autoAlpha: 0,
        })
        .to(cur, { autoAlpha: 1, duration: 0.3 }, 0.4);
      const run = intro;

      // numbers settle first
      /* Settle from a nearby figure rather than snapping to zero first: the
         server already rendered the real number, so counting up from 0 read as
         the value breaking before it recovered. */
      const rate = { v: 92.7 };
      run.to(rate, {
        v: 96.4,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => setRateText(rate.v.toFixed(1) + "%"),
      }, 0.4);
      const enr = { v: 601 };
      run.to(enr, {
        v: 648,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => setEnrolled(fmt(Math.round(enr.v))),
      }, 0.5);

      // type into search
      moveTo(loop, "search", 0.8);
      const q = t.searchQuery;
      loop.to({}, {
        duration: 0.9,
        onUpdate() {
          setTyped(q.slice(0, Math.ceil(this.progress() * q.length)));
        },
      });
      loop.to({}, { duration: 0.5 });
      loop.call(() => setTyped(""));

      // walk through the screens, pausing on each
      const visit = (i: number, hold = 1.1) => {
        moveTo(loop, `view-${i}`, 0.75);
        press(loop);
        loop.call(() => setView(i));
        loop.to({}, { duration: hold });
      };

      visit(1);            // Enrolment
      visit(3);            // Transport
      visit(2, 0.5);       // Courses — then open the menu on it
      /* the button only exists once the Courses screen is on, so let the layout
         settle for a beat before aiming at it */
      loop.to({}, { duration: 0.15 });
      moveTo(loop, "add", 0.8);
      press(loop);
      loop.call(() => setMenu(true));
      loop.to({}, { duration: 1.6 });
      loop.call(() => setMenu(false));

      visit(0, 0.9);       // back to Attendance, ready to run again

      /* hand over to the looping half the moment the numbers have settled */
      intro.eventCallback("onComplete", () => loop.play(0));

      /* dev-only, like the preloader's: the demonstration runs on a wall clock
         that a remote inspector cannot keep up with, so let it be scrubbed */
      if (process.env.NODE_ENV !== "production") {
        const w = window as unknown as Record<string, unknown>;
        w.__dbLoop = loop;
        w.__dbIntro = intro;
      }

      gsap.from(root.current, {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.out,
        scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
      });
      gsap.from(".db-bar", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.7,
        stagger: 0.008,
        ease: EASE.out,
        scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
      });

      /* An observer, not a ScrollTrigger: a trigger created while the browser was
         still restoring a deep scroll position never reports the change it
         missed, so the demonstration sat frozen. This reports the current state
         the moment it starts watching, and suspends the loop off screen so it
         is not burning frames in the background. */
      const io = new IntersectionObserver(
        ([entry]) => {
          /* Suspended only when the panel is completely off screen. An earlier
             version paused at a quarter visible, and a reflow as the demo
             switched screens briefly crossed that line and stranded the run
             half way through — hence zero, and resume rather than restart. */
          if (entry.intersectionRatio === 0) {
            loop.pause();
            return;
          }
          if (intro.progress() === 0 && !intro.isActive()) intro.play();
          else if (intro.progress() === 1 && !loop.isActive()) loop.play();
        },
        { threshold: [0, 0.2] },
      );
      io.observe(el);

      return () => {
        io.disconnect();
        loop.kill();
        intro.kill();
      };
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-2xl border border-line bg-paper
        shadow-[0_28px_64px_-24px_rgba(10,20,30,0.16),0_2px_8px_rgba(10,20,30,0.05)]"
    >
      <span
        className="db-cursor pointer-events-none absolute left-0 top-0 z-30 hidden size-[18px] -translate-x-1/2
          -translate-y-1/2 rounded-full border-2 border-ink bg-paper/70 opacity-0 shadow-sm md:block"
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] lg:grid-cols-[230px_1fr]">
        {/* ---------------- sidebar ---------------- */}
        <aside className="border-b border-line bg-off md:flex md:h-full md:flex-col md:border-b-0 md:border-e">
          <div className="flex items-center gap-2.5 border-b border-line px-4 py-3.5">
            <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.svg`} alt="" width={63} height={18} aria-hidden="true" />
            <span className="flex-1 truncate text-[13px] font-semibold">{t.org}</span>
            <ChevronDown size={13} className="text-ink-45" aria-hidden="true" />
          </div>

          {/* horizontal chips on phones, a real sidebar from md up */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto p-3 md:block md:space-y-0.5 md:p-2.5">
            <p className="mono-label hidden px-2 pb-2 pt-3 md:block">{t.manage}</p>
            {NAV.map((n, i) => {
              const Icon = n.icon;
              const on = nav === i;
              return (
                <button
                  key={n.label}
                  type="button"
                  onClick={() => setNav(i)}
                  aria-pressed={on}
                  className={`flex min-h-[40px] shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors
                    md:min-h-0 md:w-full ${on ? "bg-paper font-semibold text-blue-ink shadow-[0_1px_0_rgba(10,20,30,.04)] ring-1 ring-line" : "text-ink-70 hover:bg-paper/70"}`}
                >
                  <Icon size={15} strokeWidth={1.6} className={on ? "text-blue-ink" : "text-ink-45"} aria-hidden="true" />
                  <span className="whitespace-nowrap md:flex-1 md:text-start">{n.label}</span>
                  {n.badge && (
                    <span className="rounded bg-blue px-1.5 py-0.5 font-mono text-[9px] text-ink">{n.badge}</span>
                  )}
                </button>
              );
            })}

            <p className="mono-label hidden px-2 pb-2 pt-4 md:block">{t.teachingTools}</p>
            {TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  type="button"
                  className="flex min-h-[40px] shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2
                    text-[13px] text-ink-70 transition-colors hover:bg-paper/70 md:min-h-0 md:w-full"
                >
                  <Icon size={15} strokeWidth={1.6} className="text-ink-45" aria-hidden="true" />
                  <span className="whitespace-nowrap md:flex-1 md:text-start">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* pushed to the foot of the sidebar rather than trailing the nav */}
          <div className="mt-auto hidden items-center gap-2.5 border-t border-line px-4 py-3.5 md:flex">
            <span className="flex size-7 items-center justify-center rounded-full bg-blue-bg text-[9px] font-semibold text-blue-ink">
              {t.user.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-medium">{t.user.name}</span>
              <span className="block text-[10.5px] text-ink-45">{t.user.role}</span>
            </span>
          </div>
        </aside>

        {/* ---------------- main ---------------- */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="flex min-w-0 items-baseline gap-2 truncate">
              <span className="text-[13px] font-semibold">{VIEWS[view]}</span>
              <span className="truncate font-mono text-[10.5px] text-ink-45">{t.crumb}</span>
            </p>
            <span className="flex shrink-0 items-center gap-2">
              <span
                data-demo="search"
                className="hidden items-center gap-2 rounded-lg border border-line bg-off px-2.5 py-1.5 sm:flex"
              >
                <Search size={13} className="text-ink-45" aria-hidden="true" />
                <span className="font-mono text-[11px] text-ink-25">
                  {typed || t.search}
                  {typed && <span className="db-caret ms-px inline-block w-px bg-ink align-middle" style={{ height: "1em" }} />}
                </span>
              </span>
              <Bell size={15} className="text-ink-45" aria-hidden="true" />
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
            <div className="no-scrollbar flex gap-4 overflow-x-auto">
              {VIEWS.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(i)}
                  aria-pressed={view === i}
                  data-demo={`view-${i}`}
                  className="flex min-h-[40px] shrink-0 items-center gap-2 py-1 text-[12.5px] transition-colors sm:min-h-0"
                >
                  <span
                    className={`size-2 rounded-full border transition-colors ${
                      view === i ? "border-blue bg-blue" : "border-ink-25"
                    }`}
                  />
                  <span className={view === i ? "font-semibold" : "text-ink-45"}>{v}</span>
                </button>
              ))}
            </div>
            <div className="hidden shrink-0 rounded-lg border border-line bg-off p-0.5 sm:flex">
              {PERIODS.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(i)}
                  aria-pressed={period === i}
                  className={`rounded-md px-3 py-1.5 text-[11.5px] transition-colors ${
                    period === i ? "border border-line bg-paper font-semibold" : "text-ink-45"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px]">
            <div ref={pane} className="min-w-0 p-4 sm:p-5">
              {view === 0 && (
                <>
                  <p className="mono-label">{t.attendance.label}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="tabular font-display text-[clamp(32px,5vw,46px)] font-extrabold leading-none tracking-[-0.04em]">
                      {rateText}
                    </span>
                    <span className="rounded bg-blue-bg px-2 py-1 font-mono text-[10px] text-blue-ink">
                      {t.attendance.delta}
                    </span>
                  </p>
                  <p className="mt-2 font-mono text-[10.5px] text-ink-45">
                    {t.attendance.meta}
                  </p>
                  <div className="mt-5 flex h-[clamp(96px,15vw,160px)] items-end gap-[3px]">
                    {SERIES.map((v, i) => (
                      <span
                        key={i}
                        className="db-bar min-w-[2px] flex-1 rounded-t-sm"
                        style={{
                          height: `${((v - 84) / 16) * 100}%`,
                          background: i >= SERIES.length - 8 ? "var(--color-ink)" : "#DCDCDC",
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[9px] text-ink-25">
                    {["W01", "W03", "W05", "W07", "W09", "W12"].map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </>
              )}

              {view === 1 && (
                <>
                  <p className="mono-label">{t.enrolment.label}</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-3">
                    <span className="tabular font-display text-[clamp(32px,5vw,46px)] font-extrabold leading-none tracking-[-0.04em]">
                      {enrolled}
                    </span>
                    <span className="text-[12.5px] text-ink-45">{t.enrolment.of}</span>
                  </p>
                  <ul className="mt-5 space-y-3.5">
                    {FUNNEL.map((f) => (
                      <li key={f.label}>
                        <span className="flex items-baseline justify-between text-[12.5px]">
                          <span className={f.done ? "font-semibold" : "text-ink-70"}>{f.label}</span>
                          <span className="font-mono">{f.value}</span>
                        </span>
                        <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line-2">
                          <span
                            className="block h-full rounded-full transition-[width] duration-700"
                            style={{ width: `${f.pct}%`, background: f.done ? "var(--color-blue)" : "#CFCFCF" }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 flex items-center gap-2.5 rounded-lg bg-blue-bg px-3 py-2.5 text-[12.5px]">
                    <span className="rounded bg-blue px-1.5 py-0.5 font-mono text-[9px] text-ink">12</span>
                    {t.enrolment.waiting}
                  </p>
                </>
              )}

              {view === 3 && (
                <>
                  <p className="mono-label">{t.transport.label}</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-3">
                    <span className="tabular font-display text-[clamp(32px,5vw,46px)] font-extrabold leading-none tracking-[-0.04em]">
                      22
                    </span>
                    <span className="text-[12.5px] text-ink-45">{t.transport.unit}</span>
                  </p>
                  <ul className="mt-5 space-y-2">
                    {BUSES.map((b, i) => (
                      <li key={b.id} className="rounded-lg border border-line px-3 py-2.5">
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-[12.5px] font-medium">
                            {b.id} · {b.route}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] ${
                              !b.arrived ? "bg-blue-bg text-blue-ink" : "bg-line-2 text-ink-45"
                            }`}
                          >
                            {b.status}
                          </span>
                        </span>
                        <span className="mt-2 flex items-center gap-2.5">
                          <span className="h-1 flex-1 overflow-hidden rounded-full bg-line-2">
                            <span
                              className="block h-full rounded-full bg-blue"
                              style={{ width: `${[86, 100, 62][i]}%` }}
                            />
                          </span>
                          <span className="font-mono text-[10px] text-ink-45">{b.cap}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {view === 4 && (
                <>
                  <p className="mono-label">{t.grades.label}</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-3">
                    <span className="tabular font-display text-[clamp(32px,5vw,46px)] font-extrabold leading-none tracking-[-0.04em]">
                      412
                    </span>
                    <span className="text-[12.5px] text-ink-45">{t.grades.unit}</span>
                  </p>
                  <ul className="mt-5">
                    {[
                      [t.grades.rows[0], "89", t.grades.published],
                      [t.grades.rows[1], "95", t.grades.published],
                      [t.grades.rows[2], "71", t.grades.draft],
                      [t.grades.rows[3], "98", t.grades.published],
                    ].map(([n, g, st]) => (
                      <li key={n} className="flex items-center gap-3 border-b border-line-2 py-2.5 last:border-0">
                        <span className="min-w-0 flex-1 truncate text-[12.5px]">{n}</span>
                        <span className="font-mono text-[12.5px]">{g}</span>
                        <span
                          className={`w-20 shrink-0 text-end font-mono text-[9.5px] ${
                            st === t.grades.published ? "text-blue-ink" : "text-ink-25"
                          }`}
                        >
                          {st}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* courses: its own screen, and also kept under Attendance */}
              {(view === 0 || view === 2) && (
                <div
                  className={`relative ${
                    view === 0 ? "mt-6 hidden border-t border-line pt-4 sm:block" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex min-w-0 items-baseline gap-2 truncate">
                      <span className="text-[13px] font-semibold">{t.courses.title}</span>
                      <span className="truncate font-mono text-[9.5px] text-ink-25">
                        {t.courses.meta}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setMenu((m) => !m)}
                      aria-expanded={menu}
                      data-demo="add"
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[12px]
                        font-semibold text-paper transition-transform active:scale-95"
                    >
                      <Plus size={13} aria-hidden="true" /> {t.courses.add}
                    </button>
                  </div>

                  <ul className="mt-2">
                    {(view === 2 ? COURSES.concat(EXTRA_COURSES) : COURSES).map((c) => (
                      <li key={c.name} className="flex items-center gap-4 border-b border-line-2 py-2.5 last:border-0">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-medium">{c.name}</span>
                          <span className="block truncate text-[10.5px] text-ink-45">{c.teacher}</span>
                        </span>
                        <span className="hidden h-1 w-24 shrink-0 overflow-hidden rounded-full bg-line-2 sm:block">
                          <span className="block h-full rounded-full bg-blue" style={{ width: `${c.pct}%` }} />
                        </span>
                        <span className="w-9 shrink-0 text-end font-mono text-[10.5px]">{c.pct}%</span>
                        <span className="hidden w-20 shrink-0 text-end font-mono text-[9.5px] text-ink-45 sm:block">
                          {c.students} {t.courses.students}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {menu && (
                    <div
                      className="db-menu absolute end-0 top-12 z-10 w-[250px] overflow-hidden rounded-xl border
                        border-line bg-paper py-1.5 shadow-[0_12px_30px_-8px_rgba(10,20,30,0.18)]"
                    >
                      <p className="mono-label px-3 py-1.5">{t.courses.menuTitle}</p>
                      {[
                        { label: t.courses.menu[0], icon: Library, meta: "142", on: true },
                        { label: t.courses.menu[1], icon: Copy, meta: undefined },
                        { label: t.courses.menu[2], icon: Upload, meta: undefined },
                      ].map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.label}
                            type="button"
                            onClick={() => setMenu(false)}
                            className={`flex w-full items-center gap-2.5 px-3 py-2 text-[12.5px] transition-colors
                              ${m.on ? "bg-blue-bg font-semibold" : "hover:bg-off"}`}
                          >
                            <Icon size={14} className={m.on ? "text-blue-ink" : "text-ink-45"} aria-hidden="true" />
                            <span className="flex-1 text-start">{m.label}</span>
                            {m.meta && <span className="font-mono text-[9.5px] text-blue-ink">{m.meta}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ---------------- right rail ---------------- */}
            {/* two columns on a phone: stacked, the rail alone ran most of a
                screen for what is meant to be a glance */}
            <div className="grid grid-cols-2 gap-x-5 border-t border-line bg-off p-4 sm:p-5 lg:grid-cols-1 lg:border-s lg:border-t-0">
              <div>
              <div className="flex items-baseline justify-between">
                <p className="text-[12.5px] font-semibold">{t.enrolment.title}</p>
                <p className="mono-label">{t.enrolment.term}</p>
              </div>
              <p className="mt-1.5 flex items-baseline gap-2">
                <span className="tabular font-display text-[30px] font-extrabold leading-none tracking-[-0.04em]">
                  {enrolled}
                </span>
                <span className="text-[11.5px] text-ink-45">{t.enrolment.ofApplied}</span>
              </p>
              <ul className="mt-3.5 space-y-2.5">
                {FUNNEL.map((f) => (
                  <li key={f.label}>
                    <span className="flex items-baseline justify-between text-[11.5px]">
                      <span className={f.done ? "font-medium" : "text-ink-45"}>{f.label}</span>
                      <span className="font-mono">{f.value}</span>
                    </span>
                    <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-line-2">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${f.pct}%`, background: f.done ? "var(--color-blue)" : "#CFCFCF" }}
                      />
                    </span>
                  </li>
                ))}
              </ul>

              </div>
              <div className="border-s border-line ps-5 lg:mt-6 lg:border-s-0 lg:ps-0 lg:pt-4">
              <div className="flex items-center justify-between lg:border-t lg:border-line lg:pt-4">
                <p className="text-[12.5px] font-semibold">{t.transport.title}</p>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-blue" aria-hidden="true" />
                  <span className="mono-label text-blue-ink">{t.transport.live}</span>
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {BUSES.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11.5px] font-medium">
                        {b.id} · {b.cap}
                      </span>
                      <span className="block truncate text-[10px] text-ink-45">{b.route}</span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 font-mono text-[9px] ${
                        !b.arrived ? "bg-blue-bg text-blue-ink" : "bg-line-2 text-ink-45"
                      }`}
                    >
                      {b.status}
                    </span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
