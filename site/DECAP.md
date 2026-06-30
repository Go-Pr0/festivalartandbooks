# Decap CMS — Editing Guide for Festival Art & Books

Decap CMS is the browser-based editor for the site. Open **`/admin`** to add and update catalogue items, journal essays, collecting guides, page copy, and the various lists (events, press, FAQs, artists, gallery images) — without touching code.

**Live site:** `https://festivalartandbooks.com/admin`  
**Local testing:** `http://localhost:4321/admin` (see below)

---

## One-time setup (Netlify + GitHub login)

These steps are done once when the site is first deployed.

1. **Push the repo to GitHub** (already connected: `Go-Pr0/festivalartandbooks`).

2. **Enable Netlify Identity** (free):
   - In the Netlify dashboard go to *Site configuration → Identity* and enable Identity.
   - Under *Identity → Settings → External providers* add **GitHub**.
   - Invite yourself (and anyone else who should edit) under *Identity → Invite users*.

3. **Connect the CMS to Netlify OAuth** — in `site/public/admin/config.yml`, uncomment and set:
   ```yaml
   base_url: https://YOUR-NETLIFY-SITE.netlify.app
   auth_endpoint: api/auth
   ```
   Replace `YOUR-NETLIFY-SITE` with your actual Netlify subdomain. Commit and deploy.

4. Visit **`https://festivalartandbooks.com/admin`** and log in with the GitHub account Netlify linked to your invite.

> **Note for developers:** The admin config is generated from `site/cms/`. After changing collection schemas, run `npm run cms:config` (see below) before deploying.

---

## Local testing (no GitHub login)

Useful for trying edits before they go live.

**Terminal 1 — the site:**
```bash
cd site
npm run dev
```

**Terminal 2 — the local save handler:**
```bash
cd site
npm run cms:server
```

Open **`http://localhost:4321/admin`**. Saves write directly to files on your machine — nothing is pushed to GitHub until you commit.

---

## Regenerating the admin config

The file **`site/public/admin/config.yml`** is **auto-generated**. Do not edit it by hand — changes will be overwritten.

When collection fields or page sections are added or changed in the codebase, regenerate the config:

```bash
cd site
npm run cms:config
```

The generator validates field definitions before writing — if `config.yml` would be invalid for Decap, the command fails with a clear error instead of breaking `/admin` at runtime.

Commit the updated `config.yml` along with any schema changes so the live `/admin` panel stays in sync.

---

## What you see in `/admin`

The sidebar has five sections:

| Section | What it controls |
|---|---|
| **Books & Collectables** | For-sale catalogue entries (individual books and collectables) |
| **Journal** | Long-form essays and blog posts |
| **Collecting Guides** | Pillar and supporting collecting guides |
| **Lists & Galleries** | Shared lists used across pages — events, press, FAQs, artists, gallery |
| **Site Pages** | Headlines, intro copy, SEO text, and images for each main page |

### Lists & Galleries (detail)

| Entry | What it is |
|---|---|
| **Events** | Dated list of past/upcoming events (date, location, detail) shown on the Events page |
| **Press & Media** | Outlet, headline, and URL for each press mention |
| **Used Books FAQs** | Question-and-answer pairs on the Used Tolkien Books page |
| **Tolkien Artists** | Artist name, portrait, alt text, and bio paragraphs on the Tolkien Art page |
| **Rare Books Gallery** | Showcase images (with captions) on the Rare Books & Collectables landing page |

### Site Pages (detail)

| Entry | Page on the live site |
|---|---|
| **Homepage** | Home — hero, welcome text, stats, trust points, “what I deal in” cards |
| **About Mark Faith** | About — biography, timeline, portrait figures |
| **Contact** | Contact — hero and “where to buy” copy |
| **E-book** | Free e-book offer page |
| **Events** | Events page — headings and intro copy (the event *list* is under Lists & Galleries) |
| **Festival in the Shire** | Festival in the Shire page |
| **News & Media** | News & Media page copy (press *links* are under Lists & Galleries) |
| **Rare Tolkien Books & Collectables** | Rare books landing page copy and hero |
| **Tolkien Art** | Tolkien Art page copy (artist *profiles* are under Lists & Galleries) |
| **TV Appearances** | TV Appearances page |
| **Used Tolkien Books** | Used books page hero and intro (FAQ *answers* are under Lists & Galleries) |

Each site page is split into labelled blocks — **SEO**, optional **Hero image**, **Stats / Timeline / Figures** (where the page uses them), and **Page copy** (individual headings and paragraphs). Expand a block to edit its fields.

### Admin UI

The `/admin` panel uses a **polished, branded interface** — a Festival Art & Books header at the top and **organised page sections** (SEO, hero, stats, page copy, etc.) grouped into collapsible blocks so you are not scrolling through one long form.

Custom admin styling lives in **`site/public/admin/admin.css`** (loaded by `index.html`). If the panel looks unstyled after a deploy, check that this file is present.

The **live preview pane** (when editing markdown) loads **`site/public/admin/preview.css`**, which approximates the live site typography — serif body text, cream background, readable line length — so what you see while editing is closer to the published page.

> **Developers:** After changing collection schemas or CMS field definitions in `site/cms/`, you must still run **`npm run cms:config`** and commit the regenerated **`config.yml`** — the admin UI styling does not replace config regeneration.

---

## Day-to-day tasks

| I want to… | Go to… |
|---|---|
| Add a book or collectable to the catalogue | **Books & Collectables** → **New Book / Collectable** |
| Mark something as sold | **Books & Collectables** → edit entry → **Availability** → *Sold / Out of Stock* |
| Hide something temporarily | Any entry → tick **Draft (hide from site)** |
| Remove a catalogue item | **Books & Collectables** → open entry → **Delete** |
| Write a new journal essay | **Journal** → **New Journal entry** |
| Publish or update a collecting guide | **Collecting Guides** → open or create a **Guide** |
| Add a past event (date, place, detail) | **Lists & Galleries** → **Events** |
| Add a press mention | **Lists & Galleries** → **Press & Media** |
| Edit a used-books FAQ | **Lists & Galleries** → **Used Books FAQs** |
| Add or update an artist profile | **Lists & Galleries** → **Tolkien Artists** |
| Change showcase images on the rare books page | **Lists & Galleries** → **Rare Books Gallery** |
| Edit homepage welcome text or stats | **Site Pages** → **Homepage** |
| Update your biography or timeline | **Site Pages** → **About Mark Faith** |
| Change contact or “where to buy” copy | **Site Pages** → **Contact** |
| Update the e-book offer page | **Site Pages** → **E-book** |
| Change Events page headings or intro | **Site Pages** → **Events** |
| Update Festival in the Shire copy | **Site Pages** → **Festival in the Shire** |
| Edit News & Media page text | **Site Pages** → **News & Media** |
| Change rare books landing page copy | **Site Pages** → **Rare Tolkien Books & Collectables** |
| Edit Tolkien Art page intro | **Site Pages** → **Tolkien Art** |
| Update TV Appearances copy | **Site Pages** → **TV Appearances** |
| Change Used Books page hero or intro | **Site Pages** → **Used Tolkien Books** |
| Fix a page title or Google description | **Site Pages** → relevant page → **SEO** block |

---

## What happens when you click Publish

On the **live site**, every save in `/admin` commits a change to GitHub. Netlify watches the repo and **automatically rebuilds and redeploys** the site. Allow a few minutes before checking the public site — you can watch build progress in the Netlify dashboard.

There is no separate “publish” step beyond saving in the CMS.

---

## Uploading images

Use descriptive filenames **before** upload — they help search engines and make files easy to find later.

**Good:** `tolkien-hobbit-1937-first-edition-front-cover.jpg`  
**Poor:** `IMG_4829.jpg`

Images are stored in different folders depending on what you are editing:

| You are editing… | Images go to… |
|---|---|
| Books & Collectables | `inventory/` |
| Journal entries | `journal/` |
| Collecting guides | `guides/` |
| Homepage | `home/` |
| About, Festival in the Shire, News & Media, TV Appearances | `story/` |
| Contact, E-book, Rare Books page, Used Books page, Artists, Gallery | `showcase/` |

Always fill in **alt text** when the form asks for it — a short, precise description of what the image shows (edition, condition, artist name, etc.).

---

## Quick tips

- **Draft** hides an entry from the public site while you work on it.
- **Date modified** on journal entries and guides signals freshness to search engines — update it when you revise content.
- **Listing URL** on catalogue items should be the full eBay or AbeBooks URL where buyers can purchase.
- List order in **Lists & Galleries** is the order items appear on the site — drag to reorder where the editor allows.
- If a section looks wrong in `/admin`, the config may need regenerating — ask your developer to run `npm run cms:config` and deploy.
