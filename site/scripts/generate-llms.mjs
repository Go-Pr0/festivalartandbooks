/**
 * Build public/llms.txt — AI crawler index with guide + journal links.
 * Run: npm run generate:llms
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const guidesDir = join(siteRoot, 'src/content/guides');
const journalDir = join(siteRoot, 'src/content/journal');
const outPath = join(siteRoot, 'public/llms.txt');

const SITE_URL = 'https://festivalartandbooks.com';

/** Mirror site/src/lib/site.ts EXTERNAL — plain Node script cannot import TS. */
const EXTERNAL = {
  ebay: 'https://www.ebay.co.uk/str/festivalartandbooks',
  abebooks: 'https://www.abebooks.co.uk/festival-art-and-books-aberdyfi/51881760/sf',
  podcast: 'https://castbox.fm/app/castbox/player/id1209853/id485657519',
};

const INTRO = `# Festival Art & Books

> Festival Art & Books is a specialist Tolkien rare book dealership run by Mark Faith in
> Mid-Wales, United Kingdom (Machynlleth area). Est. 2001, trading as Festival Art and
> Books since 2009. One of the world's oldest and largest specialist Tolkien rare-book
> dealers — 5,000+ rare Tolkien books sold. First editions of The Hobbit (1937) and The
> Lord of the Rings (1954–55), other Tolkien firsts, and original Tolkien-inspired art.
> Sales on eBay, AbeBooks and direct email — no on-site checkout.

`;

function parseFrontmatter(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatter = match[1];

  if (/^draft:\s*true\s*$/m.test(frontmatter)) return null;

  const title =
    frontmatter.match(/^title:\s*["'](.+?)["']\s*$/m)?.[1] ??
    frontmatter.match(/^title:\s*(.+)\s*$/m)?.[1];

  const description =
    frontmatter.match(/^description:\s*["'](.+?)["']\s*$/m)?.[1] ??
    frontmatter.match(/^description:\s*(.+)\s*$/m)?.[1];

  const pillar = /^pillar:\s*true\s*$/m.test(frontmatter);

  if (!title) return null;

  return { title, description, pillar };
}

function loadGuides() {
  const files = readdirSync(guidesDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const parsed = parseFrontmatter(join(guidesDir, file));
      if (!parsed) return null;
      return { ...parsed, slug: file.replace(/\.md$/, '') };
    })
    .filter(Boolean);

  files.sort((a, b) => {
    if (a.pillar !== b.pillar) return a.pillar ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  return files;
}

function loadJournal() {
  let files;
  try {
    files = readdirSync(journalDir);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const parsed = parseFrontmatter(join(journalDir, file));
      if (!parsed) return null;
      return { ...parsed, slug: file.replace(/\.md$/, '') };
    })
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title));
}

function linkLine(title, path, description) {
  const desc = description ? `: ${description}` : '';
  return `- [${title}](${SITE_URL}${path})${desc}`;
}

function buildCollectingGuides(guides) {
  let section = '## Collecting Guides\n\n';
  for (const g of guides) {
    section += `${linkLine(g.title, `/guides/${g.slug}`, g.description)}\n`;
  }
  return `${section}\n`;
}

function staticSections() {
  return `## Collector's Guide (hub + chapters)

${linkLine("The Tolkien Collector's Guide — hub", '/collectors-guide', "Mark Faith's complete free collector's guide, readable online chapter by chapter or downloadable as a PDF.")}

## Expert Q&A

${linkLine('Used & Rare Tolkien Books: Q&A', '/used-tolkien-books', 'Answer-first guide on first-edition values, dust jackets, restoration, states and what to collect.')}

## About & Services

${linkLine('About Mark Faith', '/about', 'Biography, credentials, 5,000+ rare Tolkien books sold, TV expert appearances.')}
- [AbeBooks Collecting Podcast](${EXTERNAL.podcast}): Mark Faith on collecting Tolkien books and why they are such a phenomenon.
${linkLine('Sell & Source', '/sell-and-source', 'We buy rare Tolkien books, offer consignment for high-value items, and confidentially source titles.')}
${linkLine('Contact', '/contact', 'Email Mark Faith for advice, valuations, buying or selling rare Tolkien books.')}

## Current Inventory

${linkLine('Catalogue', '/books', 'Browse rare Tolkien books and collectables currently for sale — titles, photos and prices.')}
${linkLine('Rare Tolkien Books & Collectables', '/rare-tolkien-books-collectables', 'The current collection of rare books, art and memorabilia.')}
- [eBay Shop](${EXTERNAL.ebay}): Current listings for rare Tolkien books and art.
- [AbeBooks Shop](${EXTERNAL.abebooks}): Current listings on AbeBooks.

## Resources

${linkLine('Resources hub', '/resources', 'Index of guides, journal, events, media, art and the photo gallery.')}
${linkLine('Free Tolkien Collector E-book', '/ebook', 'Download the 26-page PDF guide or read the full guide online.')}
${linkLine('The Journal', '/journal', 'Essays on Tolkien collecting, market commentary and notable finds.')}
${linkLine('Journal Issue 1 (2009) PDF', '/downloads/festival-art-and-books-journal-issue-1-2009.pdf', 'The first Festival Art and Books Journal — 8-page archive edition from 2009.')}

`;
}

function buildJournal(journal) {
  if (journal.length === 0) return '';
  let section = '## Journal\n\n';
  for (const j of journal) {
    section += `${linkLine(j.title, `/journal/${j.slug}`, j.description)}\n`;
  }
  return `${section}\n`;
}

function buildMedia() {
  return `## Media

${linkLine('TV Appearances', '/tv-appearances', 'Four Rooms, Pawn Stars UK and other television appearances.')}
${linkLine('News & Media', '/news-media', 'Press coverage, interviews and media mentions.')}
${linkLine('Photo Gallery', '/photo-gallery', 'Archive photographs of rare books, events and memorabilia.')}
${linkLine('Festival in the Shire', '/festival-in-the-shire', 'The Tolkien fan festival Mark Faith founded — history and photos.')}
${linkLine('Events', '/events', 'Past exhibitions, talks and Tolkien collecting events.')}
`;
}

const guides = loadGuides();
const journal = loadJournal();

let output = INTRO;
output += buildCollectingGuides(guides);
output += staticSections();
output += buildJournal(journal);
output += buildMedia();

writeFileSync(outPath, output, 'utf8');
console.log(`Wrote ${outPath} (${guides.length} guides, ${journal.length} journal entries)`);
