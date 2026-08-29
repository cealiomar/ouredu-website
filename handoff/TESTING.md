# How this was verified

## Commands

```bash
npx tsc --noEmit    # clean
npm run build       # passes, all routes static
```

## Viewports checked

390×844, 414×896, 768×1024, 834×1112, 1024×768, 1280×800, 1366×768,
1440×900, 1920×1080 — in **both** languages.

Checked at each: horizontal overflow, elements crossing a clipping parent, text
shorter than its own content box, tap targets under 40px, and that held sections
neither crop their content nor leave the viewport empty.

## Results carried forward

- No horizontal overflow at any width, either language.
- No cropped panel in the held sections at or above 1024×800; below that they
  are not held, by design.
- Nav: all four links land at 64px from the top; the marker sits on the current
  link in both directions.
- Systems rail: cards 0→1→2→3 against counter 01→04, both languages.
- Outputs: one panel visible at a time through the hand-over.
- Odometer: all four figures land on the exact digit.
- Record rail: fill reaches 100%, five of five stages lit, without further scroll.

## What could NOT be verified, and why

The browser pane used for testing **suspends `requestAnimationFrame`**. Anything
that depends on real animation frames could not be observed running:

- the preloader and dashboard demo were verified by **scrubbing their timelines**
  via the dev hooks, not by watching them play;
- the outputs tab click starts an eased scroll that needs frames — **not
  verified**;
- the comparison drag was verified structurally (`touch-action`, handlers,
  direction maths) but **not by an actual finger**.

Please exercise those three by hand before shipping.

## Known gap

There is no automated test suite. For a static marketing site the build and type
check catch most regressions, but the motion has none — every finding above came
from manual measurement in the browser.
