"use client";

import { Lines, FadeUp } from "@/components/motion/primitives";
import { ArrowRight } from "@/components/ui";
import { useCopy } from "@/lib/copy";

export function Hero() {
  const { hero, forms } = useCopy();
  return (
    <section className="shell pt-[clamp(48px,7vw,88px)]" aria-labelledby="hero-heading">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        {/* headline column */}
        <div className="min-w-0 lg:flex-1">
          <Lines
            as="h1"
            id="hero-heading"
            lines={hero.headline}
            delay={0.05}
            immediate
            className="font-display text-[clamp(34px,5vw,70px)] font-extrabold hero-leading tracking-[-0.035em]"
          />

          <FadeUp delay={0.35} immediate>
            <p className="mono-label mt-7">{hero.tagline}</p>
          </FadeUp>

          <FadeUp delay={0.45} immediate>
            <div className="mt-11">
              <p className="mono-label">{hero.groupsLabel}</p>
              <ul className="mt-4 flex flex-wrap items-center gap-y-3">
                {hero.groups.map((g, i) => (
                  <li
                    key={g.name}
                    className={`flex items-center gap-2.5 py-1 ${
                      i === 0 ? "pe-6" : "border-s border-line px-6"
                    }`}
                  >
                    <span className="text-[13.5px] font-medium">{g.name}</span>
                    <span className="font-mono text-[10px] tracking-[0.14em] text-blue-ink">{g.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>

        {/* intro + lead capture */}
        <FadeUp delay={0.25} immediate className="lg:w-[380px] lg:shrink-0">
          <p className="text-[17px] leading-[1.68] text-ink-70">{hero.intro}</p>

          <p className="mono-label mt-8">{hero.fieldLabel}</p>

          <form
            id="demo"
            className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-paper p-1.5 ps-4
              transition-colors focus-within:border-ink-25"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="hero-email" className="sr-only">
              {forms.emailLabel}
            </label>
            <input
              id="hero-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={hero.fieldPlaceholder}
              className="h-10 min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink
                placeholder:text-ink-25 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-blue px-4 text-[13px]
                font-semibold text-ink transition-[filter] duration-150 hover:brightness-[1.06]"
            >
              {hero.cta}
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="mt-3.5 text-[12.5px] text-ink-45">{hero.note}</p>
        </FadeUp>
      </div>
    </section>
  );
}
