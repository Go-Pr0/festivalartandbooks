# Festival Art and Books — Extracted Site Content

This directory is a faithful, structured snapshot of the **current live site** at
[festivalartandbooks.com](https://festivalartandbooks.com), captured for rebuilding the site.
It is the **source of truth for content** for the new build — every page's text, headings,
images, captions, alt text, and links were extracted in document order, so images stay
attached to the section they belong to.

Captured: June 2026 (live WordPress site, rendered with a headless browser so JS/lazy-loaded
images were included).

## How this is organized

```
content-extract/
├── README.md            ← this file (index of all pages)
├── manifest.json        ← machine-readable page list (slug, title, nav, image/block counts)
├── extract.json         ← raw structured extraction (ordered blocks per page) — for re-processing
├── pages/               ← one Markdown file per page, content in original order
│   └── <slug>.md
└── images/              ← downloaded images, one folder per page
    └── <slug>/
```

### Reading a page file

Each `pages/<slug>.md` has YAML frontmatter (title, slug, source_url, nav_location,
meta_description) then the content. Images appear **inline, in their correct section**, each
followed by an italic note line with metadata:

```
![alt text](../images/<slug>/<file>.jpg)
*[image — role: featured | caption: ... | alt: ... | source: <original URL>]*
```

- `role: featured` = the page's WordPress header/hero image.
- `caption:` = the visible caption shown under the image on the live site.
- `source:` = the original URL on the live site (keep for reference/attribution).

A "Links found on this page" section at the bottom lists every hyperlink (internal, external,
and `mailto:`) so nothing is lost.

## Page index

| Page (→ extracted file) | Where it lives in the current nav | Images | Content blocks |
|---|---|---:|---:|
| [FESTIVAL ART AND BOOKS](pages/home.md) | Main: Home | 1 | 18 |
| [USED TOLKIEN BOOKS, Q&A](pages/used-tolkien-books-qa.md) | Main: Used Tolkien Books, Q&A | 1 | 36 |
| [RARE TOLKIEN BOOKS & COLLECTABLES](pages/rare-tolkien-books-collectables.md) | Main: Rare Tolkien Books & Collectables | 4 | 56 |
| [CONTACT AND ABOUT US](pages/contact-and-about-us.md) | Main: Contact and About Us | 3 | 18 |
| [TOLKIEN COLLECTOR E-BOOK](pages/tolkien-collector-e-book.md) | Resources ▸ Tolkien Collector E-book | 1 | 6 |
| [THE JOURNAL](pages/the-journal.md) | Resources ▸ The Journal | 1 | 3 |
| [FESTIVAL IN THE SHIRE](pages/festival-in-the-shire.md) | Resources ▸ Festival in the Shire | 2 | 6 |
| [EVENTS](pages/events.md) | Resources ▸ Events | 0 | 4 |
| [MARK D. FAITH – FOUNDER](pages/mark-faith-founder.md) | Resources ▸ Mark Faith – Festival Art & Books | 4 | 22 |
| [TV APPEARANCES](pages/tv-appearances.md) | Resources ▸ TV Appearances | 2 | 14 |
| [NEWS/MEDIA](pages/news-media.md) | Resources ▸ News/Media | 2 | 27 |
| [RESOURCES](pages/resources.md) | Resources landing (dropdown parent) | 1 | 1 |
| [ONLINE SHOP](pages/online-shop.md) | Online Shop (links out to eBay/AbeBooks) | 1 | 2 |
| [BALLANTINE](pages/ballantine.md) | Standalone (not in main nav) | 3 | 17 |
| [NAZARETH](pages/nazareth.md) | Standalone (not in main nav) | 1 | 3 |
| [TOLKIEN INSPIRED ART](pages/tolkien-inspired-art.md) | Standalone (not in main nav) | 1 | 4 |
| [TOLKIEN INSPIRED ARTISTS](pages/tolkien-inspired-artists.md) | Standalone (not in main nav) | 16 | 39 |
| [EBAY LISTINGS MASTER](pages/ebay-listings-master.md) | Internal/utility | 4 | 4 |
| [The Hobbit or The Lord of the Rings?](pages/post-the-hobbit-or-the-lord-of-the-rings.md) | Blog post | 1 | 2 |
| [A SEO COPY CHECK PAGE](pages/a-seo-copy-check-page.md) | ⚠️ Test/draft — exclude from new site | 1 | 10 |

**Totals:** 20 pages captured · 49 images downloaded (~10 MB).

## Current site structure (navigation)

- **Home**
- **Used Tolkien Books, Q&A**
- **Rare Tolkien Books & Collectables**
- **Resources** (dropdown)
  - Tolkien Collector E-book · The Journal · Festival in the Shire · Events ·
    Mark Faith – Festival Art & Books · TV Appearances · News/Media
- **Contact and About Us**
- **Online Shop** (dropdown → external)
  - [AbeBooks shop](https://www.abebooks.co.uk/festival-art-and-books-aberdyfi/51881760/sf) ·
    [eBay shop](https://www.ebay.co.uk/str/festivalartandbooks)

Standalone pages not in the main nav but present in the sitemap (linked internally):
`ballantine`, `nazareth`, `tolkien-inspired-art`, `tolkien-inspired-artists`,
`ebay-listings-master`.

## Notes & known gaps

- **Sales are off-site.** There is no on-site checkout; the "Online Shop" links out to the
  owner's eBay and AbeBooks stores. The new site is a content/authority/showcase site that
  drives traffic to those marketplaces (and to direct contact).
- **`a-seo-copy-check-page`** is a draft/test page — capture kept for completeness but it
  should NOT be published on the new site.
- **One missing image:** on `tolkien-inspired-artists.md`, `Rodney-Matthews-pics.jpg` returns
  HTTP 404 on the live site (broken there too). It's flagged inline; needs a replacement from
  Mark.
- **Logo:** the dragon "Festival Art and Books / Tolkien Rare Books" emblem is baked into the
  homepage montage hero (`images/home/`). A clean standalone logo file should be requested
  from Mark (or recreated) for the new build.
- **Contact email:** `MarkFaith@festivalartandbooks.com`.
