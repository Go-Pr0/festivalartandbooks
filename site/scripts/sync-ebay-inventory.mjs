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
 *   npm run sync:ebay -- --ids=236918240730,236916210470
 *
 * Full seller descriptions are pulled from itm.ebaydesc.com (public iframe source).
 * Store HTML supplies title, price, and gallery thumbnails when eBay allows access.
 *
 * No API keys required. Re-run after inventory changes to refresh prices and copy.
 */
import {
 mkdir,
 writeFile,
 readdir,
 unlink,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
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

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const DRY_RUN = args.has('--dry-run');
const PRUNE = args.has('--prune');
const IDS_ARG = rawArgs.find((a) => a.startsWith('--ids='));
/** @type {string[] | null} */
const ONLY_IDS = IDS_ARG ? IDS_ARG.replace('--ids=', '').split(',').map((s) => s.trim()).filter(Boolean) : null;

/** @typedef {{ listingId: string, title: string, price: number, currency: string, imageUrl: string | null, imageUrls?: string[], body?: string, summary?: string }} Listing */

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
 return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
}

/** @param {string} html */
function decodeHtmlEntities(html) {
 return html
 .replace(/&nbsp;/g, ' ')
 .replace(/&amp;/g, '&')
 .replace(/&lt;/g, '<')
 .replace(/&gt;/g, '>')
 .replace(/&quot;/g, '"')
 .replace(/&#39;/g, "'");
}

/** @param {string} html */
function stripInlineHtml(html) {
 return decodeHtmlEntities(
 html
 .replace(/<br\s*\/?>/gi, '\n')
 .replace(/<\/p>/gi, '\n\n')
 .replace(/<\/li>/gi, '\n')
 .replace(/<li[^>]*>/gi, '- ')
 .replace(/<strong[^>]*>/gi, '**')
 .replace(/<\/strong>/gi, '**')
 .replace(/<[^>]+>/g, '')
 .replace(/\u003C/g, '<')
 .replace(/\u003E/g, '>'),
 ).replace(/\n{3,}/g, '\n\n').trim();
}

/** @param {string} html */
function extractDescriptionHtml(html) {
 const match = html.match(
 /class=x-item-description-child[^>]*>([\s\S]*?)<\/div><!--M_96613636\/-->/,
 );
 if (match) return match[1];
 const spanMatch = html.match(/"accessibilityText":"Seller provided item description"\}],"textSpans":\[\{"_type":"TextSpan","text":"([\s\S]*?)"\}\]/);
 if (spanMatch) {
 return spanMatch[1]
 .replace(/\\u003C/g, '<')
 .replace(/\\u003E/g, '>')
 .replace(/\\"/g, '"')
 .replace(/\\n/g, '\n');
 }
 return '';
}

/** @param {string} html */
function descriptionHtmlToMarkdown(html) {
 const inner = extractDescriptionHtml(html);
 if (!inner) return { body: '', summary: '' };
 const text = stripInlineHtml(inner);
 const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
 const body = paragraphs.join('\n\n');
 const summary = paragraphs[0]?.replace(/\*\*/g, '').slice(0, 280) ?? '';
 return { body, summary };
}

/** @param {string} html @param {number} [max=6] */
function extractGalleryImageUrls(html, max = 6) {
 const urls = [
 ...html.matchAll(
 /https:\/\/i\.ebayimg\.com\/images\/g\/[A-Za-z0-9~_-]+\/s-l1600\.(?:webp|jpg|jpeg|png)/gi,
 ),
 ].map((m) => m[0]);
 const seen = new Set();
 /** @type {string[]} */
 const ordered = [];
 for (const url of urls) {
 const key = url.replace(/\/s-l\d+\./, '/');
 if (seen.has(key)) continue;
 seen.add(key);
 ordered.push(url);
 if (ordered.length >= max) break;
 }
 return ordered;
}

/** @param {string} listingId */
async function fetchItemDescription(listingId) {
 const html = await fetchText(`https://itm.ebaydesc.com/itmdesc/${listingId}`, false);
 return descriptionHtmlToMarkdown(html);
}

/** @param {string} listingId */
async function fetchItemGalleryImages(listingId) {
 try {
 const html = await fetchText(`https://www.ebay.co.uk/itm/${listingId}`, true);
 const urls = extractGalleryImageUrls(html);
 if (urls.length > 0) return urls;
 } catch {
 // item page may be bot-blocked; store card image is the fallback
 }
 return [];
}

/** @param {Listing} listing */
function markdownForListing(listing) {
 const slug = `ebay-${listing.listingId}`;
 const author = inferAuthor(listing.title);
 const kind = inferKind(listing.title);
 const imageUrls = listing.imageUrls?.length
 ? listing.imageUrls
 : listing.imageUrl
 ? [listing.imageUrl]
 : [];
 const imagePaths = imageUrls.map((_, i) => {
 if (i === 0) return `../../assets/inventory/ebay-${listing.listingId}.jpg`;
 return `../../assets/inventory/ebay-${listing.listingId}-${i + 1}.jpg`;
 });
 const description = listing.summary || listing.title;

 const lines = [
 '---',
 `title: ${yamlQuote(listing.title)}`,
 `description: ${yamlQuote(description)}`,
 ];
 lines.push(`author: ${yamlQuote(author)}`);
 if (imagePaths.length > 0) {
 lines.push('images:');
 for (const p of imagePaths) lines.push(` - ${p}`);
 }
 lines.push(`price: ${listing.price}`);
 lines.push(`priceCurrency: ${yamlQuote(listing.currency)}`);
 lines.push('availability: InStock');
 lines.push(`offerUrl: ${yamlQuote(`https://www.ebay.co.uk/itm/${listing.listingId}`)}`);
 lines.push(`kind: ${kind}`);
 lines.push('draft: false');
 lines.push('---');
 lines.push('');
 if (listing.body?.trim()) {
 lines.push(listing.body.trim());
 lines.push('');
 } else {
 lines.push(
 'Photographs, condition notes, and the full listing description are on the eBay listing linked above.',
 );
 lines.push('');
 }

 return { slug, content: lines.join('\n'), imagePaths, imageUrls };
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

/**
 * @param {Map<string, Listing>} storeListings
 * @param {string[]} ids
 */
async function enrichListings(storeListings, ids) {
 /** @type {Map<string, Listing>} */
 const out = new Map();

 for (const id of ids) {
 const fromStore = storeListings.get(id);
 if (!fromStore) {
 console.warn(` ${id} not found on store — skipping (store may be rate-limited)`);
 continue;
 }

 console.log(` Enriching ${id}…`);
 const { body, summary } = await fetchItemDescription(id);
 let gallery = await fetchItemGalleryImages(id);
 if (gallery.length === 0 && fromStore.imageUrl) gallery = [fromStore.imageUrl];

 out.set(id, {
 ...fromStore,
 body,
 summary: summary || fromStore.title,
 imageUrls: gallery,
 imageUrl: gallery[0] ?? fromStore.imageUrl,
 });
 }

 return out;
}

/** @param {Listing} listing @param {string[]} imagePaths @param {string[]} imageUrls */
async function writeListingAssets(listing, imagePaths, imageUrls) {
 const { slug, content } = markdownForListing(listing);
 const mdPath = path.join(BOOKS_DIR, `${slug}.md`);
 await writeFile(mdPath, content, 'utf8');

 for (let i = 0; i < imageUrls.length; i += 1) {
 const hiRes = hiResImageUrl(imageUrls[i]);
 const dest = path.join(SITE_ROOT, 'src', imagePaths[i].replace('../../', ''));
 try {
 await downloadImage(hiRes, dest);
 } catch (err) {
 console.warn(` Image download failed for ${listing.listingId} #${i + 1}: ${err.message}`);
 }
 }

 return slug;
}

async function main() {
 await mkdir(BOOKS_DIR, { recursive: true });
 await mkdir(IMAGES_DIR, { recursive: true });

 console.log('Fetching eBay store listings…');
 const storeListings = await fetchAllListings();
 console.log(`Found ${storeListings.size} active listings on store.`);

 if (ONLY_IDS) {
 const listings = await enrichListings(storeListings, ONLY_IDS);
 if (listings.size === 0) {
 console.error('No requested listings could be loaded from the store.');
 process.exit(1);
 }
 if (DRY_RUN) {
 for (const item of listings.values()) {
 console.log(` ${item.listingId} £${item.price} ${item.title.slice(0, 70)}`);
 console.log(`   summary: ${item.summary?.slice(0, 100)}…`);
 }
 return;
 }

 const syncedSlugs = new Set();
 for (const listing of listings.values()) {
 const { imagePaths, imageUrls } = markdownForListing(listing);
 const slug = await writeListingAssets(listing, imagePaths, imageUrls);
 syncedSlugs.add(slug);
 console.log(` Wrote ${slug}`);
 }

 console.log(`Updated ${syncedSlugs.size} catalogue entries.`);
 return;
 }

 const listings = storeListings;

 if (DRY_RUN) {
 for (const item of listings.values()) {
 console.log(` ${item.listingId} £${item.price} ${item.title.slice(0, 70)}`);
 }
 return;
 }

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
 console.log(` Enriching ${listing.listingId}…`);
 const { body, summary } = await fetchItemDescription(listing.listingId);
 let gallery = await fetchItemGalleryImages(listing.listingId);
 if (gallery.length === 0 && listing.imageUrl) gallery = [listing.imageUrl];

 const enriched = {
 ...listing,
 body,
 summary: summary || listing.title,
 imageUrls: gallery,
 imageUrl: gallery[0] ?? listing.imageUrl,
 };
 const { imagePaths, imageUrls } = markdownForListing(enriched);
 const slug = await writeListingAssets(enriched, imagePaths, imageUrls);
 syncedSlugs.add(slug);
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

 const astroCache = path.join(SITE_ROOT, '.astro');
 if (existsSync(astroCache)) {
 await rm(astroCache, { recursive: true, force: true });
 console.log('Cleared .astro cache, restart the dev server if it is running.');
 }
}

main().catch((err) => {
 console.error(err);
 process.exit(1);
});
