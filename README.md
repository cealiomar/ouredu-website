<div align="center">

<img src="public/logo.svg" alt="OurEdu" height="40">

### Every system your institution runs — built by one company

Marketing site for **Taaleemna Investment (تعليمنا)**, the Saudi company behind
thirteen education systems. English and Arabic, one codebase.

</div>

---

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000> for English, <http://localhost:3000/ar> for Arabic.

```bash
npm run build      # production build
npx tsc --noEmit   # type check
```

Node 20+. No environment variables, no database, no API keys — every page is
statically rendered.

## What this is

Thirteen products, sold separately, grouped into four. The site's argument is
that they come from one company and the ones serving the same institution share
its data — so instead of a feature list it shows the things a person actually
receives: a bus route sheet, an enrolment record, a training certificate, a
lesson plan.

**Art direction:** three colours — white, black, `#00ACED`. No photography.
Every product surface on the page is drawn as a wireframe.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3

## Documentation

Full documentation lives in [`handoff/`](handoff/):

| | |
|---|---|
| [ARCHITECTURE](handoff/ARCHITECTURE.md) | Code layout, the two routes, how copy is typed |
| [DESIGN-SYSTEM](handoff/DESIGN-SYSTEM.md) | Colour, type, the one spacing scale |
| [MOTION](handoff/MOTION.md) | Every animation and the traps found building them |
| [RTL](handoff/RTL.md) | What Arabic needed beyond translation |
| [CONTENT-NEEDED](handoff/CONTENT-NEEDED.md) | **What is still placeholder** |
| [TESTING](handoff/TESTING.md) | How this was verified, and what was not |

## Structure

```
app/
  (en)/page.tsx          /      English, dir="ltr"
  (ar)/ar/page.tsx       /ar    Arabic,  dir="rtl"
  globals.css            design tokens and the shared layout rules
components/
  sections/              one file per section of the page
  product/Dashboard.tsx  the product surface, with a scripted self-demo
  motion/primitives.tsx  GSAP setup and shared reveal helpers
lib/
  content.en.ts          source of truth for the shape of all copy
  content.ar.ts          must satisfy the same type, or the build fails
```

## Before shipping

Read [`handoff/CONTENT-NEEDED.md`](handoff/CONTENT-NEEDED.md). Several claims on
the page — hosting location, backup targets, customer results — are placeholders
awaiting facts from the client, and the headline figures should be confirmed as
current.
