"use client";

import { useState } from "react";
import { School, GraduationCap, HeartHandshake, Plus, type LucideIcon } from "lucide-react";
import { Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker, ArrowRight } from "@/components/ui";
import { useCopy } from "@/lib/copy";

const ICONS: LucideIcon[] = [School, GraduationCap, HeartHandshake];

export function WhoItsFor() {
  const { whoItsFor, whoLabels } = useCopy();
  /* Three full cards stacked made this nearly three screens on a phone. There
     they collapse to headings you open one at a time; from md up all three are
     side by side and always open. */
  const [open, setOpen] = useState(0);

  return (
    <section id="who" className="rule-b" aria-labelledby="who-heading">
      <div className="shell section-y">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[740px]">
            <Kicker>{whoItsFor.kicker}</Kicker>
            <Lines
              id="who-heading"
              lines={whoItsFor.headline}
              className="mt-5 font-display text-[clamp(30px,4.4vw,50px)] font-extrabold display-leading tracking-[-0.035em]"
            />
          </div>
          <FadeUp className="lg:w-[400px] lg:shrink-0">
            <p className="text-[16.5px] leading-[1.72] text-ink-70">{whoItsFor.intro}</p>
          </FadeUp>
        </div>

        {/* Pulled out by the same amount the columns are padded in, so all three
            tracks are equal width — and the first column's text still lands on
            the section headline's left edge instead of being inset from it. */}
        <ol className="head-gap grid grid-cols-1 rule-b lg:-mx-9 lg:grid-cols-3">
          {whoItsFor.paths.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={p.index}
                /* every card carries its own top rule, so the grid reads the
                   same at one, two or three columns; the vertical divider is
                   added only where a card actually has a neighbour beside it */
                className="flex flex-col border-t border-line py-7 md:py-9 lg:px-9
                  lg:[&:not(:nth-child(3n+1))]:border-s"
              >
                {/* the heading is the control, so the accordion is reachable
                    from a screen reader's heading list as well as by tab */}
                <h3>
                <button
                  type="button"
                  onClick={() => setOpen((o) => (o === i ? -1 : i))}
                  aria-expanded={open === i}
                  data-cursor="open"
                  className="w-full text-start md:pointer-events-none"
                >
                  <span className="flex items-center justify-between">
                    <Icon size={24} strokeWidth={1.5} className="text-ink" aria-hidden="true" />
                    <span className="flex items-center gap-3">
                      <span className="mono-label text-ink-25">{p.index}</span>
                      <Plus
                        size={16}
                        aria-hidden="true"
                        className={`text-ink-45 transition-transform duration-300 md:hidden ${
                          open === i ? "rotate-45" : ""
                        }`}
                      />
                    </span>
                  </span>

                  <span className="mt-6 block font-display text-[clamp(20px,2.2vw,25px)] font-extrabold leading-[1.24] tracking-[-0.02em]">
                    {p.title.map((t) => (
                      <span key={t} className="block">
                        {t}
                      </span>
                    ))}
                  </span>
                </button>
                </h3>

                {/* flex-1 so `mt-auto` on the link below has something to push
                    against: without it the body hugged its own content and the
                    three "see the systems" links sat at three different heights,
                    one per list length. */}
                <div
                  className={`min-h-0 flex-1 flex-col md:flex ${open === i ? "flex" : "hidden"}`}
                >
                <p className="mono-label mt-9 text-ink-25">{whoLabels.broken}</p>
                <ul className="mt-3.5">
                  {p.pains.map((pain, k) => (
                    <li
                      key={pain}
                      className={`flex gap-3 pt-3 text-[13.5px] leading-[1.68] text-ink-70 ${
                        k < p.pains.length - 1 ? "border-b border-line-2 pb-3" : "pb-0"
                      }`}
                    >
                      <span className="mt-[11px] h-px w-[9px] shrink-0 bg-ink-25" aria-hidden="true" />
                      {pain}
                    </li>
                  ))}
                </ul>

                <p className="mono-label mt-9 text-blue-ink">{whoLabels.fits}</p>
                <ul className="mt-3.5 space-y-3">
                  {p.systems.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-[13.5px] font-medium">
                      <span className="size-[5px] shrink-0 rounded-full bg-blue" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>

                {/* the rule belongs to the column, not to the words — on the
                    link it was only as wide as the label, so three columns gave
                    three different rule lengths */}
                <div className="mt-auto border-t border-line pt-5">
                  <a
                    href="#systems"
                    data-cursor="explore"
                    className="-my-2 inline-flex min-h-[40px] items-center gap-2 py-2 text-[14px]
                      font-semibold transition-colors hover:text-blue-ink"
                  >
                    {whoLabels.see}
                    <ArrowRight size={14} className="icon-dir" />
                  </a>
                </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
