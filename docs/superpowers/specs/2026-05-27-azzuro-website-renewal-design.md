# Azzuro Resources — Website Renewal Design Spec

**Date:** 2026-05-27
**Client:** Azzuro Resources PLC (formerly Asian Battery Metals PLC)
**Project:** Brand renewal + content-managed rebuild of the corporate marketing site
**Target launch:** 5-8 weeks from kickoff
**Old site:** https://asianbatterymetals.com/
**New domain:** azzororesources.com
**External investor portal:** investors.azzororesources.com (client-managed, not in scope)

---

## 1. Project context

The current site (`asianbatterymetals.com`) is dated and the client is rebranding to "Azzuro Resources PLC" with a green-to-blue color shift and a refreshed information architecture. The current POC in this repo (`src/`) was built in React + Vite + Tailwind + shadcn/ui to demonstrate visual direction.

The client explicitly wants ongoing **self-service maintenance** — adding/removing team members, swapping governance PDFs, publishing case studies, updating pages — without coming back to the developer. This drives the Git-based CMS decision.

A separate **external investor portal** at `investors.asianbatterymetals.com` (becoming `investors.azzororesources.com` post-rebrand) handles all investor-facing content authoritatively. The new marketing site links out to it; it is not rebuilt here.

## 2. Locked decisions

| Area | Decision |
|---|---|
| Framework | Next.js 14+ App Router, SSG, deployed on Vercel |
| CMS | Sveltia CMS (Git-based, GitHub auth via GitHub App) |
| Languages | Bilingual EN/MN, both prefixed: `/en/...` and `/mn/...`, EN default |
| UI string i18n | next-intl with `messages/{en,mn}.json` (dev-managed) |
| Content i18n | Sveltia `multiple_files` mode: `<slug>.en.md` + `<slug>.mn.md` |
| Timeline | 5-8 weeks single launch with everything in scope |
| Map library | MapLibre GL JS + MapTiler (free tier) |
| Hero video | Cloudflare Stream (free tier) |
| Asset hosting | Small in Git (`public/uploads/`), large media on Cloudflare Stream |
| Stock price | Live API, ticker TBD post-rebrand, configured via CMS |
| Auth | Sveltia GitHub App, 1-3 client editors as repo collaborators |
| Contact form | None on the marketing site; Contact page is informational only |
| Repo | Continue current repo, rename to `azzuro-resources`, restructure |
| Content seed | AI-drafted EN from PPT + old site, machine-translated MN, client edits |
| Analytics | Vercel Analytics + Speed Insights |
| Investor center | External link only; do not build a `/investor-center/` route |

## 3. Information architecture

```
azzororesources.com/
├── /                                  → 301 redirect to /en/ (or Accept-Language)
├── /en/                               Home
├── /en/about/                         About (story, board, technical team, leadership & governance, governance docs)
├── /en/projects/                      Projects (full-page interactive map + side panel)
├── /en/projects/[slug]/               Project detail page
├── /en/esg/                           ESG / Sustainability
├── /en/gallery/                       Gallery (photos, videos, case studies preview)
├── /en/gallery/case-studies/[slug]/   Case study detail
├── /en/contact/                       Contact (3 offices, phones, general email — no form)
├── /en/legal/{privacy,terms}/         Legal pages
│
├── /mn/...                            Full mirror in Mongolian
│
├── /admin/                            Sveltia CMS (static HTML + config.yml)
├── /robots.txt                        Auto-generated
├── /sitemap.xml                       Auto-generated with hreflang
└── /api/
    ├── /stock-price                   Cached 5 min
    └── /investor-news                 Cached 10 min, pulls external portal feed
```

**Nav:** About us · Projects · ESG · Gallery · Investor Center ↗ · Contact us
(Investor Center opens external portal in new tab.)

**Out of scope:** dedicated blog, site search, user accounts beyond /admin, newsletter signup, A/B testing, multi-tier editorial workflow at launch.

## 4. Page-level designs

Mark each block as **[CMS]** (client edits via /admin) or **[static]** (dev edits in code).

### 4.1 Home (`/[locale]/`)

1. **Hero** — Cloudflare Stream video, headline, sub-line, CTA [CMS]
2. **Key metrics strip** — 4-6 stat cards (value, label, source) [CMS]
3. **Projects preview** — small embedded map (400px), reads project pins [CMS]
4. **Why Mongolia** — bullet cards + "Visit investor portal →" CTA [CMS]
5. **Why Azzuro** — bullet cards + "Visit investor portal →" CTA [CMS]
6. **Sustainability teaser** — heading, body, image, CTA → /esg [CMS]
7. **Leadership teaser** — heading, body, CTA → /about#governance [CMS]
8. **Latest news** — 3 items, auto-pulled from external investor portal [feed]
9. **Stock price card** — live ticker + day change + "Full portal →" link [API + CMS ticker]
10. **Partners strip** — logos with URLs [CMS]
11. **Footer** [CMS partial]

**Killed from POC:** `IntroGate` (the loading splash). It hurts SEO and bounces casual visitors. The hero video is the first impression.

### 4.2 About (`/[locale]/about/`)

1. **Our story** — long-form markdown body + optional hero image [CMS]
2. **Mission + values** — mission statement + 3-5 value cards [CMS]
3. **Board of Directors** — grid of headshots; hover/tap → bio card [CMS, `team` collection filtered to Board]
4. **Technical Team** — same shape, includes new Mongolian members (Otgonjargal Bayarbat, Batkhurel Battulga, Purevdorj Dorjsuren, Bat-Erdene Batmunkh); removes Enkhbayasgalang [CMS, `team` collection filtered to Technical]
5. **Leadership & Governance** — body text [CMS]
6. **Governance documents** — tabbed by category, PDF uploads via /admin [CMS, `governance_documents` collection]

### 4.3 Projects (`/[locale]/projects/`)

1. **Page header** — title + 1-line description [CMS]
2. **Interactive map** — full-bleed MapLibre + MapTiler (satellite/terrain), pins from `projects` collection [CMS-driven]
3. **Filter chips** — by commodity, derived from project frontmatter [static logic, CMS data]
4. **Side panel on pin click** — hero image, commodity badge, status, summary, "View full project →" button to detail page
5. **Mobile:** bottom sheet replaces side panel

### 4.3b Project detail (`/[locale]/projects/[slug]/`)

All content from the `projects` collection (Section 5.2). Layout:
1. **Hero** — `hero_image`, `title`, `commodity` badges, `status` badge [CMS]
2. **Data cards strip** — generated from `data_cards[]` (label/value pairs) plus auto-derived (`license_area_km2`, `acquired_date`) [CMS]
3. **Body content** — long markdown `body` field, rendered as the primary narrative; client can structure it with H2/H3 headings as needed (Geology, Resource summary, Exploration history, etc.) [CMS]
4. **Gallery strip** — rendered from `gallery_images[]` with lightbox [CMS]
5. **Documents list** — `documents[]` entries (label + PDF), same widget as governance docs [CMS]
6. **Inset map** — small map locked to this project's lat/lng [derived]
7. **Nearby projects** — auto-suggests up to 3 other projects from the same `region` [derived]

Tab structure is deliberately avoided — markdown headings give the client more flexibility than rigid tabs and read better on mobile.

### 4.4 ESG (`/[locale]/esg/`)

Hero band. Our approach (markdown). Environment section (icon + body + image). Community engagement (icon + body + image). Governance link out to `/about#governance`. Reports & disclosures (PDF list, same widget as governance docs). All [CMS].

### 4.5 Gallery (`/[locale]/gallery/`)

Header + filter chips (All · Field · Drilling · Community · Events) — chip labels editable in CMS. Photo masonry grid with lightbox. Videos grid (Cloudflare Stream embeds). Case studies preview cards → detail page. All [CMS].

### 4.5b Case study detail (`/[locale]/gallery/case-studies/[slug]/`)

Long-form storytelling: hero, body markdown with inline images, optional pull-quote, related case studies. One markdown file per study.

### 4.6 Contact (`/[locale]/contact/`)

**No form here by design** — investor inquiries route through the external portal; general inquiries use the visible email.

1. **3 office cards** (AUS · UK · Mongolia) — name, address, static map image, local time, phone, email [CMS]
2. **Phone dropdown by category** — General inquiries (AUS / MN numbers), Investors (Phil Rundell), Media [CMS]
3. **General email** — clickable mailto [CMS]
4. **"For investor inquiries, please visit Investor Center →"** [static link]

### 4.7 Shared components

- **Navbar** — adapted from POC, new menu structure, language toggle EN ↔ MN
- **Footer** — adapted from POC FooterCards + minimal Footer
- **PartnerLogos** strip — existing, CMS-driven
- **Language toggle** — preserves current path: `/en/about` ↔ `/mn/about`
- **Breadcrumbs** on non-home pages

## 5. CMS schema (Sveltia)

Config lives at `public/admin/config.yml`. Bilingual via `i18n: { structure: multiple_files }`.

### 5.1 Singleton collections

| Collection | Path | Key fields |
|---|---|---|
| `site` | `content/settings/site.yml` (not i18n) | `brand_name`, `logo`, `logo_dark`, `stock_ticker`, `stock_api_enabled`, `investor_portal_url`, social links, `default_locale` |
| `nav` | `content/settings/nav.{en,mn}.yml` | `items[]` of `{label, href, external}` |
| `home` | `content/pages/home.{en,mn}.md` | hero (video_id, headline, subline, cta), metrics[], why_mongolia (intro + cards[]), why_azzuro (intro + cards[]), sustainability_teaser, leadership_teaser, section toggles |
| `about` | `content/pages/about.{en,mn}.md` | hero_image, story_body, mission, values[], leadership_governance_body, governance_documents_intro |
| `esg` | `content/pages/esg.{en,mn}.md` | hero_image, approach_body, environment, community, reports_intro |
| `gallery` | `content/pages/gallery.{en,mn}.md` | intro_heading, intro_body, filter_tags[] |
| `contact` | `content/pages/contact.{en,mn}.md` | intro_body, offices[], phone_groups[], general_email |
| `footer` | `content/settings/footer.{en,mn}.yml` | tagline, link_columns[], copyright_holder, legal_links[] |

### 5.2 Folder collections

| Collection | Folder | Fields per entry |
|---|---|---|
| `team` | `content/team/` | name, role, team_section (Board/Technical), photo, bio, order |
| `governance_documents` | `content/governance/` | title, category, file (PDF), effective_date, description |
| `projects` | `content/projects/` | title, slug, commodity (multi-select), status, region, lat, lng, license_area_km2, acquired_date, hero_image, gallery_images[], summary, body, data_cards[], documents[] |
| `gallery_photos` | `content/gallery/photos/` | image, caption, tags, date, featured |
| `gallery_videos` | `content/gallery/videos/` | title, description, stream_uid, thumbnail, tags, date |
| `case_studies` | `content/gallery/case-studies/` | title, slug, summary, hero_image, body, pull_quote, related[], date |
| `partners` | `content/partners/` (not i18n) | name, logo, url, order |

### 5.3 Sidebar layout for the client in /admin

```
PAGES         → Home · About · ESG · Gallery · Contact
TEAM          → Board of Directors · Technical Team (filtered views of `team`)
PROJECTS      → All projects
GOVERNANCE    → Documents
GALLERY       → Photos · Videos · Case studies
SETTINGS      → Navigation labels · Footer · Partners · Site (logo, ticker, social)
```

### 5.4 Not in CMS (dev-only)

UI label translations · privacy/terms bodies · routing/design tokens/animations · API keys (Vercel env vars) · robots.txt and sitemap config.

## 6. Tech architecture

### 6.1 Repo structure

```
azzuro-resources/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                         Home
│   │   ├── about/page.tsx
│   │   ├── projects/page.tsx                Server shell + client map island
│   │   ├── projects/[slug]/page.tsx
│   │   ├── esg/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── gallery/case-studies/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   └── legal/{privacy,terms}/page.tsx
│   ├── api/
│   │   ├── stock-price/route.ts             Cached 5 min
│   │   └── investor-news/route.ts           Cached 10 min
│   ├── layout.tsx                           Root <html>/<body>
│   ├── robots.ts
│   ├── sitemap.ts                           Includes hreflang for both locales
│   └── not-found.tsx
├── components/
│   ├── ui/                                  shadcn (preserved from POC)
│   ├── layout/                              Navbar, Footer, LanguageToggle, Breadcrumbs
│   ├── home/                                Hero, Metrics, WhyCards, MapPreview, StockCard
│   ├── projects/                            ProjectsMap (client), SidePanel, FilterChips
│   ├── about/                               TeamGrid, GovernanceList
│   ├── gallery/                             PhotoMasonry, VideoGrid, Lightbox
│   └── shared/                              PDFViewer, OptimizedImage
├── content/                                 CMS-managed (Sveltia commits here)
│   ├── pages/
│   ├── settings/
│   ├── team/
│   ├── projects/
│   ├── governance/
│   ├── gallery/{photos,videos,case-studies}/
│   └── partners/
├── lib/
│   ├── content/                             MD readers + typed loaders
│   ├── i18n/                                next-intl config
│   ├── map/                                 MapLibre setup
│   └── stock/                               Stock fetcher
├── messages/{en,mn}.json                    UI strings
├── middleware.ts                            Locale routing + `/` redirect
├── public/
│   ├── admin/{index.html,config.yml}        Sveltia CMS bundle
│   └── uploads/                             CMS-uploaded assets
├── next.config.mjs
├── tailwind.config.ts                       Updated color palette (blue)
└── .env.local
```

### 6.2 Environment variables

| Var | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client + server | Canonical URLs, sitemap, OG |
| `NEXT_PUBLIC_MAPTILER_KEY` | client | Map tile auth (domain-restricted) |
| `STOCK_API_KEY` | server | Yahoo / Alpha Vantage |
| `STOCK_TICKER` | server | Default ticker (CMS site.yml can override) |
| `INVESTOR_FEED_URL` | server | External portal news feed |
| `CLOUDFLARE_STREAM_ACCOUNT_ID` | client | Video embed iframe URL |

Set in Vercel env per environment (dev/preview/prod). Secrets never enter the bundle.

### 6.3 Branch & deploy flow

- `feature/*` → preview deploys per PR
- `develop` → `staging.azzororesources.com` (password protected)
- `main` → production at `azzororesources.com`
- Sveltia commits land on `main` directly (no editorial workflow at launch) — Save → Live in 60-90s

Branch protection on `main` requires build + typecheck + lint to pass.

### 6.4 Sveltia GitHub App setup (one-time)

1. Register a GitHub App (or use the Sveltia-hosted shared app for fastest setup)
2. Permissions: **Contents: Read & Write**, **Metadata: Read**
3. Install on the `azzuro-resources` repo
4. Configure `public/admin/config.yml` with `backend: { name: github, repo, branch: main, app_id, base_url }`
5. Cost: $0

### 6.5 Image pipeline

`next/image` for all images. `remotePatterns` configured for `public/uploads/**`, `imagedelivery.net/**`, `customer-*.cloudflarestream.com/**`. Every upload auto-converts to AVIF/WebP at responsive sizes; lazy-loaded.

### 6.6 Map page — server vs client split

```
app/[locale]/projects/page.tsx              Server Component — reads content/projects/*.md
  └── <ProjectsMap projects={...} />        Client island — dynamic import MapLibre
```

MapLibre's ~200KB bundle loads only on the projects page.

### 6.7 Domain setup

| Domain | Target |
|---|---|
| `azzororesources.com` | Vercel (apex A record), `/` redirects to `/en` |
| `www.azzororesources.com` | 301 → apex |
| `staging.azzororesources.com` | Vercel preview, password-protected |
| `azzororesources.com/admin` | Same Vercel deployment (static file) |
| `investors.azzororesources.com` | Client's IR portal (not ours) |

### 6.8 Per-build steps

```
1. npm install                            ~30s
2. tsc --noEmit                           fail = abort deploy
3. eslint                                 warn but don't fail
4. next build                             ~60s
5. vercel deploy                          ~10s
Total per content edit: ~90-120s
```

## 7. Workflows

### 7.1 Client onboarding (~30 min, one-time)

1. Editor signs up at github.com (~3 min)
2. You invite them as collaborator
3. They accept the email invite
4. Visit `azzororesources.com/admin` → "Sign in with GitHub" → authorize Sveltia App
5. 20-min screen-share walkthrough: editing a page, uploading photos, adding a team member, adding a project, EN/MN tabs, Save behavior
6. Hand off one-page editor guide (PDF, EN + MN)

### 7.2 Client day-to-day (representative flows)

- **Add team member:** /admin → Team → Technical Team → "+ New" → fill EN tab + MN tab + photo → Save → live in 90s
- **Change hero headline:** /admin → Pages → Home → edit headline (EN + MN tabs) → Save → live in 90s
- **Upload new governance PDF:** /admin → Governance → Documents → upload PDF + update effective_date → Save → live in 90s

**Common-task principles:** every form opens in EN with MN one click away; live preview panel; image uploads auto-resize if >4000px wide; Save prominent / Discard muted.

### 7.3 Dev iteration

Local dev: `git pull`, `npm install`, `npm run dev` → localhost:3000, hot reload.
Pushing: branch → preview deploy → review URL → merge to main → prod.
Sveltia has a "local backend" mode (`local_backend: true` + `sveltia-cms-proxy-server`) for offline schema iteration.

### 7.4 Content migration & launch — 8-week breakdown

| Week | Focus |
|---|---|
| 1 | Repo restructure: rename, migrate POC to Next.js App Router, set up next-intl/middleware, Sveltia shell, working "Hello world" deploy |
| 2 | Brand refresh: blue palette, logo swap, typography, port POC components to Next.js components, Cloudflare Stream setup |
| 3 | CMS schema: write config.yml, build content loaders, wire pages to CMS, seed placeholder files |
| 4 | AI content seeding: EN drafts from PPT + scraped old site, MN machine translations, client review begins |
| 5 | Projects map: MapTiler setup, ProjectsMap + side panel, /projects/[slug] pages, filter chips, real coords for OVAL / KHUKH TAG / TSAGAAN DERS |
| 6 | Gallery + integrations: photo masonry, videos grid, case studies, stock price API, investor news pull, analytics, sitemap, robots.txt |
| 7 | Polish: Lighthouse pass (target 95+), keyboard/screen reader, cross-browser, final client content review, /admin onboarding |
| 8 | Launch + buffer: DNS cutover, 301s from old URLs, sitemap submitted, monitor 48h |

### 7.5 Going-live checklist

**Pre-launch:** all CMS content reviewed by client (EN + MN); Lighthouse ≥90 Home/Projects/About in both locales; CTAs verified (portal URL, mailto); 404 works; /admin auth verified; sitemap.xml validates; robots.txt allows prod; cross-browser smoke test; Vercel prod env vars set; DNS TTLs lowered to 300s ≥24h ahead.

**Launch day:** content snapshot to main; DNS updated; SSL provisioned; investor portal still resolves; sitemap submitted to Google Search Console; old domain redirects (client side); social announcement (client side).

**First 48h:** monitor Vercel logs, stock API rate limits, news feed parse errors; production Lighthouse re-check; live walkthrough with client.

**First 2 weeks:** address edit confusions, update editor guide; monitor analytics for 404s/slow pages; fix typos.

### 7.6 Post-launch ownership

**Dev maintains:** code, deps, Vercel project + env vars, GitHub repo + branch protections, Sveltia GitHub App, DNS, design tokens, build pipeline, schema changes, security patches.

**Client maintains via /admin:** page bodies, team members, governance PDFs, projects (incl. map pins), gallery photos/videos/case studies, partner logos, site settings (ticker, social, nav labels), EN ↔ MN translations.

**Quarterly:** dependency updates, Lighthouse spot-check, Sveltia version bumps, repo health verification.

## 8. Open items requiring client input at kickoff

These are not blockers for design approval but must resolve before / during build:

1. **New Azzuro Resources logo files** (SVG + dark/light variants) — needed week 2
2. **Stock ticker symbol** post-rebrand — needed week 6
3. **External investor portal feed** — what platform powers `investors.asianbatterymetals.com`? Does it expose RSS/JSON? — needed week 6
4. **Real geo coordinates** for OVAL, KHUKH TAG, TSAGAAN DERS — needed week 5
5. **IR mailbox address** if we ever add a form post-launch
6. **Cloudflare Stream account** — client provides or we set one up under our account and transfer
7. **MapTiler account** — same
8. **Hero video footage** — field exploration, drilling, geologists, community meetings — needed week 2
9. **Approved board bios + photos** — for About page seeding
10. **Final governance documents** (current PDFs) — for initial /admin seed

## 9. Out of scope (explicitly)

- Investor Center page (external portal handles)
- Investor inquiry form (external portal handles)
- Investor news article pages (external portal handles)
- Inline PDF presentation viewer (external portal handles)
- Dedicated blog system
- Site-wide search
- User accounts beyond /admin
- Newsletter signup at launch
- A/B testing infra
- Multi-tier editorial workflow at launch
- Mobile app or PWA install banner

Anything above can be added Phase 2 post-launch.

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Client misses GitHub signup step | Walk through it on the onboarding call; provide screenshot guide |
| External investor portal has no feed | Fall back to manual news entries in CMS (or skip the home news section) |
| Stock API rate-limit during high traffic | 5-min server cache; graceful "Last close: X" fallback |
| Sveltia upstream stagnates | Config-compatible with Decap; documented escape hatch |
| Client uploads huge unoptimized images | Sveltia auto-resize on upload; document maximum sensible sizes in editor guide |
| Translation drift between EN and MN | Sveltia tabs surface both languages on every edit; spot-check during quarterly maintenance |
| Map tile costs spike | MapTiler free tier covers 100k loads/month; restrict key to production domain |
| MN typography rendering issues | Test with Cyrillic Mongolian content during week 2 brand pass; pick a font that supports the script |
