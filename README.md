# Azzuro Resources Website

Marketing and investor-facing website for Azzuro Resources PLC, built on Next.js 14 App Router with bilingual EN/MN routing, markdown-backed content, and a Git-based CMS at `/admin`.

## Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS 3
- next-intl locale routing with `/en` and `/mn`
- Sveltia CMS shell in `public/admin`
- Markdown/YAML content loaders in `lib/content`
- MapLibre GL for projects mapping
- Vitest for loader coverage
- Playwright + axe-core for launch accessibility scans

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs on `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill what you have:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_MAPTILER_KEY`
- `NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID`
- `STOCK_API_PROVIDER`
- `STOCK_API_KEY`
- `STOCK_TICKER_FALLBACK`
- `INVESTOR_FEED_URL`
- `GITHUB_APP_ID`
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`

The site degrades gracefully when `NEXT_PUBLIC_MAPTILER_KEY`, `NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID`, or `INVESTOR_FEED_URL` are missing.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run a11y:scan
```

For bundle analysis, run `ANALYZE=true npm run build`.

## Content Editing

- `/admin` loads the Sveltia CMS shell from `public/admin`
- Collections map directly to `content/` markdown and YAML files
- Each save commits back to the repo and triggers a Vercel deploy once the GitHub App is configured

Current launch-state note: the schema in `public/admin/config.yml` is aligned to the current page, project, governance, gallery, team, partner, and settings content models, but GitHub App credentials still need to be entered during environment setup.

## Project Structure

```text
app/                App Router routes, metadata routes, API routes
components/         Page sections and reusable UI
content/            CMS-managed markdown and YAML source files
docs/               Specs, plans, launch docs, editor/client guides
lib/                Content loaders, i18n, SEO, maps, stock/news fetchers
messages/           Locale message bundles
public/             Static assets and Sveltia admin shell
scripts/            Launch and maintenance scripts
src.legacy/         Archived pre-migration reference app
```

## Deployment

Vercel is the intended host.

- Framework preset: Next.js
- Build command: `npm run build`
- Output: standard Next.js app
- Production and Preview env vars should match `.env.example`

See `docs/staging.md`, `docs/admin-setup.md`, and `docs/launch-readiness.md` for launch workflow notes.

## Contribution Flow

1. Make changes in a branch or on `main`, depending on your release workflow.
2. Run `npm run typecheck`, `npm run lint`, and `npm test`.
3. Run `npm run build` for any routing, metadata, or config changes.
4. If you touched major UI surfaces, run `npm run a11y:scan` against a local server.
5. Push to GitHub and verify the Vercel preview.
