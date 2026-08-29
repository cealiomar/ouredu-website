# OurEdu / تعليمنا — website

Marketing site for Taaleemna Investment, the Saudi company behind thirteen
education systems. English and Arabic, one codebase.

- **English** — `/`
- **Arabic (RTL)** — `/ar`
- **Figma** — <https://figma.com/design/rK25VXvfWUu33R2tKXis8h> · About page at `?node-id=175-2`

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npx tsc --noEmit # type check
```

Node 20+. No environment variables, no database, no API keys — every page is
statically rendered.

## What is in here

| File | What it covers |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the code is laid out and why |
| [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | Colour, type, spacing, the rules that hold it together |
| [MOTION.md](MOTION.md) | Every animation, what drives it, and the traps found along the way |
| [RTL.md](RTL.md) | What Arabic needed beyond translation |
| [CONTENT-NEEDED.md](CONTENT-NEEDED.md) | **Read this** — what is still placeholder and who has to supply it |
| [TESTING.md](TESTING.md) | How this was verified, and what could not be |

## The short version

Thirteen products, sold separately, grouped into four. The site's argument is
that they come from one company and the ones serving the same institution share
its data — so the page shows real outputs (a route sheet, an enrolment record, a
certificate) rather than feature lists.

Art direction is three colours only: white, black, and `#00ACED`. No
photography — every product surface on the page is drawn as a wireframe.
