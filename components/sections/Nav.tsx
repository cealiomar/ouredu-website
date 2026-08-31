"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { gsap, useGSAP, scrollToY } from "@/components/motion/primitives";
import { Button } from "@/components/ui";
import { useCopy } from "@/lib/copy";
import { withBasePath } from "@/lib/paths";

export function Nav() {
  const { nav, chrome, navUI } = useCopy();
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  /* -1 = above every section, so nothing is marked as "here" in the hero */
  const [active, setActive] = useState(-1);

  const links = nav.links;

  /* The pill slides to whichever link is current rather than each link
     switching colour on its own — one moving object is easier to follow than
     five that blink. */
  const movePill = useCallback((i: number, animate = true) => {
    const bar = pill.current;
    const ul = list.current;
    if (!bar || !ul) return;
    /* the marker itself is the list's first child, so indexing children
       directly landed on the link before the one that is current */
    const item = ul.querySelectorAll("li")[i] as HTMLElement | undefined;
    if (i < 0 || !item) {
      gsap.to(bar, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });
      return;
    }
    const box = item.getBoundingClientRect();
    const base = ul.getBoundingClientRect();
    gsap.to(bar, {
      /* The marker is pinned to the inline start, which is the right edge in
         Arabic — so moving to a later link means travelling left, a negative
         translate, not the mirror of the Latin number. */
      x:
        document.documentElement.dir === "rtl"
          ? -(base.right - box.right)
          : box.left - base.left,
      width: box.width,
      autoAlpha: 1,
      duration: animate ? 0.42 : 0,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);



  /* The marker follows the active link and glides between them. Deliberately a
     plain effect rather than a scoped `useGSAP`: that context reverts what it
     created whenever its dependency changes, which put the marker back on the
     previous link every time — it was always one word behind. */
  useEffect(() => {
    movePill(active, true);
  }, [active, movePill]);

  useGSAP(
    () => {
      const el = root.current!;
      const bar = shell.current!;

      /* Leaving the hero the bar becomes a menu, and a menu is tight around
         its own content. Collapsing to a fixed 1000px left it a stretched bar
         with the logo pinned to one edge and the button to the other, which is
         the half-way state that reads as neither one thing nor the other.

         The target width is measured, not guessed, because the Arabic labels
         are not the width of the English ones. */
      const tight = () => {
        /* no menu below lg, so nothing to centre and nothing to narrow around —
           the bar keeps the width it has and only lifts off the edge */
        if (window.innerWidth < 1024) return 1440;
        const zones = [...bar.querySelectorAll<HTMLElement>(":scope > nav > *")];
        if (zones.length < 3) return 720;
        const [logo, menu, actions] = zones.map((n) => n.getBoundingClientRect().width);
        /* A centred menu needs symmetric side tracks, so the narrowest the pill
           can be while keeping the menu on the true centre is twice the wider
           side plus the menu itself — not the sum of the three, which would
           pull the menu off centre the moment the sides differ. */
        return Math.round(2 * Math.max(logo, actions) + menu + 2 * 20 + 2 * 18);
      };

      const float = gsap.timeline({ paused: true, defaults: { duration: 0.42, ease: "power3.inOut" } });
      float
        /* `y`, not padding. Growing the header by 14px pushed the whole
           document down, and every pinned section below had already cached its
           start against the old height — so passing 80px made the systems rail
           jump up and correct itself. A transform changes nothing in layout. */
        .to(bar, { y: 8 }, 0)
        .to(
          bar,
          {
            /* re-measured on every play, so a language switch or a resize does
               not leave the pill sized for the wrong words */
            maxWidth: () => tight(),
            height: 54,
            borderRadius: 999,
            borderColor: "#E6E9EC",
            backgroundColor: "rgba(255,255,255,0.86)",
            boxShadow: "0 12px 34px -14px rgba(10,20,30,0.22)",
          },
          0,
        );

      let floating = false;
      const onScroll = () => {
        const should = window.scrollY > 80;
        if (should === floating) return;
        floating = should;
        should ? float.play() : float.reverse();
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      /* Scroll spy, as one decision rather than a trigger per section: with a
         trigger each, several sections satisfied their range at once and
         whichever fired last won, so the marker sat under the wrong word.
         Here the current section is simply the last one whose top has passed
         the line — there is only ever one answer. */
      const targets = links.map((l) =>
        l.href.startsWith("#") ? (document.querySelector(l.href) as HTMLElement | null) : null,
      );
      const spy = () => {
        const line = window.innerHeight * 0.4;
        let cur = -1;
        targets.forEach((t, i) => {
          if (t && t.getBoundingClientRect().top <= line) cur = i;
        });
        setActive(cur);
      };
      spy();
      window.addEventListener("scroll", spy, { passive: true });

      const onResize = () => {
        spy();
        movePill(active, false);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", spy);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: root, dependencies: [links] },
  );

  const jump = (e: React.MouseEvent, href: string, i: number) => {
    if (!href.startsWith("#")) return;
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    e.preventDefault();

    /* Eased in JS rather than `scroll-behavior: smooth`, which fights the
       scrubbed timelines and the pins further down the page.

       Then corrected: a held section between here and the destination grows
       its spacer as you pass through it, so the distance measured before
       setting off is not the distance that ends up being there. One pass is
       enough — without it a link could land thousands of pixels past its
       section. */
    const offset = () => target.getBoundingClientRect().top - 64;
    scrollToY(window.scrollY + offset(), 0.8);

    let tries = 0;
    const settle = () => {
      const off = offset();
      if (Math.abs(off) < 6 || tries >= 3) return;
      tries += 1;
      scrollToY(window.scrollY + off, 0.3);
      gsap.delayedCall(0.35, settle);
    };
    gsap.delayedCall(0.85, settle);
  };

  return (
    <header
      ref={root}
      /* A fixed height, so the bar inside can shrink and slide without the
         header hugging it and moving the whole document down with it. */
      className="sticky top-0 z-50 h-[68px] px-4 sm:px-5"
    >
      {/* Equal outer tracks, auto middle. With `auto 1fr auto` the menu was
          only centred inside the leftover space, so a 91px logo against 154px
          of actions pushed it 30px off the true centre of the bar. */}
      <div
        ref={shell}
        className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-4
          border border-transparent bg-paper px-4 sm:px-6
          lg:grid lg:grid-cols-[1fr_auto_1fr]"
        /* the blur is constant rather than tweened — animating a backdrop
           filter re-rasterises everything behind the bar on every frame, and
           behind an opaque white bar there is nothing for it to show anyway */
        style={{
          backdropFilter: "blur(16px)",
          willChange: "max-width, height, border-radius, background-color, box-shadow",
        }}
      >
        <nav className="contents" aria-label={navUI.main}>
          <a href={withBasePath(navUI.home)} className="flex shrink-0 items-center justify-self-start" aria-label={chrome.home}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.svg`}
              alt={chrome.logoAlt}
              width={91}
              height={26}
              priority
            />
          </a>

          <ul ref={list} className="relative hidden items-center justify-center gap-0.5 lg:flex">
            {/* the moving marker, behind the labels */}
            <span
              ref={pill}
              aria-hidden="true"
              className="absolute inset-y-[5px] start-0 -z-10 rounded-full bg-off opacity-0"
            />
            {links.map((l, i) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={(e) => jump(e, l.href, i)}
                  aria-current={active === i ? "true" : undefined}
                  className={`block whitespace-nowrap rounded-full px-3.5 py-2 font-mono text-[11.5px]
                    tracking-[0.03em] transition-colors ${
                      active === i ? "text-ink" : "text-ink-70 hover:text-ink"
                    }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center justify-self-end gap-3.5">
            <a
              href={withBasePath(nav.langHref)}
              className="mono-label transition-colors hover:text-ink"
              aria-label={chrome.langSwitch}
            >
              {nav.langLabel}
            </a>
            <span className="hidden h-3.5 w-px bg-line sm:block" aria-hidden="true" />
            <Button size="sm" href="#demo" onClick={(e) => jump(e, "#demo", -1)}>
              {nav.cta}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
