# Azzoro Resources - Handoff Document

## What the client receives

- Next.js bilingual website codebase
- Git-backed CMS shell at `/admin`
- Editor guide in `docs/editor-guide.md`
- Launch checklist in `docs/launch-readiness.md`
- Review checklist in `docs/client-review-checklist.md`

## What the client owns

- Final content approval in EN and MN
- Team photos, bios, governance PDFs, and hero footage
- Investor portal feed details
- DNS or registrar coordination for production cutover

## What the dev team owns

- Hosting and deploy pipeline configuration
- GitHub App setup for `/admin`
- Code changes, schema changes, and dependency updates
- Post-launch bug fixes and maintenance tasks

## Ongoing services

| Service | Expected cost |
|---|---|
| Vercel | Hobby or Pro, depending on traffic |
| Cloudflare Stream | Paid only when hero/video hosting is enabled |
| MapTiler | Optional if OSM fallback is not enough |
| GitHub | Existing repository hosting |

## Support model

- Content edits: client via `/admin`
- Structural changes: dev task
- Operational issues: check Vercel deployment status first, then escalate to dev support