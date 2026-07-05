// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// @tailwindcss/vite resolves against a different bundled Vite than Astro's, so their
// PluginOption types don't unify. Hold the plugins as `any` to bridge the mismatch without
// disabling Tailwind — runtime is unaffected.
/** @type {any} */
const vitePlugins = [tailwindcss()];

// Production domain — required for sitemap, canonical URLs, and absolute schema.org URLs.
export default defineConfig({
  site: 'https://festivalartandbooks.com',
  redirects: {
    '/ebook': '/collectors-guide',
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: vitePlugins,
  },
  // Static output — every page is pre-rendered to HTML (best for SEO/GEO + Core Web Vitals).
  output: 'static',
});
