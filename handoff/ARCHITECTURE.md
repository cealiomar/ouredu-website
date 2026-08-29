# Architecture

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, GSAP 3.
Every page is statically rendered — no server data, no API, no database.

## Routes

```
app/(en)/page.tsx    →  /      English, dir="ltr"
app/(ar)/page.tsx    →  /ar    Arabic,  dir="rtl"
```

Both routes render the same component tree. The only difference is which copy
dictionary is provided and which `dir` the document carries.

## Copy

`lib/content.en.ts` is the source of truth for the *shape* of the copy.
`lib/content.ar.ts` must satisfy the same type, so a missing translation is a
build error rather than an English string left sitting on an Arabic page.

```ts
export type Copy = typeof en;              // en is the shape
const DICT: Record<Lang, Copy> = { en, ar }; // ar must match it
```

Components read copy with `useCopy()`. Two server components use `copyFor(lang)`
because they cannot read context.

**Never hard-code a user-visible string in a component.** If it appears on
screen it belongs in both content files.

## Layout

```
components/
  motion/primitives.tsx   gsap + ScrollTrigger + shared reveal helpers
  brand/Mark.tsx          the logo mark, split into individually animatable petals
  sections/               one file per section of the page
  product/Dashboard.tsx   the product surface in the hero region
  ui/ProgressRail.tsx     the one progress pattern, reused three times
  ui.tsx                  Button, Kicker, ArrowRight
  Preloader.tsx           first-load sequence
  Cursor.tsx              the custom pointer
```

`app/page.tsx` is just the running order of sections. Section files own their own
markup, copy binding and motion.

## Conventions that matter

- **Logical CSS properties everywhere.** `ps-`/`pe-`, `border-s`, `start-0`,
  `insetInlineStart`. A physical `left`/`ml-` is a bug waiting for the Arabic page.
- **No user-visible string outside the content files.**
- **`prefers-reduced-motion` is honoured at the top of every motion effect.**
  Reduced motion gets the finished state immediately, never a half-played one.
- **Numbers are formatted with a helper, not `toLocaleString`,** where they are
  rendered on both server and client — the locale differs and the hydration
  mismatch is silent.
