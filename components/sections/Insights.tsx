"use client";

import { Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker, ArrowRight } from "@/components/ui";
import { useCopy, useLang } from "@/lib/copy";

/* Covers are generated from the brand's radial motif rather than stock photos —
   three colours only, and they scale to any size without an asset pipeline. */
function Cover({ kind }: { kind: "arcs" | "dots" | "rays" }) {
  const W = 420;
  const H = 236;

  if (kind === "arcs") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true">
        <rect width={W} height={H} fill="var(--color-off)" />
        {Array.from({ length: 10 }, (_, i) => 70 + i * 34).map((r) => (
          <circle
            key={r}
            cx={210}
            cy={310}
            r={r}
            fill="none"
            stroke={r === 172 || r === 206 ? "var(--color-blue)" : "#E1E4E7"}
            strokeWidth={r === 172 || r === 206 ? 2 : 1}
          />
        ))}
      </svg>
    );
  }

  if (kind === "dots") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true">
        <rect width={W} height={H} fill="var(--color-off)" />
        {Array.from({ length: 13 }).flatMap((_, x) =>
          Array.from({ length: 7 }).map((__, y) => {
            const on = x >= 6 && x <= 9 && y >= 2 && y <= 4 && !(x === 9 && y === 4);
            return (
              <circle
                key={`${x}-${y}`}
                cx={26 + x * 30}
                cy={26 + y * 29}
                r={on ? 4 : 2.6}
                fill={on ? "var(--color-blue)" : "#DCDFE2"}
              />
            );
          }),
        )}
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true">
      <rect width={W} height={H} fill="var(--color-off)" />
      {Array.from({ length: 40 }).map((_, i) => {
        const a = (i / 40) * Math.PI * 2;
        const len = 52 + ((i * 37) % 56);
        const on = i % 9 === 0;
        return (
          <line
            key={i}
            /* rounded so the server and client emit byte-identical markup —
               raw float output differs in the last decimal and breaks hydration */
            x1={+(210 + Math.cos(a) * 30).toFixed(2)}
            y1={+(118 + Math.sin(a) * 30).toFixed(2)}
            x2={+(210 + Math.cos(a) * (30 + len)).toFixed(2)}
            y2={+(118 + Math.sin(a) * (30 + len)).toFixed(2)}
            stroke={on ? "var(--color-blue)" : "#DCDFE2"}
            strokeWidth={on ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={210} cy={118} r={16} fill="var(--color-ink)" />
    </svg>
  );
}

export function Insights() {
  const { insights } = useCopy();
  const lang = useLang();
  const insightsHref = lang === "ar" ? "/ar/insights" : "/insights";
  return (
    <section id="insights" className="rule-b" aria-labelledby="insights-heading">
      <div className="shell section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>{insights.kicker}</Kicker>
            <Lines
              id="insights-heading"
              lines={insights.headline}
              className="mt-5 font-display text-[clamp(30px,4.4vw,50px)] font-extrabold display-leading tracking-[-0.035em]"
            />
          </div>
          <a
            href={insightsHref}
            data-cursor="read"
            className="-my-2 inline-flex min-h-[40px] items-center gap-2 py-2 text-[14px] font-semibold text-blue-ink transition-opacity hover:opacity-70"
          >
            {insights.all}
            <ArrowRight size={14} />
          </a>
        </div>

        <FadeUp stagger={0.08} className="head-gap grid grid-cols-1 gap-8 lg:grid-cols-3">
          {insights.articles.map((a, index) => (
            <article key={a.title} className="group flex flex-col">
              <a href={`${insightsHref}#article-${index + 1}`} className="flex h-full flex-col" data-cursor="read">
                <div className="relative aspect-[420/236] overflow-hidden rounded-xl border border-line">
                  <Cover kind={a.cover} />
                  <span
                    className="absolute start-3.5 top-3.5 rounded border border-line bg-paper px-2.5 py-1
                      font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-70"
                  >
                    {a.category}
                  </span>
                </div>

                <p className="mono-label mt-6">{a.date}</p>
                <h3
                  className="mt-3 text-[19px] font-semibold leading-[1.42] tracking-[-0.014em]
                    transition-colors group-hover:text-blue-ink"
                >
                  {a.title}
                </h3>

                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13.5px] font-medium text-blue-ink">
                  {insights.read}
                  <ArrowRight size={13} />
                </span>
              </a>
            </article>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
