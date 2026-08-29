# Arabic (RTL)

`/ar` is not a translation of `/`. It is the same tree with `dir="rtl"`, and
several things had to be taught to mirror.

## What logical CSS handles for free

`ps-` / `pe-`, `border-s` / `border-e`, `start-0`, `insetInlineStart`. Use these
everywhere. A physical `left`, `ml-`, `pl-` is a bug that will only show up on
the Arabic page.

## What it does not handle

**Animation direction.** Anything that moves horizontally has to be told which
way "forward" is:

- The logo marquee travelled `xPercent: -50` — in Arabic the row is laid out
  from the far edge, so the logos marched off screen and left the band empty.
- The systems rail travelled the wrong way and the cards ended up at `-6191`,
  entirely off screen.
- The nav marker is pinned to the inline start, which is the *right* edge in
  Arabic — so moving to a later link is a **negative** translate, not the mirror
  of the Latin number.

```js
const rtl = document.documentElement.dir === "rtl";
```

**`transform-origin`.** A progress line grows from where the sequence starts.
`origin-left` is physical, so in Arabic the record rail's fill grew *away* from
stage 01. Handled in `globals.css`:

```css
[dir="rtl"] .rail-fill-h,
[dir="rtl"] .pre-bar-fill { transform-origin: right center; }
```

**`translate-x` for centring.** Centring something positioned with a logical
offset needs the shift mirrored too, or it sits half its own width off. Use
`.pin-inline` / `.pin-inline-mid` from `globals.css`, not `-translate-x-1/2`.

**`clip-path`.** The comparison wipe is physical while its divider is logical —
left alone the two came apart, the wipe cutting from one side while the handle
sat on the other. Both the clip and the pointer maths are direction-aware.

## Bidirectional text

A Latin or numeric run inside an Arabic page gets reordered by the bidi
algorithm. `01 / 04` printed as `04 / 01`; a phone number came out
`5XX XXX XXX 966+`; a date reversed. Wrap those in `.ltr-run`:

```css
.ltr-run { direction: ltr; unicode-bidi: isolate; }
```

Applied to: both section counters, phone numbers, dates, the certificate code.
Do not apply it to anything containing Arabic words — it will force them LTR.

## Directional icons

`.icon-dir` flips an arrow in RTL. Logos and numerals never flip.
