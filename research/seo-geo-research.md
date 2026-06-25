# SEO & GEO Research: festivalartandbooks.com
*Compiled June 2026 — Build Specification for Mark Faith / Tolkien Rare Books Dealer Site*

---

## 1. Executive Summary — 10 Highest-Leverage Moves for This Site

These are ordered by expected impact-per-effort for a one-man, content-heavy, niche specialist dealer:

1. **Go deep on topical content clusters, not breadth.** Mark's 25+ years of expertise is his biggest asset. Build a comprehensive, interlinked Tolkien collecting knowledge hub (editions guides, identification guides, condition grading, provenance, market history). Google's March 2026 Core Update crystallised topical authority as the primary quality signal. Smaller niche sites that cover a subject exhaustively now outrank big brands.

2. **Deploy JSON-LD structured data on every page.** Use `Book`, `Product`, `Offer`, `Person`, `Organization`, `Article`, and `BreadcrumbList` schemas. This is the cheapest, highest-leverage technical investment available in 2026 — it amplifies rich snippets, AI Overview citations, and Knowledge Graph presence simultaneously.

3. **Build a proper Author/About page with Person schema.** Connect Mark's name as a `Person` entity with `sameAs` links to eBay shop, AbeBooks shop, any media mentions, and IOBA/antiquarian bookseller associations. This is the single most important E-E-A-T signal for a one-person specialist.

4. **Use Astro as the framework.** Ships zero JavaScript by default, hits Core Web Vitals thresholds easily, produces clean crawlable HTML that all search engines and AI bots can parse. Full detail in Section 2.

5. **Structure content for AI extractability.** Front-load answers in the first 100 words of each guide/essay. Add H2/H3 headings framed as questions. Include specific facts with named sources, dates, and prices. Adding statistics increases AI visibility by 22%; adding direct quotations raises it by 37%.

6. **Add `llms.txt` and `llms-full.txt`.** Low cost, no downside, growing upside as AI agents mature. Provide a clean Markdown index of all valuable content. Detail in Section 7.

7. **Allow all AI crawlers in robots.txt.** GPTBot, ClaudeBot, PerplexityBot, Google-Extended — all should be explicitly permitted. Being crawled is necessary (not sufficient) for AI citation. Never block them for a content-first authority site.

8. **Implement freshness signals.** Add visible "Last updated" dates on all guides, refresh key statistics annually (Tolkien first edition market prices move), and include the current year in major article titles. 50% of AI-cited content is under 13 weeks old; freshness is a strong AI citation signal.

9. **Earn third-party citations.** Reach out to Tolkien societies (Tolkien Society UK, Mythopoeic Society), IOBA, rare book press/blogs (Rare Book Hub, Collecting Tolkien communities). Community-driven platforms and external citations account for 52.5% of AI Overview citations. A single authoritative mention in a major Tolkien resource is worth dozens of internal pages.

10. **Optimize for long-tail, high-intent collector queries.** "First edition Hobbit 1937 Allen & Unwin identification points" is worth 100x more than "Tolkien books." Use exact bibliographic terminology: issue points, binding variants, dust jacket states, printer's colophon, publisher imprints.

---

## 2. Recommended Tech Stack: Astro vs Next.js vs React SPA vs WordPress

### Verdict: **Astro**

**One-line reason:** Astro ships zero JavaScript by default, produces clean static HTML that Google and AI bots crawl perfectly, scores Core Web Vitals out of the box, and supports the full Tailwind + modern UI component ecosystem — it can look just as high-end as a Next.js or React site with dramatically better performance.

### Detailed Comparison

| Criterion | Astro | Next.js | React SPA | WordPress |
|---|---|---|---|---|
| **Rendering model** | SSG by default; SSR/hybrid opt-in | SSR/SSG/ISR via App Router | Client-side only | PHP server-rendered |
| **JS payload (typical content site)** | ~9 KB | ~463 KB | 500 KB–1 MB+ | Varies (often heavy with plugins) |
| **Core Web Vitals** | Excellent; 60% of Astro sites pass vs 38% for WP | Good with tuning | Poor without heavy optimization | Mediocre; plugin bloat is chronic |
| **AI bot crawlability** | HTML is fully rendered at build; zero JS needed | Good (SSR/SSG); RSC complicates parsing | Bad; bots see mostly empty HTML | Good (server-rendered) |
| **Schema.org / JSON-LD** | Direct `<script type="application/ld+json">` in any component or layout | Same; slightly more complex in App Router | Same | Requires plugins; brittle |
| **llms.txt** | Static file in `public/` — trivial | Same | Requires separate deployment config | Plugin or manual file upload |
| **Modern/high-end design?** | Yes — full Tailwind CSS, shadcn/ui, Framer Motion, any React component via Islands | Yes | Yes | Limited without heavy theme work |
| **Content management** | MDX/Markdown files + optional headless CMS (Sanity, Contentful) | Same | Same | Built-in but plugin-dependent |
| **Maintenance overhead** | Low; no server to manage; deploy to Netlify/Vercel/Cloudflare Pages | Medium; Node server or Vercel functions | Medium | High; updates, security, plugins |
| **SEO control** | Complete; meta, canonical, sitemaps all handled in code | Complete | Requires SSR for full SEO | Good but plugin-dependent |

### Why Not the Others

**Next.js:** Excellent framework, but its default JS payload (~463 KB on comparable sites vs Astro's ~9 KB) requires active optimization effort to match what Astro gives you by default. Best when you need real-time data, user accounts, shopping cart — none of which apply here (sales go off-site to eBay/AbeBooks). The added complexity is not justified.

**React SPA:** SEO-hostile by default. Bots that don't execute JavaScript — including some AI crawlers — see an empty page. Not viable for a content/SEO-first site. There is no scenario where this is the right choice here.

**WordPress:** Server-side rendered (good for crawlability), but notorious Core Web Vitals problems from plugin bloat, theme CSS overhead, and PHP rendering. Security maintenance is a persistent overhead for a one-man operation. The "just use WordPress" convenience is real, but it fights you on performance every step of the way in 2026.

### Can Astro Look High-End?

Yes, decisively. Astro supports the full modern frontend design stack:
- **Tailwind CSS** for utility-first design
- **shadcn/ui** or any Radix UI components for polished interactive elements
- **Framer Motion** (via Islands) for animations
- Any React, Vue, or Svelte components via Astro's Islands Architecture
- Premium Astro themes exist in 2026 that rival the best Next.js marketing sites

The constraint is not the framework — it's the design investment. Astro does not limit visual ambition.

### Deployment Recommendation

Astro on **Cloudflare Pages** (free tier covers the traffic profile of a specialist dealer site). Fast global CDN, zero cold starts, automatic HTTPS, simple CI/CD from GitHub. Alternatively Netlify or Vercel — all work identically for static Astro deploys.

---

## 3. SEO Fundamentals 2026

### Technical SEO

**Core Web Vitals Thresholds (required passing, not optional):**
- LCP (Largest Contentful Paint): ≤ 2.5 seconds
- INP (Interaction to Next Paint): ≤ 200 milliseconds (replaces FID; 43% of sites fail this in 2026)
- CLS (Cumulative Layout Shift): ≤ 0.1

Only 47–48% of sites pass all three on mobile. Failure costs 8–35% of organic traffic. Astro's zero-JS default makes passing these straightforward for a content site.

**Critical technical items:**
- `sitemap.xml` — auto-generate with `@astrojs/sitemap`. Submit to Google Search Console and Bing Webmaster Tools.
- `robots.txt` — explicitly allow all crawlers (see Section 7). Never accidentally block with a wildcard `Disallow: /`.
- Canonical URLs on every page — prevent duplicate content from www/non-www or URL parameter variations.
- HTTPS — mandatory; Cloudflare Pages provides this free.
- Preload hero image (LCP element) with `<link rel="preload">`.
- Use `font-display: swap` on all web fonts to prevent render blocking.
- Inline critical CSS above the fold; defer the rest.
- Image optimization: serve WebP/AVIF, use `width` and `height` attributes to prevent CLS, lazy-load below-fold images.
- 301 redirects for any URLs changing from the old site — losing link equity on old URLs is permanent.

**Crawl budget (less critical but worth knowing):** For a site with hundreds of pages (not thousands), crawl budget is not a concern. Focus on eliminating duplicate URLs.

### On-Page SEO

- **Title tags:** 50–60 characters. Primary keyword near the front. Each page unique. Example: `First Edition Hobbit 1937 Identification Guide | Festival Art & Books`
- **Meta descriptions:** 120–155 characters. Write to compel click-through, not just keyword-stuff. These don't rank but they affect CTR.
- **H1:** One per page. Matches the user's search intent, not just a keyword dump.
- **H2/H3 hierarchy:** Structure guides and essays around real questions collectors ask. This serves both human readers and AI extraction.
- **Keyword placement:** Title, H1, first 100 words, at least one H2, image alt text. Don't repeat obsessively — write naturally for experts.
- **Internal linking:** Link every guide and essay to related pages. Build a web, not a collection of isolated pages. This is the mechanical implementation of topical authority.
- **Page length:** There is no magic word count. Write until the topic is exhausted. For a first-edition identification guide, that may be 3,000+ words. For a blog announcement, 400 words is fine.
- **Image alt text:** Describe precisely: "J.R.R. Tolkien The Hobbit first edition 1937 George Allen & Unwin original olive-green binding" — not "old book".

### Content Strategy

- **Content clusters:** One pillar page per major topic (The Hobbit collecting guide, LOTR first editions guide, Tolkien art guide, etc.) with multiple supporting pages linking in. The March 2026 Google Core Update specifically rewarded this structure.
- **People-first content:** Write for experienced collectors, not SEO bots. Demonstrate you have actually handled these books. Include specific issue points, price ranges, condition assessments, provenance stories.
- **Refresh cadence:** Update market price estimates and condition notes annually. Add "Last Updated: [Month Year]" visible on each guide.
- **Blog/Journal:** Publish on a realistic cadence — monthly is better than weekly-then-silent. Each post should demonstrate genuine expertise, not SEO padding.

### Mobile Optimization

Mobile-first indexing means Google indexes the mobile version of your site. Astro with Tailwind CSS is responsive by default. Test with Google's Mobile-Friendly Test and PageSpeed Insights.

---

## 4. GEO — Generative Engine Optimization

### What It Is

GEO is the practice of structuring content so AI answer engines — ChatGPT Search, Perplexity, Google AI Overviews, Gemini, Claude — cite or surface it in generated answers. By mid-2026:
- ChatGPT: 800M+ weekly active users
- Perplexity: ~780M monthly queries
- Google AI Overviews: appear in ~60% of SERPs
- AI search handles an estimated 12–18% of English-language informational queries

Google's official position (2026): "Optimizing for AI features is still SEO." GEO is an additive layer, not a replacement discipline.

### How AI Engines Select & Cite Sources

Research across 23 citation studies (as of May 2026) identifies the following patterns:

- **55% of AI Overview citations come from the top 30% of a page.** The opening is disproportionately important.
- **Community-driven platforms captured 52.5% of citations** across ChatGPT, Perplexity, and Google AI Overviews combined. First-party websites accounted for 44%.
- **Statistics increase AI visibility by 22%.** Specific numbers ("Allen & Unwin printed 1,500 copies of the first edition in 1937") are highly extractable.
- **Direct quotations raise AI citation rate by 37%.** If Mark has said something quotable and authoritative, surface it prominently.
- **LLMs are 28–40% more likely to cite content with clear formatting** — headings, bullet lists, tables, short paragraphs.
- **50% of AI-cited content is under 13 weeks old.** Freshness matters more on Perplexity than on Google, but it signals relevance across all platforms.
- **Visible year signals** ("2026") in titles and headings improve citation rates by ~30%.

### Concrete GEO Tactics for This Site

**Content structure:**
- Write a direct, factual answer to the implied question in the first 100 words of every guide.
- Use H2s and H3s as literal questions: "How do I identify a first-edition Hobbit?", "What makes a first-edition LOTR dust jacket valuable?"
- Each section should be independently extractable — a reader (or AI) jumping into any H2 should get a complete mini-answer.

**Citability:**
- Include specific facts with verifiable precision: exact print run numbers, publication dates, publisher, known price records at auction.
- Attribute quotes and data: "According to the Tolkien Collector's Guide..." or "The 1937 first edition by Allen & Unwin featured..."
- Write a "Key Facts" or "Quick Reference" box at the top of major guides — this is the format AI engines extract most reliably.

**Q&A format:**
- Add a genuine FAQ section at the bottom of major guides. Even though FAQPage schema no longer triggers rich results in Google (deprecated May 7, 2026), the Q&A text content itself is exactly what AI engines extract for answers. The schema is still worth including for AI parsing of the page structure.

**Freshness signals:**
- Visible "Last Updated" date on all guides.
- Refresh market price data and notable recent sales annually.
- Include the year in evergreen guide titles: "Identifying a First-Edition Hobbit (2026 Guide)."

**Structural clarity for AI bots:**
- Clean HTML with semantic elements (`<article>`, `<section>`, `<aside>`, `<nav>`).
- One clear topic per URL — no multi-topic pages.
- Short sentences and paragraphs in factual sections (AI engines parse these more reliably than dense academic prose).

**Entity mentions:**
- Name-drop credible entities: Tolkien Society, Bodleian Library, Christie's/Sotheby's auction records, IOBA (Independent Online Booksellers Association), Rare Book Hub.
- These entity associations help AI models classify the site as part of the authoritative rare-books discourse network.

---

## 5. Structured Data / Schema.org Plan

All schema should be implemented as **JSON-LD in `<script type="application/ld+json">` tags** — Google's recommended format, easiest to maintain in Astro component layouts.

**Note on FAQPage:** As of May 7, 2026, FAQPage schema no longer triggers rich results in Google Search. Still implement it on pages with genuine FAQ sections — it does no harm and AI engines use the semantic structure. Do not prioritize it.

### Schema Types for This Site

#### `Organization`
**On:** Homepage (sitewide via layout)
**Why:** Establishes festivalartandbooks.com as a named, structured entity in Google's Knowledge Graph. Enables sitewide entity recognition.
**Key fields:** `name`, `url`, `logo`, `contactPoint`, `sameAs` (eBay shop URL, AbeBooks shop URL, any social profiles), `foundingDate`, `description`

#### `Person` (Mark Faith)
**On:** About page; also nested inside `Organization.founder` and all `Article.author` fields
**Why:** The single most important E-E-A-T signal. Connects Mark's name to his 25+ year expertise, his external shop profiles, and any media mentions. Google uses Person entities to validate authorship.
**Key fields:** `name`, `jobTitle` ("Antiquarian Bookseller"), `knowsAbout` (["J.R.R. Tolkien", "Rare Books", "First Editions", "Book Collecting"]), `sameAs` (eBay, AbeBooks, IOBA listing, any press mentions), `url` (About page)

#### `Book`
**On:** Each book listing/product page and within collecting guides referencing specific editions
**Why:** Enables Google's Book rich results and allows AI engines to extract precise bibliographic data. The most specific schema type for the core inventory.
**Key fields:** `name`, `author` (Tolkien), `isbn` (if applicable to edition), `publisher`, `datePublished`, `bookFormat`, `description`, `image`, `numberOfPages`, `inLanguage`

#### `Product` + `Offer`
**On:** Individual items for sale (even if purchase happens off-site via eBay/AbeBooks)
**Why:** `Product` with `Offer` enables Google Shopping rich results and price display in SERPs. Required fields: `name`, `image`, `description`. For `Offer`: `price`, `priceCurrency`, `availability` (`InStock` / `OutOfStock`), `url` (to eBay/AbeBooks listing).
**Note:** Even though transactions complete off-site, the `Product` + `Offer` schema on the festivalartandbooks.com detail page is valid and beneficial. Link the `Offer.url` to the external marketplace listing.

#### `Article` / `BlogPosting`
**On:** All journal/blog posts and long-form essays
**Why:** Signals that content is editorial, authored, and dated — key for AI citation eligibility and Google News/Discover visibility. The `author` field MUST link to the Person entity.
**Key fields:** `headline`, `author` (Person), `datePublished`, `dateModified`, `image`, `publisher` (Organization), `mainEntityOfPage`

#### `BreadcrumbList`
**On:** Every page except homepage
**Why:** Produces breadcrumb display in SERPs (increases CTR), signals site hierarchy to crawlers, and helps AI engines understand content structure.
**Key fields:** `itemListElement` array with `@type: ListItem`, `position`, `name`, `item` (URL)

#### `FAQPage`
**On:** Pages with genuine FAQ sections (collecting guides, About page)
**Why:** No longer generates SERP rich results (deprecated May 2026), but AI engines use the structured Q&A pairs for extraction. Worth including wherever genuine FAQ content exists.

#### `WebSite` with `SearchAction`
**On:** Homepage (sitewide via layout)
**Why:** Enables the Google Sitelinks Search Box in brand SERPs. Minimal effort, useful for a content-heavy site.

#### Optional: `ItemList`
**On:** Category/collection pages listing multiple books
**Why:** Helps AI engines understand that a page is a curated list, not a single item page. Improves extraction of inventory pages.

### Implementation in Astro
Create a `SchemaOrg.astro` component accepting typed props and rendering the JSON-LD script tag. Pass different schema types from each page's frontmatter. Keep schema co-located with page data, not in a separate configuration file.

---

## 6. E-E-A-T & Topical Authority

### What E-E-A-T Means in Practice (2026)

E-E-A-T = Experience, Expertise, Authoritativeness, Trustworthiness. It is not a single score — it is a bundle of trust signals that Google's quality raters and algorithms assess holistically. The March 2026 Core Update strengthened topical authority as the primary delivery mechanism for E-E-A-T.

For a site like festivalartandbooks.com, E-E-A-T is a massive structural advantage: 25+ years of hands-on experience dealing rare Tolkien books is exactly what Google (and AI engines) reward in 2026. The opportunity is to make this expertise *legible* to algorithms.

### Signals Mark Should Make Explicit

**Experience (the new "E" added to EAT in late 2022):**
- First-person descriptions of handling specific books: "I examined this copy in 2019 and noted the usual darkening of the spine..."
- Provenance stories: where significant copies came from, their history.
- Personal essays on the collecting journey, market changes over 25 years.
- Photos of actual inventory with Mark's own descriptions.

**Expertise:**
- Detailed bibliographic knowledge: exact identification points for each Tolkien first edition (this is gold — most sites are shallow here).
- The free e-book is a major asset. Make it prominent, update it, and ensure it links extensively to site content.
- Bylined essays on specific topics: dust jacket grading for LOTR first editions, pricing trends, how to spot facsimiles.
- Speaking to or being quoted by the Tolkien community.

**Authoritativeness:**
- Third-party citations: Tolkien Society, IOBA member listing, antiquarian book press (Rare Book Hub, Fine Books Magazine, ABA mentions).
- Outbound links to authoritative sources (Tolkien Society, auction house records) — linking to authorities signals you are part of their discourse network.
- "As seen in" or media mention references on the About page.

**Trustworthiness:**
- Clear contact information.
- Physical address or location reference (even city/country).
- Return/condition guarantee policy stated clearly.
- Accurate condition descriptions with honest assessments.
- SSL/HTTPS (automatic with Cloudflare Pages).
- Privacy policy page.
- Links to established marketplace profiles (eBay, AbeBooks) as verification of legitimacy.

### Topical Authority Strategy

Build content clusters around every major Tolkien collecting topic. The goal is to be the definitive online resource for Tolkien rare book collecting — so thorough that both Google and AI engines recognize festivalartandbooks.com as the authoritative source for this specific niche.

**Suggested cluster structure:**

*Pillar: The Hobbit First Editions*
- Identification guide (issue points, binding, DJ states)
- Price history and market guide
- How to spot reprints and later impressions
- Notable copies and provenance
- Condition grading for DJ

*Pillar: The Lord of the Rings First Editions*
- Allen & Unwin 3-volume set identification
- US Houghton Mifflin first edition guide
- DJ variants and price guide
- Common faults and what they mean for value

*Pillar: Other Tolkien First Editions*
- Farmer Giles of Ham, Smith of Wootton Major, etc.
- Letters of J.R.R. Tolkien
- Academic/Beowulf editions

*Pillar: Tolkien Art & Illustration*
- Collectors' guide to Tolkien-related art
- Artist profiles (Alan Lee, John Howe, Ted Nasmith)

*Pillar: Rare Book Collecting Fundamentals* (Tolkien-specific)
- Condition grading explained
- How to store and care for first editions
- Working with dealers vs. auctions
- Authentication and forgery awareness

Each pillar should be a long-form comprehensive guide (2,000–5,000 words). Support pages link into the pillar. The pillar links back to support pages. Internal linking is the mechanical infrastructure of topical authority.

---

## 7. llms.txt & AI Crawler Strategy

### Allow or Block AI Crawlers? — Allow All

For a content-first authority site whose goal is citations and visibility, blocking AI crawlers is self-defeating. Being crawled is a necessary (not sufficient) precondition for AI citation. The only reason to block would be concern about training data usage — a legitimate concern for some businesses, but not for a dealer whose goal is visibility and authority establishment.

**Explicit allow in `robots.txt`:**
```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: *
Allow: /

Sitemap: https://festivalartandbooks.com/sitemap.xml
```

Do not add a blanket `Disallow: /` for any bot unless there is a specific reason. The default for a new build should be permissive.

### llms.txt — Implement It

**Current state of the spec (June 2026):**
- llms.txt was proposed by Jeremy Howard (Answer.AI) in September 2024.
- It is a community convention, not a W3C/IETF standard. No major AI provider has officially committed to reading it automatically.
- Server-log analysis shows AI crawlers rarely fetch it proactively — GPTBot occasionally fetches but rarely; ClaudeBot and PerplexityBot effectively don't.
- **However:** When you manually provide the llms.txt URL to ChatGPT, Claude, or Perplexity, the models do incorporate it. This matters for users asking AI assistants about where to buy Tolkien first editions.
- Cost to implement: ~30 minutes. Risk: zero. Upside: growing as AI agent workflows mature.

**Implement it.**

### llms.txt Format

Place at `https://festivalartandbooks.com/llms.txt` (static file in Astro's `public/` directory):

```markdown
# Festival Art & Books

> Festival Art & Books is a specialist antiquarian bookshop run by Mark Faith, one of the world's 
> leading dealers in rare and collectible J.R.R. Tolkien books, including first editions of 
> The Hobbit (1937) and The Lord of the Rings (1954–55), plus original Tolkien-inspired art. 
> In business for 25+ years. IOBA member.

## Collecting Guides

- [Identifying a First-Edition Hobbit](https://festivalartandbooks.com/guides/hobbit-first-edition): Complete guide to issue points, binding variants, and dust jacket states for the 1937 George Allen & Unwin first edition.
- [Lord of the Rings First Editions Guide](https://festivalartandbooks.com/guides/lotr-first-editions): Identification and valuation guide for the Allen & Unwin 3-volume first edition set (1954–55).
- [Tolkien First Editions Price Guide](https://festivalartandbooks.com/guides/price-guide): Market values and auction records for major Tolkien first editions.

## About the Dealer

- [About Mark Faith](https://festivalartandbooks.com/about): Background, credentials, 25+ years in the rare Tolkien book trade.

## Current Inventory

- [eBay Shop](https://www.ebay.com/[mark-shop-url]): Current listings for rare Tolkien books and art.
- [AbeBooks Shop](https://www.abebooks.com/[mark-shop-url]): Current listings on AbeBooks.

## Free Resources

- [Free E-Book: Collecting Tolkien First Editions](https://festivalartandbooks.com/ebook): Downloadable guide for new and experienced Tolkien collectors.

## Optional

- [Journal / Blog](https://festivalartandbooks.com/journal): Irregular essays on Tolkien collecting, market commentary, and notable finds.
```

### llms-full.txt (Optional but Recommended)

Create a second file at `/llms-full.txt` containing the full Markdown text of all key guides and the About page, concatenated. This is the "deep ingestion" file for AI agents that want full content, not just a link index. Auto-generate it at build time from the same MDX source files used to build the site.

---

## 8. Niche & Collectibles-Specific Tactics

### Keyword Strategy for Rare Books

Generic keywords ("Tolkien books", "buy Tolkien") are dominated by Amazon, eBay, and large retailers. The opportunity is **long-tail, high-intent, bibliographic precision:**

- "first edition Hobbit 1937 Allen & Unwin for sale"
- "Hobbit first edition issue points identification"
- "Lord of the Rings first edition dust jacket price"
- "signed Tolkien book value"
- "J.R.R. Tolkien first edition grading condition"
- "rare Tolkien book dealer specialist"

These queries have lower volume but higher purchase intent. A serious collector searching for a specific edition variant is far more valuable than a casual browser.

### Image SEO

Book condition is shown, not just described. Invest in:
- High-resolution photos of actual copies (cover, spine, title page, colophon, any damage)
- Consistent image naming: `tolkien-hobbit-1937-first-edition-front-cover.jpg` (not `IMG_4821.jpg`)
- Precise alt text describing edition, condition, and notable features
- Consider an image gallery for notable pieces — Google Image Search is a legitimate discovery channel for collectors

### Marketplace Integration SEO

The eBay and AbeBooks shops are the transaction layer. The website is the authority/discovery layer. Ensure:
- Every external listing links back to festivalartandbooks.com in the seller description.
- The website's product pages link out to the specific marketplace listings.
- Consistent naming conventions between the website and marketplace listings (helps Google entity resolution).

### ViaLibri

Register with ViaLibri's Harvest service — it indexes antiquarian dealer websites and serves serious collectors who search daily. This is a direct audience-match discovery channel specific to rare books.

### IOBA Membership & Directory

If not already an IOBA member, the listing is a valuable backlink from a recognized authority in the antiquarian books field. This is one of the highest-quality E-E-A-T signals available specifically for rare booksellers.

### Tolkien Society & Community

- Ensure festivalartandbooks.com is listed in any Tolkien Society dealer/resource directories.
- Participate in the Tolkien Collector's Guide (tolkiencollectorsguide.com) community — citations from this community-driven platform are exactly the type AI engines favor.
- Engage with Tolkien collector forums (The One Ring, Tolkien subreddit communities) — these generate community citations.

### Condition & Provenance Content

Collectors buy confidence as much as books. Content that directly addresses:
- How Mark grades condition (with his own scale and reasoning)
- How provenance is documented and verified
- Refund/return policy for condition misrepresentation

This content both builds trust and creates keyword-rich pages that answer specific collector concerns.

### Pricing Transparency

Publishing approximate price ranges (even if actual prices are on eBay/AbeBooks) helps:
- Attract searchers comparing values
- Position the site as a pricing authority (supporting AI citations for value queries)
- Drive traffic from "what is my Tolkien first edition worth" type queries

---

## 9. Concrete Checklist for the New Build

Prioritized: **[P1]** = Must-have before launch. **[P2]** = Complete within 30 days post-launch. **[P3]** = Ongoing / quarterly.

### P1 — Pre-Launch (Foundation)

**Tech & Infrastructure**
- [ ] Astro + Tailwind CSS project configured and deploying to Cloudflare Pages (or Netlify/Vercel)
- [ ] Custom domain with HTTPS (automatic on Cloudflare Pages)
- [ ] `sitemap.xml` auto-generated via `@astrojs/sitemap`
- [ ] `robots.txt` with explicit `Allow: /` for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, `*`
- [ ] Sitemap submitted to Google Search Console and Bing Webmaster Tools
- [ ] Google Search Console verified
- [ ] 301 redirects for all URLs from old site (if any existing pages have backlinks)
- [ ] All images optimized: WebP format, `width`/`height` attributes, descriptive filenames
- [ ] `font-display: swap` on all web fonts
- [ ] Hero/LCP image preloaded with `<link rel="preload">`

**Schema / Structured Data**
- [ ] `Organization` schema on homepage layout (sitewide)
- [ ] `Person` schema for Mark Faith on About page; `sameAs` to eBay, AbeBooks, IOBA
- [ ] `Article` / `BlogPosting` schema on all essays and journal posts
- [ ] `BreadcrumbList` schema on all non-homepage pages
- [ ] `Book` schema on all book detail/listing pages
- [ ] `Product` + `Offer` schema on all items for sale (with `url` to marketplace listing)
- [ ] `WebSite` + `SearchAction` schema on homepage
- [ ] Validate all schema at schema.org/validator and Google Rich Results Test

**Content (Minimum Viable)**
- [ ] About page: Mark's biography, 25+ years experience, IOBA membership, contact info, photo
- [ ] At least one complete pillar guide (Hobbit first edition identification recommended)
- [ ] Free e-book prominently featured with download landing page
- [ ] Clear navigation to eBay and AbeBooks shops
- [ ] Privacy policy and contact page

**GEO Basics**
- [ ] `llms.txt` in `public/` directory
- [ ] Every guide opens with a direct, factual answer in the first 100 words
- [ ] H2/H3 headings framed as questions where applicable

### P2 — Within 30 Days Post-Launch

**Content**
- [ ] LOTR first edition pillar guide complete
- [ ] At least 3 additional supporting pages per pillar linking back to pillar
- [ ] FAQ section on at least 2 major guides (with `FAQPage` schema)
- [ ] Visible "Last Updated" date on all guides
- [ ] Pricing reference section on each major edition guide

**Schema**
- [ ] `FAQPage` schema on pages with FAQ sections
- [ ] `ItemList` schema on category/inventory pages
- [ ] Review all `sameAs` links for completeness

**GEO / Citation Building**
- [ ] `llms-full.txt` generated at build time from MDX source
- [ ] Submit site URL to ViaLibri Harvest
- [ ] Contact Tolkien Society about resource/dealer listing
- [ ] Ensure IOBA listing links to site

**Technical**
- [ ] PageSpeed Insights all core pages: all three CWV must be green on mobile
- [ ] Mobile usability test in Google Search Console — zero errors
- [ ] Check all structured data in Search Console — zero errors

### P3 — Ongoing (Quarterly)

- [ ] Publish at least one new guide or essay
- [ ] Refresh market price data in existing guides; update "Last Updated" dates
- [ ] Review Google Search Console for new query opportunities (what are visitors searching for?)
- [ ] Check AI citation: manually ask ChatGPT, Perplexity, and Claude "where can I buy a Tolkien first edition?" and note whether the site appears
- [ ] Add any new notable sales or acquisitions as blog posts (freshness signal)
- [ ] Monitor Core Web Vitals report in Search Console for regressions

---

## 10. Sources

- [The Most Important SEO Ranking Factors in 2026 — WestCounty](https://www.westcounty.com/seo/top-seo-ranking-factors)
- [Google SEO Ranking Factors 2026: The Ultimate Guide — ClickRank](https://www.clickrank.ai/seo-ranking-factors/)
- [13 On Page SEO Factors You Must Focus on in 2026 — Wellows](https://wellows.com/blog/on-page-seo-factors/)
- [Generative Engine Optimization (GEO): The 2026 Guide to AI Search Visibility — LLMrefs](https://llmrefs.com/generative-engine-optimization)
- [GEO in 2026: How to Get Your Content Cited by ChatGPT and AI Overviews — TechTimes](https://www.techtimes.com/articles/318359/20260614/generative-engine-optimization-geo-2026-how-get-your-content-cited-chatgpt-ai-overviews.htm)
- [Generative Engine Optimization: Getting Cited in ChatGPT, Claude, and Perplexity in 2026 — AI Magicx](https://www.aimagicx.com/blog/generative-engine-optimization-chatgpt-perplexity-2026)
- [Generative Engine Optimization (GEO): The Complete 2026 Guide — Enrich Labs](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026)
- [How to Get Cited in Google AI Overviews: 2026 Tactics That Work — Contently](https://contently.com/2026/02/25/how-to-get-cited-google-ai-overviews/)
- [Google AI Overviews Ranking Factors: 2026 Guide — Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [I Analyzed 23 Studies on AI Citations — Medium/Max Vincet](https://medium.com/@maxvincet391/i-analyzed-23-studies-on-ai-citations-780c0717cac0)
- [How ChatGPT, Google AI Overviews, and Perplexity Source Information in 2026 — Leapd](https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026)
- [llms.txt Standard: Complete Implementation Guide for 2026 — WhatsMyGeoScore](https://whatsmygeoscore.com/llms-txt-standard-implementation-guide-ai-crawlers-2026/)
- [llms.txt Explained: The New Standard for AI Crawlers (2026) — API Serpent](https://apiserpent.com/blog/llms-txt-guide)
- [The State of llms.txt in 2026 — AEO Press](https://www.aeo.press/ai/the-state-of-llms-txt-in-2026)
- [AI Crawler Access Control: The 2026 Decision Matrix — Digital Applied](https://www.digitalapplied.com/blog/ai-crawler-access-control-2026-robots-llms-txt-decision-matrix)
- [llms.txt: The Complete Guide for AI Search Visibility 2026 — Kulbhushan Pareek](https://kulbhushanpareek.com/blog/llms-txt-guide-ai-search-visibility)
- [llms.txt Explained (May 2026): The Honest Guide — Codersera](https://codersera.com/blog/llms-txt-complete-guide-2026/)
- [Structured Data for SEO: A Guide to Schema Markup in 2026 — GW Content](https://www.gwcontent.com/blogs/news/structured-data-for-seo)
- [Stop Using FAQ Schema: The New Rules of Structured Data in 2026 — GreenSERP](https://greenserp.com/high-impact-schema-seo-guide/)
- [Ecommerce Structured Data & Schema 2026 — ProductLasso](https://productlasso.com/en/blog/structured-data-ecommerce-schema-2026)
- [Structured Data After I/O 2026: Schema Cheat Sheet — Digital Applied](https://www.digitalapplied.com/blog/structured-data-after-io-2026-schema-updates)
- [Topical Authority: How to Dominate Your Niche (2026) — SEO Score Tools](https://seoscore.tools/blog/topical-authority/)
- [E-E-A-T and Topical Authority: How to Build Trust in 2026 — Media Plus Digital](https://mediaplusdigital.com.my/eeat-and-topical-authority/)
- [How to Build Topical Authority in 2026 — Topical Map AI](https://topicalmap.ai/blog/auto/how-to-build-topical-authority-2026-guide)
- [Core Web Vitals 2026: INP, LCP & CLS Optimization — Digital Applied](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)
- [How important are Core Web Vitals for SEO in 2026? — White Label Coders](https://whitelabelcoders.com/blog/how-important-are-core-web-vitals-for-seo-in-2026/)
- [Astro vs Next.js: 9KB vs 463KB JS — Astro Wins [2026] — Tech Insider](https://tech-insider.org/astro-vs-nextjs-2026/)
- [Astro in 2026: Why It's Beating Next.js for Content Sites — DEV Community](https://dev.to/polliog/astro-in-2026-why-its-beating-nextjs-for-content-sites-and-what-cloudflares-acquisition-means-6kl)
- [Next.js vs Astro in 2026: Which Framework Should You Build With? — CosmicJS](https://www.cosmicjs.com/blog/nextjs-vs-astro-choosing-the-right-framework-for-your-project)
- [What Is Astro Web Framework? Why I Use Astro for SEO Websites in 2026 — Outrun Studio](https://www.outrunstudio.com/blog/what-is-astro-web-framework-2026)
- [Google AI Overviews Statistics 2026 — SEOProfy](https://seoprofy.com/blog/google-ai-overviews/)
- [GoCollect Blog: Niche Markets in 2026](https://gocollect.com/blog/what-niche-markets-will-go-mainstream-in-2026)
- [ViaLibri — The World's Largest Search Engine for Old & Rare Books](https://www.vialibri.net/)
- [Rare Book Hub](https://www.rarebookhub.com/)
- [Understanding Core Web Vitals — Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google's 200 Ranking Factors: The Complete List (2026) — Backlinko](https://backlinko.com/google-ranking-factors)
