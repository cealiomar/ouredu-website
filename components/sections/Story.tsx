"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE, prefersReducedMotion, Lines, FadeUp } from "@/components/motion/primitives";
import { Kicker } from "@/components/ui";
import { useCopy } from "@/lib/copy";

export function Story() {
  const { story } = useCopy();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".story-mark", {
        y: 16,
        autoAlpha: 0,
        duration: 0.6,
        ease: EASE.out,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
      gsap.from(".story-rule", {
        scaleY: 0,
        duration: 0.8,
        ease: EASE.inOut,
        transformOrigin: "top",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section ref={root} id="story" className="rule-b" aria-labelledby="story-heading">
      <div className="shell section-y">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Kicker>{story.kicker}</Kicker>
          <p className="mono-label text-ink-25">{story.meta}</p>
        </div>

        {/* the quote itself — marked as a quotation, with a rule that draws in */}
        <figure className="mt-12 flex gap-6 sm:gap-10">
          <div className="flex shrink-0 flex-col items-center">
            {/* a typographic mark set in the display face — the filled icon read
                as clip-art next to type this large */}
            <span
              className="story-mark select-none font-display text-[clamp(46px,6vw,76px)] font-extrabold
                leading-[0.6] text-ink-25"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <span className="story-rule mt-6 w-px flex-1 bg-line" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <Lines
              id="story-heading"
              as="blockquote"
              lines={[
                <>
                  {story.quoteLead}
                  <span className="text-ink-45">{story.quoteRest}</span>
                </>,
              ]}
              className="max-w-[980px] font-display text-[clamp(23px,3.1vw,36px)] font-extrabold
                leading-[1.3] tracking-[-0.025em]"
            />

            <FadeUp delay={0.1}>
              <figcaption className="mt-9 flex items-center gap-4">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border
                    border-line bg-off text-[11.5px] font-semibold text-ink-70"
                  aria-hidden="true"
                >
                  {story.initials}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold">{story.author}</span>
                  <span className="block text-[13px] text-ink-45">{story.role}</span>
                </span>
              </figcaption>
            </FadeUp>
          </div>
        </figure>

        <div className="mt-16 grid grid-cols-1 rule-t md:grid-cols-2">
          {story.voices.map((v, i) => (
            <FadeUp
              key={v.name}
              delay={0.05 * i}
              className={`pt-9 ${
                i === 0 ? "md:pe-12" : "border-t border-line pt-9 md:border-s md:border-t-0 md:ps-12"
              }`}
            >
              <figure className="border-s-2 border-line ps-5">
                <blockquote className="text-[16px] leading-[1.7] text-ink-70">{v.quote}</blockquote>
                <figcaption className="mt-5">
                  <span className="block text-[13.5px] font-semibold">{v.name}</span>
                  <span className="mono-label mt-1 block">{v.role}</span>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
