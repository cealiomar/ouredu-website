# Design system

Defined once in `app/globals.css` under `@theme`. Nothing outside that block
should introduce a colour, a font or a spacing step.

## Colour — three, and shades of them

| Token | Value | Use |
|---|---|---|
| `paper` | `#ffffff` | base surface |
| `off` | `#fafafa` | second surface |
| `tint` | `#f4fbfe` | third surface, so neighbouring sections never blend |
| `ink` | `#0a0a0a` | text, and the dark panels |
| `ink-70 / 45 / 25` | `#575757 / #8c8c8c / #c4c4c4` | descending text weight |
| `line / line-2` | `#e4e4e4 / #f0f0f0` | hairlines |
| `blue` | `#00aced` | **fills only** |
| `blue-ink` | `#0077a8` | **any blue text** |
| `blue-bg` | `#eaf8fe` | blue tint backgrounds |

`#00ACED` on white is **2.3:1** — it fails WCAG for text. That is why
`blue-ink` exists at 4.6:1. Blue text anywhere on the page uses `blue-ink`;
`blue` is for a fill, a rule or a dot.

## Type

| Role | Family | Notes |
|---|---|---|
| Display | Alexandria ExtraBold / Bold | headlines and figures; supports Arabic |
| Body | IBM Plex Sans | Arabic falls back to IBM Plex Sans Arabic |
| Mono labels | IBM Plex Mono Medium | uppercase, `0.16em` tracking, 9–10px |

All four are self-hosted at build time by `next/font/google` — no runtime request
to Google, which is slow from the Gulf.

## Spacing — one scale

Every section uses one of three, and nothing else:

```css
.section-y      padding-block: clamp(64px, 9vw, 128px)   /* a chapter */
.section-y-sm   padding-block: clamp(44px, 6vw, 80px)    /* a band */
.section-y-lg   padding-block: clamp(76px, 11vw, 160px)  /* the closing statement */
.head-gap       margin-block-start: clamp(36px, 5.5vw, 76px)
```

Before this existed, nine different clamps were in use and the gaps between
sections read as accidental. **Do not add a tenth.**

## Section header pattern

Five sections share it, and they share it exactly:

```
left column  740px   kicker (blue rule + mono label) → 22px → headline
right column 420px   intro paragraph, 16.5px
```

## Held sections

`.stage-screen` / `.stage-frame` / `.stage-panel` in `globals.css` implement the
two full-screen held sections (the systems rail, the outputs frame). They hold
**only** at `min-width: 1024px and min-height: 800px`. Below that the section
lays out down the page and its tabs do the navigating — a held section on a short
screen cropped its own content.

Padding for those sections lives in the CSS, not as utilities on the element:
Tailwind utilities outrank the component layer, and a padding class on the same
node silently beat the held-state padding.
