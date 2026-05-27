# Azzuro

Foundation migration for the Azzuro Resources marketing site, built with Next.js App Router, TypeScript, Tailwind CSS, next-intl, and shadcn/ui primitives.

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- next-intl
- Framer Motion
- shadcn/ui
- Vitest

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Getting Started

```bash
git clone <your-repository-url>
cd azzuro
npm install
npm run dev
```

The local dev server runs through Next.js on port `3000`.

## Available Scripts

```bash
npm run dev        # Start local development server
npm run build      # Create a production build
npm run start      # Run the production server
npm run lint       # Run Next.js ESLint checks
npm run typecheck  # Run TypeScript without emitting
npm run test       # Run Vitest once
npm run test:watch # Run Vitest in watch mode
```

## Project Structure

```text
app/            App Router routes and layouts
components/     Shared layout, home, and UI components
content/        CMS-managed markdown and YAML content
lib/            Content loaders, i18n config, and utilities
messages/       UI string translations
public/         Static assets and Sveltia admin shell
```

## GitHub Push Checklist

Before pushing to GitHub, verify the following:

1. Run `npm run build` and confirm it passes.
2. Run `npm run test` if you changed behavior.
3. Do not commit local output such as `node_modules/`, `.next/`, `dist/`, `.vercel/`, or coverage reports.
4. Review large media assets in `public/` before pushing. GitHub rejects files larger than 100 MB.
5. Confirm any secrets are stored in Vercel environment variables, not committed to the repo.

## Deployment Notes

This project deploys to Vercel as a Next.js App Router application with these settings:

- Framework Preset: Next.js
- Build Command: `npm run build`

## Notes About Assets

Large video or image assets can block GitHub pushes and slow Vercel builds. Prefer one of these approaches for oversized media:

- Compress the file below GitHub's 100 MB limit
- Store it with Git LFS
- Host it externally and reference it by URL

## License

No license file has been added yet. If this repository will be public, add an explicit license before publishing.
