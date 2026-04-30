# Mongolia Engineering Hub

Marketing site for Asian Battery Metals PLC, built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui components.

## Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Vitest

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Getting Started

```bash
git clone https://github.com/ShijkaCode/mongolia-engineering-hub.git
cd mongolia-engineering-hub
npm install
npm run dev
```

The local dev server runs through Vite. By default, the project is configured to serve on port `8080`.

## Available Scripts

```bash
npm run dev        # Start local development server
npm run build      # Create production build in dist/
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run test       # Run Vitest once
npm run test:watch # Run Vitest in watch mode
```

## Project Structure

```text
src/
	components/   Reusable UI and page sections
	hooks/        Shared React hooks
	lib/          Small utilities
	pages/        Route-level page components
	test/         Test setup and examples
public/         Static assets served directly by Vite
```

## GitHub Push Checklist

Before pushing to GitHub, verify the following:

1. Run `npm run build` and confirm it passes.
2. Run `npm run test` if you changed behavior.
3. Do not commit local output such as `node_modules/`, `dist/`, `.vercel/`, or coverage reports.
4. Review large media assets in `public/` before pushing. GitHub rejects files larger than 100 MB.
5. Confirm any secrets are stored in Vercel environment variables, not committed to the repo.

## Deployment Notes

This project deploys cleanly to Vercel as a standard Vite application with these settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Notes About Assets

Large video or image assets can block GitHub pushes and slow Vercel builds. Prefer one of these approaches for oversized media:

- Compress the file below GitHub's 100 MB limit
- Store it with Git LFS
- Host it externally and reference it by URL

## License

No license file has been added yet. If this repository will be public, add an explicit license before publishing.
