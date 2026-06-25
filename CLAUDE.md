# Festival Art & Books — Project Context (read this first)

This file is the full briefing for rebuilding **festivalartandbooks.com**, a specialist
rare-Tolkien-books dealership site. If you are starting a build session, read this top to
bottom before touching code.

---

## 1. The client & the business

- **Owner:** Mark Faith. Trading as *Festival Art and Books* since 2009; dealing rare Tolkien
  books since ~2001. One of the oldest and largest **Tolkien rare-book dealerships in the world.**
- **What he sells:** rare and collectible **J.R.R. Tolkien** books — first editions of *The
  Hobbit* (1937) and *The Lord of the Rings* (1954–55), other Tolkien firsts, plus original
  **Tolkien-inspired art** and memorabilia.
- **Voice:** authoritative, first-person, scholarly, opinionated, personal. 25+ years of
  hands-on expertise. He is NOT a general bookseller and says so. Keep this authentic voice —
  do not sand it into generic marketing copy.
- **Sales are OFF-SITE.** There is **no on-site checkout.** Transactions happen on his
  **eBay** and **AbeBooks** shops. The website's job is **authority, discovery, and trust** —
  drive serious collectors to those marketplaces and to direct contact.
- **Contact:** `MarkFaith@festivalartandbooks.com`
- **Marketplaces:**
  - eBay: https://www.ebay.co.uk/str/festivalartandbooks
  - AbeBooks: https://www.abebooks.co.uk/festival-art-and-books-aberdyfi/51881760/sf

## 2. The goal of this project

Rebuild the dated (2010s-era WordPress) site into a **modern, high-end, fast** site that:
1. **Keeps all existing content** (every page, essay, image — already extracted, see §4).
2. **Looks modern and premium** but still feels like *Mark's* site — antiquarian, warm,
   scholarly. Not a templated startup look.
3. **Showcases his books** properly (book/collectable showcase pages, linking out to sales).
4. Is **engineered for SEO and GEO** (Generative Engine Optimization — getting cited by
   ChatGPT, Google AI Overviews, Perplexity, Claude). This is a primary objective, not an
   afterthought. Full strategy in `research/seo-geo-research.md`.

## 3. Stack decision — Astro (locked)

**Astro**, static output, TypeScript, Tailwind v4. Chosen over Next.js / React SPA / WordPress
because the site is content-heavy with **no cart/accounts/real-time needs** (checkout is
off-site), and Astro ships ~zero JS by default → best-in-class Core Web Vitals, clean
server-rendered HTML that Google and every AI crawler parse without executing JS, trivial
schema.org + llms.txt, and Markdown content collections that map 1:1 to the extracted content.
It can still look fully high-end (Tailwind + optional islands for any interactivity). See
`research/seo-geo-research.md` §2 for the full comparison and reasoning.

- Content: **Astro content collections** (`site/src/content/`), Markdown/MDX.
- Styling: **Tailwind v4** via `@tailwindcss/vite`; design tokens in `site/src/styles/global.css`.
- Deploy target: a static host (Cloudflare Pages or Netlify — auto HTTPS, fast CDN).

## 4. Repo layout & what's already done

```
mark-web/
├── CLAUDE.md                      ← this file
├── content-extract/              ← ✅ SOURCE OF TRUTH for content (all current-site content)
│   ├── README.md                  ← index of all 20 pages + nav map + notes
│   ├── manifest.json              ← machine-readable page list
│   ├── extract.json               ← raw ordered-block extraction (for re-processing)
│   ├── pages/<slug>.md            ← one file per page: frontmatter + content IN ORDER,
│   │                                images inline in their correct section w/ caption+alt+source
│   └── images/<slug>/             ← downloaded full-res images, foldered per page (49 imgs)
├── research/
│   └── seo-geo-research.md        ← ✅ full SEO + GEO strategy (572 lines, cited)
└── site/                          ← ✅ Astro scaffold (deps installed, builds & runs)
    ├── astro.config.mjs            ← site URL, sitemap, mdx, tailwind. UPDATE `site` before launch.
    ├── src/
    │   ├── content.config.ts       ← collections: guides, journal, pages, books (with SEO fields)
    │   ├── lib/site.ts             ← brand facts, nav, external links (single source of truth)
    │   ├── lib/schema.ts           ← schema.org builders (Organization, Person, WebSite, Article, Breadcrumbs)
    │   ├── components/Seo.astro     ← per-page <head> (title, meta, canonical, OG, Twitter)
    │   ├── components/SchemaOrg.astro ← renders JSON-LD blocks
    │   ├── layouts/BaseLayout.astro ← head wiring + sitewide schema + placeholder header/footer
    │   ├── pages/index.astro        ← placeholder homepage (replace)
    │   └── styles/global.css        ← design tokens + Tailwind (READ THIS for the visual direction)
    └── public/
        ├── robots.txt              ← permissive, AI crawlers explicitly allowed
        └── llms.txt                ← AI ingestion index (populate as guides ship)
```

**Status: SCAFFOLD ONLY.** No real pages/components are built yet — that is the next session's
job. The homepage is a placeholder. Header/footer in `BaseLayout.astro` are stubs.

### How to use the extracted content
- Each `content-extract/pages/<slug>.md` is the faithful content of one current page, with
  **images inline in their original section** and a metadata line under each image
  (`role` / `caption` / `alt` / `source` URL). This is so you can place each image back in the
  right place on the new page.
- When building a new page, pull copy from the matching extract file, move the relevant images
  from `content-extract/images/<slug>/` into `site/src/` (e.g. `site/src/assets/...` for
  Astro image optimization, or `site/public/images/...`), and **rename them descriptively**
  for image SEO (e.g. `tolkien-hobbit-1937-first-edition-front-cover.jpg`, not the WP name).
- `content-extract/README.md` has the full page index and known gaps.

## 5. Design direction

Antiquarian + quietly modern. Tokens live in `site/src/styles/global.css` — read them. Summary:
- **Colours:** deep royal/midnight blue (hero backdrop), gold/bronze (the dragon emblem),
  parchment/cream paper, deep oxblood red CTA. (All pulled from the existing brand.)
- **Type:** refined display serif (Cormorant Garamond) + readable text serif (EB Garamond) +
  clean sans only for small UI labels. Wire fonts via Fontsource or a `<link>` in BaseLayout.
- **Feel:** generous whitespace, large type, restrained motion, scholarly confidence. High-end
  rare-book dealer, not a SaaS landing page. Reuse the existing dragon/montage imagery.
- Mark wants it to still feel like **his** site — keep the identity, modernize the execution.
- For deeper aesthetic guidance, the `frontend-design` skill is available.

## 6. SEO + GEO requirements (non-negotiable — full detail in research/)

The highest-leverage items (do these as you build, not after):
1. **JSON-LD schema on every page** — use `src/lib/schema.ts`. Sitewide Organization + Person
   (Mark) + WebSite are already wired in `BaseLayout`. Add per-page `Article`, `Book`,
   `Product`+`Offer`, `BreadcrumbList`, `FAQPage` where relevant.
2. **Person/E-E-A-T for Mark** — strong About page, `sameAs` to eBay/AbeBooks/IOBA/press.
   His 25-year expertise is a massive ranking advantage; make it *legible* to algorithms.
3. **Topical authority content clusters** — pillar guides (Hobbit first editions, LOTR first
   editions, other firsts, Tolkien art, collecting fundamentals) with interlinked support
   pages. This is the #1 SEO move for this niche (research §6). Map to the `guides` collection.
4. **GEO content structure** — direct factual answer in the first ~100 words of each guide;
   H2/H3 headings phrased as real questions; include concrete stats and quotable facts
   (boosts AI citation); cite authoritative sources.
5. **Freshness** — visible "Last updated" dates (`dateModified`), refresh price data yearly,
   put the year in major guide titles.
6. **AI crawlers allowed** (`robots.txt` done) + **llms.txt** (done; keep populated).
7. **Image SEO** — descriptive filenames + precise alt text (edition, condition, features).
8. **Long-tail bibliographic keywords** — "first edition Hobbit 1937 Allen & Unwin
   identification points", not "Tolkien books".
9. **Sitemap** — `@astrojs/sitemap` is installed and auto-generates on build.
10. Note: Google **deprecated FAQPage rich results (May 2026)** — still include FAQ schema for
    AI extraction, but don't treat it as a SERP win.

## 7. Suggested build roadmap (next session)

Rough order; the user directs priorities.
1. **Foundations:** wire fonts; build real **Header** (nav + Resources dropdown from
   `site/src/lib/site.ts`) and **Footer** (contact, marketplace links, legal).
2. **Homepage:** hero using the montage imagery, intro (from `pages/home.md`), featured
   books, links to guides + marketplaces.
3. **Core pages** from extracts: About/Mark Faith (E-E-A-T centerpiece), Rare Tolkien Books &
   Collectables, Used Books Q&A, Contact, Festival in the Shire, TV Appearances, News/Media,
   E-book, Journal index.
4. **Guides (content clusters):** start with the Hobbit and LOTR first-edition pillar guides
   (this is where SEO/GEO pays off most). Use the `guides` collection.
5. **Book/collectable showcase:** `books` collection → Product/Offer/Book schema, link out to
   eBay/AbeBooks listings.
6. **Polish:** OG images, favicon/logo, 404, privacy page, performance pass, schema validation
   (Google Rich Results Test), Lighthouse.

## 8. Conventions & guardrails

- **Backward compatibility is not a concern** — this is a clean rebuild. No WordPress shims.
- Keep brand facts/links in `src/lib/site.ts`; keep schema in `src/lib/schema.ts`. Don't
  scatter hardcoded URLs/metadata across pages.
- Use Astro's `<Image>` / image optimization for content photos (move them out of
  `content-extract/` into `src/assets/`). Descriptive filenames + alt text always.
- `content-extract/` and `research/` are **reference** — don't ship them; the site is `site/`.
- **Exclude** `content-extract/pages/a-seo-copy-check-page.md` — it's a test/draft page.
- One image is missing on the source site (`Rodney-Matthews-pics.jpg`, 404) — needs a
  replacement from Mark. Logo is currently baked into the homepage montage — request/ recreate
  a clean standalone logo.

## 9. Open items to confirm with Mark

- Clean **logo** file (standalone, transparent).
- **Physical location / address** (city/country at least — trust + local signals).
- Replacement for the missing Rodney Matthews image.
- **IOBA / association memberships** and any **press mentions** ("as seen in") for E-E-A-T
  `sameAs` and the About page.
- Confirm production **domain** stays `festivalartandbooks.com` (update `astro.config.mjs`
  `site` and `llms.txt`/`robots.txt` URLs if not).
- Whether he wants the standalone pages (`ballantine`, `nazareth`, `tolkien-inspired-art/
  artists`) kept, merged into guides, or dropped.

## 10. Commands

```bash
cd site
npm run dev      # local dev server
npm run build    # static build → site/dist
npm run preview  # preview the build
npm run check    # astro type/diagnostics check
```
