# Azzuro Resources Website

Marketing and investor-facing website for Azzuro Resources PLC (ASX: AZ9, the rebrand of Asian Battery Metals). Next.js 14 App Router, bilingual EN/MN, markdown/YAML content with a Git-based CMS at `/admin`.

## Stack

- Next.js 14 App Router · React 18 · TypeScript
- Tailwind CSS 3
- next-intl locale routing (`/en`, `/mn`)
- Sveltia CMS shell in `public/admin`
- Markdown/YAML content loaders in `lib/content`
- MapLibre GL + MapTiler for maps
- Vitest (loaders) · Playwright + axe-core (a11y)

## Setup (macOS)

Requires **Node 20 LTS** (Next 14 needs ≥18.17). With [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 20 && nvm use 20
npm install
cp .env.example .env.local   # fill in what you have (see below)
npm run dev                  # http://localhost:3000  (redirects to /en)
```

`npm` is the source of truth (`package-lock.json`). A `bun.lockb` exists but stick to npm to match CI.

## Environment

Copy `.env.example` → `.env.local`. The site degrades gracefully when optional keys are missing.

- `NEXT_PUBLIC_MAPTILER_KEY` — **needed for maps to render** (homepage + projects + contact). Without it, maps fall back to a plain style.
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID`
- `STOCK_API_PROVIDER` / `STOCK_API_KEY` / `STOCK_TICKER_FALLBACK`, `INVESTOR_FEED_URL`
- `GITHUB_APP_ID` / `GITHUB_APP_CLIENT_ID` / `GITHUB_APP_CLIENT_SECRET` — for `/admin` auth

## Scripts

```bash
npm run dev         # dev server (port 3000)
npm run build       # production build
npm run start       # serve the build
npm run typecheck   # tsc --noEmit
npm run lint
npm run test        # vitest
npm run a11y:scan   # axe scan against a running local server
```

## Gotchas

- **Clear `.next` before a production build if a dev server was running.** A shared `.next` causes `Cannot find module './vendor-chunks/...'` or `PageNotFoundError`. Fix: `rm -rf .next` then `npm run build`. (Restart `npm run dev` afterward.)
- **Port 3000 in use** → kill the stale process: `lsof -ti:3000 | xargs kill -9`.
- **Images:** `.HEIC` / `.MOV` do **not** render in browsers — convert to JPG/MP4 before use. `next/image` handles resizing, so drop in full-res originals.
- The hero video is self-hosted at `public/uploads/drone/hero_drone.MP4` with `public/videos/hero-720.mp4` as fallback (Cloudflare Stream is deferred; `CloudflareStreamHero.tsx` is kept for a future switch).

## Design system (Swiss / editorial)

Conventions to keep when adding UI:

- **No rounded corners, drop shadows, gradients, or glassmorphism.** Sharp corners, hairline `border-rule` dividers, flat fills.
- Palette is monochrome via CSS variables in `app/globals.css`: `--ink`, `--paper`, `--rule`, `--muted-ink`. The brand accent is the single var `--brand-accent` (provisional navy — client to confirm). ESG has a scoped `--eco` green. **Never hardcode hex/rgb in components** — reference the vars.
- Fonts: **Source Serif 4** display (`font-display`) + **Inter** body, both with Cyrillic. Big tabular numerals use `.num-display` / `.num-tabular`.
- Section rhythm alternates dark (`bg-ink`) ↔ paper (`bg-paper`), full-bleed with `px-6 sm:px-10 lg:px-16` gutters. Pattern: eyebrow → serif headline → body → underlined text CTA.
- Full-bleed page headers sit flush under the fixed navbar via `-mt-24` (navbar is solid ink on inner pages, transparent over the homepage hero).

## Images & media

```
public/uploads/
  hero/ home/ drone/ minerals/ field/ esg/ offices/ team/ team/technical_team/
  projects/<flat hero files>   gallery/photos  gallery/case-studies
```

- The Gallery "Field photography" section **auto-collects every image in `public/uploads/field/`** at build time (4×2 paginated). Drop files in — no code change.
- Team photos use the uniform 300×300 set in `public/uploads/team/technical_team/`.

## Content & CMS

- `/admin` = Sveltia CMS; collections map to `content/**`. Each save commits to the repo and (once the GitHub App is set) triggers a deploy.
- Pages render from markdown frontmatter + body; the body is exposed to components as `markdown` (not `body`).
- **Projects** (`content/projects/*.{en,mn}.md`) carry structured frontmatter: `tenure`, `drill_highlights`, `resource_table`, `exploration_target` / `historical_estimate` (each renders a mandatory JORC cautionary callout), and `is_draft` (shows a "pending Competent Person sign-off" notice). Schema lives in `lib/content/types.ts` and `public/admin/config.yml` — keep those two in sync.
- Project hero files stay flat in `content`/`public/uploads/projects/`; per-project body images go in `gallery_images`.
- MN translations done so far are marked `TODO — client to verify`.

## Project structure

```text
app/[locale]/   routes (home, about, projects, esg, gallery, contact, legal)
components/     home/ layout/ projects/ about/ gallery/ esg/ contact/ shared/
content/        CMS-managed markdown + YAML
lib/            content loaders, i18n, seo, map, stock/news
messages/       locale bundles
public/         static assets + /admin shell + /uploads media
```

## Deployment

Vercel (Next.js preset, `npm run build`). Production + Preview env vars mirror `.env.example`. Production domain: `azzuroresources.com` (the default `*.vercel.app` alias was removed to keep it out of search results). The `/admin` OAuth popup uses `base_url` in `public/admin/config.yml` (`https://azzuroresources.com`); the GitHub OAuth App callback must be registered for `https://azzuroresources.com/api/callback` (+ localhost for dev) — other hostnames will 404 on admin auth.
