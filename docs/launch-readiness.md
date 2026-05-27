# Launch Readiness

## Automated checks

- `npm run typecheck`: pending latest pre-launch pass
- `npm run lint`: pending latest pre-launch pass
- `npm test`: pending latest pre-launch pass
- `npm run build`: pending latest pre-launch pass
- `npm run a11y:scan`: pending local/staging run

## Lighthouse scores

| Page | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| /en | pending | pending | pending | pending |
| /en/projects | pending | pending | pending | pending |
| /en/about | pending | pending | pending | pending |
| /en/gallery | pending | pending | pending | pending |

## Pre-launch checklist

- [ ] Client approved EN copy
- [ ] Client approved MN copy
- [ ] `/admin` auth verified end-to-end
- [ ] Vercel staging domain live
- [ ] Production env vars set
- [ ] Sitemap and robots verified on staging
- [ ] Accessibility scan reviewed
- [ ] Cross-browser smoke test complete
- [ ] DNS cutover approved

## Launch note

Production launch remains blocked on client-owned assets, DNS access, and GitHub App credentials.