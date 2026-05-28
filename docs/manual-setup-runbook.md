# Azzuro Resources — Manual Setup Runbook

Everything you have to do **outside the codebase** between now and launch — in execution order, with specific links, field values, and verification steps. Nothing here can be automated from inside Claude Code.

**Status legend** for each step:
- ✅ Done
- 🟡 In progress / partially done
- ⬜ Not started
- 🚫 Blocked on someone else

Mark as you go. When you finish a phase, ping me and I'll wire up the next code piece that depends on it.

---

## Dependency map at a glance

```
Phase 1: Accounts ────────────────► Phase 2: Wire infrastructure
   │                                       │
   │                                       ▼
   │                              Phase 4: Cloudflare Stream upload
   │                                       │
   ▼                                       ▼
Phase 3: Asset collection ──────► Phase 5: Content review
(longest pole — start day 1)             │
                                          ▼
                                  Phase 6: Client onboarding
                                          │
                                          ▼
                                  Phase 7: Pre-launch validation
                                          │
                                          ▼
                                  Phase 8: Launch day (DNS cutover)
                                          │
                                          ▼
                                  Phase 9: Post-launch (within 48h)
```

Phase 3 is the longest pole. Kick it off in parallel with Phase 1.

---

## PHASE 1 — Account setup (~30-60 min)

Do these in parallel. None depend on each other. All except Cloudflare Stream are free.

---

### 1.1 ⬜ GitHub App for Sveltia /admin auth

**Why:** Without this, no one can sign into `/admin` to edit content. The client can't self-serve.

**Steps:**
1. Go to https://github.com/settings/apps/new
2. Fill the form:
   - **GitHub App name:** `Azzuro Resources CMS`
   - **Homepage URL:** `https://azzororesources.com`
   - **Callback URL** (one per line, click "Add a callback URL" for each):
     ```
     https://staging.azzororesources.com/admin
     https://azzororesources.com/admin
     http://localhost:3000/admin
     ```
   - **Webhook** → untick "Active"
   - **Repository permissions:**
     - Contents: **Read and write**
     - Metadata: **Read-only** (default)
   - All other permissions: leave at "No access"
   - **Where can this GitHub App be installed?** → "Only on this account"
3. Click **Create GitHub App** at the bottom
4. On the resulting page, save these three values somewhere safe (1Password / Bitwarden / temporary note):
   - **App ID** (top of the page — a 6-7 digit number)
   - **Client ID** (under "About" — starts with `Iv1.` or `Iv23li`)
   - **Client secret** — click **Generate a new client secret**, then copy. **You won't see this again.**
5. Scroll down to **Private keys** section. Click **Generate a private key**. A `.pem` file downloads. Keep it — you may need it later for self-hosted Sveltia auth.
6. Click **Install App** in the left sidebar
7. Click **Install** next to your account
8. Choose **Only select repositories** → pick `azzuro-resources` (or whatever the repo is named) → **Install**

**Verify:** GitHub Apps page shows the app installed on the repo with green "Installed" badge.

**Hand to me when done:** App ID + Client ID + Client Secret. I'll update `public/admin/config.yml` to use the App ID.

---

### 1.2 ⬜ MapTiler account (free tier)

**Why:** Production map tiles. Free tier covers 100k loads/month — plenty for a portfolio site. Without this, the map falls back to OpenStreetMap raster tiles which look uglier and have weaker rate limits.

**Steps:**
1. Sign up at https://cloud.maptiler.com/auth/widget/?mode=register
2. Verify email
3. Dashboard → **Keys** (left sidebar)
4. The "Default" key is fine, but for safety create a new one named `azzuro-production`:
   - Click **+ New Key**
   - Name: `azzuro-production`
   - **Allowed HTTP Origins:** add these (one per line — **hostnames only, no `https://` scheme, no port**):
     ```
     azzororesources.com
     *.azzororesources.com
     localhost
     ```
     MapTiler validates this field strictly — `https://...` or `http://localhost:3000` will fail with "Invalid origin restriction".
   - **Allowed user-agent header:** leave blank
   - Save
5. Copy the generated key

**Hand to me when done:** the key string. I'll tell you the env var name (it's `NEXT_PUBLIC_MAPTILER_KEY` — see Phase 2.4).

**Verify after deploy:** Visit `/en/projects` on staging — pins render on a satellite/terrain map, not a flat gray OSM map.

---

### 1.3 ⏸️ Cloudflare Stream — DEFERRED per client decision (2026-05-28)

**Decision:** Client opted to self-host a compressed MP4 first, only upgrade to Cloudflare Stream if real perf becomes a problem. Avoid the $60/year subscription unless data justifies it.

**What replaces this:**
- Compress the hero footage to ~3-5 MB MP4 (see Phase 4 for compression specs)
- Drop at `public/uploads/hero.mp4`
- The existing `CloudflareStreamHero` component will be swapped for a `<video>` element wired to the local file. Cloudflare wiring stays in the codebase as a switchable option.

**Revisit trigger:** if Lighthouse / RUM data shows the hero video is materially slowing TTI on mobile, or visitors report buffering, re-enable this phase.

---

### 1.4 ⬜ Vercel project + first deploy

**Why:** Hosting. You may already have this from the POC — verify which project name it points at and whether it's set to deploy from `main`.

**If POC project exists and deploys current repo:**
1. Open https://vercel.com/dashboard
2. Find the project (probably named `azzuro` or similar)
3. Settings → Git → confirm:
   - Connected repository: correct repo
   - Production branch: `main`
4. If anything is wrong, fix it now

**If no project exists:**
1. Dashboard → **Add New…** → **Project**
2. Import the GitHub repo
3. Framework Preset: Next.js (auto-detected)
4. Build command: default (`next build`)
5. Output directory: default (`.next`)
6. Click **Deploy**
7. Wait ~90-120s for first build

**Verify:** Vercel build log shows "Compiled successfully" + a list of pre-rendered routes (every `/en/*` and `/mn/*` page).

Once deployed, note the auto-assigned URL (looks like `azzuro-resources-xxxxx.vercel.app`).

---

## PHASE 2 — Initial wiring (~60-90 min, after Phase 1)

Now we connect the accounts to the codebase via Vercel env vars + a couple of small code edits I'll make for you.

---

### 2.1 ⬜ Set Vercel environment variables

**Why:** Env vars are how the code reads keys + URLs. Set them on Vercel for Production + Preview scopes.

**Steps:**
1. Vercel → Project → **Settings** → **Environment Variables**
2. Add each row below. For each: enter Key, Value, then check **Production** + **Preview** + **Development** scopes:

| Key | Value | Source |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://staging.azzororesources.com` (will swap to prod URL at launch) | You |
| `NEXT_PUBLIC_MAPTILER_KEY` | The key from 1.2 | MapTiler |
| `NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID` | The Account ID from 1.3 | Cloudflare |
| `STOCK_API_PROVIDER` | `yahoo` | Hardcoded |
| `STOCK_TICKER_FALLBACK` | `ABM.L` for now (swap when client confirms post-rebrand ticker) | Client (eventually) |
| `INVESTOR_FEED_URL` | leave blank until Phase 3.7 | Client |
| `GITHUB_APP_ID` | App ID from 1.1 | GitHub |
| `GITHUB_APP_CLIENT_ID` | Client ID from 1.1 | GitHub |
| `GITHUB_APP_CLIENT_SECRET` | Client Secret from 1.1 — **mark as Sensitive** | GitHub |

3. Click **Save**
4. Trigger a fresh deploy:
   - Either push an empty commit: `git commit --allow-empty -m "trigger: env vars refreshed" && git push`
   - Or in Vercel → Deployments → ⋯ next to latest deploy → **Redeploy** (uncheck "Use existing Build Cache")

**Verify:** New deploy succeeds.

---

### 2.2 ⬜ Wire Sveltia config to your GitHub App

**Files:** `public/admin/config.yml`

This is one small code edit I can do for you once you have the App ID. Or do it yourself:

1. Open `public/admin/config.yml`
2. Find the `backend:` block at the top
3. Replace with:
   ```yaml
   backend:
     name: github
     repo: <YOUR-GITHUB-USERNAME>/azzuro-resources
     branch: main
     app_id: <APP_ID_FROM_1.1>
   ```
4. Replace the placeholder strings with real values
5. Commit and push:
   ```bash
   git add public/admin/config.yml
   git commit -m "feat: configure Sveltia GitHub App backend"
   git push
   ```

**Verify:** Vercel auto-deploys. After deploy:
1. Visit `https://<vercel-url>/admin`
2. You should see a Sveltia sign-in page with a "Sign in with GitHub" button
3. Click it → GitHub OAuth flow → Authorize the Azzuro Resources CMS app
4. You land in the Sveltia dashboard with the left sidebar showing all collections (Pages, Team, Projects, Governance, Gallery, Partners, Settings)
5. **End-to-end smoke test:** Click Pages → Home → change the EN headline → Save. Wait ~90s. Refresh `/en` on the site. The new headline shows.

If sign-in fails, the most common causes:
- Callback URL mismatch — the URL you're visiting must exactly match one of the callback URLs you set in step 1.1
- Env vars only set on Preview, not Production — check Vercel scope checkboxes
- App not actually installed on the repo (registered ≠ installed) — go back to 1.1 step 6

---

### 2.3 ⬜ Add custom staging domain

**Why:** A URL the client can remember + tied to your real domain so SSL is properly branded.

**Steps:**
1. Vercel → Project → **Settings** → **Domains**
2. Type `staging.azzororesources.com` → Add
3. Vercel shows a DNS record to add — something like:
   ```
   Type: CNAME
   Name: staging
   Value: cname.vercel-dns.com
   ```
4. **Go to your domain registrar** (whoever sold you azzororesources.com — likely GoDaddy, Namecheap, Cloudflare, Porkbun, etc.)
5. Open DNS management for `azzororesources.com`
6. Add the CNAME record above, TTL 300 seconds
7. Save at the registrar
8. Back in Vercel, the domain status flips from "Pending" → "Valid Configuration" within a few minutes (SSL provisions automatically)

**Verify:** Visit `https://staging.azzororesources.com` — green padlock, site loads.

---

### 2.4 ⬜ Password-protect staging

**Why:** Keep search engines and casual visitors out until launch.

**Steps:**
1. Vercel → Project → **Settings** → **Deployment Protection**
2. Find **Vercel Authentication** or **Password Protection** for Preview Deployments
3. Enable it. Pick **Password Protection** (simpler than Vercel SSO for non-team users)
4. Set a password (e.g., `azzuro-staging-2026` — anything memorable)
5. Save

**Verify:** Open `https://staging.azzororesources.com` in incognito — prompted for password. Enter it → site loads.

**Hand to client:** the staging URL + password, plus a heads-up that this is private until launch.

---

## PHASE 3 — Asset + info collection from the client (longest pole)

**Start this in parallel with Phase 1.** These items take real-world time (client looks for files, pulls together team bios, asks IT for DNS access, etc.) and any one of them can become a blocker the day before launch.

For each item below: send the client a single consolidated email listing all of them, then chase weekly.

---

### 3.1 🚫 Final logo files

**Ask the client for:**
- Logo SVG (vector — scales perfectly)
- Logo PNG fallback (2400px wide, transparent background)
- Dark-mode variant (white-on-transparent, in case we add dark mode)
- Favicon (512×512 PNG or .ico)
- Optional: brand guidelines PDF (colors, typography, do/don't)

**Tell them why each format:** SVG for scalability, PNG fallback for legacy email clients / social embeds, dark variant just-in-case.

**When received:** Drop into `public/uploads/`:
- `logo.svg`
- `logo.png`
- `logo-dark.svg`
- `favicon.ico` (also link from `app/layout.tsx`)

Then update `content/settings/site.yml` `logo` and `logo_dark` fields to point at the new files via `/admin`.

---

### 3.2 🚫 Hero video footage

**Ask the client for:**
- 15-30 seconds of high-quality footage (1080p minimum, 4K preferred)
- Loopable: starts and ends on similar frames so the loop seam isn't obvious
- No audio is fine (we mute by default)
- File formats accepted: MP4 (H.264), MOV, MKV — Cloudflare Stream re-encodes to HLS

**Content suggestions** (per the PPT): field exploration teams in action, drilling, geologists working, meeting with local communities, drone shots over Mongolian landscape.

**When received:** Upload to Cloudflare Stream (Phase 4) and note the UID.

---

### 3.3 🚫 Team photos

**Ask the client for:**
- One photo per person — Phil Rundell, Otgonjargal Bayarbat, Batkhurel Battulga, Purevdorj Dorjsuren, Bat-Erdene Batmunkh
- Square crop (1:1 ratio), minimum 800×800 px
- Neutral background preferred, professional
- File format: JPG or WebP

**Tell them:** placeholder PNGs are showing as initials right now. Real photos make the team page feel real.

**When received:** Drop into `public/uploads/team/<slug>.jpg` (e.g., `phil-rundell.jpg`). The CMS frontmatter `photo:` field already points at these paths — just overwriting the file is enough; or use /admin to swap.

---

### 3.4 🚫 Team bios

**Ask the client for:**
- 100-150 words per person, neutral third-person tone
- Highlights: years of experience, key roles, education, anything distinctive
- For board members: PLC governance experience, prior boards, listing experience

**Tell them:** AI-drafted bios are currently in `[DRAFT]` state and clearly marked. Real bios go in via /admin (Team → click member → Bio field).

---

### 3.5 🚫 Governance documents (PDFs)

**Ask the client for:** the actual current files for each category:
- **Constitution:** Company constitution
- **Charters:** Board charter, Audit & Risk committee charter, Remuneration committee charter
- **Policies:** Code of conduct, Anti-bribery/corruption policy, Continuous disclosure policy, Whistleblower policy, Securities trading policy
- **Reports:** Latest annual report, latest half-year report, ESG/Sustainability report if any
- **Disclosures:** Any current AIM/LSE disclosures, modern slavery statement, tax transparency report

**Tell them:** the structure already exists — they just need to swap real PDFs in via /admin. The category dropdown puts each in the right section automatically.

---

### 3.6 🚫 Project license-area coordinates + technical info

**Ask the client for:**
- Exact lat/lng of each project's primary license-area centroid:
  - OVAL (Western Mongolia)
  - KHUKH TAG (Northern Mongolia)
  - TSAGAAN DERS (Southern Mongolia)
- License area in km² per project
- Current status (Active exploration / Drilling / Resource definition)
- Acquired date
- Any technical detail they want public: drill program status, recent assay highlights, resource estimates (only if formally announced)

**Tell them:** map pins are currently at approximate coordinates. Precise centroids make the map accurate. Technical info goes into `data_cards[]` in /admin.

---

### 3.7 🚫 Investor portal feed URL + format

**Ask the client for:**
- What platform powers `investors.asianbatterymetals.com`? (vendor name — EQS, IRESS, Computershare, ASX Investor Centre, etc.)
- Does the platform expose an RSS or JSON feed of announcements? If yes, the feed URL.
- If no, can they enable one — most IR platforms support it but it's off by default.

**Why this matters:** the home page has a "Latest announcements" section that auto-pulls from this feed. No feed = section just hides (graceful degradation), but the Home page is less alive.

**When received:**
- Set `INVESTOR_FEED_URL` in Vercel env vars to the feed URL
- Paste a sample of the XML/JSON response to me — I'll confirm the existing parser in `lib/news/fetch.ts` handles its shape, and adjust if needed
- Toggle `news_section_enabled: true` in `/admin` → Pages → Home

---

### 3.8 🚫 Stock ticker post-rebrand

**Ask the client for:** the new ticker symbol on whichever exchange they're listed (probably AIM/LSE). Could be the same `ABM.L` or could change to something like `AZR.L`.

**When received:** Update `STOCK_TICKER_FALLBACK` in Vercel env vars.

**Note:** the stock card on Home gracefully degrades to a "View on investor portal" link if the API can't find the ticker, so a wrong ticker doesn't break the site — just makes the card less useful.

---

### 3.9 🚫 DNS access for `azzororesources.com`

**Ask the client:** "We need DNS edit access for `azzororesources.com` to point the domain at our hosting at launch. Two options:
1. Give us temporary access to the domain registrar account
2. We send you the exact records to add when we're ready, you add them at the registrar yourself"

**Tell them:** for the staging subdomain we already added (Phase 2.3), they may have already given access. Production cutover needs the apex domain (`azzororesources.com` and `www.azzororesources.com`).

**Lead time:** Some registrars (corporate-managed) have approval workflows that take days. Find out early.

---

### 3.10 🚫 Old domain redirect coordination

**Ask the client:** "After we launch at azzororesources.com, we want visitors who land on the old asianbatterymetals.com URLs to be auto-redirected to the new site. Two options:
1. Point asianbatterymetals.com DNS at our Vercel hosting too — we'll catch all the legacy paths and 301 them
2. Configure 301 redirects at the current asianbatterymetals.com host (whoever runs it today)"

**Option 1 is simpler if they have DNS access to the old domain too.**

---

### 3.11 🚫 Native Mongolian speaker for translation review

**Ask the client:** "Our MN translations are AI-drafted starting points. Before launch, we need a native Mongolian speaker — ideally someone in the Mongolia office — to spend ~1 hour proofreading. Who's the right person?"

**Tell them:** the proofreader doesn't need to be a developer. They can review by:
1. Browsing the staging site with the language toggle on MN
2. Marking up screenshots / a Google Doc with corrections
3. Or — if they're comfortable — editing directly in `/admin`

---

## PHASE 4 — Self-host compressed hero video (after Phase 3.2)

Replaces the original Cloudflare Stream flow per the 2026-05-28 client decision.

---

### 4.1 ⬜ Compress the client's footage

**Targets:**
- Container: MP4 · Codec: H.264 · Resolution: 1920×1080 · 24-30 fps
- Duration: 15-30s loop
- **Audio: strip it** (we autoplay muted anyway)
- **Target file size: 3-5 MB**
- Enable `+faststart` so playback begins before full download

**Tools:**
- **HandBrake** (free, GUI): https://handbrake.fr/ → "Web Optimized" preset → quality RF ~28 → uncheck audio
- **ffmpeg** one-liner:
  ```bash
  ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow -vf "scale=1920:-2" -an -movflags +faststart -t 25 hero.mp4
  ```

Verify the output: open in browser, confirm it autoplays muted, loops smoothly, file is under 5 MB.

---

### 4.2 ⬜ Drop the file in repo and ping Claude

1. Save the compressed file as `public/uploads/hero.mp4`
2. Hand to Claude — Claude swaps the existing `CloudflareStreamHero` component for a `<video>` element wired to the local file (~5 min code change). The Cloudflare component stays in place as a switchable option for later.

---

### 4.3 ⬜ Upload hero poster image

**Why:** This is the static image visitors see while the video is buffering (or always, if their browser blocks autoplay).

**Steps:**
1. Pick a still frame from the hero video (or use any compelling 16:9 photo)
2. Save as `public/uploads/hero-poster.jpg`, ~1920×1080, target ~150kB (compress with https://squoosh.app/ first)
3. Commit and push:
   ```bash
   git add public/uploads/hero-poster.jpg
   git commit -m "feat: add hero video poster"
   git push
   ```

**Verify:** Disable JS in your browser, visit `/en` — poster image visible.

---

## PHASE 5 — Content review (after Phase 3 items received)

This phase is the **interactive content polishing loop** with the client. Expect 2-3 iterations.

---

### 5.1 ⬜ AI-drafted EN copy review

**Process:**
1. Send the staging URL + password to the client with `docs/client-review-checklist.md` attached
2. Ask them to walk each page, mark up anything wrong (factual errors, brand voice, tone)
3. They reply with markup OR (better) they go into `/admin` and just fix it themselves
4. Iterate until they say "looks good"

**Expected timeline:** 1-2 weeks of back-and-forth depending on how many people approve.

---

### 5.2 ⬜ MN translation review by native speaker

**Process:**
1. Send the reviewer the staging URL + the same password
2. Tell them how to switch language: click "Монгол" in the top-right
3. Give them either:
   - A Google Doc per page with the EN ↔ MN side-by-side for marking up, OR
   - `/admin` access if comfortable (have client invite them as GitHub collaborator first)
4. Apply corrections

**Common findings in AI-translated MN:**
- Mining/geology terms — the AI uses general words; native speaker swaps in industry terms
- Formal vs informal register — investor copy should be formal
- Cultural references — "Western Mongolia" should be the proper Mongolian region name

---

### 5.3 ⬜ Project body copy SME review

**Ask the client:** "Have a geologist or technical SME read the project pages and confirm the geology language is accurate. AI drafts are conservative but may use imprecise terms."

---

## PHASE 6 — Client onboarding (after content is "good enough")

---

### 6.1 ⬜ Schedule the call

**Steps:**
1. Find 30 minutes in the calendar with whoever will edit the site
2. Send invite with the staging URL + password + `docs/editor-guide.md` (or the PDF if you generated one)
3. Pre-call: confirm they have a GitHub account (if not, have them sign up at github.com first — 3 minutes)

**Don't skip this step.** A walkthrough call is 100x more useful than a written guide.

---

### 6.2 ⬜ Walkthrough agenda (30 min)

1. **(5 min)** Tour of the live staging site — Home, About, Projects map, Gallery, Contact. Show the language toggle.
2. **(2 min)** Sign them into `/admin` — invite them as repo collaborator first (GitHub → Settings → Collaborators → Add), they accept the email invite, then sign in
3. **(15 min)** Edit something real together — pick something on their team page (their own bio, role title). Save. Wait 90s. Show it live.
4. **(5 min)** Cover the 5 most common tasks from the editor guide
5. **(3 min)** Q&A — what worries them most?

**After:** capture any confusions in `docs/client-feedback.md` and update the editor guide.

---

## PHASE 7 — Pre-launch validation (after content is locked)

These I can help with — ping me to run them. Or do them yourself if you want.

---

### 7.1 ⬜ Run the a11y scan

```bash
npm run dev  # in one terminal
node scripts/a11y-scan.mjs  # in another
```

Capture violations. Most common ones are easy fixes (alt text, button labels). Hand them to me to fix.

---

### 7.2 ⬜ Lighthouse audit

Chrome DevTools → Lighthouse tab → Run on Mobile + Desktop for: `/en`, `/en/projects`, `/en/about`, `/en/gallery`. Targets: Perf ≥90 desktop / ≥75 mobile, Accessibility ≥95, BP ≥95, SEO ≥95.

If anything's below target, capture the specific findings and hand to me.

---

### 7.3 ⬜ Cross-browser smoke test

Walk Home + Projects + About + Gallery + Contact on:
- Desktop Chrome
- Desktop Firefox
- Desktop Safari (need a Mac, or use https://www.browserstack.com/ free trial)
- iOS Safari (real phone, or BrowserStack)
- Android Chrome (real phone, or BrowserStack)

Look for: layout breaks, broken images, map issues, scroll glitches, font fallback ugliness.

---

### 7.4 ⬜ Get client sign-off in writing

Email/Slack: "Are you happy with everything? Once you say yes I'll cut over DNS to make this live at the real azzororesources.com."

Don't skip this — having written sign-off protects you if they later say "wait that's not what we wanted."

---

### 7.5 ⬜ Lower DNS TTLs (≥24h before cutover)

**Why:** When you swap DNS, the old record can stay cached for as long as its TTL. Lower it first so the cutover takes minutes, not hours.

**Steps:**
1. Go to the DNS registrar for `azzororesources.com`
2. Find any existing records on the apex / www (probably pointing nowhere right now if it's a fresh domain — but check)
3. Set TTL to **300 seconds** (5 min) on those records
4. Wait at least 24 hours before doing Phase 8

---

## PHASE 8 — Launch day (~1-2 hours of focused work)

Pick a time: **early morning, mid-week, NOT Friday afternoon.** If something breaks you want hours of awake time to fix it, not a weekend.

---

### 8.1 ⬜ Add production domain to Vercel

**Steps:**
1. Vercel → Project → Settings → Domains
2. Add `azzororesources.com` (apex)
3. Add `www.azzororesources.com`
4. Vercel shows DNS records — note them

---

### 8.2 ⬜ Update DNS records at registrar

**Add/replace:**
- `azzororesources.com` (apex) → **A** record to Vercel's IP (Vercel displays it, commonly `76.76.21.21`)
- `www.azzororesources.com` → **CNAME** to `cname.vercel-dns.com`

If your registrar doesn't support apex A records, use Vercel's ALIAS/ANAME workaround per their docs.

**If using Cloudflare in front of the registrar:** set the proxy to **DNS only** (gray cloud) for the apex during the first 5 minutes. Vercel needs to verify ownership and provision its own SSL. After SSL is issued you can flip back to proxied if you want CF features.

---

### 8.3 ⬜ Wait for SSL (~5-15 min)

**Verify:** Visit `https://azzororesources.com` — green padlock, the site loads. If you see "Not secure" wait 5 more minutes, then check Vercel for errors.

---

### 8.4 ⬜ Update `NEXT_PUBLIC_SITE_URL` in Vercel

**Steps:**
1. Vercel → Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_SITE_URL`
3. Change Production value from `https://staging.azzororesources.com` to `https://azzororesources.com`
4. Trigger a redeploy

**Why:** sitemap, OG images, canonical URLs all use this var. Don't want staging URLs leaking into production.

---

### 8.5 ⬜ Disable production password protection

**Steps:**
1. Vercel → Settings → Deployment Protection
2. **Production:** turn OFF the password (leave staging ON)
3. Save

**Verify:** Open `https://azzororesources.com` in an incognito window — site loads without password.

---

### 8.6 ⬜ Coordinate old domain redirect

Per Phase 3.10 decision:
- **If client points old domain at Vercel:** our redirect rules in `next.config.mjs` catch the common paths and 301 them
- **If old hosting handles redirects:** confirm with client that they've configured `301 → https://azzororesources.com` at the old host's edge

**Test:** visit `https://asianbatterymetals.com/about/` — expect to land on `https://azzororesources.com/en/about/`.

---

### 8.7 ⬜ Post-launch smoke test from a fresh browser

Open incognito, walk every page, every locale, every CTA. Test `/admin` sign-in with at least one client editor account.

---

## PHASE 9 — Post-launch (within 48h)

---

### 9.1 ⬜ Submit sitemap to Google

**Steps:**
1. https://search.google.com/search-console
2. Add Property → `azzororesources.com` → DNS verification → add TXT record at registrar
3. Once verified: Sitemaps → submit `https://azzororesources.com/sitemap.xml`
4. URL Inspection → enter homepage URL → Request Indexing

---

### 9.2 ⬜ Submit sitemap to Bing

**Steps:**
1. https://www.bing.com/webmasters
2. Add Site (you can import directly from Google Search Console — faster)
3. Submit sitemap URL

---

### 9.3 ⬜ Update client's social profiles

Hand these to the client to do:
- LinkedIn company page → update URL + bio
- Twitter/X bio if used
- Any other directories the company is listed in (Bloomberg, FT, ASX/LSE company info pages)

---

### 9.4 ⬜ Set up uptime monitoring (optional but recommended)

Free options:
- https://uptimerobot.com/ — 5-min interval, 50 monitors free
- https://www.pingdom.com/ — 14-day free trial

Add `https://azzororesources.com` as a check. Get email/SMS alert if it goes down.

---

### 9.5 ⬜ Monitor for 48 hours

Daily checks:
- Vercel deploy logs (`vercel logs --follow` or dashboard)
- Vercel Analytics dashboard for any 404 spikes
- Google Search Console crawl errors (will be empty for first few days)

---

### 9.6 ⬜ Address client first-week edit confusions

When the client asks "how do I X?", do it once on a screen-share, then update `docs/editor-guide.md` and regenerate the PDF.

---

## Quick reference: what to hand to me when

| When you finish | Tell me | I'll do |
|---|---|---|
| Phase 1.1 GitHub App registered | App ID, Client ID, Client Secret | Update config.yml backend block |
| Phase 1.2 MapTiler key | the key string | Confirm env var name + verify map renders post-deploy |
| Phase 1.3 Cloudflare account | Account ID | Already wired in env var documentation |
| Phase 3.7 Investor portal feed format | sample XML/JSON response | Confirm parser handles it, adjust if needed |
| Phase 7.1 a11y violations | the scanner output | Fix the top issues |
| Phase 7.2 Lighthouse findings | screenshots of failed audits | Tune images/bundles/etc. |
| Phase 7.3 Cross-browser issues | screenshots or descriptions | Apply CSS fixes |
| Anytime an edit-and-deploy doesn't behave as expected | the URL + what you expected vs saw | Diagnose |

---

## Things I deliberately can't help with

These are 100% your manual work no matter what:

- Account creation on any third-party service (requires email + password from a real human)
- Anything requiring a credit card (Cloudflare Stream subscription, paid Vercel plan if needed)
- DNS edits at the registrar (requires registrar account access)
- Talking to the client about content / asset deliverables
- Native Mongolian translation review (requires a native speaker)
- Visual subjective decisions ("does this look right?" — that's you)
- Real photos / videos / PDFs (only client has these)
- Onboarding call with client (you need to drive it)

Everything else: hand it to me when you're ready.
