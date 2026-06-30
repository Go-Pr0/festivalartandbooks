# Decap CMS — Quick Setup for Festival Art & Books

Decap lets you add, edit and remove catalogue entries from a browser UI at `/admin`.

---

## One-time setup

1. **Push the repo to GitHub** (if not already done).

2. **Repo** — already set in `site/public/admin/config.yml`:
   ```yaml
   repo: Go-Pr0/festivalartandbooks
   ```

3. **Enable GitHub OAuth via Netlify** (free):
   - In the Netlify dashboard go to *Site configuration → Identity* and enable Identity.
   - Under *Identity → Settings → External providers* add GitHub.
   - Then uncomment the two lines in `config.yml`:
     ```yaml
     base_url: https://YOUR-NETLIFY-SITE.netlify.app
     auth_endpoint: api/auth
     ```

4. Deploy the site. Then visit `https://festivalartandbooks.com/admin` and log in with your GitHub account.

---

## Local testing (no GitHub login needed)

```bash
cd site
npm run dev
```

Open `http://localhost:4321/admin` — the local backend handles saves as real files.

---

## Day-to-day use

| Task | What to do |
|---|---|
| Add a new item | Open `/admin` → Books & Collectables → **New Book / Collectable** |
| Mark an item as sold | Edit the entry → set **Availability** to *Sold / Out of Stock* |
| Hide an item temporarily | Edit the entry → tick **Draft** |
| Upload photos | Use the **Images** field — saves to `src/assets/inventory/` |
| Remove an item | Delete the entry (the Markdown file is removed from the repo) |

---

> Images should have descriptive filenames before upload, e.g.
> `tolkien-hobbit-1937-first-edition-front-cover.jpg`.
