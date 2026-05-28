# Azzoro Resources - Editor Guide

## Signing in

1. Visit `/admin` on the staging or production site.
2. Click **Sign in with GitHub**.
3. Authorize the Azzoro Resources CMS app the first time.

## Common tasks

### Edit a page

1. Open **Pages**.
2. Choose Home, About, ESG, Gallery, or Contact.
3. Edit the EN tab, then switch to MN for the translation.
4. Save and wait about 90 seconds for Vercel to redeploy.

### Update a team member

1. Open **Team**.
2. Choose a profile or create a new entry.
3. Fill name, role, photo, bio, and order.
4. Save both locales.

### Update a project

1. Open **Projects**.
2. Edit title, commodity, status, coordinates, summary, data cards, and markdown body.
3. Save both locales.

### Replace governance documents

1. Open **Governance**.
2. Upload the new PDF.
3. Set category and effective date.
4. Save.

### Publish gallery content

1. Use **Gallery Photos**, **Gallery Videos**, or **Case Studies**.
2. Upload media, then fill titles, dates, tags, and body copy.
3. Save both locales where applicable.

## What not to edit in CMS

- Layout changes
- Navigation structure beyond existing links
- New schema fields
- `/admin` configuration

## When something looks wrong

1. Wait 1 to 2 minutes for deploy completion.
2. Hard-refresh the page.
3. Check whether your edit created a Git commit in the repo.
4. Contact the dev team if the deploy fails or the page layout breaks.

## Practical notes

- Resize images before upload when possible.
- Use `##` headings inside markdown bodies.
- Internal links should stay locale-aware, for example `/about` in CMS fields that the site localizes automatically.
- Keep MN and EN versions aligned so the language switcher stays trustworthy.