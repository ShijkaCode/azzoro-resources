# Azzuro Resources — Launch Implementation Plan (Plan 3 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the site from "all pages built with placeholder copy on local dev" to "live at azzororesources.com with real content, /admin working for client editors, indexed in search engines, and the client trained to maintain it themselves."

**Architecture:** No new framework changes. Plan 3 is operational + polish work on top of the existing Next.js + Sveltia stack. The handful of remaining code tasks (Cloudflare Stream hero, investor news feed, OG images, structured data, a11y/perf fixes) are surgical adds in well-understood places.

**Tech Stack additions vs Plan 2:** axe-core (a11y testing), @next/bundle-analyzer (perf). No runtime additions of consequence.

**Reference spec:** `docs/superpowers/specs/2026-05-27-azzuro-website-renewal-design.md`

**What Plan 1 + Plan 2 already shipped (skip in this plan):**
- Next.js 14 + i18n + middleware + typed CMS content + Sveltia /admin shell (Plan 1)
- All 6 pages built and wired: Home (with hero, metrics, why-cards, map preview, stock card, partners), About (story + team grids + governance), Projects (interactive map + side panel + filters + detail pages), ESG, Gallery (photos masonry + lightbox, video grid, case studies + detail), Contact (offices + phone dropdown)
- Stock price API + Home card (Yahoo Finance + portal fallback)
- Maplibre lazy-loaded on Home for 99kB first-load JS
- 8-commit Plan 1 + 10-commit Plan 2 history merged to main

**Out of scope for this plan:** Phase 2 features the client may ask for post-launch (newsletter signup, blog, multi-user editorial workflow, dashboard analytics, advanced map interactions).

---

## Blocked-on-client items entering Plan 3

These are gating launch unless deferred or accepted in placeholder form. Each task that depends on them is flagged **[BLOCKED ON CLIENT]** with the workaround documented.

| Item | Blocks | If still missing at launch |
|---|---|---|
| Real Azzuro logo (SVG + dark variant) | T22 brand finalization | Ship with current `new_logo.png` |
| Stock ticker post-rebrand | T15 (stock card displays correct symbol) | Keep `ABM.L` env fallback |
| Investor portal feed URL + format | T8-T9 (Home news section) | Section hidden via `news_section_enabled: false` |
| Cloudflare Stream account ID + hero video UID | T6-T7 (hero video) | Static `/uploads/hero-poster.jpg` fallback |
| Real team photos (high-res JPG/WEBP, 1:1) | T22 polish | Existing placeholder PNGs ship |
| Real team bios | T19 content review | Existing AI-drafted bios ship as `[DRAFT]` |
| Real governance PDFs | T22 polish | Single `placeholder.pdf` everywhere |
| Real project license coordinates | T22 polish | Existing approximate coords ship |
| Native MN translation review | T20 content review | AI-translated MN ships labeled `[DRAFT]` |
| GitHub account for client editor(s) | T3 onboarding | Editor invites deferred to post-launch |
| DNS access for azzororesources.com | T27 cutover | Site stays at staging URL until DNS available |

---

## Tasks

### Phase 3.A — Plan 1 leftover deploy + auth (T1-T5)

These were tasks 37-39 of Plan 1 that were never executed. They're prerequisites for everything downstream.

---

### Task 1: Fix Browserslist staleness warning

**Files:** `package-lock.json` (refreshed by command)

The build emits "Browserslist: caniuse-lite is outdated" — non-blocking but easy to clear.

- [ ] **Step 1:** Run the updater

```bash
npx update-browserslist-db@latest
```

Expected: prints "caniuse-lite has been successfully updated" (or "already up to date").

- [ ] **Step 2:** Verify build is warning-free for this issue

```bash
npm run build 2>&1 | grep -i browserslist
```

Expected: no matches.

- [ ] **Step 3:** Commit

```bash
git add package-lock.json
git commit -m "chore: refresh caniuse-lite via update-browserslist-db"
```

---

### Task 2: Push branch to GitHub and verify CI builds

**Files:** none

- [ ] **Step 1:** Confirm branch + remote

```bash
git status
git remote -v
```

Expected: branch is `main` (or your feature branch), remote `origin` points at the GitHub repo.

- [ ] **Step 2:** Push

```bash
git push origin HEAD
```

Expected: push succeeds. If `main` is protected, push to a feature branch and open a PR.

- [ ] **Step 3:** Confirm push landed in GitHub UI

---

### Task 3: Set up Vercel project with all env vars

**Files:** none (Vercel dashboard)

- [ ] **Step 1:** Open https://vercel.com/dashboard → Add New → Project

- [ ] **Step 2:** Import the `azzuro-resources` repo (or current name). Accept Next.js detection.

- [ ] **Step 3:** Configure environment variables under Production + Preview scopes

Add each, mark Production + Preview:

```
NEXT_PUBLIC_SITE_URL = https://staging.azzororesources.com
NEXT_PUBLIC_MAPTILER_KEY = <your MapTiler key, or leave blank to use OSM fallback>
NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID = <leave blank until T7>
STOCK_API_PROVIDER = yahoo
STOCK_API_KEY = (Yahoo unofficial needs none; leave blank)
STOCK_TICKER_FALLBACK = ABM.L
INVESTOR_FEED_URL = <leave blank until T9>
```

- [ ] **Step 4:** Trigger first deploy

Either Vercel auto-triggers on the import, or push an empty commit:

```bash
git commit --allow-empty -m "trigger: first Vercel build"
git push
```

- [ ] **Step 5:** Verify deploy succeeds

Watch build log (~90-120s). On success, note the Vercel-assigned `*.vercel.app` URL.

- [ ] **Step 6:** Smoke-test the Vercel URL

Visit it. Walk through `/en`, `/mn`, all 6 sub-pages, `/projects` map, `/projects/oval`. Stock card should render (Yahoo Finance may be flaky from Vercel's IPs — that's OK, it gracefully degrades to the portal CTA).

`/admin` will load the Sveltia shell but sign-in won't work yet (GitHub App in T4). That's expected.

- [ ] **Step 7:** Capture URL

Update `docs/staging.md` (create if missing):

```markdown
# Staging environment

- Preview URL: <Vercel-assigned URL>
- Custom staging domain: pending T4
- /admin status: shell loads, GitHub App pending T4-T5
```

```bash
git add docs/staging.md
git commit -m "docs: capture first Vercel deploy URL"
git push
```

---

### Task 4: Add custom staging domain and password protection

**Files:** none (Vercel + DNS)

- [ ] **Step 1:** Vercel → Project → Settings → Domains → Add `staging.azzororesources.com`

Vercel shows a CNAME target (`cname.vercel-dns.com`).

- [ ] **Step 2:** **[BLOCKED ON CLIENT]** Add CNAME record at the domain registrar

Record: `staging` CNAME `cname.vercel-dns.com` · TTL 300s

If you don't have DNS access, ask the client/IT for it. You can proceed with subsequent tasks using the `*.vercel.app` URL.

- [ ] **Step 3:** Wait for SSL provisioning (~5 min) and verify HTTPS works

Visit `https://staging.azzororesources.com`.

- [ ] **Step 4:** Enable deployment protection

Vercel → Project → Settings → Deployment Protection → Password Protect Preview Deployments. Set a shared password. Send to client.

- [ ] **Step 5:** Update `docs/staging.md` with the staging URL and password

(Keep the password out of git — paste it in a private message to the client.)

```bash
git add docs/staging.md
git commit -m "docs: staging.azzororesources.com live with password protection"
git push
```

---

### Task 5: Register Sveltia GitHub App and wire /admin auth

**Files:** `public/admin/config.yml`

Follow `docs/admin-setup.md` (created in Plan 1 Task 35).

- [ ] **Step 1:** Register at https://github.com/settings/apps/new

- App name: `Azzuro Resources CMS`
- Homepage URL: `https://azzororesources.com`
- Callback URLs (one per line):
  - `https://staging.azzororesources.com/admin`
  - `https://azzororesources.com/admin`
  - `http://localhost:3000/admin`
- Untick Webhook → Active
- Permissions: Contents Read & Write, Metadata Read
- Where can this App be installed: Only on this account
- Save. Note the **App ID** and **Client ID**. Generate a Client Secret, save it.

- [ ] **Step 2:** Install the App on the `azzuro-resources` repo

App settings → Install App → select the repo only (not the org).

- [ ] **Step 3:** Add Vercel env vars (Production + Preview)

```
GITHUB_APP_ID = <App ID>
GITHUB_APP_CLIENT_ID = <Client ID>
GITHUB_APP_CLIENT_SECRET = <Client Secret>
```

- [ ] **Step 4:** Update `public/admin/config.yml` backend block

Replace the existing backend block:

```yaml
backend:
  name: github
  repo: <github-org>/azzuro-resources
  branch: main
  app_id: <APP_ID>
```

- [ ] **Step 5:** Commit and push

```bash
git add public/admin/config.yml
git commit -m "feat: configure Sveltia backend with GitHub App ID"
git push
```

- [ ] **Step 6:** Wait for Vercel deploy, then test sign-in

Visit `https://staging.azzororesources.com/admin`. Click "Sign in with GitHub" → authorize. You should land in the Sveltia dashboard with all collections visible in the sidebar.

If sign-in fails, check:
- Callback URLs in the App match the URL where /admin lives
- Vercel env vars are set on Production (not just Preview)
- App is installed on the repo (not just registered)

- [ ] **Step 7:** Edit a field as an end-to-end smoke test

In Sveltia: Pages → Home → change the EN headline to anything → Save. Confirm:
- A new commit appears on `main`
- Vercel triggers a deploy (~90s)
- The new headline shows on staging after deploy

- [ ] **Step 8:** Update `docs/staging.md`

```markdown
# Staging environment
- URL: https://staging.azzororesources.com (password protected)
- /admin: live, GitHub App configured, end-to-end edit-to-deploy verified
- Editor onboarding: T19 (post content review)
```

```bash
git add docs/staging.md
git commit -m "docs: confirm /admin auth working end-to-end"
git push
```

---

### Phase 3.B — Remaining integrations (T6-T9)

---

### Task 6: Provision Cloudflare Stream and upload hero video

**[BLOCKED ON CLIENT]** Skip this task and use the static poster fallback if no Stream account or video footage is available at launch.

**Files:** none (Cloudflare dashboard)

- [ ] **Step 1:** Open https://dash.cloudflare.com → Stream → enable (paid plan starts at $5/mo for the first 1000 minutes)

- [ ] **Step 2:** Note the **Account ID** from the URL or Stream dashboard

- [ ] **Step 3:** Upload the hero video footage

In Stream dashboard → Upload Video → drag the footage. Cloudflare encodes (~2-5 min). Note the **Video UID** (shown next to the title).

- [ ] **Step 4:** Generate a poster image

Either let Cloudflare auto-generate (default thumbnail at 1s) or upload a custom poster JPG via the Stream dashboard.

- [ ] **Step 5:** Set Vercel env var

```
NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID = <account ID>
```

Redeploy.

---

### Task 7: Wire hero video into HeroSection

**Files:** `components/home/HeroSection.tsx`, `content/pages/home.{en,mn}.md`, `public/uploads/hero-poster.jpg`

- [ ] **Step 1:** Verify `components/home/CloudflareStreamHero.tsx` from Plan 2 Task 39 exists. If it does not, create it now per Plan 2 specs.

- [ ] **Step 2:** Edit `components/home/HeroSection.tsx` to render the video as a background layer

Modify the section's outer container to be `relative`, then before the existing content `div`, add:

```tsx
<CloudflareStreamHero
  streamUid={hero.video_id}
  poster="/uploads/hero-poster.jpg"
  className="absolute inset-0 -z-10"
/>
<div className="absolute inset-0 -z-[5] bg-navy-dark/40" />
```

Adjust opacity overlay until text contrast is acceptable (WCAG AA: 4.5:1 minimum).

- [ ] **Step 3:** Add hero poster image

Save a still frame (or any compelling 16:9 photo) as `public/uploads/hero-poster.jpg` (1920×1080 max, ~150kB target).

- [ ] **Step 4:** Update CMS content

In `/admin` → Pages → Home → set `hero.video_id` to the Cloudflare Stream UID. Save (or edit the markdown files directly).

- [ ] **Step 5:** Verify

Visit staging Home. Video autoplays muted, loops. Without the env var, the poster image appears instead (graceful degradation).

- [ ] **Step 6:** Commit

```bash
git add components/home/HeroSection.tsx public/uploads/hero-poster.jpg
git commit -m "feat: render Cloudflare Stream hero video with overlay + poster fallback"
git push
```

---

### Task 8: Discover the investor portal feed format

**[BLOCKED ON CLIENT]** Cannot proceed without portal feed source.

- [ ] **Step 1:** Inspect `https://investors.asianbatterymetals.com/` HTML — look for RSS/Atom feed `<link>` tags in `<head>`

Common patterns:
- `<link rel="alternate" type="application/rss+xml" href="..." />`
- A "/feed/" or "/news/rss" path

- [ ] **Step 2:** Check the portal vendor's docs

Common IR platforms with feed support:
- EQS Group: usually has `/de-pls/rss/news.xml` or similar
- IRESS: `/news.xml`
- Computershare: typically requires support ticket to enable

- [ ] **Step 3:** If no public feed exists, ask the client to ask the IR portal vendor to enable one

- [ ] **Step 4:** Once you have a feed URL, paste a sample of the XML response and confirm the shape matches the assumptions in `lib/news/fetch.ts` (RSS 2.0 with `<rss><channel><item>...`)

If the shape differs (Atom, JSON Feed, custom XML), adjust `parseInvestorNews` in `lib/news/fetch.ts` to map fields correctly.

---

### Task 9: Implement and enable investor news section

**Files:** `lib/news/fetch.ts`, `app/api/investor-news/route.ts`, `components/home/LatestNewsSection.tsx`, `app/[locale]/page.tsx`, `content/pages/home.{en,mn}.md`

- [ ] **Step 1:** Verify Plan 2 Tasks 37-38 components exist. If not, create them per Plan 2 specs.

- [ ] **Step 2:** Set Vercel env var

```
INVESTOR_FEED_URL = <feed URL from T8>
```

- [ ] **Step 3:** Wire into Home page

In `app/[locale]/page.tsx`, after the other home sections, render:

```tsx
{home.news_section_enabled && (
  <LatestNewsSection investorPortalUrl={site.investor_portal_url} />
)}
```

- [ ] **Step 4:** Enable in CMS

In `/admin` (or directly edit `content/pages/home.{en,mn}.md`), set `news_section_enabled: true`.

- [ ] **Step 5:** Verify

Visit staging Home. Three most recent items render with title, date, summary, link → portal.

If parsing fails silently (empty section), check Vercel function logs (`vercel logs --follow`) for the actual response shape.

- [ ] **Step 6:** Commit

```bash
git add content/pages/home.en.md content/pages/home.mn.md
git commit -m "feat: enable investor news section on Home"
git push
```

---

### Phase 3.C — SEO polish (T10-T13)

---

### Task 10: Per-page metadata

**Files:** `app/[locale]/{about,projects,esg,gallery,contact}/page.tsx`, `app/[locale]/page.tsx`, `app/[locale]/projects/[slug]/page.tsx`, `app/[locale]/gallery/case-studies/[slug]/page.tsx`

Every page should export a `generateMetadata` function returning a title and description tuned for the page. Right now only the root layout has metadata.

- [ ] **Step 1:** Define a shared metadata helper

Create `lib/seo/pageMetadata.ts`:

```ts
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';

const SITE_NAME = 'Azzuro Resources';

type Args = {
  title: string;
  description: string;
  locale: Locale;
  path: string;
};

export function buildPageMetadata({ title, description, locale, path }: Args): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com';
  const url = `${siteUrl}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${path}`,
        mn: `${siteUrl}/mn${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'mn' ? 'mn_MN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
```

- [ ] **Step 2:** Add `generateMetadata` to each page

Example for `app/[locale]/about/page.tsx`:

```tsx
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  if (!isLocale(locale)) return {};
  const titleEn = 'About Azzuro Resources';
  const titleMn = 'Azzuro Resources-ийн тухай';
  const descEn = 'Mining exploration in Mongolia — story, leadership, governance.';
  const descMn = 'Монгол дахь уул уурхайн хайгуул — түүх, удирдлага, засаглал.';
  return buildPageMetadata({
    title: locale === 'mn' ? titleMn : titleEn,
    description: locale === 'mn' ? descMn : descEn,
    locale,
    path: '/about',
  });
}
```

Repeat for: home (`/`), projects (`/projects`), esg (`/esg`), gallery (`/gallery`), contact (`/contact`).

- [ ] **Step 3:** Add `generateMetadata` to dynamic routes

For `app/[locale]/projects/[slug]/page.tsx`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  if (!isLocale(locale)) return {};
  const projects = await loadCollection<Project>('projects', locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return buildPageMetadata({
    title: `${project.title} — ${project.commodity.join(', ')}`,
    description: project.summary,
    locale,
    path: `/projects/${slug}`,
  });
}
```

Same pattern for case study detail.

- [ ] **Step 4:** Verify

Run `npm run build`, then view source on a page like `/en/about` — expect `<title>`, `<meta name="description">`, `<link rel="alternate" hreflang="mn">`, `<meta property="og:*">` present and correct.

- [ ] **Step 5:** Commit

```bash
git add lib/seo/ app/[locale]/
git commit -m "feat: per-page metadata with hreflang and OG tags"
git push
```

---

### Task 11: Organization JSON-LD structured data

**Files:** `app/[locale]/layout.tsx`

Helps Google understand the company entity.

- [ ] **Step 1:** Add a `<script type="application/ld+json">` to the locale layout

Inside `LocaleLayout`, after `NextIntlClientProvider` opens:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Azzuro Resources PLC',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com',
      logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com'}/uploads/logo.png`,
      sameAs: [
        // populate from site settings if available
      ],
      address: [
        {
          '@type': 'PostalAddress',
          addressLocality: 'Ulaanbaatar',
          addressCountry: 'MN',
          streetAddress: '305 MERU tower, Jamiyangun street, 1st khoroo, Sukhbaatar district',
        },
        {
          '@type': 'PostalAddress',
          addressLocality: 'Subiaco',
          addressRegion: 'WA',
          addressCountry: 'AU',
          streetAddress: 'Suite 8, 16 Nicholson road',
          postalCode: '6008',
        },
        {
          '@type': 'PostalAddress',
          addressLocality: 'London',
          addressCountry: 'GB',
          streetAddress: 'The Broadgate Tower, 20 Primrose Street',
          postalCode: 'EC2A 2EW',
        },
      ],
    }),
  }}
/>
```

- [ ] **Step 2:** Validate

Run `npm run build && npm start`, then test the home page URL at https://search.google.com/test/rich-results. Expect "Organization detected" with no errors.

- [ ] **Step 3:** Commit

```bash
git add app/[locale]/layout.tsx
git commit -m "feat: Organization JSON-LD structured data"
git push
```

---

### Task 12: Dynamic Open Graph images

**Files:** `app/[locale]/opengraph-image.tsx`, `app/[locale]/projects/[slug]/opengraph-image.tsx`

Next 14 supports OG image generation as a special route file. We make a branded card per page.

- [ ] **Step 1:** Create `app/[locale]/opengraph-image.tsx`

```tsx
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
  const title = params.locale === 'mn' ? 'Azzuro Resources' : 'Azzuro Resources';
  const subtitle =
    params.locale === 'mn'
      ? 'Монгол дахь уул уурхайн хайгуул'
      : 'Critical minerals exploration in Mongolia';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1A6FE0 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1 }}>{title}</div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.85 }}>{subtitle}</div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 2:** Create equivalent for project detail

`app/[locale]/projects/[slug]/opengraph-image.tsx` — same shape, but include project title + commodity badge.

- [ ] **Step 3:** Verify

Visit `https://staging.azzororesources.com/en/opengraph-image` — expect a 1200x630 PNG with the gradient + text.

Test the URL at https://www.opengraph.xyz/ to see the LinkedIn/Twitter preview.

- [ ] **Step 4:** Commit

```bash
git add app/[locale]/opengraph-image.tsx app/[locale]/projects/[slug]/opengraph-image.tsx
git commit -m "feat: dynamic Open Graph image generation per page"
git push
```

---

### Task 13: Verify sitemap, robots, and hreflang

**Files:** none (verification only)

- [ ] **Step 1:** Visit `https://staging.azzororesources.com/sitemap.xml`

Expect both `/en/...` and `/mn/...` URLs, plus `<xhtml:link rel="alternate" hreflang="...">` entries for every locale on every URL.

- [ ] **Step 2:** Visit `https://staging.azzororesources.com/robots.txt`

Expect `Disallow: /admin` and `Sitemap: https://staging.azzororesources.com/sitemap.xml`.

- [ ] **Step 3:** Validate hreflang at https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/

Paste the sitemap URL — tool flags any reciprocal hreflang mismatches.

- [ ] **Step 4:** Commit (no-op checkpoint)

```bash
git commit --allow-empty -m "checkpoint: sitemap/robots/hreflang verified clean"
git push
```

---

### Phase 3.D — AI content seeding (T14-T20)

This is the content drafting pass deferred from Plan 2. Operational, not coded — you (or the content owner) run Claude with the prompts below, paste output into the corresponding `.en.md` or `.mn.md` files, and commit.

The point isn't to ship AI-final copy — it's to **kick the placeholder copy hard enough that the client has something concrete to react to**, so their feedback loop is "fix this specific phrase" instead of "write everything."

---

### Task 14: Draft EN copy for Home, About, ESG, Gallery, Contact

**Files:** `content/pages/{home,about,esg,gallery,contact}.en.md`

- [ ] **Step 1:** Gather source material

- `docs/website renewal slides.pptx` (the brief)
- The current asianbatterymetals.com text (manual copy)
- Existing POC component copy from `src.legacy/components/`

- [ ] **Step 2:** For each page, run this prompt with Claude

> You are drafting marketing website copy for Azzuro Resources PLC, a critical-minerals exploration company operating in Mongolia (formerly Asian Battery Metals PLC, just rebranded). Target audiences: institutional investors, regulators, partners, local Mongolian stakeholders. Tone: confident, technical-but-accessible, no AI tells (no "let's dive in", no rhetorical questions).
>
> Read the attached PPT and existing copy. Then output **YAML frontmatter only** (no markdown body, no surrounding commentary) for `content/pages/<PAGE>.en.md`. Use the existing field shape exactly. Pay attention to:
> - Headlines should be ≤8 words, evocative
> - Sub-lines should sell, not narrate
> - Card bodies should be 2-3 short sentences max
> - CTA labels should be ≤4 words
>
> Page in scope: <Home / About / ESG / Gallery / Contact>

- [ ] **Step 3:** Paste output into the corresponding `.en.md` file, replacing existing frontmatter

- [ ] **Step 4:** Verify dev server renders correctly

- [ ] **Step 5:** Repeat for each of the 5 pages

- [ ] **Step 6:** Commit per page or all together

```bash
git add content/pages/
git commit -m "feat: AI-drafted EN content for Home, About, ESG, Gallery, Contact"
git push
```

---

### Task 15: Draft EN project bodies and team bios

**Files:** `content/projects/{oval,khukh-tag,tsagaan-ders}.en.md`, `content/team/*.en.md`

- [ ] **Step 1:** For each project, give Claude:
  - The current frontmatter (commodity, region, status)
  - Geological details from the POC's old BentoGrid descriptions
  - Standard marketing structure: opening summary, "Geology", "Exploration history", "Outlook"

Output: a markdown body of ~400-600 words.

- [ ] **Step 2:** Update `data_cards[]` in frontmatter with real fields (license area, target commodity, drill program status, recent results highlight)

- [ ] **Step 3:** For each team member, give Claude:
  - Name + role
  - Any public info available (the user can paste a LinkedIn URL or supply background)

Output: a 100-150 word neutral third-person bio.

- [ ] **Step 4:** **[BLOCKED ON CLIENT]** Mark commits as `[DRAFT]`. Real bios + technical project copy require client subject-matter review.

```bash
git add content/projects/ content/team/
git commit -m "feat: AI-drafted project bodies and team bios [DRAFT — pending client review]"
git push
```

---

### Task 16: Draft EN first case study

**Files:** `content/gallery/case-studies/khukh-tag-community.en.md`

- [ ] **Step 1:** Prompt Claude

> Write a 600-800 word storytelling case study about a mining exploration company's community engagement at a remote site in northern Mongolia. The narrative arc: (1) the place and people before our arrival, (2) what we did to build trust (concrete examples), (3) the program we run now, (4) what we've learned. First person plural ("we"), warm but factual, no marketing fluff. Avoid stock phrases like "long-term partnership." Output as markdown.

- [ ] **Step 2:** Paste into the case study file body

- [ ] **Step 3:** Commit

```bash
git add content/gallery/case-studies/khukh-tag-community.en.md
git commit -m "feat: AI-drafted Khukh Tag community case study [DRAFT]"
git push
```

---

### Task 17: Translate everything to MN

**Files:** all `content/**/*.mn.md`

- [ ] **Step 1:** For each updated `.en.md` file, prompt Claude

> Translate the following Azzuro Resources web copy from English to formal Mongolian Cyrillic. Preserve YAML frontmatter structure exactly: translate only string values, not field names or hrefs. Industry vocabulary: use established Mongolian mining/geology terms (геологи, ордын, хайгуул, баялаг, etc.). Output ready-to-save .mn.md content.

- [ ] **Step 2:** Apply each output to the matching `.mn.md`

- [ ] **Step 3:** Spot-check by browsing `/mn` — Cyrillic renders, no untranslated English fragments

- [ ] **Step 4:** **[BLOCKED ON CLIENT]** Native speaker review before launch — find a Mongolian-speaking colleague or pay a translator for a 1-hour proofread

- [ ] **Step 5:** Commit

```bash
git add content/
git commit -m "feat: MN translations for all seeded content [DRAFT — pending native speaker review]"
git push
```

---

### Task 18: Send client a content review checklist

**Files:** `docs/client-review-checklist.md`

- [ ] **Step 1:** Create the file

```markdown
# Azzuro Resources — Content Review Checklist

Site URL: https://staging.azzororesources.com
Password: <separately>

## What to check

For each page, scan the EN version, then click the language toggle and scan MN.

- [ ] **Home** — Hero headline, key metrics (are the numbers right?), Why Mongolia cards, Why Azzuro cards, sustainability blurb, leadership blurb
- [ ] **About** — Story, mission, values, Board of Directors, Technical Team (correct people, correct roles, correct order), Leadership & Governance text
- [ ] **Projects** — Click each pin: side panel shows accurate commodity, region, status. Click "View full project" → check body copy + data cards for accuracy
- [ ] **ESG** — Approach, Environment, Community
- [ ] **Gallery** — Photos relevant? Case study text accurate?
- [ ] **Contact** — Office addresses correct? Phone numbers current? IR portal link correct?

## What you can edit yourself

The /admin login at the same URL lets you edit any of the above. Walk through the editor guide PDF first (delivered separately).

## What requires the dev team

- Anything visual/layout (button styles, page structure, color)
- New page sections or fields
- Adding/removing top-level menu items

## What we still need from you

- [ ] Real Azzuro Resources logo (SVG, ideally light + dark)
- [ ] Final stock ticker (post-rebrand)
- [ ] Investor portal feed URL/format (RSS or JSON)
- [ ] Real team photos (1:1 ratio, ≥600px wide)
- [ ] Real team bios (~150 words each)
- [ ] Real governance documents (PDFs)
- [ ] Real project license-area coordinates (lat/lng per project)
- [ ] Hero video footage
- [ ] Native Mongolian speaker to proofread

## How to give feedback

Email or screenshot annotations. For copy changes, the simplest path is for you to go into /admin and just make them.
```

- [ ] **Step 2:** Send to client (email/Slack/whatever) along with the staging URL + password

- [ ] **Step 3:** Commit

```bash
git add docs/client-review-checklist.md
git commit -m "docs: add client content review checklist"
git push
```

---

### Task 19: Write editor guide PDF

**Files:** `docs/editor-guide.md` (markdown source), `docs/editor-guide.pdf` (compiled)

One-page how-to for the client to maintain the site after launch.

- [ ] **Step 1:** Write the markdown

`docs/editor-guide.md`:

```markdown
# Azzuro Resources — Editor Guide

## Signing in

1. Visit `https://azzororesources.com/admin`
2. Click **Sign in with GitHub**
3. Authorize the Azzuro Resources CMS app (only the first time)

You'll land in the editor. The left sidebar groups everything you can edit.

## The 5 most common tasks

### Edit a page

1. **Pages** → pick **Home / About / ESG / Gallery / Contact**
2. The EN tab opens by default. Switch to **MN** tab to edit the Mongolian version.
3. Click **Save** at the top. Changes appear on the live site in ~90 seconds.

### Add a team member

1. **Team** → **Board of Directors** or **Technical Team**
2. Click **+ New Team Member**
3. Fill name, role, drag-drop a photo, write bio. Switch to MN tab.
4. Click **Save**.

### Add a project

1. **Projects** → **+ New Project**
2. Fill title, commodity, status, latitude/longitude, hero image. Fill summary and body in markdown.
3. Switch to MN tab.
4. Save. The new pin appears on the projects map after the next deploy.

### Upload a governance PDF

1. **Governance** → **+ New Document** (or click an existing one to replace)
2. Fill title, pick category (Constitution / Charters / Policies / Reports / Disclosures), drag the PDF, set the effective date
3. Save.

### Publish a case study

1. **Gallery** → **Case Studies** → **+ New Case Study**
2. Fill title, summary, hero image, body (markdown — use ## headings for structure)
3. Switch to MN tab and translate.
4. Save.

## What you should NOT edit through /admin

- Page layout, button colors, navbar structure → contact dev team
- Adding new languages → contact dev team
- The /admin config itself → contact dev team

## When something looks broken

1. Wait ~2 min — Vercel takes that long to redeploy after a Save
2. Hard-refresh the page (Ctrl+F5 / Cmd+Shift+R)
3. Check the GitHub repo for your recent commit — it should be there
4. If still broken, contact <dev contact>

## Common gotchas

- **Image uploads above ~4MB** are slow. Resize beforehand (e.g., https://squoosh.app/).
- **Heading levels in markdown bodies:** use `##` not `#` (the page title is already `#`).
- **Hrefs:** internal links go `/en/about` or `/mn/about`. External links open in a new tab automatically if you tick "External."
- **Cyrillic typing:** Sveltia accepts Mongolian Cyrillic natively. If your keyboard doesn't, use https://www.google.com/inputtools/ Mongolian → copy/paste.
```

- [ ] **Step 2:** Generate PDF

Use any markdown-to-PDF tool. Easiest: paste into https://www.markdowntopdf.com/ or `pandoc docs/editor-guide.md -o docs/editor-guide.pdf`.

- [ ] **Step 3:** Commit the markdown source (PDF is binary; commit it too if small)

```bash
git add docs/editor-guide.md docs/editor-guide.pdf
git commit -m "docs: add editor guide for client self-service"
git push
```

---

### Task 20: Schedule client onboarding call

**Files:** none (calendar)

- [ ] **Step 1:** Send invite for a 30-min screen-share

Agenda:
- Walk through staging URL — Home, About, Projects map, Gallery, Contact
- Sign them into /admin with their GitHub account (have them sign up if needed)
- Edit a real piece of content together (e.g., update their own team member entry)
- Hand off the editor guide PDF
- Discuss feedback turnaround and the remaining client deliverables

- [ ] **Step 2:** Run the call, capture any blockers/feedback in `docs/client-feedback.md`

---

### Phase 3.E — Accessibility audit (T21-T24)

---

### Task 21: Automated a11y scan with axe-core

**Files:** `package.json`, `scripts/a11y-scan.mjs`

- [ ] **Step 1:** Install axe-core CLI

```bash
npm install --save-dev @axe-core/playwright playwright
npx playwright install chromium
```

- [ ] **Step 2:** Create a scan script

`scripts/a11y-scan.mjs`:

```js
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/en', '/en/about', '/en/projects', '/en/projects/oval',
  '/en/esg', '/en/gallery', '/en/contact',
  '/mn', '/mn/about', '/mn/projects',
];

const BASE = process.env.A11Y_BASE_URL ?? 'http://localhost:3000';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

let totalViolations = 0;

for (const path of PAGES) {
  await page.goto(BASE + path);
  await page.waitForLoadState('networkidle');
  const { violations } = await new AxeBuilder({ page }).analyze();
  console.log(`${path}: ${violations.length} violations`);
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    v.nodes.slice(0, 2).forEach((n) => console.log(`    — ${n.target.join(' ')}`));
  }
  totalViolations += violations.length;
}

await browser.close();
console.log(`\nTotal: ${totalViolations} violations across ${PAGES.length} pages`);
process.exit(totalViolations > 0 ? 1 : 0);
```

- [ ] **Step 3:** Run against local dev

```bash
npm run dev   # in one terminal
node scripts/a11y-scan.mjs   # in another
```

- [ ] **Step 4:** Capture the violation list, group by issue type, file as a checklist

- [ ] **Step 5:** Commit the script

```bash
git add scripts/a11y-scan.mjs package.json package-lock.json
git commit -m "chore: add axe-core a11y scan script"
git push
```

---

### Task 22: Fix high-impact a11y violations

**Files:** various components as flagged by T21

Typical findings on a freshly-built site, with fixes:

| Violation | Fix |
|---|---|
| `image-alt`: images missing `alt` | Add `alt=""` for decorative, descriptive alt for content images |
| `color-contrast`: text contrast below 4.5:1 | Tune `text-muted-foreground` or background opacity |
| `button-name`: icon buttons without accessible name | Add `aria-label` |
| `link-name`: link with only icon | Add `aria-label` or visible text |
| `landmark-one-main`: missing `<main>` | Wrap page content in `<main>` (most already done) |
| `region`: content outside landmarks | Wrap orphan blocks in `<section>` or `<aside>` |
| `aria-hidden-focus`: focusable element inside `aria-hidden="true"` | Remove `aria-hidden` or `tabindex="-1"` |
| `frame-title`: iframe missing `title` (Cloudflare Stream, MapTiler embed) | Add `title="..."` to all iframes |

- [ ] **Step 1:** Fix each `serious` and `critical` violation. `moderate` and `minor` are optional but worth doing.

- [ ] **Step 2:** Re-run `node scripts/a11y-scan.mjs` — expect 0 critical/serious violations

- [ ] **Step 3:** Commit per logical group:

```bash
git commit -m "a11y: add alt text to all content images"
git commit -m "a11y: label icon buttons and links"
git commit -m "a11y: improve color contrast on muted text"
git push
```

---

### Task 23: Keyboard navigation walkthrough

**Files:** manual testing + component fixes as needed

- [ ] **Step 1:** On each page, navigate using only Tab / Shift+Tab / Enter / Space

Acceptance:
- Every interactive element is reachable
- Focus indicator is visible (Tailwind `focus-visible:` ring is on shadcn buttons by default — confirm)
- Tab order matches visual order
- Esc closes any open modal / side panel / lightbox (verify ProjectSidePanel, Lightbox)
- Skip-to-main link at top (add if missing — common in `app/layout.tsx`)

- [ ] **Step 2:** Add skip link if missing

In `app/[locale]/layout.tsx`, as the first child of the provider:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2"
>
  Skip to main content
</a>
```

And add `id="main-content"` to each page's `<main>` element.

- [ ] **Step 3:** Commit fixes

```bash
git commit -m "a11y: add skip-to-main link and visible focus styles"
git push
```

---

### Task 24: Screen reader spot-check

**Files:** manual testing

- [ ] **Step 1:** Run NVDA (Windows) or VoiceOver (Mac), navigate Home + About + Projects in browse mode

Acceptance:
- Page heading announces correctly (page title, then H1)
- Landmarks read as "navigation", "main", "footer", "complementary" where appropriate
- Images: decorative ones don't announce, content ones do
- Map pins are reachable via keyboard tab; pin labels are announced
- Language toggle announces "English, current" / "Mongolian, link"

- [ ] **Step 2:** Fix surprising findings (often: misuse of `<div>` where `<button>` should be, missing `role` attributes)

- [ ] **Step 3:** Commit

```bash
git commit -m "a11y: fix screen reader surprises on Projects map and Language toggle"
git push
```

---

### Phase 3.F — Performance pass (T25-T26)

---

### Task 25: Lighthouse audit and fixes

**Files:** varies by finding

- [ ] **Step 1:** Run Lighthouse against staging (Chrome DevTools → Lighthouse tab → Mobile + Desktop)

Run on: `/en`, `/en/projects`, `/en/about`, `/en/gallery`. Capture scores.

Targets:
- Performance: ≥90 desktop, ≥75 mobile (achievable given current Home is 99kB)
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

- [ ] **Step 2:** Address common findings

| Finding | Fix |
|---|---|
| "Properly size images" | Ensure all `<Image>` components have correct `sizes` prop |
| "Serve images in next-gen formats" | Already handled by next/image; verify uploads aren't pre-compressed to JPG with lower quality |
| "Reduce unused JavaScript" | Use bundle analyzer to find oversized chunks; dynamic-import where reasonable |
| "Avoid enormous network payloads" | Check that hero video isn't auto-downloading; use `preload="none"` on `<video>` if used |
| "Eliminate render-blocking resources" | Defer non-critical CSS; usually next/font handles fonts |
| "Largest Contentful Paint" >2.5s | LCP is usually the hero image — ensure it's `priority` on next/image |

- [ ] **Step 3:** Install bundle analyzer

```bash
npm install --save-dev @next/bundle-analyzer
```

Update `next.config.mjs`:

```js
import bundleAnalyzer from '@next/bundle-analyzer';
const withAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
// existing config...
export default withAnalyzer(withNextIntl(nextConfig));
```

Run:

```bash
ANALYZE=true npm run build
```

Opens HTML report. Look for any single chunk >100kB that shouldn't be — dynamic-import the import path.

- [ ] **Step 4:** Apply fixes, commit per category

```bash
git commit -m "perf: dynamic-import lightbox on Gallery page"
git commit -m "perf: priority hint on Home hero image"
git push
```

---

### Task 26: Re-run Lighthouse, confirm targets met

- [ ] **Step 1:** After T25 fixes deploy, re-run Lighthouse on the same 4 pages

- [ ] **Step 2:** Capture scores in `docs/launch-readiness.md`

```markdown
# Launch readiness

## Lighthouse scores (mobile, last run YYYY-MM-DD)

| Page | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| /en | 93 | 98 | 100 | 100 |
| /en/projects | 87 | 97 | 100 | 100 |
| /en/about | 95 | 98 | 100 | 100 |
| /en/gallery | 89 | 97 | 100 | 100 |
```

- [ ] **Step 3:** Commit

```bash
git add docs/launch-readiness.md
git commit -m "docs: record Lighthouse scores post-tuning"
git push
```

---

### Phase 3.G — Cross-browser + responsive (T27-T28)

---

### Task 27: Manual cross-browser test

**Files:** none (manual)

- [ ] **Step 1:** On each browser, walk through Home + Projects + About + Gallery + Contact

- **Desktop Chrome** (current)
- **Desktop Firefox** (current)
- **Desktop Safari** (current — use BrowserStack if no Mac)
- **iOS Safari** (real device or BrowserStack)
- **Android Chrome** (real device or BrowserStack)

- [ ] **Step 2:** Note rendering differences

Common surprises:
- Safari: `aspect-ratio` CSS in older versions; check with iOS 15 baseline
- Safari mobile: `100vh` includes URL bar — use `100svh` instead
- Firefox: scrollbar overlay differs from Chrome — may shift content
- Touch targets <44px on mobile — fix any
- ProjectsMap touch behavior (pinch zoom, pin tap) on mobile

- [ ] **Step 3:** Fix issues, commit

```bash
git commit -m "fix: 100svh for hero on iOS Safari URL bar"
git push
```

---

### Task 28: Responsive breakpoint sweep

**Files:** manual + tweaks

- [ ] **Step 1:** Resize Chrome window from 320px → 1920px continuously, watch for breakages

Common issues:
- Navbar overflows between 768-1024px (6 menu items + language toggle)
- Project map side panel goes full-width too aggressively
- Gallery photo columns reflow awkwardly at intermediate widths
- Office card grid wraps to ugly 1-column at 800px

- [ ] **Step 2:** Adjust breakpoints, commit

```bash
git commit -m "fix: navbar wraps cleanly at 1024px"
git push
```

---

### Phase 3.H — Production cutover (T29-T34)

---

### Task 29: Pre-launch checklist sign-off

**Files:** `docs/launch-readiness.md`

- [ ] **Step 1:** Walk this checklist with the client

```markdown
## Pre-launch

- [ ] All client content reviewed + approved (EN + MN)
- [ ] Lighthouse scores meet targets on Home/Projects/About in both locales
- [ ] All CTAs verified (investor portal URL works, mailto's correct)
- [ ] /admin auth tested by at least one client editor
- [ ] sitemap.xml validates, robots.txt allows everything in prod
- [ ] Cross-browser smoke test passed
- [ ] Vercel env vars set on Production scope
- [ ] DNS TTLs lowered to 300s ≥24h before cutover
- [ ] Old domain redirect ready to flip (client coordinates with their registrar)
- [ ] Editor guide PDF delivered
- [ ] At least one onboarding call completed
```

- [ ] **Step 2:** Get explicit client sign-off in writing (email/Slack)

- [ ] **Step 3:** Lower DNS TTLs on `azzororesources.com` at the registrar to 300s

(Do this ≥24h before T31. The TTL has to expire from caches before the swap is fast.)

- [ ] **Step 4:** Commit checklist

```bash
git commit -m "docs: pre-launch checklist signed off by client"
git push
```

---

### Task 30: Add 301 redirects from old domain paths

**Files:** `next.config.mjs`, plus client-side DNS work

- [ ] **Step 1:** Identify the old paths still receiving traffic

Use Google Search Console on `asianbatterymetals.com` if accessible. Otherwise crawl with `curl` or guess from the site map.

Typical old paths:
- `/` → `/en/`
- `/about/` → `/en/about/`
- `/projects/` → `/en/projects/`
- `/our-team/` → `/en/about/` (consolidated)
- `/sustainability/` → `/en/esg/`
- `/contact/` → `/en/contact/`

- [ ] **Step 2:** Add redirects in `next.config.mjs`

```js
async redirects() {
  return [
    { source: '/about', destination: '/en/about', permanent: true },
    { source: '/projects', destination: '/en/projects', permanent: true },
    { source: '/our-team', destination: '/en/about', permanent: true },
    { source: '/sustainability', destination: '/en/esg', permanent: true },
    { source: '/contact', destination: '/en/contact', permanent: true },
    // Add more as discovered
  ];
}
```

These only fire when the old domain is also pointed at this Vercel deployment. Coordinate with the client:

- [ ] **Step 3:** **[BLOCKED ON CLIENT]** Either point asianbatterymetals.com DNS at Vercel (preferred — our redirects then catch everything) OR have the old hosting service configure 301s to the new domain

- [ ] **Step 4:** Commit

```bash
git add next.config.mjs
git commit -m "feat: 301 redirects from common asianbatterymetals.com paths"
git push
```

---

### Task 31: DNS cutover to azzororesources.com

**Files:** none (DNS)

- [ ] **Step 1:** In Vercel → Project → Settings → Domains, add `azzororesources.com` (apex) and `www.azzororesources.com`

Vercel shows the required DNS records.

- [ ] **Step 2:** **[BLOCKED ON CLIENT]** At the domain registrar, add/replace records

- apex `A` record → Vercel's IP (Vercel displays it; common is `76.76.21.21`)
- `www` CNAME → `cname.vercel-dns.com`

If using Cloudflare in front, set proxy to DNS-only for the apex initially to let Vercel manage TLS.

- [ ] **Step 3:** Wait for SSL provisioning (5-15 min)

Visit `https://azzororesources.com` — expect a green padlock and the new site.

- [ ] **Step 4:** Disable deployment protection on production

Vercel → Settings → Deployment Protection → Production: turn OFF password protection. (Staging stays protected.)

- [ ] **Step 5:** Update Vercel env vars

```
NEXT_PUBLIC_SITE_URL = https://azzororesources.com   (on Production scope)
```

Redeploy. This propagates the canonical URL into sitemap, metadata, etc.

- [ ] **Step 6:** Commit

```bash
git commit --allow-empty -m "launch: cutover to https://azzororesources.com"
git push
```

---

### Task 32: Submit sitemap to search engines

**Files:** none

- [ ] **Step 1:** Verify ownership of `azzororesources.com` in Google Search Console

https://search.google.com/search-console → Add Property → DNS verification (add TXT record).

- [ ] **Step 2:** Submit sitemap

In Search Console → Sitemaps → enter `https://azzororesources.com/sitemap.xml` → Submit. Google starts crawling.

- [ ] **Step 3:** Repeat for Bing Webmaster Tools

https://www.bing.com/webmasters → Add Site → submit sitemap.

- [ ] **Step 4:** Request indexing of high-priority URLs

In Search Console → URL Inspection → enter the homepage URL → Request Indexing. Repeat for /about, /projects, /investor-center (the external link — won't index, but flag for completeness).

---

### Task 33: Update social profiles + external mentions

**Files:** none (client side)

- [ ] **Step 1:** **[BLOCKED ON CLIENT]** Client updates LinkedIn company page URL and bio

- [ ] **Step 2:** **[BLOCKED ON CLIENT]** Client updates Twitter/X bio if used

- [ ] **Step 3:** **[BLOCKED ON CLIENT]** Client coordinates with PR/IR partners to update any cached company-info entries (Bloomberg, FT, etc.)

---

### Task 34: Production smoke test

**Files:** none (manual)

- [ ] **Step 1:** From a fresh browser session, walk through the production URL

Verify:
- All pages load over HTTPS
- All locales work
- All CTAs go to correct destinations
- Projects map renders
- Stock card renders (or gracefully degrades)
- /admin loads + auth works for client editor account

- [ ] **Step 2:** Run Lighthouse once more on the production URL — confirm scores hold

- [ ] **Step 3:** Capture confirmation

Update `docs/launch-readiness.md`:

```markdown
## Launched: YYYY-MM-DD HH:MM TZ
- URL: https://azzororesources.com
- All pre-launch checks: ✓
- Production Lighthouse: <scores>
```

```bash
git commit -m "launch: production verified, site live"
git push
```

---

### Phase 3.I — Post-launch + cleanup (T35-T40)

---

### Task 35: Monitor for 48 hours

**Files:** `docs/post-launch.md`

- [ ] **Step 1:** Watch Vercel deploy logs daily

```bash
vercel logs --follow
```

Look for: 500 errors, slow function executions, failed deploys, stock API rate-limit errors.

- [ ] **Step 2:** Watch Vercel Analytics

Vercel Dashboard → Analytics tab. Confirm traffic, watch for unusually high 404 rate.

- [ ] **Step 3:** Watch Search Console crawl errors

Daily for first week, weekly thereafter.

- [ ] **Step 4:** Log any anomalies in `docs/post-launch.md`

---

### Task 36: Address first round of client edit confusions

- [ ] **Step 1:** When the client asks "how do I X?", do it once on a screen-share, then update `docs/editor-guide.md` with the answer

- [ ] **Step 2:** If a structural fix is needed (e.g., they want a field that doesn't exist), add to a Phase-2-of-the-business backlog. Don't reactively patch the schema mid-launch.

---

### Task 37: Remove src.legacy/ and unused deps

**Files:** delete `src.legacy/`, modify `package.json` if unused deps found

- [ ] **Step 1:** Confirm nothing imports from src.legacy

```bash
git grep "src.legacy"
```

Expected: no matches.

- [ ] **Step 2:** Delete

```bash
git rm -r src.legacy
```

- [ ] **Step 3:** Run depcheck to find unused deps

```bash
npx depcheck
```

Common false positives to ignore: `tailwind-merge`, `class-variance-authority`, `@types/*`. Remove genuine orphans:

```bash
npm uninstall <unused-package>
```

- [ ] **Step 4:** Verify build still passes

```bash
npm run build && npm run typecheck && npm test
```

- [ ] **Step 5:** Commit

```bash
git add -A
git commit -m "chore: remove src.legacy and unused dependencies"
git push
```

---

### Task 38: Final repo housekeeping

**Files:** `README.md`, `CHANGELOG.md` (new)

- [ ] **Step 1:** Update `README.md`

Replace the stale Vite-era documentation. Cover:
- Stack
- How to run locally (npm install, .env.local, npm run dev)
- How content editing works (/admin)
- How to contribute (open PR, Vercel previews)
- Where docs live (specs, plans, editor guide, admin setup)

- [ ] **Step 2:** Create `CHANGELOG.md`

```markdown
# Changelog

## 1.0.0 — YYYY-MM-DD (Launch)
- Initial Azzuro Resources website
- Migrated from POC to Next.js 14 App Router
- Bilingual EN/MN with Sveltia CMS
- Interactive projects map with side panel
- Cloudflare Stream hero video
- Stock price card (Yahoo Finance)
- Investor portal feed integration
```

- [ ] **Step 3:** Commit

```bash
git add README.md CHANGELOG.md
git commit -m "docs: launch README + initial CHANGELOG"
git push
```

---

### Task 39: Tag the release

**Files:** git tag

- [ ] **Step 1:** Tag and push

```bash
git tag -a v1.0.0 -m "Launch: Azzuro Resources website"
git push origin v1.0.0
```

- [ ] **Step 2:** Create a GitHub release from the tag

`gh release create v1.0.0 --notes-from-tag` (or via UI).

---

### Task 40: Handoff document for client + ongoing maintenance plan

**Files:** `docs/handoff.md`

- [ ] **Step 1:** Create the file

```markdown
# Azzuro Resources — Handoff Document

## What you got

- Live website at https://azzororesources.com
- Sveltia /admin at https://azzororesources.com/admin for self-service content edits
- Editor guide PDF (see docs/editor-guide.pdf)
- Plan 3 launch readiness doc (see docs/launch-readiness.md)
- This handoff doc

## What you own

- Editing content via /admin (no dev needed)
- Final review of EN/MN copy
- Real photos/videos for team and gallery
- Governance documents
- Stock ticker once finalized
- Investor portal feed URL

## What the dev team owns

- Hosting (Vercel)
- DNS (or coordinate with you — depends on registrar access)
- Sveltia GitHub App
- Code patches and upgrades
- Schema changes (adding new CMS fields)
- Quarterly dependency updates

## Ongoing costs

| Service | Monthly cost |
|---|---|
| Vercel | $0 (Hobby plan; upgrade to Pro at $20/mo when traffic warrants) |
| Cloudflare Stream | $5/mo for first 1000 minutes |
| MapTiler | $0 (free tier covers 100k loads/mo) |
| GitHub | $0 |

## Support model

<dev-contact-info>
- Bug reports / urgent issues: email
- Feature requests: open GitHub issue
- Content questions: editor guide first, then ping
```

- [ ] **Step 2:** Commit

```bash
git add docs/handoff.md
git commit -m "docs: client handoff document"
git push
```

---

## Plan 3 done — what's launched

After all 40 tasks:

- `azzororesources.com` live and indexed
- All real client content in place (or as close to it as the client provided)
- /admin auth working for at least one client editor
- Lighthouse ≥90 perf, ≥95 a11y/BP/SEO on key pages
- 301 redirects from old domain catching legacy traffic
- Cloudflare Stream hero video (if footage provided)
- Investor news section live (if feed exists)
- Cross-browser tested, screen-reader sane
- Sitemap submitted to Google + Bing
- Editor guide PDF + handoff doc delivered
- Codebase clean (src.legacy gone, unused deps pruned)
- Tagged release v1.0.0

**You are done with the website rebuild.** Post-launch becomes maintenance mode: dependency updates, occasional schema changes, responding to client edit questions.

---

## What's deliberately NOT in any of the three plans

Things the client may want next but were never in scope:

- Newsletter signup form
- Dedicated blog system beyond investor news
- Multi-author editorial workflow with draft/review/publish gating
- Logged-in investor portal beyond the external link-out
- Real-time data feeds beyond the stock card
- Mobile app or PWA install banner
- Site-wide search
- A/B testing infrastructure
- E-commerce features
- Custom analytics dashboards

Any of these become a Phase 2 conversation post-launch, scoped and planned separately.
