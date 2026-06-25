import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections — the new site is content-first. Source the body from the
 * extracted Markdown in ../content-extract (copy/transform into these collections
 * during the build). Schema fields below double as SEO/GEO metadata and feed the
 * SchemaOrg component.
 */

// Long-form collecting guides (pillar + supporting pages). The topical-authority engine.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // meta description + first-100-words answer summary
      pillar: z.boolean().default(false),
      cluster: z.string().optional(), // e.g. "hobbit-first-editions"
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      datePublished: z.coerce.date(),
      dateModified: z.coerce.date().optional(), // freshness signal — keep updated
      faq: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .optional(),
      draft: z.boolean().default(false),
    }),
});

// Journal / blog essays (Article schema, authored by Mark).
const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      datePublished: z.coerce.date(),
      dateModified: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

// Standalone narrative pages (About, Festival in the Shire, TV, etc.).
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

// Notable inventory / showcase items (Product + Offer + Book schema; link out to eBay/AbeBooks).
const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      editionTitle: z.string().optional(), // e.g. "The Hobbit, first edition, 1937"
      author: z.string().default('J.R.R. Tolkien'),
      publisher: z.string().optional(),
      datePublished: z.string().optional(), // book's own publication year
      bookFormat: z.string().optional(),
      isbn: z.string().optional(),
      images: z.array(image()).optional(),
      price: z.number().optional(),
      priceCurrency: z.string().default('GBP'),
      availability: z.enum(['InStock', 'OutOfStock', 'PreOrder']).default('InStock'),
      offerUrl: z.string().url().optional(), // eBay / AbeBooks listing
      draft: z.boolean().default(false),
    }),
});

export const collections = { guides, journal, pages, books };
