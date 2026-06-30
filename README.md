# Festival Art & Books

Source for [festivalartandbooks.com](https://festivalartandbooks.com) — the website of **Mark Faith** and *Festival Art and Books*, a specialist dealership in rare and collectible J.R.R. Tolkien books, Tolkien-inspired art, and related memorabilia.

The site is a static Astro app: authority, discovery, and trust for serious collectors. Sales happen off-site via [eBay](https://www.ebay.co.uk/str/festivalartandbooks) and [AbeBooks](https://www.abebooks.co.uk/festival-art-and-books-aberdyfi/51881760/sf).

## Repository structure

| Path | Purpose |
|------|---------|
| `site/` | Deployable Astro application (TypeScript, Tailwind v4) |
| `content-extract/` | Legacy WordPress content extraction — reference only, not shipped |
| `research/` | SEO and GEO strategy notes |
| `CLAUDE.md` | Full project briefing for AI-assisted development sessions |

## Quick start

```bash
cd site
npm ci
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). The CMS admin panel is at `/admin`.

## Build & deploy

Hosted on **Netlify** ([`netlify.toml`](netlify.toml)): build runs from `site/`, publishes `dist/`, and targets **festivalartandbooks.com**.

```bash
cd site
npm ci
npm run cms:config   # regenerate Decap CMS config
npm run build
```

## Content editing

Editors use **Decap CMS** at `/admin` on the live site. Setup, local testing, and day-to-day workflows are documented in [`site/DECAP.md`](site/DECAP.md).

After changing CMS collection schemas in code, run `npm run cms:config` before deploying.

## Commands

Run from `site/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production static build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run check` | Astro type and diagnostics check |
| `npm run cms:config` | Regenerate `public/admin/config.yml` from `cms/` |
| `npm run cms:server` | Local Decap save handler (for CMS testing) |
