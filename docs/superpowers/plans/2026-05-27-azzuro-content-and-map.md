# Azzuro Resources — Content & Map Implementation Plan (Plan 2 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the foundation site real. Add the interactive projects map, full About/Gallery pages with all their sub-components, finish ESG/Contact wiring, integrate Cloudflare Stream hero video + stock price API + investor news feed, and seed real EN content (with MN translation drafts) into all CMS files.

**Architecture:** Build on Plan 1's foundation (Next.js 14 App Router, next-intl, Sveltia CMS, typed content loaders, blue brand tokens). New interactive components are React client islands (`'use client'`) dynamically imported to keep bundles small. External integrations (stock, news) are server-side API routes with stale-while-revalidate caching. Content seeding is an operational task — AI-drafted markdown applied to existing CMS files.

**Tech Stack additions vs Plan 1:** maplibre-gl, yet-another-react-lightbox, react-markdown (for rendering long-form bodies), @cloudflare/stream-react (or plain iframe), date-fns (already in package.json from POC).

**Reference spec:** `docs/superpowers/specs/2026-05-27-azzuro-website-renewal-design.md`

**What Plan 1 already shipped (skip in this plan):**
- Next.js + i18n + middleware infrastructure
- All 6 sub-route pages render with placeholder content
- Home page sections (HeroSection, IntroSection, WhatWeDo, ESGSection, FooterCards) ported and wired to CMS
- Shared layout (Navbar, Footer, LanguageToggle, PartnerLogos)
- Typed CMS loaders for `.md` and `.yml`
- Sveltia /admin shell with all collections defined
- robots.txt, sitemap.xml with hreflang

**Out of scope for this plan:** accessibility audit, performance tuning, production DNS cutover, client onboarding session, editor guide PDF, 301 redirects from old domain. All deferred to Plan 3.

---

## Blocked-on-client items

These tasks can't fully execute without client input. The plan flags them with **[BLOCKED ON CLIENT]** and provides a placeholder path so partial execution unblocks itself.

| Item | Needed for tasks | Workaround |
|---|---|---|
| MapTiler API key | Map (T7-T12) | Use OpenStreetMap raster fallback in dev |
| Cloudflare Stream account ID + video UID | Hero video (T39-T41) | Use `poster` image fallback |
| Stock ticker symbol (post-rebrand) | Stock card (T35-T36) | Hardcode `ABM.L` for now, swap later |
| Investor portal news feed URL/format | News pull (T37-T38) | Skip the home news section if no feed exists |
| Real project geo coordinates | Map pin placement (T11) | Current placeholders are sufficient for visual testing |
| Real board/team photos + bios | About page seed (T46) | Use placeholder text + initials avatars |
| Real governance PDFs | Governance list (T22-T24) | Use placeholder PDF |
| Real gallery photos + videos | Gallery seed (T48-T49) | Use placeholder images from Unsplash |

---

## File structure added in this plan

```
app/
├── [locale]/
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx                        Project detail page (new)
│   └── gallery/
│       └── case-studies/
│           └── [slug]/
│               └── page.tsx                    Case study detail (new)
└── api/
    ├── stock-price/route.ts                    (new)
    └── investor-news/route.ts                  (new)
components/
├── projects/
│   ├── ProjectsMap.tsx                         Client island (new)
│   ├── ProjectSidePanel.tsx                    (new)
│   ├── ProjectsMapWithFilters.tsx              (new) wraps ProjectsMap with commodity chips
│   └── ProjectDetailHero.tsx                   (new)
├── about/
│   ├── TeamGrid.tsx                            (new)
│   ├── TeamMemberCard.tsx                      (new, with bio reveal)
│   └── GovernanceList.tsx                      (new)
├── esg/
│   └── ESGFullPage.tsx                         (new)
├── contact/
│   ├── OfficeCard.tsx                          (new)
│   └── PhoneDropdown.tsx                       (new)
├── gallery/
│   ├── PhotoMasonry.tsx                        Client island (new)
│   ├── VideoGrid.tsx                           (new)
│   ├── CaseStudyCard.tsx                       (new)
│   └── CaseStudyArticle.tsx                    (new)
├── home/
│   ├── StockPriceCard.tsx                      Client island (new, fetches API)
│   ├── LatestNewsSection.tsx                   Server component reading /api/investor-news
│   ├── ProjectsMapPreview.tsx                  Smaller static-leaning map (new)
│   └── CloudflareStreamHero.tsx                Hero video wrapper (new)
└── shared/
    ├── MarkdownBody.tsx                        react-markdown wrapper (new)
    └── PDFDownloadButton.tsx                   (new)
lib/
├── content/
│   └── loadGlobal.ts                           Loader for non-i18n files (new)
├── map/
│   ├── tiles.ts                                MapTiler / OSM tile URL switcher (new)
│   └── markers.ts                              Pin styling per commodity (new)
└── stock/
    └── fetch.ts                                Cached fetcher (new)
content/
├── projects/                                   3 real projects (oval, khukh-tag, tsagaan-ders)
├── team/                                       Real team entries (board + technical)
├── governance/                                 Placeholder PDFs + metadata
├── gallery/photos/                             ~10 seed photos
├── gallery/videos/                             0-2 seed videos (Stream UIDs)
└── gallery/case-studies/                       1-2 seed case studies
public/uploads/
├── hero-poster.jpg                             Static fallback for hero video
├── projects/                                   Project hero images
├── team/                                       Team headshots (placeholder)
└── governance/                                 Placeholder PDFs
```

---

## Tasks

### Phase 2.A — External integrations setup (T1-T6)

---

### Task 1: Install map + content rendering dependencies

**Files:** `package.json`

- [ ] **Step 1:** Install runtime deps

Run:
```bash
npm install maplibre-gl react-markdown remark-gfm yet-another-react-lightbox
```

- [ ] **Step 2:** Install type deps (only those without bundled types)

Run:
```bash
npm install --save-dev @types/react-markdown
```

(maplibre-gl ships its own types.)

- [ ] **Step 3:** Verify typecheck still passes

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4:** Commit

```bash
git add package.json package-lock.json
git commit -m "chore: add maplibre-gl, react-markdown, lightbox deps"
```

---

### Task 2: Add MapTiler + Cloudflare Stream env vars

**Files:** `.env.example`, Vercel dashboard

- [ ] **Step 1:** Create or update `.env.example`

Write `.env.example`:

```
# Map tiles (https://www.maptiler.com/cloud/)
NEXT_PUBLIC_MAPTILER_KEY=

# Cloudflare Stream (https://dash.cloudflare.com/?to=/:account/stream)
NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID=

# Stock price (server-only)
STOCK_API_PROVIDER=yahoo           # yahoo | alphavantage
STOCK_API_KEY=
STOCK_TICKER_FALLBACK=ABM.L         # used until ticker confirmed post-rebrand

# Investor portal news feed
INVESTOR_FEED_URL=

# Public site URL (canonical)
NEXT_PUBLIC_SITE_URL=https://staging.azzororesources.com
```

- [ ] **Step 2:** Copy to `.env.local` (gitignored) with real values where you have them

Run:
```bash
cp .env.example .env.local
```

Then fill in values you already have. **[BLOCKED ON CLIENT]** items can stay blank.

- [ ] **Step 3:** Add the same vars to Vercel (Project → Settings → Environment Variables)

Match `.env.local`. Scope to Production + Preview.

- [ ] **Step 4:** Commit `.env.example` only (never `.env.local`)

```bash
git add .env.example
git commit -m "feat: document required env vars in .env.example"
```

---

### Task 3: Create MapTiler / OSM tile URL switcher

**Files:** `lib/map/tiles.ts`

A single helper that returns the right tile URL based on whether `NEXT_PUBLIC_MAPTILER_KEY` is set. Lets us develop the map without a MapTiler account.

- [ ] **Step 1:** Create the file

```ts
const MAPTILER_STYLE = 'topo-v2';

export type MapStyle = {
  version: 8;
  sources: Record<string, unknown>;
  layers: Array<Record<string, unknown>>;
  glyphs?: string;
};

export function getMapStyleUrl(): string {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (key) {
    return `https://api.maptiler.com/maps/${MAPTILER_STYLE}/style.json?key=${key}`;
  }
  // Fallback: an inline raster style backed by OpenStreetMap (dev only)
  return `/api/map-fallback-style`;
}

export function isUsingFallback(): boolean {
  return !process.env.NEXT_PUBLIC_MAPTILER_KEY;
}
```

- [ ] **Step 2:** Commit

```bash
git add lib/map/tiles.ts
git commit -m "feat: add MapTiler tile URL helper with OSM fallback flag"
```

---

### Task 4: Create OSM raster fallback API route

**Files:** `app/api/map-fallback-style/route.ts`

Returns a MapLibre style JSON pointing at OpenStreetMap tile servers. Used in dev when MapTiler key is absent. Tile servers used directly require a `User-Agent` and rate-limit guidance — for *dev only*, this is acceptable.

- [ ] **Step 1:** Create the file

```ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const FALLBACK_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export function GET() {
  return NextResponse.json(FALLBACK_STYLE);
}
```

- [ ] **Step 2:** Commit

```bash
git add app/api/map-fallback-style/route.ts
git commit -m "feat: add OSM raster fallback style for dev without MapTiler"
```

---

### Task 5: Create commodity → pin color/icon mapping

**Files:** `lib/map/markers.ts`

- [ ] **Step 1:** Create the file

```ts
export type CommodityKey = 'Nickel' | 'Copper' | 'PGE' | 'Gold' | 'Graphite' | 'Lithium' | 'Other';

const COMMODITY_COLORS: Record<CommodityKey, string> = {
  Nickel: '#3b82f6',     // blue
  Copper: '#f97316',     // orange
  PGE: '#a855f7',        // purple
  Gold: '#eab308',       // yellow
  Graphite: '#374151',   // dark gray
  Lithium: '#10b981',    // emerald
  Other: '#6b7280',      // neutral
};

export function colorForCommodity(commodity: string): string {
  return COMMODITY_COLORS[commodity as CommodityKey] ?? COMMODITY_COLORS.Other;
}

export function primaryCommodityColor(commodities: string[]): string {
  if (commodities.length === 0) return COMMODITY_COLORS.Other;
  return colorForCommodity(commodities[0]);
}
```

- [ ] **Step 2:** Commit

```bash
git add lib/map/markers.ts
git commit -m "feat: define pin color per commodity for projects map"
```

---

### Task 6: Add loadGlobal for non-i18n CMS files

**Files:** `lib/content/loadGlobal.ts`, `lib/content/loadGlobal.test.ts`

The existing `loadSingleton` supports optional locale, but a dedicated `loadGlobal` is clearer at call sites for files like `site.yml` and individual partner entries.

- [ ] **Step 1:** Write the failing test

`lib/content/loadGlobal.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { loadGlobal } from './loadGlobal';

describe('loadGlobal', () => {
  it('reads a global YAML file', async () => {
    const result = await loadGlobal<{ label: string }>('test-fixtures/global');
    expect(result.label).toBe('Global fixture');
  });

  it('throws on missing file', async () => {
    await expect(loadGlobal('test-fixtures/missing')).rejects.toThrow();
  });
});
```

- [ ] **Step 2:** Run test, verify it fails

Run: `npm test -- loadGlobal`
Expected: FAIL — "Cannot find module './loadGlobal'"

- [ ] **Step 3:** Write the loader

`lib/content/loadGlobal.ts`:

```ts
import { loadSingleton } from './loadSingleton';

export async function loadGlobal<T extends Record<string, unknown>>(
  slug: string
): Promise<T> {
  const result = await loadSingleton<T>(slug);
  // Strip the `markdown` field if present
  const { markdown: _markdown, ...rest } = result as T & { markdown?: string };
  return rest as T;
}
```

- [ ] **Step 4:** Run test, verify it passes

Run: `npm test -- loadGlobal`
Expected: 2 tests pass.

- [ ] **Step 5:** Commit

```bash
git add lib/content/
git commit -m "feat: add loadGlobal wrapper for non-i18n CMS files"
```

---

### Phase 2.B — Projects map and detail pages (T7-T15)

---

### Task 7: Create the ProjectsMap client component

**Files:** `components/projects/ProjectsMap.tsx`

- [ ] **Step 1:** Create the file

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Project } from '@/lib/content/types';
import { getMapStyleUrl } from '@/lib/map/tiles';
import { primaryCommodityColor } from '@/lib/map/markers';
import { ProjectSidePanel } from './ProjectSidePanel';

type Props = {
  projects: Project[];
  initialCenter?: [number, number];
  initialZoom?: number;
};

export function ProjectsMap({
  projects,
  initialCenter = [105, 47],
  initialZoom = 5,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center: initialCenter,
      zoom: initialZoom,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    const markers: Marker[] = [];
    projects.forEach((p) => {
      const el = document.createElement('button');
      el.className = 'project-pin';
      el.style.cssText = `
        width: 28px; height: 28px; border-radius: 50%;
        background: ${primaryCommodityColor(p.commodity)};
        border: 3px solid white;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
        cursor: pointer;
      `;
      el.setAttribute('aria-label', `Open ${p.title}`);
      el.addEventListener('click', () => setSelected(p));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [projects, initialCenter, initialZoom]);

  return (
    <div className="relative h-[70vh] w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {selected && (
        <ProjectSidePanel project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/projects/ProjectsMap.tsx
git commit -m "feat: add ProjectsMap client island with MapLibre pins"
```

---

### Task 8: Create the ProjectSidePanel component

**Files:** `components/projects/ProjectSidePanel.tsx`

- [ ] **Step 1:** Create the file

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import type { Project } from '@/lib/content/types';
import { useLocale } from 'next-intl';
import { primaryCommodityColor } from '@/lib/map/markers';

type Props = {
  project: Project;
  onClose: () => void;
};

export function ProjectSidePanel({ project, onClose }: Props) {
  const locale = useLocale();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside
      role="dialog"
      aria-label={project.title}
      className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl border-l border-border overflow-y-auto md:max-w-md"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project details"
        className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background"
      >
        ✕
      </button>
      {project.hero_image && (
        <div className="relative h-48 w-full">
          <Image
            src={project.hero_image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="448px"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.commodity.map((c) => (
            <span
              key={c}
              className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full text-white"
              style={{ background: primaryCommodityColor([c]) }}
            >
              {c}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.region} · {project.status}
        </p>
        <p className="mt-4 text-sm leading-relaxed">{project.summary}</p>
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          View full project →
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/projects/ProjectSidePanel.tsx
git commit -m "feat: add ProjectSidePanel with image, commodity badges, CTA"
```

---

### Task 9: Create ProjectsMapWithFilters wrapper

**Files:** `components/projects/ProjectsMapWithFilters.tsx`

Wraps `ProjectsMap` with commodity filter chips. Kept in its own file so the page component imports a single thing.

- [ ] **Step 1:** Create the file

```tsx
'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/lib/content/types';
import { ProjectsMap } from './ProjectsMap';

type Props = { projects: Project[] };

export function ProjectsMapWithFilters({ projects }: Props) {
  const allCommodities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.commodity.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [projects]);

  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? projects.filter((p) => p.commodity.includes(active)) : projects),
    [projects, active]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`text-xs px-3 py-1.5 rounded-full border ${
            active === null
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:bg-muted'
          }`}
        >
          All
        </button>
        {allCommodities.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              active === c
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <ProjectsMap projects={filtered} />
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/projects/ProjectsMapWithFilters.tsx
git commit -m "feat: add commodity filter chips wrapping ProjectsMap"
```

---

### Task 10: Wire Projects page to render the map

**Files:** `app/[locale]/projects/page.tsx`

- [ ] **Step 1:** Replace the placeholder page

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { ProjectsMapWithFilters } from '@/components/projects/FilterChips';

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const projects = await loadCollection<Project>('projects', locale);

  return (
    <main className="container-wide py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Click any pin to view project details. Filter by commodity to narrow the view.
        </p>
      </header>
      <ProjectsMapWithFilters projects={projects} />
    </main>
  );
}
```

- [ ] **Step 2:** Verify in dev

Run `npm run dev`. Visit `/en/projects` — expect the map to render with one pin (the OVAL placeholder) somewhere over Mongolia. Click the pin — side panel opens. Filter chips render with one commodity. Esc closes the panel.

Stop dev.

- [ ] **Step 3:** Commit

```bash
git add app/[locale]/projects/page.tsx
git commit -m "feat: wire projects page to render interactive map"
```

---

### Task 11: Seed 2 more real projects (KHUKH TAG, TSAGAAN DERS)

**Files:** `content/projects/khukh-tag.{en,mn}.md`, `content/projects/tsagaan-ders.{en,mn}.md`

- [ ] **Step 1:** Create `content/projects/khukh-tag.en.md`

```markdown
---
title: "KHUKH TAG"
commodity:
  - Graphite
status: "Active exploration"
region: "Northern Mongolia"
lat: 50.2
lng: 100.3
license_area_km2: 45
acquired_date: "2021-06-15"
hero_image: "/uploads/projects/khukh-tag-hero.jpg"
summary: "One of the highest-grade graphite deposits in Mongolia, with logistics and operational advantages."
---

The KHUKH TAG project hosts a graphite resource notable for its grade and accessibility. Detailed geology, sampling history, and drilling program details are managed in /admin.

Real content will be added during client review of Plan 2.
```

- [ ] **Step 2:** Create `content/projects/khukh-tag.mn.md`

Same shape with translated `title` (e.g. "ХӨХ ТАГ"), `region` ("Хойд Монгол"), `summary` ("Монгол улсын хамгийн өндөр агуулгатай бал чулууны ордуудын нэг..."), and translated body.

- [ ] **Step 3:** Create `content/projects/tsagaan-ders.en.md`

```markdown
---
title: "TSAGAAN DERS"
commodity:
  - Lithium
status: "Resource definition"
region: "Southern Mongolia"
lat: 43.5
lng: 105.8
license_area_km2: 78
acquired_date: "2022-09-01"
hero_image: "/uploads/projects/tsagaan-ders-hero.jpg"
summary: "Proterozoic metasedimentary sequences cut by Devonian felsic intrusions and Permian volcanic complexes."
---

Lithium project with active resource definition drilling. Geology and exploration history maintained in /admin.
```

- [ ] **Step 4:** Create `content/projects/tsagaan-ders.mn.md` with translated fields

- [ ] **Step 5:** Copy hero images from src.legacy assets to public/uploads/projects/

```bash
mkdir -p public/uploads/projects
cp src.legacy/assets/CP11687-scaled.jpg public/uploads/projects/khukh-tag-hero.jpg
cp src.legacy/assets/DJI_0315-scaled.jpg public/uploads/projects/tsagaan-ders-hero.jpg
cp src.legacy/assets/RPNE8993-scaled.jpg public/uploads/projects/oval-hero.jpg
```

(Adjust filenames to match what's actually in src.legacy/assets/ — these are placeholders.)

- [ ] **Step 6:** Update `content/projects/oval.en.md` to reference `/uploads/projects/oval-hero.jpg`

(And the .mn.md file.)

- [ ] **Step 7:** Verify in dev — three pins visible, filter chips show "Graphite", "Lithium", "Nickel", "Copper", "PGE"

- [ ] **Step 8:** Commit

```bash
git add content/projects/ public/uploads/projects/
git commit -m "feat: seed KHUKH TAG and TSAGAAN DERS projects with hero images"
```

**Note:** Coordinates are approximate. **[BLOCKED ON CLIENT]** for the exact lat/lng of each project's primary license area.

---

### Task 12: Create ProjectDetailHero component

**Files:** `components/projects/ProjectDetailHero.tsx`

- [ ] **Step 1:** Create the file

```tsx
import Image from 'next/image';
import type { Project } from '@/lib/content/types';
import { primaryCommodityColor } from '@/lib/map/markers';

type Props = { project: Project };

export function ProjectDetailHero({ project }: Props) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {project.hero_image && (
        <Image
          src={project.hero_image}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 container-wide pb-12 text-white">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.commodity.map((c) => (
            <span
              key={c}
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: primaryCommodityColor([c]) }}
            >
              {c}
            </span>
          ))}
        </div>
        <h1 className="text-5xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-3 text-lg opacity-90">
          {project.region} · {project.status}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/projects/ProjectDetailHero.tsx
git commit -m "feat: add ProjectDetailHero with image, commodities, region"
```

---

### Task 13: Create MarkdownBody component

**Files:** `components/shared/MarkdownBody.tsx`

Used by all long-form pages (project body, case study body, about story, ESG approach).

- [ ] **Step 1:** Create the file

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = { children: string; className?: string };

export function MarkdownBody({ children, className }: Props) {
  return (
    <div className={`prose prose-neutral max-w-none ${className ?? ''}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/shared/MarkdownBody.tsx
git commit -m "feat: add MarkdownBody using react-markdown + gfm"
```

---

### Task 14: Create the project detail page

**Files:** `app/[locale]/projects/[slug]/page.tsx`

- [ ] **Step 1:** Create the file

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectDetailHero } from '@/components/projects/ProjectDetailHero';
import { MarkdownBody } from '@/components/shared/MarkdownBody';

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    const projects = await loadCollection<Project>('projects', locale);
    for (const p of projects) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const projects = await loadCollection<Project>('projects', locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const nearby = projects
    .filter((p) => p.slug !== slug && p.region === project.region)
    .slice(0, 3);

  return (
    <main>
      <ProjectDetailHero project={project} />

      <section className="container-wide py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <MarkdownBody>{project.body}</MarkdownBody>
        </div>
        <aside className="space-y-4">
          {project.data_cards?.map((card) => (
            <div key={card.label} className="rounded-2xl border border-border p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {card.label}
              </div>
              <div className="mt-1 text-lg font-semibold">{card.value}</div>
            </div>
          ))}
          {project.license_area_km2 && (
            <div className="rounded-2xl border border-border p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                License area
              </div>
              <div className="mt-1 text-lg font-semibold">
                {project.license_area_km2} km²
              </div>
            </div>
          )}
          {project.acquired_date && (
            <div className="rounded-2xl border border-border p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Acquired
              </div>
              <div className="mt-1 text-lg font-semibold">
                {new Date(project.acquired_date).getFullYear()}
              </div>
            </div>
          )}
        </aside>
      </section>

      {nearby.length > 0 && (
        <section className="bg-muted py-16">
          <div className="container-wide">
            <h2 className="text-2xl font-bold mb-8">Nearby projects</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {nearby.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/projects/${p.slug}`}
                  className="rounded-2xl border border-border bg-background p-6 hover:border-primary"
                >
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.region}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2:** Verify

Run `npm run dev`. Visit `/en/projects/oval`, `/en/projects/khukh-tag`, `/en/projects/tsagaan-ders`. Each renders hero + body + data cards + nearby (which will be empty unless 2+ share a region — that's fine).

- [ ] **Step 3:** Commit

```bash
git add app/[locale]/projects/[slug]/page.tsx
git commit -m "feat: add project detail page with hero, body, data cards, nearby"
```

---

### Task 15: Smaller projects map preview for Home page

**Files:** `components/home/ProjectsMapPreview.tsx`, modify `app/[locale]/page.tsx`

- [ ] **Step 1:** Create the preview component

```tsx
'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { Project } from '@/lib/content/types';
import { getMapStyleUrl } from '@/lib/map/tiles';
import { primaryCommodityColor } from '@/lib/map/markers';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type Props = { projects: Project[] };

export function ProjectsMapPreview({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center: [105, 47],
      zoom: 4,
      interactive: false,
    });
    projects.forEach((p) => {
      const el = document.createElement('div');
      el.style.cssText = `width:18px;height:18px;border-radius:50%;background:${primaryCommodityColor(p.commodity)};border:2px solid white;`;
      new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map);
    });
    return () => map.remove();
  }, [projects]);

  return (
    <section className="container-wide py-16">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Our projects</h2>
        <Link href={`/${locale}/projects`} className="text-primary font-semibold hover:underline">
          Explore all projects →
        </Link>
      </div>
      <div ref={containerRef} className="h-[400px] w-full rounded-2xl overflow-hidden" />
    </section>
  );
}
```

- [ ] **Step 2:** Add to home page

In `app/[locale]/page.tsx`, after loading projects via `loadCollection<Project>('projects', locale)`, render `<ProjectsMapPreview projects={projects} />` between `WhatWeDo` and `ESGSection` (or wherever fits the existing flow).

- [ ] **Step 3:** Verify

Run dev, visit `/en` — small static-feel map between intro sections.

- [ ] **Step 4:** Commit

```bash
git add components/home/ProjectsMapPreview.tsx app/[locale]/page.tsx
git commit -m "feat: add embedded map preview on home page"
```

---

### Phase 2.C — About page (T16-T24)

---

### Task 16: Create TeamMemberCard with bio reveal

**Files:** `components/about/TeamMemberCard.tsx`

- [ ] **Step 1:** Create the file

```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { TeamMember } from '@/lib/content/types';
import { MarkdownBody } from '@/components/shared/MarkdownBody';

type Props = { member: TeamMember };

export function TeamMemberCard({ member }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left"
      >
        <div className="relative aspect-square w-full bg-muted">
          {member.photo ? (
            <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground">
              {member.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="font-semibold">{member.name}</div>
          <div className="text-sm text-muted-foreground mt-1">{member.role}</div>
        </div>
      </button>
      {open && member.bio && (
        <div className="p-4 border-t border-border bg-muted/50">
          <MarkdownBody>{member.bio}</MarkdownBody>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/about/TeamMemberCard.tsx
git commit -m "feat: add TeamMemberCard with click-to-reveal bio"
```

---

### Task 17: Create TeamGrid component

**Files:** `components/about/TeamGrid.tsx`

- [ ] **Step 1:** Create the file

```tsx
import type { TeamMember } from '@/lib/content/types';
import { TeamMemberCard } from './TeamMemberCard';

type Props = {
  members: TeamMember[];
  section: 'Board' | 'Technical';
  heading: string;
};

export function TeamGrid({ members, section, heading }: Props) {
  const filtered = members
    .filter((m) => m.team_section === section)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (filtered.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">{heading}</h2>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((m) => (
          <TeamMemberCard key={m.slug} member={m} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/about/TeamGrid.tsx
git commit -m "feat: add TeamGrid filtering members by section"
```

---

### Task 18: Create PDFDownloadButton

**Files:** `components/shared/PDFDownloadButton.tsx`

- [ ] **Step 1:** Create the file

```tsx
type Props = { href: string; label: string };

export function PDFDownloadButton({ href, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      {label}
    </a>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/shared/PDFDownloadButton.tsx
git commit -m "feat: add PDFDownloadButton"
```

---

### Task 19: Create GovernanceList component

**Files:** `components/about/GovernanceList.tsx`

- [ ] **Step 1:** Create the file

```tsx
import type { GovernanceDocument } from '@/lib/content/types';
import { PDFDownloadButton } from '@/components/shared/PDFDownloadButton';

const CATEGORIES: GovernanceDocument['category'][] = [
  'Constitution',
  'Charters',
  'Policies',
  'Reports',
  'Disclosures',
];

type Props = { documents: GovernanceDocument[] };

export function GovernanceList({ documents }: Props) {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Governance documents</h2>
      <div className="space-y-12">
        {CATEGORIES.map((cat) => {
          const docs = documents.filter((d) => d.category === cat);
          if (docs.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-xl font-semibold mb-4">{cat}</h3>
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li key={d.slug} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                    <div>
                      <div className="font-medium">{d.title}</div>
                      {d.description && (
                        <div className="text-sm text-muted-foreground mt-1">{d.description}</div>
                      )}
                      {d.effective_date && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Effective: {new Date(d.effective_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <PDFDownloadButton href={d.file} label="Download PDF" />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/about/GovernanceList.tsx
git commit -m "feat: add GovernanceList grouped by category"
```

---

### Task 20: Wire About page

**Files:** `app/[locale]/about/page.tsx`

- [ ] **Step 1:** Replace placeholder

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { loadCollection } from '@/lib/content/loadCollection';
import type { AboutContent, TeamMember, GovernanceDocument } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import { TeamGrid } from '@/components/about/TeamGrid';
import { GovernanceList } from '@/components/about/GovernanceList';

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [about, team, governance] = await Promise.all([
    loadSingleton<AboutContent>('pages/about', locale),
    loadCollection<TeamMember>('team', locale),
    loadCollection<GovernanceDocument>('governance', locale),
  ]);

  return (
    <main className="container-wide py-16">
      <h1 className="text-5xl font-bold mb-12">About Azzuro</h1>

      <section className="grid gap-12 lg:grid-cols-2 mb-16">
        <MarkdownBody>{about.story_body}</MarkdownBody>
        <div>
          <h2 className="text-2xl font-bold mb-4">Mission</h2>
          <p className="text-lg">{about.mission}</p>
          {about.values?.length > 0 && (
            <div className="mt-8 grid gap-4">
              {about.values.map((v) => (
                <div key={v.title} className="border-l-4 border-primary pl-4">
                  <div className="font-semibold">{v.title}</div>
                  <div className="text-sm text-muted-foreground">{v.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <TeamGrid members={team} section="Board" heading="Board of Directors" />
      <TeamGrid members={team} section="Technical" heading="Technical Team" />

      <section id="governance" className="py-12">
        <MarkdownBody>{about.leadership_governance_body}</MarkdownBody>
      </section>

      <GovernanceList documents={governance} />
    </main>
  );
}
```

- [ ] **Step 2:** Verify

Run dev, visit `/en/about`. Confirm story + mission + values + Board + Technical + governance render. Governance section may be empty if no docs seeded yet — that's fine.

- [ ] **Step 3:** Commit

```bash
git add app/[locale]/about/page.tsx
git commit -m "feat: wire About page with team grids + governance list"
```

---

### Task 21: Seed real team members (board + technical)

**Files:** `content/team/<slug>.{en,mn}.md`

Per spec Section 4.2, technical team gets new Mongolian members: Otgonjargal Bayarbat, Batkhurel Battulga, Purevdorj Dorjsuren, Bat-Erdene Batmunkh. Remove Enkhbayasgalang. Board placeholders remain pending real names from client.

- [ ] **Step 1:** Create technical team files

For each member, create `content/team/<slug>.en.md`:

```markdown
---
name: "Otgonjargal Bayarbat"
role: "Senior Geologist (NPG)"
team_section: "Technical"
photo: "/uploads/team/otgonjargal.jpg"
order: 1
---

Placeholder bio for Otgonjargal Bayarbat. Real bio TBD from client.
```

Repeat for: `batkhurel-battulga` (Exploration Superintendent, order 2), `purevdorj-dorjsuren` (Business Development Manager, order 3), `bat-erdene-batmunkh` (Senior Geologist, order 4).

- [ ] **Step 2:** Create matching .mn.md files with Cyrillic names

E.g. `content/team/otgonjargal-bayarbat.mn.md` with `name: "Отгонжаргал Баярбат"`, `role: "Ахлах геологич (NPG)"`.

- [ ] **Step 3:** Remove `content/team/technical-lead.{en,mn}.md` (placeholder we no longer need)

- [ ] **Step 4:** Add a board placeholder bumped to Phil Rundell pending real data

Replace `content/team/chair.{en,mn}.md` content with Phil Rundell board entry, mark TBD where info pending.

- [ ] **Step 5:** **[BLOCKED ON CLIENT]** Real photos and bios. Add `public/uploads/team/<slug>.jpg` placeholders (1:1 ratio, e.g., 400×400 silhouettes).

- [ ] **Step 6:** Commit

```bash
git add content/team/ public/uploads/team/
git commit -m "feat: seed technical team per PPT (Otgonjargal, Batkhurel, Purevdorj, Bat-Erdene)"
```

---

### Task 22: Add placeholder governance documents

**Files:** `content/governance/*.{en,mn}.md`, `public/uploads/governance/*.pdf`

- [ ] **Step 1:** Add a placeholder PDF (any small valid PDF works for testing)

```bash
mkdir -p public/uploads/governance
# Use any small PDF; e.g., generate via terminal:
echo "%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj
xref
0 3
0000000000 65535 f
0000000009 00000 n
0000000050 00000 n
trailer<</Size 3/Root 1 0 R>>
startxref
92
%%EOF" > public/uploads/governance/placeholder.pdf
```

- [ ] **Step 2:** Create one governance entry per category

For each category (Constitution, Charters, Policies, Reports, Disclosures), create `content/governance/<slug>.en.md`:

```markdown
---
title: "Audit Committee Charter"
category: "Charters"
file: "/uploads/governance/placeholder.pdf"
effective_date: "2024-01-01"
description: "Placeholder description."
---
```

Plus matching .mn.md.

- [ ] **Step 3:** **[BLOCKED ON CLIENT]** Real PDFs. Replace `placeholder.pdf` with actual files when client provides them.

- [ ] **Step 4:** Verify `/en/about` now shows the Governance documents section with all 5 categories.

- [ ] **Step 5:** Commit

```bash
git add content/governance/ public/uploads/governance/
git commit -m "feat: seed governance documents placeholders across all categories"
```

---

### Task 23 (skipped — merged into Task 22)

---

### Task 24 (skipped — merged into Task 21)

---

### Phase 2.D — ESG and Contact pages (T25-T28)

---

### Task 25: Wire ESG page

**Files:** `app/[locale]/esg/page.tsx`

- [ ] **Step 1:** Replace placeholder

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { EsgContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MarkdownBody } from '@/components/shared/MarkdownBody';

export default async function EsgPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  return (
    <main className="container-wide py-16">
      <h1 className="text-5xl font-bold mb-12">ESG</h1>

      {esg.hero_image && (
        <div className="relative h-[40vh] mb-12 rounded-2xl overflow-hidden">
          <Image src={esg.hero_image} alt="" fill className="object-cover" priority />
        </div>
      )}

      <section className="mb-16 max-w-3xl">
        <MarkdownBody>{esg.approach_body}</MarkdownBody>
      </section>

      <section className="grid gap-12 lg:grid-cols-2 mb-16">
        <article>
          <h2 className="text-3xl font-bold mb-4">Environment</h2>
          {esg.environment?.image && (
            <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden">
              <Image src={esg.environment.image} alt="" fill className="object-cover" />
            </div>
          )}
          <MarkdownBody>{esg.environment?.body ?? ''}</MarkdownBody>
        </article>
        <article>
          <h2 className="text-3xl font-bold mb-4">Community</h2>
          {esg.community?.image && (
            <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden">
              <Image src={esg.community.image} alt="" fill className="object-cover" />
            </div>
          )}
          <MarkdownBody>{esg.community?.body ?? ''}</MarkdownBody>
        </article>
      </section>

      {esg.reports_intro && (
        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Reports & disclosures</h2>
          <p className="text-muted-foreground">{esg.reports_intro}</p>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add app/[locale]/esg/page.tsx
git commit -m "feat: wire ESG page with hero, approach, env, community, reports"
```

---

### Task 26: Create OfficeCard component

**Files:** `components/contact/OfficeCard.tsx`

- [ ] **Step 1:** Create the file

```tsx
import type { ContactOffice } from '@/lib/content/types';

type Props = { office: ContactOffice };

export function OfficeCard({ office }: Props) {
  const mapImageUrl =
    office.lat && office.lng
      ? `https://api.maptiler.com/maps/streets/static/${office.lng},${office.lat},14/400x200@2x.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ''}`
      : null;

  return (
    <article className="rounded-2xl border border-border overflow-hidden bg-background">
      {mapImageUrl ? (
        <img src={mapImageUrl} alt={`Map of ${office.name}`} className="h-32 w-full object-cover" />
      ) : (
        <div className="h-32 w-full bg-muted" />
      )}
      <div className="p-5">
        <h3 className="font-semibold">{office.name}</h3>
        <address className="not-italic text-sm text-muted-foreground mt-2 whitespace-pre-line">
          {office.address}
        </address>
        {office.email && (
          <a href={`mailto:${office.email}`} className="block mt-3 text-sm text-primary hover:underline">
            {office.email}
          </a>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/contact/OfficeCard.tsx
git commit -m "feat: add OfficeCard with MapTiler static map preview"
```

---

### Task 27: Create PhoneDropdown component

**Files:** `components/contact/PhoneDropdown.tsx`

- [ ] **Step 1:** Create the file

```tsx
'use client';

import { useState } from 'react';
import type { ContactContent } from '@/lib/content/types';

type Props = { groups: ContactContent['phone_groups'] };

export function PhoneDropdown({ groups }: Props) {
  const [open, setOpen] = useState<string | null>(groups[0]?.category ?? null);
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.category} className="rounded-2xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen((cur) => (cur === group.category ? null : group.category))}
            aria-expanded={open === group.category}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-background hover:bg-muted"
          >
            <span className="font-semibold">{group.category}</span>
            <span aria-hidden>{open === group.category ? '−' : '+'}</span>
          </button>
          {open === group.category && (
            <div className="px-5 py-4 border-t border-border bg-muted/30 space-y-2">
              {group.numbers.map((n) => (
                <div key={n.number} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{n.label}</span>
                  <a href={`tel:${n.number.replace(/\s+/g, '')}`} className="font-mono text-sm font-semibold hover:underline">
                    {n.number}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/contact/PhoneDropdown.tsx
git commit -m "feat: add PhoneDropdown grouping numbers by category"
```

---

### Task 28: Wire Contact page

**Files:** `app/[locale]/contact/page.tsx`

- [ ] **Step 1:** Replace placeholder

```tsx
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { loadGlobal } from '@/lib/content/loadGlobal';
import type { ContactContent, SiteSettings } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { OfficeCard } from '@/components/contact/OfficeCard';
import { PhoneDropdown } from '@/components/contact/PhoneDropdown';

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [contact, site] = await Promise.all([
    loadSingleton<ContactContent>('pages/contact', locale),
    loadGlobal<SiteSettings>('settings/site'),
  ]);

  return (
    <main className="container-wide py-16">
      <h1 className="text-5xl font-bold mb-6">Contact</h1>
      <p className="max-w-2xl text-lg text-muted-foreground mb-12">{contact.intro_body}</p>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
        {contact.offices.map((o) => (
          <OfficeCard key={o.name} office={o} />
        ))}
      </section>

      <div className="grid gap-12 lg:grid-cols-2 mb-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">By phone</h2>
          <PhoneDropdown groups={contact.phone_groups} />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6">By email</h2>
          <a href={`mailto:${contact.general_email}`} className="text-primary text-lg hover:underline">
            {contact.general_email}
          </a>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-muted p-8 text-center">
        <p className="text-lg font-semibold">For investor inquiries</p>
        <p className="mt-2 text-muted-foreground">
          Visit our investor portal for stock information, presentations, and IR contact.
        </p>
        <a
          href={site.investor_portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Visit Investor Center ↗
        </a>
      </section>
    </main>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add app/[locale]/contact/page.tsx
git commit -m "feat: wire Contact page (offices, phones, IR portal CTA)"
```

---

### Phase 2.E — Gallery (T29-T34)

---

### Task 29: Create PhotoMasonry component

**Files:** `components/gallery/PhotoMasonry.tsx`

- [ ] **Step 1:** Create the file

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { GalleryPhoto } from '@/lib/content/types';

type Props = { photos: GalleryPhoto[]; activeTag?: string | null };

export function PhotoMasonry({ photos, activeTag }: Props) {
  const filtered = activeTag ? photos.filter((p) => p.tags.includes(activeTag)) : photos;
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {filtered.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setIndex(i)}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl"
            aria-label={p.caption ?? 'Open photo'}
          >
            <div className="relative w-full" style={{ aspectRatio: '4 / 3' }}>
              <Image src={p.image} alt={p.caption ?? ''} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
          </button>
        ))}
      </div>
      <Lightbox
        open={index !== null}
        index={index ?? 0}
        close={() => setIndex(null)}
        slides={filtered.map((p) => ({ src: p.image, alt: p.caption ?? '' }))}
      />
    </>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/gallery/PhotoMasonry.tsx
git commit -m "feat: add PhotoMasonry with lightbox"
```

---

### Task 30: Create VideoGrid component

**Files:** `components/gallery/VideoGrid.tsx`

- [ ] **Step 1:** Create the file

```tsx
import Image from 'next/image';
import type { GalleryVideo } from '@/lib/content/types';

type Props = { videos: GalleryVideo[] };

export function VideoGrid({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Videos</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <article key={v.slug} className="rounded-2xl overflow-hidden border border-border">
            <div className="relative aspect-video">
              <iframe
                src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID ?? 'xxx'}.cloudflarestream.com/${v.stream_uid}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={v.title}
                className="absolute inset-0 w-full h-full"
              />
              {v.thumbnail && (
                <noscript>
                  <Image src={v.thumbnail} alt={v.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
                </noscript>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{v.title}</h3>
              {v.description && <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/gallery/VideoGrid.tsx
git commit -m "feat: add VideoGrid using Cloudflare Stream iframe"
```

---

### Task 31: Create CaseStudyCard component

**Files:** `components/gallery/CaseStudyCard.tsx`

- [ ] **Step 1:** Create the file

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/content/types';
import { useLocale } from 'next-intl';

type Props = { study: CaseStudy };

export function CaseStudyCard({ study }: Props) {
  const locale = useLocale();
  return (
    <Link
      href={`/${locale}/gallery/case-studies/${study.slug}`}
      className="group block rounded-2xl overflow-hidden border border-border hover:border-primary"
    >
      <div className="relative aspect-[4/3]">
        <Image src={study.hero_image} alt={study.title} fill className="object-cover transition group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
      <div className="p-5">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {new Date(study.date).toLocaleDateString()}
        </div>
        <h3 className="mt-2 font-semibold">{study.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{study.summary}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/gallery/CaseStudyCard.tsx
git commit -m "feat: add CaseStudyCard"
```

---

### Task 32: Wire Gallery page

**Files:** `app/[locale]/gallery/page.tsx`

- [ ] **Step 1:** Replace placeholder

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { loadCollection } from '@/lib/content/loadCollection';
import type { GalleryContent, GalleryPhoto, GalleryVideo, CaseStudy } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { PhotoMasonry } from '@/components/gallery/PhotoMasonry';
import { VideoGrid } from '@/components/gallery/VideoGrid';
import { CaseStudyCard } from '@/components/gallery/CaseStudyCard';

export default async function GalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const [gallery, photos, videos, cases] = await Promise.all([
    loadSingleton<GalleryContent>('pages/gallery', locale),
    loadCollection<GalleryPhoto>('gallery/photos', locale),
    loadCollection<GalleryVideo>('gallery/videos', locale),
    loadCollection<CaseStudy>('gallery/case-studies', locale),
  ]);

  return (
    <main className="container-wide py-16">
      <h1 className="text-5xl font-bold">{gallery.intro_heading}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{gallery.intro_body}</p>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Photos</h2>
        <PhotoMasonry photos={photos} />
      </section>

      <VideoGrid videos={videos} />

      {cases.length > 0 && (
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8">Case studies</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {cases.map((c) => (
              <CaseStudyCard key={c.slug} study={c} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add app/[locale]/gallery/page.tsx
git commit -m "feat: wire Gallery page with photos, videos, case studies"
```

---

### Task 33: Create case study detail page

**Files:** `app/[locale]/gallery/case-studies/[slug]/page.tsx`

- [ ] **Step 1:** Create the file

```tsx
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { loadCollection } from '@/lib/content/loadCollection';
import type { CaseStudy } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { MarkdownBody } from '@/components/shared/MarkdownBody';

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    const cases = await loadCollection<CaseStudy>('gallery/case-studies', locale);
    for (const c of cases) params.push({ locale, slug: c.slug });
  }
  return params;
}

export default async function CaseStudyPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const cases = await loadCollection<CaseStudy>('gallery/case-studies', locale);
  const study = cases.find((c) => c.slug === slug);
  if (!study) notFound();

  return (
    <main>
      <section className="relative h-[50vh] min-h-[400px]">
        <Image src={study.hero_image} alt={study.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container-wide pb-10 text-white">
          <div className="text-xs uppercase tracking-wider opacity-80">
            {new Date(study.date).toLocaleDateString()}
          </div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{study.title}</h1>
        </div>
      </section>

      <article className="container-wide max-w-3xl py-16">
        <p className="text-xl text-muted-foreground mb-8">{study.summary}</p>
        <MarkdownBody>{study.body}</MarkdownBody>
        {study.pull_quote && (
          <blockquote className="my-12 border-l-4 border-primary pl-6 text-2xl italic">
            {study.pull_quote}
          </blockquote>
        )}
      </article>
    </main>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add app/[locale]/gallery/case-studies/[slug]/page.tsx
git commit -m "feat: add case study detail page"
```

---

### Task 34: Seed sample gallery content

**Files:** `content/gallery/photos/*.{en,mn}.md`, `content/gallery/case-studies/*.{en,mn}.md`, `public/uploads/gallery/*`

Use placeholder photos (any field/site photos from `src.legacy/assets/` or fresh stock images).

- [ ] **Step 1:** Add ~6 placeholder photos under `public/uploads/gallery/photos/`

- [ ] **Step 2:** Create 6 photo entries `content/gallery/photos/photo-NN.{en,mn}.md`:

```markdown
---
image: "/uploads/gallery/photos/photo-01.jpg"
caption: "Field camp setup, summer 2025"
tags: ["Field", "Community"]
date: "2025-07-15"
featured: true
---
```

- [ ] **Step 3:** Create 1 case study `content/gallery/case-studies/khukh-tag-community.en.md`:

```markdown
---
title: "Khukh Tag community engagement"
summary: "How we built lasting relationships with the local community at the Khukh Tag exploration site."
hero_image: "/uploads/gallery/case-studies/khukh-tag-hero.jpg"
date: "2025-10-01"
pull_quote: "Long-term presence means earning trust every day."
---

## Background

Placeholder body. Real case study content from client during Plan 2 review.
```

Plus matching .mn.md.

- [ ] **Step 4:** Verify `/en/gallery` and `/en/gallery/case-studies/khukh-tag-community` both render.

- [ ] **Step 5:** Commit

```bash
git add content/gallery/ public/uploads/gallery/
git commit -m "feat: seed sample gallery photos + first case study"
```

---

### Phase 2.F — External integrations (T35-T41)

---

### Task 35: Create stock price fetcher with cache

**Files:** `lib/stock/fetch.ts`

- [ ] **Step 1:** Create the file

```ts
import 'server-only';

export type StockSnapshot = {
  ticker: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  asOf: string;
};

const TICKER = process.env.STOCK_TICKER_FALLBACK ?? 'ABM.L';

export async function fetchStockSnapshot(): Promise<StockSnapshot | null> {
  // Yahoo Finance unofficial endpoint — no API key required, rate-limited
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(TICKER)}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5 min cache
      headers: { 'User-Agent': 'azzororesources.com bot (contact: tech@azzororesources.com)' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const quote = json?.quoteResponse?.result?.[0];
    if (!quote) return null;
    return {
      ticker: quote.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      asOf: new Date(quote.regularMarketTime * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 2:** Commit

```bash
git add lib/stock/fetch.ts
git commit -m "feat: add stock price fetcher with 5-min revalidate"
```

---

### Task 36: Create stock price API route and Home card

**Files:** `app/api/stock-price/route.ts`, `components/home/StockPriceCard.tsx`

- [ ] **Step 1:** Create the API route

```ts
import { NextResponse } from 'next/server';
import { fetchStockSnapshot } from '@/lib/stock/fetch';

export const revalidate = 300;

export async function GET() {
  const snapshot = await fetchStockSnapshot();
  if (!snapshot) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
  return NextResponse.json(snapshot);
}
```

- [ ] **Step 2:** Create StockPriceCard (server component reading once at request)

```tsx
import { fetchStockSnapshot } from '@/lib/stock/fetch';
import Link from 'next/link';

type Props = { investorPortalUrl: string };

export async function StockPriceCard({ investorPortalUrl }: Props) {
  const snapshot = await fetchStockSnapshot();
  if (!snapshot) {
    return (
      <section className="container-wide py-12">
        <Link
          href={investorPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-md rounded-2xl border border-border p-6 hover:border-primary"
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Stock</div>
          <div className="mt-2 text-lg font-semibold">View live price on investor portal ↗</div>
        </Link>
      </section>
    );
  }
  const up = snapshot.change >= 0;
  return (
    <section className="container-wide py-12">
      <Link
        href={investorPortalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-md rounded-2xl border border-border p-6 hover:border-primary"
      >
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{snapshot.ticker}</div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{snapshot.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">{snapshot.currency}</span>
        </div>
        <div className={`mt-1 text-sm font-semibold ${up ? 'text-emerald-600' : 'text-red-600'}`}>
          {up ? '+' : ''}{snapshot.change.toFixed(2)} ({snapshot.changePercent.toFixed(2)}%)
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          As of {new Date(snapshot.asOf).toLocaleString()}
        </div>
        <div className="mt-4 text-sm font-semibold text-primary">View on investor portal ↗</div>
      </Link>
    </section>
  );
}
```

- [ ] **Step 3:** Add to home page

In `app/[locale]/page.tsx`, after loading `site` settings via `loadGlobal<SiteSettings>('settings/site')`, render `{home.stock_section_enabled && <StockPriceCard investorPortalUrl={site.investor_portal_url} />}`.

- [ ] **Step 4:** Toggle `stock_section_enabled: true` in `content/pages/home.en.md` and `home.mn.md`.

- [ ] **Step 5:** Verify

Run dev. Visit `/en`. If API responds, see price card. If not (network error, rate limit), see fallback "view on portal" link.

- [ ] **Step 6:** Commit

```bash
git add app/api/stock-price/ components/home/StockPriceCard.tsx app/[locale]/page.tsx content/pages/home.en.md content/pages/home.mn.md
git commit -m "feat: add stock price card with Yahoo Finance + portal fallback"
```

**[BLOCKED ON CLIENT]** Confirm post-rebrand ticker symbol and update `STOCK_TICKER_FALLBACK` in env.

---

### Task 37: Create investor news feed fetcher

**Files:** `lib/news/fetch.ts`, `app/api/investor-news/route.ts`

**[BLOCKED ON CLIENT]** Pending discovery of `investors.asianbatterymetals.com` feed format. If no feed exists, skip this task and the home news section.

- [ ] **Step 1:** Create the fetcher

```ts
import 'server-only';
import { XMLParser } from 'fast-xml-parser';

export type NewsItem = {
  title: string;
  url: string;
  publishedAt: string;
  summary?: string;
};

export async function fetchInvestorNews(): Promise<NewsItem[]> {
  const url = process.env.INVESTOR_FEED_URL;
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const text = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(text);
    // Assume RSS 2.0 shape; adjust once we know the real feed
    const items = parsed?.rss?.channel?.item ?? [];
    return (Array.isArray(items) ? items : [items]).slice(0, 3).map((i: Record<string, unknown>) => ({
      title: String(i.title ?? ''),
      url: String(i.link ?? ''),
      publishedAt: String(i.pubDate ?? ''),
      summary: typeof i.description === 'string' ? i.description : undefined,
    }));
  } catch {
    return [];
  }
}
```

- [ ] **Step 2:** Install fast-xml-parser

Run: `npm install fast-xml-parser`

- [ ] **Step 3:** Create API route

```ts
import { NextResponse } from 'next/server';
import { fetchInvestorNews } from '@/lib/news/fetch';

export const revalidate = 600;

export async function GET() {
  const items = await fetchInvestorNews();
  return NextResponse.json(items);
}
```

- [ ] **Step 4:** Commit

```bash
git add lib/news/fetch.ts app/api/investor-news/ package.json package-lock.json
git commit -m "feat: add investor news feed fetcher (RSS 2.0 assumption)"
```

---

### Task 38: Add LatestNewsSection to Home

**Files:** `components/home/LatestNewsSection.tsx`, modify `app/[locale]/page.tsx`

- [ ] **Step 1:** Create the component

```tsx
import { fetchInvestorNews } from '@/lib/news/fetch';

export async function LatestNewsSection({ investorPortalUrl }: { investorPortalUrl: string }) {
  const items = await fetchInvestorNews();
  if (items.length === 0) return null;

  return (
    <section className="container-wide py-16">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Latest announcements</h2>
        <a href={investorPortalUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
          All on investor portal ↗
        </a>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-border p-6 hover:border-primary"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {item.publishedAt && new Date(item.publishedAt).toLocaleDateString()}
            </div>
            <h3 className="mt-2 font-semibold">{item.title}</h3>
            {item.summary && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: item.summary }} />
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2:** Add to home page

In `app/[locale]/page.tsx`, render `{home.news_section_enabled && <LatestNewsSection investorPortalUrl={site.investor_portal_url} />}` before partners.

Toggle `news_section_enabled: true` in `content/pages/home.{en,mn}.md` only **after** `INVESTOR_FEED_URL` is set; otherwise the section just won't render (returns null).

- [ ] **Step 3:** Commit

```bash
git add components/home/LatestNewsSection.tsx app/[locale]/page.tsx
git commit -m "feat: add LatestNewsSection auto-pulling from investor portal feed"
```

---

### Task 39: Create CloudflareStreamHero component

**Files:** `components/home/CloudflareStreamHero.tsx`

- [ ] **Step 1:** Create the file

```tsx
type Props = {
  streamUid: string;
  poster?: string;
  className?: string;
};

export function CloudflareStreamHero({ streamUid, poster, className }: Props) {
  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID;

  if (!streamUid || !accountId) {
    // Fallback: static poster image
    if (!poster) return null;
    return (
      <div className={`relative w-full overflow-hidden ${className ?? ''}`} style={{ aspectRatio: '16 / 9' }}>
        <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className ?? ''}`} style={{ aspectRatio: '16 / 9' }}>
      <iframe
        src={`https://customer-${accountId}.cloudflarestream.com/${streamUid}/iframe?autoplay=true&loop=true&muted=true&preload=auto&controls=false&poster=${poster ? encodeURIComponent(poster) : ''}`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        title="Azzuro hero video"
      />
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add components/home/CloudflareStreamHero.tsx
git commit -m "feat: add CloudflareStreamHero with poster fallback"
```

---

### Task 40: Integrate hero video into HeroSection

**Files:** `components/home/HeroSection.tsx`

- [ ] **Step 1:** Modify HeroSection

Add a prop `videoId?: string` and `poster?: string` (already part of `HomeContent['hero'].video_id`). Render `<CloudflareStreamHero streamUid={hero.video_id} poster="/uploads/hero-poster.jpg" />` as a layered background under the existing content.

Exact wiring depends on the current `HeroSection.tsx` layout — adjust to keep text overlay readable.

- [ ] **Step 2:** **[BLOCKED ON CLIENT]** Add hero footage to Cloudflare Stream, copy the video UID into `content/pages/home.{en,mn}.md` `hero.video_id` field, add a poster JPG to `public/uploads/hero-poster.jpg`.

- [ ] **Step 3:** Commit

```bash
git add components/home/HeroSection.tsx
git commit -m "feat: wire CloudflareStreamHero into HeroSection with poster fallback"
```

---

### Task 41: Add 1 sample gallery video entry

**Files:** `content/gallery/videos/*.{en,mn}.md`

- [ ] **Step 1:** **[BLOCKED ON CLIENT]** Upload a video to Cloudflare Stream, note the UID. Skip this task until that's done.

- [ ] **Step 2:** Create `content/gallery/videos/field-operations.en.md`:

```markdown
---
title: "Field operations overview"
description: "A look at exploration and drilling at our active sites."
stream_uid: "REPLACE_WITH_STREAM_UID"
tags: ["Field", "Drilling"]
date: "2025-09-01"
---
```

- [ ] **Step 3:** Commit

```bash
git add content/gallery/videos/
git commit -m "feat: add sample gallery video entry (stream UID pending)"
```

---

### Phase 2.G — AI content seeding (T42-T47)

---

### Task 42: Generate EN drafts for Home page sections

**Files:** modify `content/pages/home.en.md`

**Operational task — not coded but executed by a human running Claude.**

- [ ] **Step 1:** Compile source material

Gather:
- `docs/website renewal slides.pptx` (the brief)
- Scrape current asianbatterymetals.com (use any tool: wget/scraper/manual copy)
- Existing POC component hardcoded copy from `src.legacy/components/`

- [ ] **Step 2:** Run Claude with this prompt

> Read the attached PPT and old website content. Write fresh English marketing copy for an Azzuro Resources home page. Required sections, each with the field shape from the current home.en.md:
> - hero.headline (max 8 words, evocative, brand-aligned)
> - hero.subline (1-2 sentences, investor- and analyst-facing)
> - hero.cta_label + cta_href ("Explore projects" → /en/projects)
> - 4 metrics (active projects, license area, commodities tracked, years of activity)
> - why_mongolia_intro (1 paragraph)
> - 4 why_mongolia_cards (each: title + 2-3 sentence body)
> - why_azzuro_intro (1 paragraph)
> - 4 why_azzuro_cards
> - sustainability_teaser (heading, 2-3 sentence body, cta_label "Read our ESG approach", cta_href "/en/esg")
> - leadership_teaser (heading, 2-3 sentence body, cta_label "Meet the team", cta_href "/en/about")
>
> Output strict YAML frontmatter only, no markdown body.

- [ ] **Step 3:** Apply the output to `content/pages/home.en.md` (replace placeholder frontmatter, keep file structure)

- [ ] **Step 4:** Verify dev server renders correctly with new copy

- [ ] **Step 5:** Commit

```bash
git add content/pages/home.en.md
git commit -m "feat: AI-drafted EN content for Home page"
```

---

### Task 43: Generate EN drafts for About / ESG / Gallery / Contact

**Files:** `content/pages/{about,esg,gallery,contact}.en.md`

- [ ] **Step 1:** Repeat the prompt pattern from Task 42 for each page

For each, give Claude the field shape from the existing placeholder, plus PPT context. Output frontmatter-only YAML.

- [ ] **Step 2:** Apply each output

- [ ] **Step 3:** Commit per page (4 commits) or one combined commit:

```bash
git add content/pages/about.en.md content/pages/esg.en.md content/pages/gallery.en.md content/pages/contact.en.md
git commit -m "feat: AI-drafted EN content for About, ESG, Gallery, Contact"
```

---

### Task 44: Generate EN body copy for Projects (oval, khukh-tag, tsagaan-ders)

**Files:** `content/projects/<slug>.en.md`

- [ ] **Step 1:** Run Claude with project-specific context (geological background per the POC's BentoGrid descriptions, plus expanded marketing-ready copy)

- [ ] **Step 2:** Replace the markdown bodies and update `data_cards[]` arrays with real fields (license area, commodities, etc.)

- [ ] **Step 3:** Commit

```bash
git add content/projects/
git commit -m "feat: AI-drafted EN project bodies for OVAL, KHUKH TAG, TSAGAAN DERS"
```

---

### Task 45: Generate EN drafts for team bios

**Files:** `content/team/*.en.md`

- [ ] **Step 1:** For each technical team member, give Claude the role + any public info known (LinkedIn-style summary), ask for 100-150 word neutral bio

- [ ] **Step 2:** Apply bios to existing files

- [ ] **Step 3:** **[BLOCKED ON CLIENT]** Real bios must come from client before launch. Mark drafts as `[DRAFT]` in commit message.

- [ ] **Step 4:** Commit

```bash
git add content/team/
git commit -m "feat: AI-drafted team bios [DRAFT — pending client review]"
```

---

### Task 46: Generate EN drafts for first case study

**Files:** `content/gallery/case-studies/khukh-tag-community.en.md`

- [ ] **Step 1:** Prompt Claude to write a 600-800 word community engagement narrative around the Khukh Tag site

- [ ] **Step 2:** Apply to file

- [ ] **Step 3:** Commit

```bash
git add content/gallery/case-studies/khukh-tag-community.en.md
git commit -m "feat: AI-drafted case study — Khukh Tag community engagement [DRAFT]"
```

---

### Task 47: Generate MN translations for all .en.md files

**Files:** all `content/**/*.mn.md`

- [ ] **Step 1:** For each `.en.md` file just updated, run Claude with the prompt:

> Translate the following Azzuro Resources Mongolian mining company web copy from English to formal Mongolian Cyrillic. Preserve all YAML frontmatter structure exactly; translate only string values, not field names or hrefs. Use industry-appropriate technical vocabulary. Output ready-to-save .mn.md content.

- [ ] **Step 2:** Apply each output to the matching `.mn.md`

- [ ] **Step 3:** Spot-check a few in dev by switching to /mn — sanity check Cyrillic renders, no untranslated English fragments

- [ ] **Step 4:** **[BLOCKED ON CLIENT]** Native speaker review before launch. Mark commit as [DRAFT].

- [ ] **Step 5:** Commit

```bash
git add content/
git commit -m "feat: MN translations across all content [DRAFT — pending native speaker review]"
```

---

### Phase 2.H — Final validation (T48-T50)

---

### Task 48: Full local smoke test

- [ ] **Step 1:** Clean install + build

```bash
rm -rf node_modules .next
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

Expected: all pass. Build output lists all pre-rendered routes for both locales, including dynamic `/projects/[slug]` and `/gallery/case-studies/[slug]` pages.

- [ ] **Step 2:** Run production build locally

```bash
npm start
```

- [ ] **Step 3:** Browser walk-through

For both `/en` and `/mn`:
- Home: hero, metrics, intro sections, map preview, sustainability, leadership, stock card (if enabled), news (if feed configured), partners
- About: story, mission, values, Board grid, Technical grid (4 members), governance docs (5 categories)
- Projects: map with 3 pins, filter chips, click → side panel → "View full" → detail page → nearby projects
- ESG: hero, approach, environment + community side-by-side, reports intro
- Gallery: photo masonry → click → lightbox, video grid (if Stream UID set), case studies → click → article
- Contact: 3 office cards with static maps, phone dropdown (toggle works), email, IR portal CTA

Stop server.

- [ ] **Step 4:** Commit checkpoint

```bash
git commit --allow-empty -m "checkpoint: Plan 2 passes full local smoke test"
```

---

### Task 49: Deploy to staging and re-verify

- [ ] **Step 1:** Push branch

```bash
git push
```

- [ ] **Step 2:** Wait for Vercel build (~90-120s)

- [ ] **Step 3:** Verify production env vars are set in Vercel

- [ ] **Step 4:** Repeat browser walk-through on `staging.azzororesources.com`

- [ ] **Step 5:** Run Lighthouse in Chrome DevTools on Home + Projects + About

Expected (informational, not blocking): Performance 70+, Accessibility 85+, Best Practices 90+, SEO 90+. Tune in Plan 3.

- [ ] **Step 6:** Commit notes

Update `docs/staging.md` with Plan 2 completion notes and any anomalies. Push.

---

### Task 50: Open PR for review

- [ ] **Step 1:** Open PR `next-migration` (or current branch) → `main` titled "Plan 2: Content + Map — interactive projects map, full pages, integrations, AI content seed"

- [ ] **Step 2:** Body should list:
- What's working
- What's still placeholder (note all **[BLOCKED ON CLIENT]** items)
- Open questions for client review during walkthrough

- [ ] **Step 3:** Merge to main after review

---

## Plan 2 done — what's deployed

After all 50 tasks:

- Real EN + MN content (AI-drafted, marked [DRAFT] pending review) across all pages
- Interactive projects map with side panel + filter chips
- Project detail pages for OVAL, KHUKH TAG, TSAGAAN DERS
- About page with Board + Technical team grids (bio reveal) and Governance docs list
- ESG page rendered with environment + community sections
- Gallery with photo masonry + lightbox, video grid, case studies
- Case study detail pages
- Contact with 3 office cards, phone dropdown, IR portal CTA
- Stock price card on Home (live API)
- Investor news section on Home (auto-pulled from external feed)
- Cloudflare Stream hero video on Home
- All integrations gracefully degrade when env vars are missing

**Ready for client content review** — they walk staging URL, mark up what to change, you and they iterate via /admin until copy is approved.

**Plan 3 begins:** accessibility audit, performance tuning (Lighthouse targets), final design polish, copy review with client, production DNS cutover, client onboarding session, editor guide PDF.
