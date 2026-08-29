"use client";

import { Lines, FadeUp } from "@/components/motion/primitives";
import { ArrowRight } from "@/components/ui";
import { useCopy } from "@/lib/copy";

export function FinalCTA() {
  const { finalCta, forms } = useCopy();
  return (
    <section id="book" className="rule-b bg-off" aria-labelledby="cta-heading">
      <div className="shell section-y-lg">
        <div className="mx-auto max-w-[920px] text-center">
          <Lines
            id="cta-heading"
            lines={[
              <>
                {finalCta.lead}
                <span className="text-blue-ink">{finalCta.blue}</span>
              </>,
            ]}
            className="font-display text-[clamp(32px,5.2vw,58px)] font-extrabold display-leading tracking-[-0.035em]"
          />

          <FadeUp delay={0.12}>
            <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.68] text-ink-70">
              {finalCta.sub}
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <form
              className="mx-auto mt-10 flex w-full max-w-[500px] items-center gap-2 rounded-xl border
                border-line bg-paper p-1.5 ps-5 transition-colors focus-within:border-ink-25"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="cta-email" className="sr-only">
                {forms.emailLabel}
              </label>
              <input
                id="cta-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={finalCta.placeholder}
                className="h-11 min-w-0 flex-1 bg-transparent font-mono text-[13.5px] text-ink
                  placeholder:text-ink-25 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-blue px-5 text-[14px]
                  font-semibold text-ink transition-[filter] duration-150 hover:brightness-[1.06]"
              >
                {finalCta.cta}
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="mt-6 flex items-center justify-center gap-2.5 text-[13px] text-ink-45">
              {finalCta.alt}
              <a
                href={`tel:${finalCta.phone.replace(/\s/g, "")}`}
                className="font-mono tracking-[0.04em] text-ink transition-colors hover:text-blue-ink"
              >
                <span className="ltr-run">{finalCta.phone}</span>
              </a>
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
