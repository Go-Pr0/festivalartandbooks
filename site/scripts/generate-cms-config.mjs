#!/usr/bin/env node
/**
 * Merge backend settings + collection definitions into site/public/admin/config.yml.
 * Run: npm run cms:config
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { collections } from '../cms/collections.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../public/admin/config.yml');

const BACKEND = `backend:
  name: github
  repo: Go-Pr0/festivalartandbooks
  branch: main
  # Netlify OAuth proxy — uncomment and set once you have a deployed site on Netlify:
  # base_url: https://your-netlify-site.netlify.app
  # auth_endpoint: api/auth

# Enables the CMS UI without GitHub auth when running \`npm run dev\` locally
local_backend: true

# Default media paths (overridden per collection / file where needed)
media_folder: site/src/assets/inventory
public_folder: ../../assets/inventory
`;

const collectionsYaml = yaml.dump(collections(), {
  lineWidth: -1,
  noRefs: true,
});

const indentedCollections = collectionsYaml
  .split('\n')
  .map((line) => (line ? `  ${line}` : ''))
  .join('\n');

writeFileSync(outPath, `${BACKEND}collections:\n${indentedCollections}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
