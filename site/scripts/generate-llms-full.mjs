/**
 * Build public/llms-full.txt from guide Markdown sources.
 * Run: npm run generate:llms-full
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const guidesDir = join(siteRoot, 'src/content/guides');
const outPath = join(siteRoot, 'public/llms-full.txt');

const SITE_URL = 'https://festivalartandbooks.com';

const intro = `# Festival Art & Books: Full Guide Content

> Specialist Tolkien Rare Book Dealer run by Mark Faith, Est. 2001, Mid-Wales, United Kingdom.
> 5,000+ rare Tolkien books sold. Sales via eBay, AbeBooks and direct contact at MarkFaith@festivalartandbooks.com.

`;

function parseGuide(filePath) {
 const raw = readFileSync(filePath, 'utf8');
 const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if (!match) return null;

 const frontmatter = match[1];
 const body = match[2].trim();

 if (/^draft:\s*true\s*$/m.test(frontmatter)) return null;

 const title =
 frontmatter.match(/^title:\s*["'](.+?)["']\s*$/m)?.[1] ??
 frontmatter.match(/^title:\s*(.+)\s*$/m)?.[1];

 const description =
 frontmatter.match(/^description:\s*["'](.+?)["']\s*$/m)?.[1] ??
 frontmatter.match(/^description:\s*(.+)\s*$/m)?.[1];

 if (!title) return null;

 return { title, description, body };
}

const files = readdirSync(guidesDir)
 .filter((f) => f.endsWith('.md'))
 .sort();

let output = intro;

for (const file of files) {
 const parsed = parseGuide(join(guidesDir, file));
 if (!parsed) continue;

 const slug = file.replace(/\.md$/, '');
 output += `\n---\n\n## ${parsed.title}\n\n`;
 output += `URL: ${SITE_URL}/guides/${slug}\n\n`;
 if (parsed.description) {
 output += `> ${parsed.description}\n\n`;
 }
 output += `${parsed.body}\n`;
}

writeFileSync(outPath, output, 'utf8');
console.log(`Wrote ${outPath} (${files.length} guides scanned)`);
