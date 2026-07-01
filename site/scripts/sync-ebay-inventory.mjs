#!/usr/bin/env node
/**
 * Sync Festival Art & Books catalogue from the live eBay UK store.
 *
 * Fetches store listing cards (title, price, image, listing ID) and writes
 * Astro content files under src/content/books/. Images are downloaded to
 * src/assets/inventory/ebay-{listingId}.jpg at highest available resolution.
 *
 * Usage:
 *   npm run sync:ebay
 *   npm run sync:ebay -- --dry-run
 *   npm run sync:ebay -- --prune   # remove local entries no longer on eBay
 *
 * No API keys required — reads the public store HTML (same data shoppers see).
 * Re-run after inventory changes to refresh prices and availability.
 */
import {
  mkdir,
  writeFile,
  readdir,
  unlink,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const BOOKS_DIR = path.join(SITE_ROOT, 'src/content/books');
const IMAGES_DIR = path.join(SITE_ROOT, 'src/assets/inventory');
const COOKIE_JAR = path.join(SITE_ROOT, '.ebay-sync-cookies.txt');

const STORE_URL = 'https://www.ebay.co.uk/str/festivalartandbooks';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const PRUNE = args.has('--prune');

/** @typedef {{ listingId: string, title: string, price: number, currency: string, imageUrl: string | null }} Listing */

/**
 * @param {string} html
 * @returns {Map<string, Listing>}
 */
function parseStoreHtml(html) {
  /** @type {Map<string, Listing>} */
  const items = new Map();
  const blocks = html.split(/"listingId":"(\d+)"/);

  for (let i = 1; i < blocks.length; i += 2) {
    const listingId = blocks[i];
    const chunk = blocks[i + 1].slice(0, 12_000);

    const titleMatch = chunk.match(/"title":"((?:\\.|[^"\\])*)"/);
    const priceMatch = chunk.match(
      /"displayPrice":\{"_type":"TextualDisplayValue","value":\{"value":([0-9.]+),"currency":"([A-Z]+)"\}/,
    );
    const imageMatch = chunk.match(/(https:\/\/i\.ebayimg\.com\/images\/g\/[^"\\]+)/);

    if (!titleMatch || !priceMatch) continue;

    const title = titleMatch[1].replace(/\\u0026/g, '&').replace(/\\"/g, '"').trim();
    if (!title || /^shop by category$/i.test(title)) continue;

    items.set(listingId, {
      listingId,
      title,
      price: Number(priceMatch[1]),
      currency: priceMatch[2],
      imageUrl: imageMatch?.[1] ?? null,
    });
  }

  return items;
}

/** @param {string | null} url */
function hiResImageUrl(url) {
  if (!url) return null;
  return url.replace(/\/s-l\d+\.(jpg|jpeg|png|webp)/i, '/s-l1600.$1').replace(/\.webp$/i, '.jpg');
}

/** @param {string} title */
function inferAuthor(title) {
  if (/\bDarwin\b/i.test(title)) return 'Charles Darwin';
  if (/\bBarbara Remington\b/i.test(title)) return 'Barbara Remington';
  return 'J.R.R. Tolkien';
}

/** @param {string} title */
function inferKind(title) {
  if (
    /\b(coin|poster|painting|artwork|art\b|memorab|collectable|collectible|print\b|map poster|illustration)/i.test(
      title,
    )
  ) {
    return 'collectable';
  }
  return 'book';
}

/** @param {string} text */
function yamlQuote(text) {
  return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/** @param {Listing} listing */
function markdownForListing(listing) {
  const slug = `ebay-${listing.listingId}`;
  const author = inferAuthor(listing.title);
  const kind = inferKind(listing.title);
  const imagePath = `../../assets/inventory/ebay-${listing.listingId}.jpg`;

  const lines = [
    '---',
    `title: ${yamlQuote(listing.title)}`,
    `description: ${yamlQuote(listing.title)}`,
  ];
  lines.push(`author: ${yamlQuote(author)}`);
  if (listing.imageUrl) lines.push('images:');
  if (listing.imageUrl) lines.push(`  - ${imagePath}`);
  lines.push(`price: ${listing.price}`);
  lines.push(`priceCurrency: ${yamlQuote(listing.currency)}`);
  lines.push('availability: InStock');
  lines.push(`offerUrl: ${yamlQuote(`https://www.ebay.co.uk/itm/${listing.listingId}`)}`);
  lines.push(`kind: ${kind}`);
  lines.push('draft: false');
  lines.push('---');
  lines.push('');
  lines.push(
    'Photographs, condition notes, and the full listing description are on the eBay listing linked above.',
  );
  lines.push('');

  return { slug, content: lines.join('\n') };
}

async function fetchText(url, cookie = true) {
  const headers = ['-sL', '-A', USER_AGENT];
  if (cookie) headers.push('-b', COOKIE_JAR, '-c', COOKIE_JAR);
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);
  const { stdout } = await execFileAsync('curl', [...headers, url], {
    maxBuffer: 20 * 1024 * 1024,
  });
  return stdout;
}

async function downloadImage(url, dest) {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);
  await execFileAsync('curl', ['-sL', '-A', USER_AGENT, '-o', dest, url]);
}

/** @returns {Promise<Map<string, Listing>>} */
async function fetchAllListings() {
  // Warm session cookies on the store home page.
  await fetchText(STORE_URL);

  /** @type {Map<string, Listing>} */
  const all = new Map();

  for (let page = 1; page <= 10; page += 1) {
    const url = page === 1 ? STORE_URL : `${STORE_URL}?_pgn=${page}`;
    const html = await fetchText(url);
    const pageItems = parseStoreHtml(html);
    if (pageItems.size === 0) break;

    const before = all.size;
    for (const [id, item] of pageItems) all.set(id, item);

    // Stop when a page adds no new listings (pagination exhausted or repeating).
    if (all.size === before) break;
  }

  return all;
}

async function main() {
  console.log('Fetching eBay store listings…');
  const listings = await fetchAllListings();
  console.log(`Found ${listings.size} active listings.`);

  if (DRY_RUN) {
    for (const item of listings.values()) {
      console.log(`  ${item.listingId}  £${item.price}  ${item.title.slice(0, 70)}`);
    }
    return;
  }

  await mkdir(BOOKS_DIR, { recursive: true });
  await mkdir(IMAGES_DIR, { recursive: true });

  // Remove legacy hand-seeded sample entries (pre-sync placeholders).
  const legacySamples = [
    'barbara-remington-lotr-original-art.md',
    'darwin-volcanic-islands-first-edition.md',
    'hobbit-deluxe-edition-1976.md',
    'tree-and-leaf-first-edition.md',
  ];
  for (const file of legacySamples) {
    const full = path.join(BOOKS_DIR, file);
    if (existsSync(full)) {
      await unlink(full);
      console.log(`Removed legacy sample: ${file}`);
    }
    const stem = file.replace(/\.md$/, '');
    for (const ext of ['.jpg', '.jpeg', '.png']) {
      const img = path.join(IMAGES_DIR, `${stem}${ext}`);
      if (existsSync(img)) await unlink(img);
    }
  }

  const syncedSlugs = new Set();

  for (const listing of listings.values()) {
    const { slug, content } = markdownForListing(listing);
    syncedSlugs.add(slug);

    const mdPath = path.join(BOOKS_DIR, `${slug}.md`);
    await writeFile(mdPath, content, 'utf8');

    if (listing.imageUrl) {
      const hiRes = hiResImageUrl(listing.imageUrl);
      const imgPath = path.join(IMAGES_DIR, `ebay-${listing.listingId}.jpg`);
      try {
        await downloadImage(hiRes, imgPath);
      } catch (err) {
        console.warn(`  Image download failed for ${listing.listingId}: ${err.message}`);
      }
    }
  }

  if (PRUNE) {
    const existing = (await readdir(BOOKS_DIR)).filter((f) => f.endsWith('.md'));
    for (const file of existing) {
      const slug = file.replace(/\.md$/, '');
      if (slug.startsWith('ebay-') && !syncedSlugs.has(slug)) {
        await unlink(path.join(BOOKS_DIR, file));
        const id = slug.replace('ebay-', '');
        const img = path.join(IMAGES_DIR, `ebay-${id}.jpg`);
        if (existsSync(img)) await unlink(img);
        console.log(`Pruned sold/removed listing: ${slug}`);
      }
    }
  }

  console.log(`Wrote ${syncedSlugs.size} catalogue entries to src/content/books/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
