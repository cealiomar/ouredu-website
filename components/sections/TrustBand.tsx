"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/motion/primitives";
import { useCopy } from "@/lib/copy";
import { withBasePath } from "@/lib/paths";

export function TrustBand() {
  const { trust, a11y } = useCopy();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      {
        /* The list is rendered twice, so moving the track by exactly half its
           width loops seamlessly. Right-to-left lays the row out from the far
           edge, so it has to travel the other way or the logos march straight
           off the side and leave the band empty. */
        const rtl = document.documentElement.dir === "rtl";
        const tween = gsap.to(track.current, {
          xPercent: rtl ? 50 : -50,
          duration: 46,
          ease: "none",
          repeat: -1,
        });

        const el = root.current!;
        const slow = () => gsap.to(tween, { timeScale: 0, duration: 0.5 });
        const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.5 });
        el.addEventListener("pointerenter", slow);
        el.addEventListener("pointerleave", resume);

        return () => {
          el.removeEventListener("pointerenter", slow);
          el.removeEventListener("pointerleave", resume);
        };
      }
    },
    { scope: root, dependencies: [] },
  );

  const row = [...trust.logos, ...trust.logos];

  return (
    <section ref={root} className="rule-b bg-tint" aria-label={a11y.logos}>
      <div className="section-y-sm">
        <p className="mono-label mb-9 text-center">{trust.caption}</p>

        {/* edges fade so logos enter and leave rather than being cut */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)",
          }}
        >
          <div ref={track} className="flex w-max items-center gap-16 will-change-transform">
            {row.map((l, i) => (
              <div key={`${l.src}-${i}`} className="relative h-16 w-[132px] shrink-0">
                <Image
                  src={withBasePath(l.src)}
                  alt={i < trust.logos.length ? l.alt : ""}
                  aria-hidden={i >= trust.logos.length}
                  fill
                  sizes="132px"
                  /* greyscale at rest, real colours on hover — a client's brand
                     is never permanently recoloured */
                  className="object-contain opacity-50 grayscale transition duration-300
                    hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
