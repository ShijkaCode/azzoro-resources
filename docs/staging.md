# Staging Environment

- Preview URL: pending first Vercel deploy
- Custom staging domain: `staging.azzororesources.com` pending DNS access
- `/admin` status: schema wired locally, GitHub App auth pending credentials and Vercel env setup
- Deployment protection: pending Vercel configuration

## Required env vars

- `NEXT_PUBLIC_SITE_URL=https://staging.azzororesources.com`
- `NEXT_PUBLIC_MAPTILER_KEY=<optional>`
- `NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID=<optional until video is ready>`
- `STOCK_API_PROVIDER=yahoo`
- `STOCK_API_KEY=`
- `STOCK_TICKER_FALLBACK=ABM.L`
- `INVESTOR_FEED_URL=<optional until feed is confirmed>`
- `GITHUB_APP_ID=<required for /admin sign-in>`
- `GITHUB_APP_CLIENT_ID=<required for /admin sign-in>`
- `GITHUB_APP_CLIENT_SECRET=<required for /admin sign-in>`

## Smoke-test checklist

- Visit `/en` and `/mn`
- Check `/en/projects` and one project detail page
- Confirm `/admin` shell loads
- Confirm stock card and investor news degrade gracefully when upstream services are unavailable