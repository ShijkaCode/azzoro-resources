# Azzoro Resources — Foundation Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the current Vite + React POC to a Next.js 14 App Router project with bilingual EN/MN routing, Sveltia CMS scaffolding, and an empty but deployable site shell at a staging URL. No real content yet — that's Plan 2.

**Architecture:** Single Next.js App Router project. Locale routing via `[locale]` dynamic segment + `next-intl` middleware. Sveltia CMS served as a static SPA at `/admin`. Content lives in `content/` directory as Markdown files with frontmatter. All page components read CMS-driven content via typed loaders in `lib/content/`. Existing POC components in `src/` are ported one-by-one to `components/` without major redesign — visual polish comes in Plan 3.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui (preserved from POC), framer-motion (preserved), next-intl, Sveltia CMS, Vitest, Vercel.

**Reference spec:** `docs/superpowers/specs/2026-05-27-azzoro-website-renewal-design.md`

**Out of scope for this plan:** projects map, content seeding, stock price API, investor news feed, contact info wiring, real images/videos, accessibility audit, performance tuning, production DNS cutover. All deferred to Plan 2 or Plan 3.

---

## File structure produced by this plan

```
azzoro/                                       (current repo, will rename to azzoro-resources on GitHub)
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                        Locale layout: IntlProvider + Navbar + Footer
│   │   ├── page.tsx                          Home
│   │   ├── about/page.tsx
│   │   ├── projects/page.tsx                 (placeholder list, map comes in Plan 2)
│   │   ├── esg/page.tsx
│   │   ├── gallery/page.tsx
│   │   └── contact/page.tsx
│   ├── layout.tsx                            Root <html>/<body>
│   ├── not-found.tsx
│   ├── globals.css                           Tailwind + brand tokens
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                                   shadcn (copied from src/components/ui)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageToggle.tsx
│   │   └── PartnerLogos.tsx
│   └── home/
│       ├── HeroSection.tsx                   (ported from POC, placeholder content)
│       ├── IntroSection.tsx                  (ported)
│       ├── WhatWeDo.tsx                      (ported, "WhyAzzoro" rename later)
│       ├── ESGSection.tsx                    (ported)
│       └── FooterCards.tsx                   (ported)
├── content/
│   ├── pages/
│   │   ├── home.en.md, home.mn.md
│   │   ├── about.en.md, about.mn.md
│   │   ├── esg.en.md, esg.mn.md
│   │   ├── gallery.en.md, gallery.mn.md
│   │   └── contact.en.md, contact.mn.md
│   ├── settings/
│   │   ├── site.yml
│   │   ├── nav.en.yml, nav.mn.yml
│   │   └── footer.en.yml, footer.mn.yml
│   ├── team/                                 (one placeholder entry)
│   ├── projects/                             (one placeholder entry)
│   ├── governance/                           (empty, schema only)
│   ├── gallery/
│   │   ├── photos/                           (empty)
│   │   ├── videos/                           (empty)
│   │   └── case-studies/                     (empty)
│   └── partners/                             (one placeholder)
├── lib/
│   ├── content/
│   │   ├── types.ts                          TypeScript types for all CMS schemas
│   │   ├── loadSingleton.ts
│   │   ├── loadSingleton.test.ts
│   │   ├── loadCollection.ts
│   │   └── loadCollection.test.ts
│   └── i18n/
│       ├── config.ts                         locales[], defaultLocale
│       └── request.ts                        next-intl request config
├── messages/
│   ├── en.json
│   └── mn.json
├── middleware.ts                             next-intl middleware
├── public/
│   ├── admin/
│   │   ├── index.html                        Sveltia bundle
│   │   └── config.yml                        All CMS collections defined
│   └── uploads/                              CMS-uploaded media (gitkeep'd)
├── next.config.mjs
├── tailwind.config.ts                        Blue palette (Azzoro brand)
├── tsconfig.json                             Next.js compatible
├── vitest.config.ts                          Existing, kept for unit tests
└── package.json                              Next.js deps, Vite removed
```

**Files that get deleted at the end of this plan:**
- `vite.config.ts`
- `postcss.config.js` (replaced with Next-native PostCSS config in `tailwind.config.ts` + Next defaults)
- `index.html` (Vite root — Next uses app/layout.tsx instead)
- `eslint.config.js` (replaced with `.eslintrc.json` Next-style)
- `src/` directory in its entirety (after every component is ported)
- `tsconfig.app.json`, `tsconfig.node.json` (Vite-specific configs)

---

## Tasks

Tasks are numbered sequentially. Each task has explicit file paths, exact commands, and complete code. **Commit after each task** unless noted otherwise.

---

### Task 1: Create feature branch for the migration

**Files:** none (git operation only)

- [ ] **Step 1:** Verify clean working tree

Run: `git status`
Expected: shows pre-existing uncommitted changes to `README.md`, `package.json`, untracked `public/new_logo.png`, `docs/.pptx_extract/` — these are not blockers. Stash if you want a clean branch.

- [ ] **Step 2:** Stash existing uncommitted changes (preserves them)

Run: `git stash push -u -m "pre-migration WIP"`
Expected: "Saved working directory and index state On main: pre-migration WIP"

- [ ] **Step 3:** Create and switch to the feature branch

Run: `git checkout -b next-migration`
Expected: "Switched to a new branch 'next-migration'"

- [ ] **Step 4:** Commit (no-op, just confirms branch is clean)

Run: `git status`
Expected: "nothing to commit, working tree clean"

---

### Task 2: Move POC source aside for reference

We preserve `src/` as `src.legacy/` during the migration so we can copy components and styles over piece by piece without breaking the Vite dev server until we're ready.

**Files:**
- Rename: `src/` → `src.legacy/`

- [ ] **Step 1:** Rename directory

Run: `git mv src src.legacy`
Expected: directory renamed, all files staged as renames

- [ ] **Step 2:** Verify renames detected (not as delete + add)

Run: `git status`
Expected: many `renamed: src/... -> src.legacy/...` lines

- [ ] **Step 3:** Commit

Run:
```bash
git commit -m "chore: move POC src to src.legacy for migration reference"
```

---

### Task 3: Remove Vite dependencies and add Next.js dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1:** Uninstall Vite-specific packages

Run:
```bash
npm uninstall vite @vitejs/plugin-react-swc lovable-tagger react-router-dom
```
Expected: removes 4 packages from `package.json`

- [ ] **Step 2:** Install Next.js core

Run:
```bash
npm install next@14 react@18 react-dom@18
```
Expected: adds `next`, updates `react` to 18.3.x

- [ ] **Step 3:** Install next-intl for i18n

Run:
```bash
npm install next-intl
```

- [ ] **Step 4:** Install gray-matter for parsing markdown frontmatter

Run:
```bash
npm install gray-matter
```

- [ ] **Step 5:** Install ESLint config for Next.js

Run:
```bash
npm install --save-dev eslint-config-next
```

- [ ] **Step 6:** Remove other Vite-specific dev deps

Run:
```bash
npm uninstall vitest jsdom @vitest/coverage-v8
```
Note: vitest will be re-added in Task 22 when we write the first content loader test, configured for Next.

- [ ] **Step 7:** Verify `package.json` looks sensible

Run: `cat package.json`
Expected: `"next": "^14.x.x"`, `"react": "^18.x.x"`, no `vite` entries, `next-intl` present, `gray-matter` present.

- [ ] **Step 8:** Commit

Run:
```bash
git add package.json package-lock.json
git commit -m "chore: replace Vite deps with Next.js 14 + next-intl"
```

---

### Task 4: Update package.json scripts for Next.js

**Files:**
- Modify: `package.json`

- [ ] **Step 1:** Replace the `scripts` block

In `package.json`, change the `"scripts"` section to:

```json
"scripts": {
  "dev": "next dev -p 3000",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 2:** Commit

Run:
```bash
git add package.json
git commit -m "chore: switch npm scripts from Vite to Next.js"
```

---

### Task 5: Create Next.js configuration file

**Files:**
- Create: `next.config.mjs`

- [ ] **Step 1:** Create the config file

Create `next.config.mjs`:

```js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '**.cloudflarestream.com' },
    ],
  },
  async redirects() {
    return [
      // Root redirect handled by middleware (locale-aware); this is a fallback.
    ];
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 2:** Commit

Run:
```bash
git add next.config.mjs
git commit -m "feat: add next.config.mjs with next-intl plugin and image patterns"
```

---

### Task 6: Update TypeScript configuration for Next.js

**Files:**
- Modify: `tsconfig.json`
- Delete: `tsconfig.app.json`, `tsconfig.node.json`

- [ ] **Step 1:** Replace `tsconfig.json` with Next.js-compatible version

Overwrite `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "src.legacy"]
}
```

Note `"exclude": ["src.legacy"]` so the old code doesn't cause typecheck failures during the transition.

- [ ] **Step 2:** Delete the Vite-specific tsconfig variants

Run:
```bash
rm tsconfig.app.json tsconfig.node.json
```

- [ ] **Step 3:** Verify typecheck passes (no source files exist yet, so this should be trivial)

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 4:** Commit

Run:
```bash
git add tsconfig.json
git rm tsconfig.app.json tsconfig.node.json
git commit -m "chore: switch tsconfig to Next.js layout, exclude src.legacy"
```

---

### Task 7: Delete obsolete Vite/build config files

**Files:**
- Delete: `vite.config.ts`, `postcss.config.js`, `index.html`, `eslint.config.js`

- [ ] **Step 1:** Delete the files

Run:
```bash
rm vite.config.ts postcss.config.js index.html eslint.config.js
```

- [ ] **Step 2:** Verify

Run: `ls`
Expected: none of those filenames present.

- [ ] **Step 3:** Commit

Run:
```bash
git add -u
git commit -m "chore: remove Vite-era config files"
```

---

### Task 8: Add Next.js ESLint config

**Files:**
- Create: `.eslintrc.json`

- [ ] **Step 1:** Create the file

Create `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals"]
}
```

- [ ] **Step 2:** Verify lint runs (no source yet, should be clean)

Run: `npm run lint`
Expected: "✔ No ESLint warnings or errors" (or message about no files matched, which is fine)

- [ ] **Step 3:** Commit

Run:
```bash
git add .eslintrc.json
git commit -m "chore: add next/core-web-vitals ESLint config"
```

---

### Task 9: Update Tailwind config with Azzoro blue palette

**Files:**
- Modify: `tailwind.config.ts`

The current POC uses a lime/green palette. The brand changes to blue. We define a primary blue scale plus a deep navy for backgrounds (the POC already uses `navy-dark` — we keep that semantic and update the hue).

- [ ] **Step 1:** Replace `tailwind.config.ts`

Overwrite `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif'],
      },
      colors: {
        // Brand: Azzoro blue scale (replaces lime/green from POC)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'navy-dark': 'hsl(var(--navy-dark))',
        // shadcn semantic tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
```

- [ ] **Step 2:** Commit

Run:
```bash
git add tailwind.config.ts
git commit -m "feat: switch Tailwind palette to Azzoro blue brand"
```

---

### Task 10: Create the global stylesheet with brand tokens

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1:** Create the file

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Azzoro blue brand */
    --primary: 215 90% 48%;              /* #1A6FE0 — Azzoro blue */
    --primary-foreground: 0 0% 100%;
    --navy-dark: 222 47% 11%;            /* #0F172A — deep navy bg */

    /* Light theme shadcn semantic tokens */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215 16% 47%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222 47% 11%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 215 90% 48%;
    --radius: 0.75rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}

@layer components {
  .container-wide {
    @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
  }
  .chevron-pattern {
    background-image: linear-gradient(135deg, transparent 47%, currentColor 47%, currentColor 53%, transparent 53%);
    background-size: 16px 16px;
  }
}
```

- [ ] **Step 2:** Commit

Run:
```bash
git add app/globals.css
git commit -m "feat: add globals.css with Azzoro brand tokens"
```

---

### Task 11: Create the root layout

**Files:**
- Create: `app/layout.tsx`

- [ ] **Step 1:** Create the file

Create `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Azzoro Resources', template: '%s — Azzoro Resources' },
  description: 'Mining exploration in Mongolia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Note `subsets: ['latin', 'cyrillic']` on Inter — required for Mongolian Cyrillic rendering.

- [ ] **Step 2:** Commit

Run:
```bash
git add app/layout.tsx
git commit -m "feat: add root layout with Inter (latin+cyrillic) and Playfair fonts"
```

---

### Task 12: Define i18n locale configuration

**Files:**
- Create: `lib/i18n/config.ts`

- [ ] **Step 1:** Create the file

Create `lib/i18n/config.ts`:

```ts
export const locales = ['en', 'mn'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
```

- [ ] **Step 2:** Commit

Run:
```bash
git add lib/i18n/config.ts
git commit -m "feat: define locales (en, mn) and defaultLocale"
```

---

### Task 13: Create next-intl request config

**Files:**
- Create: `lib/i18n/request.ts`

- [ ] **Step 1:** Create the file

Create `lib/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locale || !isLocale(locale)) {
    notFound();
  }
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2:** Commit

Run:
```bash
git add lib/i18n/request.ts
git commit -m "feat: add next-intl getRequestConfig with locale validation"
```

---

### Task 14: Create initial message files for both locales

**Files:**
- Create: `messages/en.json`, `messages/mn.json`

- [ ] **Step 1:** Create `messages/en.json`

```json
{
  "nav": {
    "about": "About us",
    "projects": "Projects",
    "esg": "ESG",
    "gallery": "Gallery",
    "investorCenter": "Investor Center",
    "contact": "Contact us"
  },
  "common": {
    "readMore": "Read more",
    "viewAll": "View all",
    "visitInvestorPortal": "Visit investor portal",
    "languageEnglish": "English",
    "languageMongolian": "Монгол"
  },
  "footer": {
    "copyright": "© {year} Azzoro Resources PLC. All rights reserved."
  }
}
```

- [ ] **Step 2:** Create `messages/mn.json`

```json
{
  "nav": {
    "about": "Бидний тухай",
    "projects": "Төслүүд",
    "esg": "Тогтвортой байдал",
    "gallery": "Галерей",
    "investorCenter": "Хөрөнгө оруулагчдад",
    "contact": "Холбоо барих"
  },
  "common": {
    "readMore": "Дэлгэрэнгүй",
    "viewAll": "Бүгдийг харах",
    "visitInvestorPortal": "Хөрөнгө оруулагчийн порталд зочлох",
    "languageEnglish": "English",
    "languageMongolian": "Монгол"
  },
  "footer": {
    "copyright": "© {year} Azzoro Resources PLC. Бүх эрх хуулиар хамгаалагдсан."
  }
}
```

- [ ] **Step 3:** Commit

Run:
```bash
git add messages/
git commit -m "feat: add EN and MN message files"
```

---

### Task 15: Create the locale routing middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1:** Create the file

Create `middleware.ts` at the repo root:

```ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|admin|.*\\..*).*)'],
};
```

The matcher excludes `/api`, `/_next`, `/admin` (Sveltia CMS), and any path containing a `.` (static files). Everything else gets locale-prefixed.

- [ ] **Step 2:** Commit

Run:
```bash
git add middleware.ts
git commit -m "feat: add next-intl middleware with /admin and static file exclusions"
```

---

### Task 16: Create the [locale] layout

**Files:**
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1:** Create the file

Create `app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

`generateStaticParams` ensures Next pre-renders both `/en` and `/mn` at build time.

- [ ] **Step 2:** Commit

Run:
```bash
git add app/[locale]/layout.tsx
git commit -m "feat: add [locale] layout with NextIntlClientProvider"
```

---

### Task 17: Create placeholder home page

**Files:**
- Create: `app/[locale]/page.tsx`

- [ ] **Step 1:** Create the file

Create `app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">Azzoro Resources</h1>
      <p className="mt-4 text-muted-foreground">Locale: {locale}</p>
      <p className="mt-2 text-sm">Placeholder home page — content arrives in Plan 2.</p>
    </main>
  );
}
```

- [ ] **Step 2:** Commit

Run:
```bash
git add app/[locale]/page.tsx
git commit -m "feat: add placeholder home page"
```

---

### Task 18: First boot — verify dev server runs and routing works

**Files:** none (verification step)

- [ ] **Step 1:** Start the dev server

Run: `npm run dev`
Expected: "▲ Next.js 14.x.x · Local: http://localhost:3000"

- [ ] **Step 2:** Visit the locale paths

In a browser, open:
- `http://localhost:3000/` — expect redirect to `/en`
- `http://localhost:3000/en` — expect to see "Azzoro Resources" + "Locale: en"
- `http://localhost:3000/mn` — expect to see "Azzoro Resources" + "Locale: mn"
- `http://localhost:3000/admin` — expect 404 (we haven't built admin yet)

- [ ] **Step 3:** Stop the dev server (Ctrl+C)

- [ ] **Step 4:** Commit (no code change, but mark checkpoint)

Run:
```bash
git commit --allow-empty -m "checkpoint: dev server + locale routing work end-to-end"
```

---

### Task 19: Create the not-found page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1:** Create the file

Create `app/not-found.tsx`:

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-8">Page not found.</p>
          <Link href="/en" className="text-primary underline">
            Return to home
          </Link>
        </main>
      </body>
    </html>
  );
}
```

Note: this is the root not-found, which renders without the locale layout (e.g., for invalid locale slugs). A locale-aware 404 will live at `app/[locale]/not-found.tsx` in Plan 3.

- [ ] **Step 2:** Commit

Run:
```bash
git add app/not-found.tsx
git commit -m "feat: add root 404 page"
```

---

### Task 20: Define content TypeScript types

**Files:**
- Create: `lib/content/types.ts`

These types mirror the CMS schema in spec Section 5. We use them in the loaders (next task) and in page components.

- [ ] **Step 1:** Create the file

Create `lib/content/types.ts`:

```ts
import type { Locale } from '@/lib/i18n/config';

// ─── Singletons ─────────────────────────────────────────────────────

export type SiteSettings = {
  brand_name: string;
  logo: string;
  logo_dark: string;
  stock_ticker: string;
  stock_api_enabled: boolean;
  investor_portal_url: string;
  social: { linkedin?: string; x?: string };
  default_locale: Locale;
};

export type NavItem = { label: string; href: string; external?: boolean };
export type NavSettings = { items: NavItem[] };

export type FooterSettings = {
  tagline: string;
  link_columns: { heading: string; links: NavItem[] }[];
  copyright_holder: string;
  legal_links: NavItem[];
};

export type HomeContent = {
  hero: { video_id: string; headline: string; subline: string; cta_label: string; cta_href: string };
  metrics: { value: string; label: string; source?: string }[];
  why_mongolia_intro: string;
  why_mongolia_cards: { icon?: string; title: string; body: string }[];
  why_azzoro_intro: string;
  why_azzoro_cards: { icon?: string; title: string; body: string }[];
  sustainability_teaser: { heading: string; body: string; image?: string; cta_label: string; cta_href: string };
  leadership_teaser: { heading: string; body: string; cta_label: string; cta_href: string };
  news_section_enabled: boolean;
  stock_section_enabled: boolean;
};

export type AboutContent = {
  hero_image?: string;
  story_body: string;
  mission: string;
  values: { icon?: string; title: string; body: string }[];
  leadership_governance_body: string;
  governance_documents_intro: string;
};

export type EsgContent = {
  hero_image?: string;
  approach_body: string;
  environment: { body: string; image?: string };
  community: { body: string; image?: string };
  reports_intro: string;
};

export type GalleryContent = {
  intro_heading: string;
  intro_body: string;
  filter_tags: { slug: string; label: string }[];
};

export type ContactOffice = {
  name: string;
  address: string;
  email?: string;
  hours?: string;
  lat?: number;
  lng?: number;
};

export type ContactContent = {
  intro_body: string;
  offices: ContactOffice[];
  phone_groups: { category: string; numbers: { label: string; number: string }[] }[];
  general_email: string;
};

// ─── Folder collections ─────────────────────────────────────────────

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  team_section: 'Board' | 'Technical';
  photo?: string;
  bio: string;
  order: number;
};

export type GovernanceDocument = {
  slug: string;
  title: string;
  category: 'Constitution' | 'Charters' | 'Policies' | 'Reports' | 'Disclosures';
  file: string;
  effective_date: string;
  description?: string;
};

export type Project = {
  slug: string;
  title: string;
  commodity: string[];
  status: 'Active exploration' | 'Drilling' | 'Resource definition' | 'Paused';
  region: string;
  lat: number;
  lng: number;
  license_area_km2?: number;
  acquired_date?: string;
  hero_image: string;
  gallery_images?: string[];
  summary: string;
  body: string;
  data_cards?: { label: string; value: string }[];
  documents?: { label: string; file: string }[];
};

export type GalleryPhoto = {
  slug: string;
  image: string;
  caption?: string;
  tags: string[];
  date: string;
  featured?: boolean;
};

export type GalleryVideo = {
  slug: string;
  title: string;
  description?: string;
  stream_uid: string;
  thumbnail?: string;
  tags: string[];
  date: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  hero_image: string;
  body: string;
  pull_quote?: string;
  related?: string[];
  date: string;
};

export type Partner = {
  slug: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
};
```

- [ ] **Step 2:** Verify typecheck passes

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 3:** Commit

Run:
```bash
git add lib/content/types.ts
git commit -m "feat: define content types matching CMS schema"
```

---

### Task 21: Re-install Vitest configured for Next

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (deps)

- [ ] **Step 1:** Install Vitest and helpers

Run:
```bash
npm install --save-dev vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2:** Create `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'src.legacy'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 3:** Create `vitest.setup.ts`

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4:** Verify Vitest runs (no tests yet)

Run: `npm test`
Expected: "No test files found" or similar — exit code 0

- [ ] **Step 5:** Commit

Run:
```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: re-add Vitest configured for Next + jsdom + RTL"
```

---

### Task 22: Write content loader for singletons (test-first)

**Files:**
- Create: `lib/content/loadSingleton.test.ts`, `lib/content/loadSingleton.ts`
- Create: `content/test-fixtures/sample.en.md` (test fixture)

- [ ] **Step 1:** Create test fixture

Create `content/test-fixtures/sample.en.md`:

```markdown
---
title: Sample Page
body: This is the body in EN.
---

Markdown body content here.
```

Create `content/test-fixtures/sample.mn.md`:

```markdown
---
title: Жишээ хуудас
body: Энэ нь MN дэх агуулга юм.
---

Монгол хэлээр бичсэн агуулга.
```

- [ ] **Step 2:** Write the failing test

Create `lib/content/loadSingleton.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { loadSingleton } from './loadSingleton';

describe('loadSingleton', () => {
  it('reads EN singleton file and returns frontmatter + body', async () => {
    const result = await loadSingleton<{ title: string; body: string }>(
      'test-fixtures/sample',
      'en'
    );
    expect(result.title).toBe('Sample Page');
    expect(result.body).toBe('This is the body in EN.');
    expect(result.markdown).toContain('Markdown body content here.');
  });

  it('reads MN singleton file', async () => {
    const result = await loadSingleton<{ title: string }>('test-fixtures/sample', 'mn');
    expect(result.title).toBe('Жишээ хуудас');
  });

  it('throws on missing file', async () => {
    await expect(
      loadSingleton('test-fixtures/does-not-exist', 'en')
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 3:** Run test to verify it fails

Run: `npm test -- loadSingleton`
Expected: FAIL — "Cannot find module './loadSingleton'"

- [ ] **Step 4:** Write the loader

Create `lib/content/loadSingleton.ts`:

```ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/lib/i18n/config';

export type Loaded<T> = T & { markdown: string };

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export async function loadSingleton<T extends Record<string, unknown>>(
  slug: string,
  locale: Locale
): Promise<Loaded<T>> {
  const filePath = path.join(CONTENT_ROOT, `${slug}.${locale}.md`);
  const raw = await readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { ...(data as T), markdown: content };
}
```

All bilingual content uses `.md` files with YAML frontmatter. Pure-data files (no body) still use `.md` with frontmatter-only content — gray-matter parses these correctly. Non-bilingual settings like `site.yml` are not loaded in Plan 1 (consumed in Plan 2 for stock ticker etc.); we'll add a `loadGlobal` helper then.

- [ ] **Step 5:** Run test to verify it passes

Run: `npm test -- loadSingleton`
Expected: 3 tests passed

- [ ] **Step 6:** Commit

Run:
```bash
git add lib/content/loadSingleton.ts lib/content/loadSingleton.test.ts content/test-fixtures/
git commit -m "feat: add loadSingleton with vitest coverage"
```

---

### Task 23: Write content loader for folder collections (test-first)

**Files:**
- Create: `lib/content/loadCollection.test.ts`, `lib/content/loadCollection.ts`
- Create: `content/test-fixtures/items/item-1.en.md`, `content/test-fixtures/items/item-2.en.md`

- [ ] **Step 1:** Create test fixtures

Create `content/test-fixtures/items/item-1.en.md`:

```markdown
---
title: Item One
order: 1
---
First item body.
```

Create `content/test-fixtures/items/item-2.en.md`:

```markdown
---
title: Item Two
order: 2
---
Second item body.
```

Also create `content/test-fixtures/items/item-1.mn.md` and `content/test-fixtures/items/item-2.mn.md` with the same shape but Mongolian titles.

- [ ] **Step 2:** Write the failing test

Create `lib/content/loadCollection.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { loadCollection } from './loadCollection';

describe('loadCollection', () => {
  it('reads all entries for the given locale', async () => {
    const items = await loadCollection<{ title: string; order: number }>(
      'test-fixtures/items',
      'en'
    );
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.title).sort()).toEqual(['Item One', 'Item Two']);
  });

  it('attaches the slug field from the filename', async () => {
    const items = await loadCollection<{ title: string }>(
      'test-fixtures/items',
      'en'
    );
    const slugs = items.map((i) => i.slug).sort();
    expect(slugs).toEqual(['item-1', 'item-2']);
  });

  it('returns empty array when folder has no matching locale files', async () => {
    const items = await loadCollection('test-fixtures/items', 'en');
    expect(Array.isArray(items)).toBe(true);
  });
});
```

- [ ] **Step 3:** Run test to verify it fails

Run: `npm test -- loadCollection`
Expected: FAIL — "Cannot find module './loadCollection'"

- [ ] **Step 4:** Write the loader

Create `lib/content/loadCollection.ts`:

```ts
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/lib/i18n/config';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type CollectionEntry<T> = T & { slug: string; markdown: string };

export async function loadCollection<T extends Record<string, unknown>>(
  folder: string,
  locale: Locale
): Promise<CollectionEntry<T>[]> {
  const dir = path.join(CONTENT_ROOT, folder);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }

  const suffix = `.${locale}.md`;
  const matching = files.filter((f) => f.endsWith(suffix));

  const entries = await Promise.all(
    matching.map(async (file) => {
      const slug = file.slice(0, -suffix.length);
      const raw = await readFile(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      return { ...(data as T), slug, markdown: content };
    })
  );

  return entries;
}
```

- [ ] **Step 5:** Run test to verify it passes

Run: `npm test -- loadCollection`
Expected: 3 tests passed

- [ ] **Step 6:** Commit

Run:
```bash
git add lib/content/loadCollection.ts lib/content/loadCollection.test.ts content/test-fixtures/items/
git commit -m "feat: add loadCollection with vitest coverage"
```

---

### Task 24: Seed empty CMS content directory with placeholder files

**Files:**
- Create: all files under `content/pages/`, `content/settings/`, `content/team/`, `content/projects/`, `content/partners/`

The actual content arrives in Plan 2. For now we create one bilingual placeholder per file so loaders have something to read and pages don't crash.

- [ ] **Step 1:** Create `content/pages/home.en.md`

```markdown
---
hero:
  video_id: ""
  headline: "Advancing Base & Precious Metal Discoveries in Mongolia"
  subline: "Placeholder hero subline — content arrives in Plan 2."
  cta_label: "Explore projects"
  cta_href: "/en/projects"
metrics:
  - value: "3"
    label: "Active projects"
why_mongolia_intro: "Placeholder intro."
why_mongolia_cards: []
why_azzoro_intro: "Placeholder intro."
why_azzoro_cards: []
sustainability_teaser:
  heading: "Sustainability"
  body: "Placeholder body."
  cta_label: "Read our approach"
  cta_href: "/en/esg"
leadership_teaser:
  heading: "Leadership & Governance"
  body: "Placeholder body."
  cta_label: "Meet the team"
  cta_href: "/en/about"
news_section_enabled: false
stock_section_enabled: false
---

Placeholder home content (markdown body).
```

- [ ] **Step 2:** Create `content/pages/home.mn.md`

Same structure with Mongolian strings. Keep `cta_href` pointing to `/mn/...` instead of `/en/...`.

- [ ] **Step 3:** Create equivalent placeholder pairs for the other 4 page singletons

Each file must have every field from the corresponding type in `lib/content/types.ts`, using empty strings or empty arrays for unset data.

`content/pages/about.en.md`:

```markdown
---
hero_image: ""
story_body: "Placeholder About story body. Real copy arrives in Plan 2."
mission: "Placeholder mission statement."
values: []
leadership_governance_body: "Placeholder leadership & governance body."
governance_documents_intro: "Placeholder governance documents intro."
---
```

`content/pages/about.mn.md`:

```markdown
---
hero_image: ""
story_body: "About хуудасны түр зуурын агуулга. Жинхэнэ агуулга 2-р төлөвлөгөөнд орно."
mission: "Түр зуурын зорилго."
values: []
leadership_governance_body: "Манлайлал, засаглалын түр зуурын агуулга."
governance_documents_intro: "Засаглалын баримт бичгүүдийн танилцуулга."
---
```

`content/pages/esg.en.md`:

```markdown
---
hero_image: ""
approach_body: "Placeholder ESG approach body."
environment:
  body: "Placeholder environment body."
  image: ""
community:
  body: "Placeholder community body."
  image: ""
reports_intro: "Placeholder reports intro."
---
```

`content/pages/esg.mn.md`:

```markdown
---
hero_image: ""
approach_body: "ESG хандлагын түр зуурын агуулга."
environment:
  body: "Байгаль орчны түр зуурын агуулга."
  image: ""
community:
  body: "Орон нутгийн оролцооны түр зуурын агуулга."
  image: ""
reports_intro: "Тайлангуудын түр зуурын танилцуулга."
---
```

`content/pages/gallery.en.md`:

```markdown
---
intro_heading: "Gallery"
intro_body: "Placeholder gallery intro body."
filter_tags: []
---
```

`content/pages/gallery.mn.md`:

```markdown
---
intro_heading: "Галерей"
intro_body: "Галерейн түр зуурын танилцуулга."
filter_tags: []
---
```

`content/pages/contact.en.md`:

```markdown
---
intro_body: "Placeholder contact intro."
offices:
  - name: "Mongolia office"
    address: "305, MERU tower, Jamiyangun street, 1st khoroo, Sukhbaatar district, Ulaanbaatar, Mongolia"
    email: "contact@azzororesources.com"
phone_groups:
  - category: "General inquiries"
    numbers:
      - label: "Mongolia"
        number: "+976 7777 4114"
general_email: "contact@azzororesources.com"
---
```

`content/pages/contact.mn.md`:

```markdown
---
intro_body: "Холбоо барих хэсгийн түр зуурын танилцуулга."
offices:
  - name: "Монгол улсын оффис"
    address: "305, МЭРУ цамхаг, Жамъянгүний гудамж, 1-р хороо, Сүхбаатар дүүрэг, Улаанбаатар, Монгол"
    email: "contact@azzororesources.com"
phone_groups:
  - category: "Ерөнхий лавлагаа"
    numbers:
      - label: "Монгол"
        number: "+976 7777 4114"
general_email: "contact@azzororesources.com"
---
```

- [ ] **Step 4:** Create `content/settings/site.yml`

```yaml
brand_name: "Azzoro Resources"
logo: "/uploads/logo.png"
logo_dark: "/uploads/logo-dark.png"
stock_ticker: "TBD"
stock_api_enabled: false
investor_portal_url: "https://investors.asianbatterymetals.com"
social:
  linkedin: ""
  x: ""
default_locale: "en"
```

- [ ] **Step 5:** Create `content/settings/nav.en.md` and `content/settings/nav.mn.md`

`content/settings/nav.en.md`:

```markdown
---
items:
  - label: "About us"
    href: "/en/about"
  - label: "Projects"
    href: "/en/projects"
  - label: "ESG"
    href: "/en/esg"
  - label: "Gallery"
    href: "/en/gallery"
  - label: "Investor Center"
    href: "https://investors.asianbatterymetals.com"
    external: true
  - label: "Contact us"
    href: "/en/contact"
---
```

`content/settings/nav.mn.md`:

```markdown
---
items:
  - label: "Бидний тухай"
    href: "/mn/about"
  - label: "Төслүүд"
    href: "/mn/projects"
  - label: "Тогтвортой байдал"
    href: "/mn/esg"
  - label: "Галерей"
    href: "/mn/gallery"
  - label: "Хөрөнгө оруулагчдад"
    href: "https://investors.asianbatterymetals.com"
    external: true
  - label: "Холбоо барих"
    href: "/mn/contact"
---
```

- [ ] **Step 6:** Create one placeholder team member

`content/team/placeholder-member.en.md`:

```markdown
---
name: "Placeholder Member"
role: "Role TBD"
team_section: "Board"
photo: ""
order: 1
---

Placeholder bio.
```

Plus `.mn.md` variant.

- [ ] **Step 7:** Create one placeholder project

`content/projects/placeholder-project.en.md`:

```markdown
---
title: "Placeholder Project"
commodity:
  - "Copper"
status: "Active exploration"
region: "Mongolia"
lat: 47.9
lng: 106.9
hero_image: ""
summary: "Placeholder summary."
---

Placeholder body.
```

Plus `.mn.md` variant.

- [ ] **Step 8:** Create one placeholder partner

`content/partners/placeholder-partner.md` (not bilingual):

```markdown
---
name: "Placeholder Partner"
logo: ""
url: ""
order: 1
---
```

- [ ] **Step 9:** Add empty placeholder gitkeep files in folders that have no entries yet

```bash
touch content/governance/.gitkeep
touch content/gallery/photos/.gitkeep
touch content/gallery/videos/.gitkeep
touch content/gallery/case-studies/.gitkeep
```

- [ ] **Step 10:** Commit

Run:
```bash
git add content/
git commit -m "feat: seed CMS content directory with bilingual placeholders"
```

---

### Task 25: Wire the home page to load CMS content

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1:** Replace the placeholder page

Overwrite `app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { HomeContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const home = await loadSingleton<HomeContent>('pages/home', locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">{home.hero.headline}</h1>
      <p className="mt-4 text-muted-foreground">{home.hero.subline}</p>
      <p className="mt-8 text-sm">Locale: {locale}</p>
    </main>
  );
}
```

- [ ] **Step 2:** Verify by running dev server

Run: `npm run dev`
Then visit `http://localhost:3000/en` — expect the EN headline from `home.en.md`. Visit `/mn` — expect the MN headline from `home.mn.md`.

- [ ] **Step 3:** Stop dev server (Ctrl+C) and commit

Run:
```bash
git add app/[locale]/page.tsx
git commit -m "feat: wire home page to load CMS content"
```

---

### Task 26: Build the LanguageToggle component (test-first)

**Files:**
- Create: `components/layout/LanguageToggle.tsx`, `components/layout/LanguageToggle.test.tsx`

- [ ] **Step 1:** Write the failing test

Create `components/layout/LanguageToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageToggle } from './LanguageToggle';

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/about',
}));

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

describe('LanguageToggle', () => {
  it('renders links to both locales', () => {
    render(<LanguageToggle />);
    expect(screen.getByRole('link', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /монгол/i })).toBeInTheDocument();
  });

  it('targets the matching path in the other locale', () => {
    render(<LanguageToggle />);
    const mnLink = screen.getByRole('link', { name: /монгол/i });
    expect(mnLink).toHaveAttribute('href', '/mn/about');
  });

  it('marks current locale as active', () => {
    render(<LanguageToggle />);
    const enLink = screen.getByRole('link', { name: /english/i });
    expect(enLink).toHaveAttribute('aria-current', 'true');
  });
});
```

- [ ] **Step 2:** Run test to verify it fails

Run: `npm test -- LanguageToggle`
Expected: FAIL — "Cannot find module './LanguageToggle'"

- [ ] **Step 3:** Write the component

Create `components/layout/LanguageToggle.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales, type Locale } from '@/lib/i18n/config';

const labelKey: Record<Locale, string> = {
  en: 'common.languageEnglish',
  mn: 'common.languageMongolian',
};

export function LanguageToggle() {
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const t = useTranslations();

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-2 text-xs">
      {locales.map((loc) => {
        const otherPath = swapLocale(pathname, loc);
        const isActive = loc === current;
        return (
          <Link
            key={loc}
            href={otherPath}
            aria-current={isActive ? 'true' : undefined}
            className={isActive ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}
          >
            {t(labelKey[loc])}
          </Link>
        );
      })}
    </nav>
  );
}

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${target}`;
  segments[0] = target;
  return '/' + segments.join('/');
}
```

- [ ] **Step 4:** Run test to verify it passes

Run: `npm test -- LanguageToggle`
Expected: 3 tests passed

- [ ] **Step 5:** Commit

Run:
```bash
git add components/layout/LanguageToggle.tsx components/layout/LanguageToggle.test.tsx
git commit -m "feat: add LanguageToggle component with tests"
```

---

### Task 27: Build the Navbar component

**Files:**
- Create: `components/layout/Navbar.tsx`

For Plan 1 we render a minimal nav that reads labels from the CMS nav settings. Visual polish (sticky behavior, mobile drawer, scroll-aware backgrounds) comes in Plan 3.

- [ ] **Step 1:** Create the file

Create `components/layout/Navbar.tsx`:

```tsx
import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { NavSettings } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

type Props = { locale: Locale };

export async function Navbar({ locale }: Props) {
  const nav = await loadSingleton<NavSettings>('settings/nav', locale);

  return (
    <header className="border-b border-border bg-background">
      <div className="container-wide flex items-center justify-between py-4">
        <Link href={`/${locale}`} className="font-display text-xl font-semibold">
          Azzoro
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.label}
              {item.external && <span aria-hidden> ↗</span>}
            </Link>
          ))}
        </nav>
        <LanguageToggle />
      </div>
    </header>
  );
}
```

- [ ] **Step 2:** Commit

Run:
```bash
git add components/layout/Navbar.tsx
git commit -m "feat: add Navbar reading from CMS nav settings"
```

---

### Task 28: Build the Footer component

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1:** Create the file

Create `components/layout/Footer.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-12 mt-24">
      <div className="container-wide text-center text-xs text-muted-foreground">
        {t('footer.copyright', { year })}
      </div>
    </footer>
  );
}
```

The full footer with link columns lives in Plan 3 — for now we just satisfy "every page has a footer."

- [ ] **Step 2:** Commit

Run:
```bash
git add components/layout/Footer.tsx
git commit -m "feat: add minimal Footer with translated copyright"
```

---

### Task 29: Wire Navbar and Footer into the locale layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1:** Update the layout

Overwrite `app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar locale={locale as Locale} />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2:** Verify in dev server

Run `npm run dev`, visit `/en` and `/mn`. Confirm:
- Navbar visible with both languages' links
- Language toggle works (clicking "Монгол" on `/en/about` should land on `/mn/about`)
- Footer visible with localized copyright

Stop dev server (Ctrl+C).

- [ ] **Step 3:** Commit

Run:
```bash
git add app/[locale]/layout.tsx
git commit -m "feat: render Navbar and Footer in locale layout"
```

---

### Task 30: Create empty pages for each route

**Files:**
- Create: `app/[locale]/about/page.tsx`, `app/[locale]/projects/page.tsx`, `app/[locale]/esg/page.tsx`, `app/[locale]/gallery/page.tsx`, `app/[locale]/contact/page.tsx`

Each page loads its corresponding CMS singleton and renders the headline/intro. No visual design yet — just proof the routing + CMS pipeline works for every page.

- [ ] **Step 1:** Create `app/[locale]/about/page.tsx`

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { loadCollection } from '@/lib/content/loadCollection';
import type { AboutContent, TeamMember } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const about = await loadSingleton<AboutContent>('pages/about', locale);
  const team = await loadCollection<TeamMember>('team', locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">About</h1>
      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: about.story_body }} />
      <h2 className="mt-16 text-2xl font-bold">Team ({team.length} members)</h2>
      <ul className="mt-4 space-y-2">
        {team.map((m) => (
          <li key={m.slug}>
            <strong>{m.name}</strong> — {m.role}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2:** Create `app/[locale]/projects/page.tsx`

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const projects = await loadCollection<Project>('projects', locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">Projects</h1>
      <p className="mt-4 text-muted-foreground">
        Interactive map ships in Plan 2. {projects.length} project(s) configured.
      </p>
      <ul className="mt-8 space-y-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <strong>{p.title}</strong> — {p.commodity.join(', ')} ({p.status})
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 3:** Create `app/[locale]/esg/page.tsx`

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { EsgContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function EsgPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">ESG</h1>
      <p className="mt-4 text-muted-foreground">{esg.approach_body}</p>
    </main>
  );
}
```

- [ ] **Step 4:** Create `app/[locale]/gallery/page.tsx`

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { loadCollection } from '@/lib/content/loadCollection';
import type { GalleryContent, GalleryPhoto } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const gallery = await loadSingleton<GalleryContent>('pages/gallery', locale);
  const photos = await loadCollection<GalleryPhoto>('gallery/photos', locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">{gallery.intro_heading}</h1>
      <p className="mt-4 text-muted-foreground">{gallery.intro_body}</p>
      <p className="mt-8 text-sm">{photos.length} photo(s) configured.</p>
    </main>
  );
}
```

- [ ] **Step 5:** Create `app/[locale]/contact/page.tsx`

```tsx
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { ContactContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const contact = await loadSingleton<ContactContent>('pages/contact', locale);

  return (
    <main className="container-wide py-24">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-muted-foreground">{contact.intro_body}</p>
      <ul className="mt-8 space-y-4">
        {contact.offices.map((office) => (
          <li key={office.name}>
            <strong>{office.name}</strong>
            <br />
            {office.address}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 6:** Verify all 5 routes render in dev

Run `npm run dev`, visit each of:
- `/en/about`, `/mn/about`
- `/en/projects`, `/mn/projects`
- `/en/esg`, `/mn/esg`
- `/en/gallery`, `/mn/gallery`
- `/en/contact`, `/mn/contact`

Each should show the page title + the CMS-loaded placeholder content. Stop dev server.

- [ ] **Step 7:** Commit

Run:
```bash
git add app/[locale]/
git commit -m "feat: add empty CMS-driven pages for about, projects, esg, gallery, contact"
```

---

### Task 31: Add robots.ts

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1:** Create the file

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 2:** Verify

Run `npm run dev`, visit `http://localhost:3000/robots.txt` — should see the robots rules.

- [ ] **Step 3:** Commit

Run:
```bash
git add app/robots.ts
git commit -m "feat: add robots.ts disallowing /admin"
```

---

### Task 32: Add sitemap.ts with hreflang

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1:** Create the file

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';

const STATIC_PATHS = ['', '/about', '/projects', '/esg', '/gallery', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com';

  return STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${siteUrl}/${alt}${path}`])
        ),
      },
    }))
  );
}
```

- [ ] **Step 2:** Verify

Run `npm run dev`, visit `http://localhost:3000/sitemap.xml` — should see XML with both `/en/...` and `/mn/...` URLs and hreflang alternates.

- [ ] **Step 3:** Commit

Run:
```bash
git add app/sitemap.ts
git commit -m "feat: add sitemap.ts with hreflang alternates for both locales"
```

---

### Task 33: Create the Sveltia CMS admin shell

**Files:**
- Create: `public/admin/index.html`, `public/admin/config.yml`

- [ ] **Step 1:** Create `public/admin/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Azzoro Resources — Admin</title>
  </head>
  <body>
    <script type="module" src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

Loading Sveltia from unpkg keeps the bundle out of our repo. For production we can vendor a pinned version (deferred to Plan 3).

- [ ] **Step 2:** Create `public/admin/config.yml` (initial — site singleton + nav only; the full schema lands in Task 34)

```yaml
backend:
  name: github
  repo: REPLACE_WITH_GITHUB_ORG/azzoro-resources
  branch: main
  base_url: https://api.netlify.com  # placeholder; Sveltia GitHub App URL replaces this in Task 36
  auth_endpoint: auth

media_folder: public/uploads
public_folder: /uploads

i18n:
  structure: multiple_files
  locales: [en, mn]
  default_locale: en

collections:
  - name: site
    label: Site Settings
    files:
      - name: site
        label: Site (logo, ticker, social)
        file: content/settings/site.yml
        fields:
          - { label: Brand name, name: brand_name, widget: string }
          - { label: Logo, name: logo, widget: image }
          - { label: Logo (dark), name: logo_dark, widget: image }
          - { label: Stock ticker, name: stock_ticker, widget: string }
          - { label: Stock API enabled, name: stock_api_enabled, widget: boolean, default: false }
          - { label: Investor portal URL, name: investor_portal_url, widget: string }
          - label: Social
            name: social
            widget: object
            fields:
              - { label: LinkedIn, name: linkedin, widget: string, required: false }
              - { label: X, name: x, widget: string, required: false }
          - { label: Default locale, name: default_locale, widget: select, options: [en, mn], default: en }
```

- [ ] **Step 3:** Commit

Run:
```bash
git add public/admin/
git commit -m "feat: add Sveltia /admin shell with initial site collection"
```

---

### Task 34: Define remaining CMS collections in config.yml

**Files:**
- Modify: `public/admin/config.yml`

Append all remaining collections. Use Sveltia's `i18n: true` flag on collections that should produce per-locale files; omit it on singleton settings like partners.

- [ ] **Step 1:** Append nav, footer, page singletons

After the `site` file in `collections[0].files`, add:

```yaml
      - name: nav
        label: Navigation labels
        file: content/settings/nav.md
        i18n: true
        fields:
          - label: Items
            name: items
            widget: list
            fields:
              - { label: Label, name: label, widget: string, i18n: true }
              - { label: Href, name: href, widget: string }
              - { label: External, name: external, widget: boolean, default: false, required: false }

      - name: footer
        label: Footer
        file: content/settings/footer.md
        i18n: true
        fields:
          - { label: Tagline, name: tagline, widget: string, i18n: true }
          - label: Link columns
            name: link_columns
            widget: list
            fields:
              - { label: Heading, name: heading, widget: string, i18n: true }
              - label: Links
                name: links
                widget: list
                fields:
                  - { label: Label, name: label, widget: string, i18n: true }
                  - { label: Href, name: href, widget: string }
                  - { label: External, name: external, widget: boolean, default: false, required: false }
          - { label: Copyright holder, name: copyright_holder, widget: string }
          - label: Legal links
            name: legal_links
            widget: list
            fields:
              - { label: Label, name: label, widget: string, i18n: true }
              - { label: Href, name: href, widget: string }
```

- [ ] **Step 2:** Add `pages` file collection (Home, About, ESG, Gallery, Contact singletons)

Append a new top-level collection:

```yaml
  - name: pages
    label: Pages
    files:
      - name: home
        label: Home
        file: content/pages/home.md
        i18n: true
        fields:
          - label: Hero
            name: hero
            widget: object
            fields:
              - { label: Cloudflare Stream video ID, name: video_id, widget: string, required: false }
              - { label: Headline, name: headline, widget: string, i18n: true }
              - { label: Subline, name: subline, widget: text, i18n: true }
              - { label: CTA label, name: cta_label, widget: string, i18n: true }
              - { label: CTA href, name: cta_href, widget: string }
          - label: Metrics
            name: metrics
            widget: list
            fields:
              - { label: Value, name: value, widget: string }
              - { label: Label, name: label, widget: string, i18n: true }
              - { label: Source, name: source, widget: string, required: false }
          - { label: Why Mongolia intro, name: why_mongolia_intro, widget: text, i18n: true }
          - label: Why Mongolia cards
            name: why_mongolia_cards
            widget: list
            fields:
              - { label: Icon, name: icon, widget: string, required: false }
              - { label: Title, name: title, widget: string, i18n: true }
              - { label: Body, name: body, widget: text, i18n: true }
          - { label: Why Azzoro intro, name: why_azzoro_intro, widget: text, i18n: true }
          - label: Why Azzoro cards
            name: why_azzoro_cards
            widget: list
            fields:
              - { label: Icon, name: icon, widget: string, required: false }
              - { label: Title, name: title, widget: string, i18n: true }
              - { label: Body, name: body, widget: text, i18n: true }
          - label: Sustainability teaser
            name: sustainability_teaser
            widget: object
            fields:
              - { label: Heading, name: heading, widget: string, i18n: true }
              - { label: Body, name: body, widget: text, i18n: true }
              - { label: Image, name: image, widget: image, required: false }
              - { label: CTA label, name: cta_label, widget: string, i18n: true }
              - { label: CTA href, name: cta_href, widget: string }
          - label: Leadership teaser
            name: leadership_teaser
            widget: object
            fields:
              - { label: Heading, name: heading, widget: string, i18n: true }
              - { label: Body, name: body, widget: text, i18n: true }
              - { label: CTA label, name: cta_label, widget: string, i18n: true }
              - { label: CTA href, name: cta_href, widget: string }
          - { label: News section enabled, name: news_section_enabled, widget: boolean, default: false }
          - { label: Stock section enabled, name: stock_section_enabled, widget: boolean, default: false }

      - name: about
        label: About
        file: content/pages/about.md
        i18n: true
        fields:
          - { label: Hero image, name: hero_image, widget: image, required: false }
          - { label: Story body, name: story_body, widget: markdown, i18n: true }
          - { label: Mission, name: mission, widget: text, i18n: true }
          - label: Values
            name: values
            widget: list
            fields:
              - { label: Icon, name: icon, widget: string, required: false }
              - { label: Title, name: title, widget: string, i18n: true }
              - { label: Body, name: body, widget: text, i18n: true }
          - { label: Leadership & Governance body, name: leadership_governance_body, widget: markdown, i18n: true }
          - { label: Governance documents intro, name: governance_documents_intro, widget: text, i18n: true }

      - name: esg
        label: ESG
        file: content/pages/esg.md
        i18n: true
        fields:
          - { label: Hero image, name: hero_image, widget: image, required: false }
          - { label: Approach body, name: approach_body, widget: markdown, i18n: true }
          - label: Environment
            name: environment
            widget: object
            fields:
              - { label: Body, name: body, widget: markdown, i18n: true }
              - { label: Image, name: image, widget: image, required: false }
          - label: Community
            name: community
            widget: object
            fields:
              - { label: Body, name: body, widget: markdown, i18n: true }
              - { label: Image, name: image, widget: image, required: false }
          - { label: Reports intro, name: reports_intro, widget: text, i18n: true }

      - name: gallery
        label: Gallery
        file: content/pages/gallery.md
        i18n: true
        fields:
          - { label: Intro heading, name: intro_heading, widget: string, i18n: true }
          - { label: Intro body, name: intro_body, widget: text, i18n: true }
          - label: Filter tags
            name: filter_tags
            widget: list
            fields:
              - { label: Slug, name: slug, widget: string }
              - { label: Label, name: label, widget: string, i18n: true }

      - name: contact
        label: Contact
        file: content/pages/contact.md
        i18n: true
        fields:
          - { label: Intro body, name: intro_body, widget: text, i18n: true }
          - label: Offices
            name: offices
            widget: list
            fields:
              - { label: Name, name: name, widget: string }
              - { label: Address, name: address, widget: text, i18n: true }
              - { label: Email, name: email, widget: string, required: false }
              - { label: Hours, name: hours, widget: string, required: false, i18n: true }
              - { label: Latitude, name: lat, widget: number, required: false }
              - { label: Longitude, name: lng, widget: number, required: false }
          - label: Phone groups
            name: phone_groups
            widget: list
            fields:
              - { label: Category, name: category, widget: string, i18n: true }
              - label: Numbers
                name: numbers
                widget: list
                fields:
                  - { label: Label, name: label, widget: string, i18n: true }
                  - { label: Number, name: number, widget: string }
          - { label: General email, name: general_email, widget: string }
```

- [ ] **Step 3:** Add folder collections (team, projects, governance, gallery items, case studies, partners)

Append:

```yaml
  - name: team
    label: Team
    folder: content/team
    create: true
    slug: '{{fields.slug | default(fields.name | slugify)}}'
    i18n: true
    fields:
      - { label: Name, name: name, widget: string, i18n: true }
      - { label: Role, name: role, widget: string, i18n: true }
      - { label: Team section, name: team_section, widget: select, options: [Board, Technical] }
      - { label: Photo, name: photo, widget: image, required: false }
      - { label: Bio, name: bio, widget: markdown, i18n: true }
      - { label: Order, name: order, widget: number, default: 0 }

  - name: projects
    label: Projects
    folder: content/projects
    create: true
    slug: '{{fields.slug | default(fields.title | slugify)}}'
    i18n: true
    fields:
      - { label: Title, name: title, widget: string, i18n: true }
      - { label: Commodity, name: commodity, widget: select, multiple: true, options: [Nickel, Copper, PGE, Gold, Graphite, Lithium, Other] }
      - { label: Status, name: status, widget: select, options: ['Active exploration', 'Drilling', 'Resource definition', 'Paused'] }
      - { label: Region, name: region, widget: string, i18n: true }
      - { label: Latitude, name: lat, widget: number }
      - { label: Longitude, name: lng, widget: number }
      - { label: License area (km²), name: license_area_km2, widget: number, required: false }
      - { label: Acquired date, name: acquired_date, widget: date, required: false }
      - { label: Hero image, name: hero_image, widget: image }
      - { label: Gallery images, name: gallery_images, widget: list, field: { label: Image, name: image, widget: image }, required: false }
      - { label: Summary, name: summary, widget: text, i18n: true }
      - { label: Body, name: body, widget: markdown, i18n: true }
      - label: Data cards
        name: data_cards
        widget: list
        required: false
        fields:
          - { label: Label, name: label, widget: string, i18n: true }
          - { label: Value, name: value, widget: string, i18n: true }
      - label: Documents
        name: documents
        widget: list
        required: false
        fields:
          - { label: Label, name: label, widget: string, i18n: true }
          - { label: File, name: file, widget: file }

  - name: governance
    label: Governance documents
    folder: content/governance
    create: true
    slug: '{{fields.title | slugify}}'
    i18n: true
    fields:
      - { label: Title, name: title, widget: string, i18n: true }
      - { label: Category, name: category, widget: select, options: [Constitution, Charters, Policies, Reports, Disclosures] }
      - { label: File, name: file, widget: file }
      - { label: Effective date, name: effective_date, widget: date }
      - { label: Description, name: description, widget: text, required: false, i18n: true }

  - name: gallery_photos
    label: Gallery — Photos
    folder: content/gallery/photos
    create: true
    slug: '{{date | date(\"yyyy-MM-dd\")}}-{{fields.caption | default(\"photo\") | slugify}}'
    i18n: true
    fields:
      - { label: Image, name: image, widget: image }
      - { label: Caption, name: caption, widget: string, required: false, i18n: true }
      - { label: Tags, name: tags, widget: list, default: [] }
      - { label: Date, name: date, widget: date }
      - { label: Featured, name: featured, widget: boolean, default: false }

  - name: gallery_videos
    label: Gallery — Videos
    folder: content/gallery/videos
    create: true
    slug: '{{fields.title | slugify}}'
    i18n: true
    fields:
      - { label: Title, name: title, widget: string, i18n: true }
      - { label: Description, name: description, widget: text, required: false, i18n: true }
      - { label: Cloudflare Stream UID, name: stream_uid, widget: string }
      - { label: Thumbnail, name: thumbnail, widget: image, required: false }
      - { label: Tags, name: tags, widget: list, default: [] }
      - { label: Date, name: date, widget: date }

  - name: case_studies
    label: Gallery — Case studies
    folder: content/gallery/case-studies
    create: true
    slug: '{{fields.title | slugify}}'
    i18n: true
    fields:
      - { label: Title, name: title, widget: string, i18n: true }
      - { label: Summary, name: summary, widget: text, i18n: true }
      - { label: Hero image, name: hero_image, widget: image }
      - { label: Body, name: body, widget: markdown, i18n: true }
      - { label: Pull quote, name: pull_quote, widget: text, required: false, i18n: true }
      - { label: Related, name: related, widget: list, default: [], required: false }
      - { label: Date, name: date, widget: date }

  - name: partners
    label: Partners
    folder: content/partners
    create: true
    slug: '{{fields.name | slugify}}'
    fields:
      - { label: Name, name: name, widget: string }
      - { label: Logo, name: logo, widget: image }
      - { label: URL, name: url, widget: string, required: false }
      - { label: Order, name: order, widget: number, default: 0 }
```

- [ ] **Step 4:** Commit

Run:
```bash
git add public/admin/config.yml
git commit -m "feat: define all CMS collections in Sveltia config.yml"
```

---

### Task 35: Write Sveltia GitHub App setup guide

**Files:**
- Create: `docs/admin-setup.md`

This documents the one-time GitHub App + Vercel setup so the user (or a future collaborator) can re-run it. The auth config in `config.yml` gets finalized in Task 36 after the GitHub App exists.

- [ ] **Step 1:** Create the file

Create `docs/admin-setup.md`:

```markdown
# Sveltia CMS — GitHub App Setup

This is a one-time setup. After this, editors can sign into `/admin` with GitHub.

## Steps

1. **Register a GitHub App**
   - Go to https://github.com/settings/apps/new
   - GitHub App name: `Azzoro Resources CMS`
   - Homepage URL: `https://azzororesources.com`
   - Callback URL: `https://azzororesources.com/admin` (and add `http://localhost:3000/admin` for dev)
   - Untick "Webhook" → "Active"
   - Repository permissions:
     - Contents: Read & write
     - Metadata: Read
   - "Where can this GitHub App be installed?" → Only on this account
   - Save. Note the **App ID** and **Client ID**.
   - Generate a client secret, save it.

2. **Install the App on the repo**
   - In the App's settings → "Install App" → select `azzoro-resources`.

3. **Update `public/admin/config.yml` backend block**

   ```yaml
   backend:
     name: github
     repo: <github-org>/azzoro-resources
     branch: main
     app_id: <APP_ID_FROM_STEP_1>
   ```

4. **Add Vercel env vars** (Dashboard → Project → Settings → Environment Variables)
   - `GITHUB_APP_ID` (App ID)
   - `GITHUB_APP_CLIENT_ID`
   - `GITHUB_APP_CLIENT_SECRET`
   - Scope: Production + Preview

5. **Add collaborator(s)** to the repo (GitHub → Settings → Collaborators).
   They use the GitHub account they want to edit with.

6. **First sign-in test**
   - Visit `https://staging.azzororesources.com/admin`
   - Click "Sign in with GitHub"
   - Authorize the App
   - You should land in the Sveltia dashboard with all collections visible.

## Troubleshooting

- **"Callback URL mismatch":** the URL in the App settings must exactly match the URL where /admin lives.
- **"Repository not found":** the App is registered but not installed on the repo — go back to step 2.
- **Collections empty but page loads:** check `config.yml` syntax with a YAML linter.
```

- [ ] **Step 2:** Commit

Run:
```bash
git add docs/admin-setup.md
git commit -m "docs: add Sveltia GitHub App setup guide"
```

---

### Task 36: First build & local smoke test

**Files:** none (verification)

- [ ] **Step 1:** Run typecheck

Run: `npm run typecheck`
Expected: no errors

- [ ] **Step 2:** Run lint

Run: `npm run lint`
Expected: no errors (warnings OK)

- [ ] **Step 3:** Run tests

Run: `npm test`
Expected: all loader + LanguageToggle tests pass

- [ ] **Step 4:** Run a full production build

Run: `npm run build`
Expected: successful build, output lists pre-rendered routes:
```
○ /[locale]
○ /[locale]/about
○ /[locale]/projects
○ /[locale]/esg
○ /[locale]/gallery
○ /[locale]/contact
○ /robots.txt
○ /sitemap.xml
```

If any route fails to pre-render, debug before continuing.

- [ ] **Step 5:** Run the production build locally

Run: `npm start`
Expected: server starts on port 3000

- [ ] **Step 6:** Smoke-test all routes in browser

Visit each, confirm content renders:
- `http://localhost:3000/` (redirects to /en)
- `http://localhost:3000/en` and all 5 sub-pages
- `http://localhost:3000/mn` and all 5 sub-pages
- Language toggle works on every page
- `http://localhost:3000/admin` loads Sveltia (will show "Sign in with GitHub" — won't actually authenticate yet because GitHub App isn't set up; that's fine for local smoke test)
- `http://localhost:3000/robots.txt` shows robots rules
- `http://localhost:3000/sitemap.xml` shows the sitemap with hreflang

Stop server.

- [ ] **Step 7:** Commit checkpoint

Run:
```bash
git commit --allow-empty -m "checkpoint: foundation passes typecheck, lint, tests, build, and smoke test"
```

---

### Task 37: Set up Vercel project and connect to GitHub

**Files:** none (Vercel dashboard operations)

This step requires you to perform actions in the Vercel dashboard. None are reversible-affecting beyond connecting a new project, so they're safe.

- [ ] **Step 1:** Push the branch to GitHub

Run:
```bash
git push -u origin next-migration
```

- [ ] **Step 2:** Open the Vercel dashboard

Go to https://vercel.com/dashboard and click "Add New… → Project."

- [ ] **Step 3:** Import the `azzoro-resources` repo (or current name)

Pick the repo. Vercel auto-detects Next.js. Accept defaults except:
- **Production branch:** set to `main` (we'll merge `next-migration` to `main` after staging is validated)
- **Preview branches:** leave default (every PR gets a preview)

- [ ] **Step 4:** Add environment variables (Production + Preview)

Add the following empty placeholders — values get filled in later plans:
- `NEXT_PUBLIC_SITE_URL` = `https://staging.azzororesources.com` (for now; switches to prod URL at launch)
- `NEXT_PUBLIC_MAPTILER_KEY` = (leave blank — populated in Plan 2)
- `CLOUDFLARE_STREAM_ACCOUNT_ID` = (blank — Plan 2)

Stock and feed vars come in Plan 2.

- [ ] **Step 5:** Trigger the first deploy

Either click "Deploy" in the import flow or push an empty commit:
```bash
git commit --allow-empty -m "trigger: first Vercel build"
git push
```

- [ ] **Step 6:** Verify deploy succeeds

Watch the Vercel build log. Expect ~90s. On success, Vercel gives a preview URL like `azzoro-resources-xxxxx.vercel.app`.

- [ ] **Step 7:** Smoke-test the deployed URL

Visit the preview URL. Walk through the same routes as Task 36 step 6. Note `/admin` will not authenticate yet — GitHub App setup is Task 38.

- [ ] **Step 8:** Commit (documentation only — capture the staging URL in a notes file)

Create `docs/staging.md`:

```markdown
# Staging environment

- Preview URL: <fill in the Vercel-assigned URL>
- Branch deployed: `next-migration`
- /admin status: shell loads, auth pending GitHub App setup (see docs/admin-setup.md)
```

Run:
```bash
git add docs/staging.md
git commit -m "docs: capture staging URL after first Vercel deploy"
git push
```

---

### Task 38: Configure custom staging domain (optional but recommended)

**Files:** none (Vercel + DNS operations)

- [ ] **Step 1:** In Vercel project → Settings → Domains, add `staging.azzororesources.com`

Vercel will show DNS records to add (CNAME to `cname.vercel-dns.com`).

- [ ] **Step 2:** Add the DNS record at the domain registrar

Add `staging` CNAME → `cname.vercel-dns.com`. TTL: 300s.

- [ ] **Step 3:** Verify SSL provisions automatically (~5 min)

Visit `https://staging.azzororesources.com` and confirm it serves the site over HTTPS.

- [ ] **Step 4:** Password-protect the staging deployment (Vercel Pro feature)

Vercel → Project → Settings → Deployment Protection → enable for Preview (covers staging). Set a shared password to send to the client.

- [ ] **Step 5:** Update `docs/staging.md` with the final URL

Edit `docs/staging.md` and replace the preview URL line with `https://staging.azzororesources.com`.

Run:
```bash
git add docs/staging.md
git commit -m "docs: update staging URL to staging.azzororesources.com"
git push
```

---

### Task 39: Complete GitHub App setup and verify /admin auth

**Files:** modify `public/admin/config.yml`

Follow `docs/admin-setup.md` to register the GitHub App and install it on the repo. Then update the config.

- [ ] **Step 1:** Follow steps 1-5 in `docs/admin-setup.md`

Specifically:
1. Register the GitHub App
2. Install on the `azzoro-resources` repo
3. Add Vercel env vars (`GITHUB_APP_ID`, `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`)
4. Add at least one collaborator (probably yourself)

- [ ] **Step 2:** Update `public/admin/config.yml` backend block

Replace the placeholder `backend:` section in `config.yml`:

```yaml
backend:
  name: github
  repo: <your-github-org>/azzoro-resources
  branch: main
  app_id: <APP_ID_YOU_REGISTERED>
```

- [ ] **Step 3:** Commit and push

Run:
```bash
git add public/admin/config.yml
git commit -m "feat: configure Sveltia backend with GitHub App ID"
git push
```

- [ ] **Step 4:** Wait for Vercel deploy (~90s)

- [ ] **Step 5:** Sign-in test

Visit `https://staging.azzororesources.com/admin`. Click "Sign in with GitHub." Authorize the App. You should land in the Sveltia dashboard with all collections visible in the sidebar.

If sign-in fails:
- Check Vercel env vars are set on Production
- Check the App's callback URL matches the /admin URL
- Re-read `docs/admin-setup.md` troubleshooting section

- [ ] **Step 6:** Edit a placeholder field as a smoke test

In Sveltia: Pages → Home → change the EN headline to anything else → Save. Confirm:
- A new commit appears on `main` in GitHub
- Vercel triggers a deploy
- ~90s later, the new headline shows on staging

- [ ] **Step 7:** Commit (documentation update)

Update `docs/staging.md`:

```markdown
# Staging environment

- Preview URL: https://staging.azzororesources.com
- Branch deployed: `next-migration` (will merge to main after Plan 1 review)
- /admin status: live, GitHub App configured, end-to-end edit-to-deploy verified
```

Run:
```bash
git add docs/staging.md
git commit -m "docs: confirm /admin auth working end-to-end"
git push
```

---

### Task 40: Clean up — remove src.legacy, merge to main

**Files:**
- Delete: `src.legacy/`
- Modify: `tsconfig.json` (remove exclude)

- [ ] **Step 1:** Confirm no references to `src.legacy/` remain

Run: `grep -r "src.legacy" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.mjs" .`
Expected: only `tsconfig.json`'s `exclude` line. If any source file imports from `src.legacy/`, port it first or remove the import.

- [ ] **Step 2:** Delete the directory

Run: `git rm -r src.legacy`

- [ ] **Step 3:** Remove the exclude from `tsconfig.json`

Edit `tsconfig.json` and change the `exclude` line to just `["node_modules"]`.

- [ ] **Step 4:** Verify typecheck + build still work

Run:
```bash
npm run typecheck
npm run build
```
Expected: both pass

- [ ] **Step 5:** Commit

Run:
```bash
git add tsconfig.json
git commit -m "chore: remove src.legacy after migration complete"
```

- [ ] **Step 6:** Push branch

Run: `git push`

- [ ] **Step 7:** Open PR for review

In GitHub UI: open a PR from `next-migration` → `main`. Title: "Plan 1: Foundation — Next.js + Sveltia CMS shell." Body should reference this plan file.

- [ ] **Step 8:** After review, merge to main

When ready, merge the PR. Vercel auto-deploys `main` to staging (and to production once production domain is wired in Plan 3).

---

## Plan 1 done — what's deployed

After all 40 tasks:

- Next.js 14 App Router project at `staging.azzororesources.com`
- Both `/en/...` and `/mn/...` routes resolve for Home, About, Projects, ESG, Gallery, Contact
- Navbar with localized nav labels (CMS-driven)
- Language toggle works
- Footer with localized copyright
- `/admin` loads Sveltia, client can sign in with GitHub
- All CMS collections defined; client can edit and Save triggers redeploy
- Placeholder content visible (real content is Plan 2)
- robots.txt and sitemap.xml with hreflang
- Typecheck + lint + tests + build all pass

**Ready for client preview** — they can browse the staging URL and see the new structure, even if visuals are minimal.

**Plan 2 begins:** AI content seeding, real images, projects map with side panel, gallery with photos/videos/case studies, stock price API, investor news feed, Cloudflare Stream integration for hero video.
