"use client";

import Image from "next/image";
import { useCopy } from "@/lib/copy";

export function Footer() {
  const { footer, chrome, nav } = useCopy();
  return (
    <footer className="bg-ink text-paper">
      <div className="shell pb-9 pt-[clamp(44px,6vw,80px)]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:pe-12">
            <Image
              src="/logo.svg"
              alt={chrome.logoAlt}
              width={112}
              height={32}
              className="brightness-0 invert"
            />
            <p className="mt-6 max-w-[320px] text-[13.5px] leading-[1.7] text-[#9A9A9A]">{footer.blurb}</p>

            <div
              className="mt-7 inline-flex rounded-lg border border-white/20 p-0.5"
              role="group"
              aria-label={footer.language}
            >
              <span
                aria-current="true"
                className="rounded-md bg-white/15 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em]"
              >
                {footer.currentLanguage}
              </span>
              <a
                href={nav.langHref}
                className="rounded-md px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] text-[#6E6E6E]
                  transition-colors hover:text-paper"
              >
                {footer.alternateLanguage}
              </a>
            </div>
          </div>

          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#6E6E6E]">{col.title}</p>
              <ul className="mt-5 space-y-4">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[13.5px] leading-[1.5] text-[#9A9A9A] transition-colors hover:text-paper"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-7 text-[12.5px]
            sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[#6E6E6E]">{footer.legal}</p>
          <ul className="flex flex-wrap items-center gap-7">
            {footer.legalLinks.map((l) => (
              <li key={l}>
                <a href="#" className="text-[#9A9A9A] transition-colors hover:text-paper">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
