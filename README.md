# Fieldnotes Science

Original study notes, an assessment hub and a free teacher toolkit for
environmental systems, ecology and biology.

Live at <https://fieldnotesscience.pages.dev>.

---

## What this is

A static site. No accounts, no server, no database, no analytics, no cookies.
Every page is prerendered HTML; the four teacher tools run entirely in the
visitor's browser and keep their state in `localStorage`.

## The one hard rule

Everything published here is written from scratch. The site exists partly to
prove that a resource hub can be useful without reproducing another
organisation's material, so the rule is enforced in code rather than trusted to
review.

Two gates run on every build (`npm run guard`):

| Gate | Script | What it stops |
| --- | --- | --- |
| Vocabulary | `scripts/check-ip.mjs` | The awarding body's name and word marks appearing in any identifier — titles, slugs, filenames, meta descriptions, `<h1>`s. Scans `src/` and the built `dist/` HTML. |
| Provenance | `scripts/check-provenance.mjs` | Any content entry whose `provenance.origin` is not `original`. Quarantined material lives in `src/content/_staging/` and is also blocked from being imported by shipped code. |

Referential use of programme names inside body prose, and the required legal
notice, are permitted and deliberately not flagged. See `/disclaimer`.

## Stack

- [Astro](https://astro.build) 7, `output: 'static'`
- MDX content collections with Zod schemas (`src/content.config.ts`)
- Self-hosted variable fonts via `@fontsource-variable` — no third-party requests
- Deployed to Cloudflare Pages, free tier

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # runs the guard, then builds to dist/
npm run check    # astro check (types)
npm run preview  # serve dist/
```

## Structure

```
src/
  components/     Header, Footer, Breadcrumb
  content/
    units/        one .mdx file per unit, discriminated by `subject`
    _staging/     quarantined material — never ships
  data/site.ts    SITE, DISCLAIMER, NAV, SUBJECTS
  layouts/        BaseLayout
  pages/
    ess/          index + [unit]
    biology/      index + [theme]
    assessment/   hub, internal-assessment, extended-essay
    tools/        index, group-picker, lesson-timer, exit-ticket, comment-bank
    about, disclaimer, 404
  styles/         global.css — design tokens
scripts/          the two guard scripts, make-og.ps1
public/           favicon.svg, og.png, robots.txt, _headers
```

### Adding a unit

Create `src/content/units/<code>.mdx`:

```yaml
---
title: Water systems
subject: ess          # ess | biology
code: water           # becomes /ess/water
summary: 20–220 characters.
order: 4
level: sl-hl          # sl-hl | hl-only
status: published     # published | coming-soon
outline:
  - First outline point
provenance:
  origin: original
  author: Fieldnotes Science
---
```

`code` must be lowercase kebab-case. `order` drives display order and, for
biology, the theme letter.

## Deployment

Cloudflare Pages, build command `npm run build`, output directory `dist`,
Node 22. `public/_headers` sets immutable caching for `/_astro/*` and basic
security headers; `public/robots.txt` points at the sitemap.

## Licence

- **Code** (layouts, components, tools): MIT — see `LICENSE`.
- **Written content** (notes, diagrams, question stems): CC BY-NC-SA 4.0.

## Disclaimer

This work has been developed independently from and is not endorsed by the
International Baccalaureate Organization. International Baccalaureate,
Baccalauréat International, Bachillerato Internacional and IB are registered
trademarks owned by the International Baccalaureate Organization.
