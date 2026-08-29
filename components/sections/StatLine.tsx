"use client";

import { Odometer } from "@/components/motion/Odometer";
import { FadeUp } from "@/components/motion/primitives";
import { useCopy } from "@/lib/copy";

export function StatLine() {
  const { stats: STATS, a11y } = useCopy();
  return (
    <section className="rule-b" aria-label={a11y.numbers}>
      <div className="shell section-y-sm">
        {/* two up on a phone — four figures stacked in a column made the section
            a screen tall for four short numbers */}
        <dl className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-4 lg:gap-y-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              /* min-w-0 stops a long number from pushing into the next column */
              className={`min-w-0 ${i === 0 ? "" : "lg:border-s lg:border-line lg:ps-10"} ${
                i % 2 === 1 ? "border-s border-line ps-5 sm:ps-8 lg:ps-10" : ""
              }`}
            >
              <dd className="font-display text-[clamp(34px,9vw,74px)] font-extrabold leading-[0.86] tracking-[-0.045em]">
                <Odometer value={s.display} />
              </dd>
              <FadeUp delay={0.15}>
                <dt className="mono-label mt-4 sm:mt-5">{s.label}</dt>
                <p className="mt-1.5 text-[12.5px] text-ink-25">{s.note}</p>
              </FadeUp>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
