# Motion

GSAP 3 with ScrollTrigger. Every effect is registered through
`components/motion/primitives.tsx`, which also exposes `EASE`, `Lines`,
`FadeUp`, `Counter` and `scrollToY`.

**Reduced motion is honoured in every single effect.** The first line of each
motion block checks it and applies the finished state instead.

## What moves, and what drives it

| Section | Behaviour | Driver |
|---|---|---|
| Preloader | Mark assembles blade by blade, holds, then a curtain wipe | one-shot timeline, 6.6s |
| Nav | Full-width bar becomes a floating pill | scroll threshold, 0.42s tween |
| Nav marker | Pill slides to the current link | scroll spy |
| Hero | Lines reveal from masks | on load |
| Record rail | Record fills through five stages | **plays on entry**, not scrubbed |
| Dashboard | Scripted self-demo, loops | timeline, paused off screen |
| Numbers | Odometer digits roll into place | on entry |
| Logos | Continuous marquee, slows on hover | infinite tween |
| Comparison | Drag to wipe between two states | pointer |
| Systems | Horizontal rail, held while it travels | pinned scrub |
| Outputs | Panels hand over vertically | pinned scrub |
| Security | Wireframes trace themselves in | on entry |

## Rules learned the hard way

**A pinned section must fill the screen it holds.** The record rail was 416px
tall and pinned for 612px of scroll — two thirds of the viewport sat empty for
the whole hold. It is no longer pinned at all.

**Do not scrub a section near the top of the page.** The record rail's scrub
range came out at `-195 → 429`: it began at a scroll position that cannot be
reached, so it was part-played before the page could be scrolled and only
finished if you kept going. It plays itself through on entry instead.

**Never animate a property that changes document height.** The nav's float used
to animate `padding-top` on the header. That grew the document by 14px, and
every pinned section below had cached its start against the old height — so
crossing the threshold made the systems rail jump and correct itself. It
animates `y` now, and the header height is fixed.

**Resolve a pointer's target every frame, not once.** The dashboard demo aimed
at a control when its tween began; if React had not yet committed the screen
change behind it, it aimed at where the button used to be and pressed a hundred
pixels of empty panel. It now eases toward a target read fresh each frame.

**`useGSAP` with a scope reverts what it created when its dependency changes.**
The nav marker was driven that way and sat on the previous link every time. A
plain effect owns it now.

**`gsap.set` before `gsap.from` on a transform you also set inline.** GSAP reads
the inline transform back as a pixel offset and adds its own on top — the
odometer travelled twice as far and rolled clean past its last row, so the
numbers vanished. `y: 0` explicitly, then `yPercent`.

**Percentage transforms drift when the row height is in `em`.** The odometer
re-seats itself on `document.fonts.ready`, on resize and on animation end,
because the webfont swap changes the row height under it.

## Dev hooks

In development only, three timelines are exposed for scrubbing:

```js
window.__preTl    // preloader
window.__dbLoop   // dashboard demo
window.__gsap / window.__ST
```

They exist because these sequences finish before a remote inspector can attach.
`tl.pause(); tl.seek(t, false)` — the `false` matters, `seek` suppresses
callbacks by default.
