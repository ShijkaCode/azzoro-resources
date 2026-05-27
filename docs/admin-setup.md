# Admin Setup

This project uses the static Sveltia CMS shell in `public/admin` with the GitHub backend.

## Repo-side state

- `public/admin/config.yml` is aligned with the current content schema
- The backend repo is set to `ShijkaCode/mongolia-engineering-hub`
- GitHub App credentials are intentionally not committed

## GitHub App setup

1. Create a GitHub App for the repo.
2. Set callback URLs for:
   - `http://localhost:3000/admin`
   - `https://staging.azzororesources.com/admin`
   - `https://azzororesources.com/admin`
3. Grant `Contents: Read and write` and `Metadata: Read`.
4. Install the app on this repository.

## Vercel environment variables

Add these to Preview and Production:

- `GITHUB_APP_ID`
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`

## Final config step

After the GitHub App exists, set `backend.app_id` in `public/admin/config.yml` to the issued App ID. Until then, `/admin` will load but sign-in will not complete.