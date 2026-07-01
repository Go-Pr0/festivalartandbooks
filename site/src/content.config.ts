import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml'; // bundled with astro (its file() loader uses it)

/** Decap list widgets may save plain strings or `{ paragraph }` / `{ image }` objects. */
function normalizeStringArray(val: unknown): unknown {
  if (!Array.isArray(val)) return val;
  return val.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      if (typeof o.paragraph === 'string') return o.paragraph;
      if (typeof o.text === 'string') return o.text;
    }
    return String(item);
  });
}

function normalizeImageArray(val: unknown): unknown {
  if (!Array.isArray(val)) return val;
  return val.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      if (typeof o.image === 'string') return o.image;
    }
    return item;
  });
}

const stringArray = () => z.preprocess(normalizeStringArray, z.array(z.string()));
const imageArray = (image: () => z.ZodType) =>
  z.preprocess(normalizeImageArray, z.array(image())).optional();

// file() requires each array item to have an id. Our list YAMLs are id-less ordered arrays;
// inject a zero-padded id from array index so insertion AND sort order are stable, WITHOUT
// editing the verbatim data files.
const orderedList = (path: string) =>
  file(path, {
    parser: (text) => {
      const parsed = yaml.load(text);
      const items = Array.isArray(parsed)
        ? parsed
        : (parsed as { items: Record<string, unknown>[] }).items;
      return items.map((item, i) => ({
        ...item,
        id: String(i).padStart(3, '0'),
      }));
    },
  });

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
      chapterOrder: z.number().optional(), // 0 = first chapter within a cluster/series
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
      images: imageArray(image),
      price: z.number().optional(),
      priceCurrency: z.string().default('GBP'),
      availability: z.enum(['InStock', 'OutOfStock', 'PreOrder']).default('InStock'),
      offerUrl: z.string().url().optional(), // eBay / AbeBooks listing
      condition: z.string().optional(), // e.g. "Very Good in Very Good dust-jacket"
      kind: z.enum(['book', 'collectable']).default('book'),
      draft: z.boolean().default(false),
    }),
});

// Shared LIST collections — file() loader, ORDER PRESERVED via injected zero-padded ids.
const events = defineCollection({
  loader: orderedList('./src/content/data/events.yaml'),
  schema: z.object({ date: z.string(), location: z.string(), detail: z.string() }),
});

const artists = defineCollection({
  loader: orderedList('./src/content/data/artists.yaml'),
  schema: ({ image }) =>
    z.object({ name: z.string(), image: image(), alt: z.string(), bio: stringArray() }),
});

const mediaMentions = defineCollection({
  loader: orderedList('./src/content/data/media-mentions.yaml'),
  schema: z.object({ outlet: z.string(), headline: z.string(), url: z.string() }),
});

const usedBooksFaqs = defineCollection({
  loader: orderedList('./src/content/data/used-books-faqs.yaml'),
  schema: z.object({ question: z.string(), answer: stringArray() }),
});

const rareBooksGallery = defineCollection({
  loader: orderedList('./src/content/data/rare-books-gallery.yaml'),
  schema: ({ image }) => z.object({ image: image(), alt: z.string(), caption: z.string() }),
});

const archiveGallery = defineCollection({
  loader: orderedList('./src/content/data/archive-gallery.yaml'),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string(),
      caption: z.string(),
      category: z.enum(['article', 'tolkien-photo', 'book', 'other']),
    }),
});

// Per-page singletons. id = filename (home, about, ...). All fields optional; pages use a subset.
const pageContent = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/page-content' }),
  schema: ({ image }) =>
    z.object({
      seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      stats: z.array(z.object({
        value: z.number(), prefix: z.string().optional(), suffix: z.string().optional(),
        decimals: z.number().optional(), label: z.string(),
      })).optional(),
      timeline: z.array(z.object({ year: z.string(), title: z.string(), body: z.string() })).optional(),
      trustPoints: z.array(z.object({ heading: z.string(), body: z.string() })).optional(),
      dealsIn: z.array(z.object({
        image: image(), alt: z.string(), heading: z.string(), body: z.string(),
        href: z.string(), cta: z.string(),
      })).optional(),
      figures: z.array(z.object({
        key: z.string(), src: image(), alt: z.string(), caption: z.string().optional(),
        frame: z.string().optional(), delay: z.number().optional(), sizes: z.string().optional(),
      })).optional(),
      text: z.record(z.union([
        z.string(),
        z.array(z.string()),
        z.array(z.object({ title: z.string(), description: z.string(), href: z.string() })),
      ])).optional(),
    }),
});

export const collections = {
  guides,
  journal,
  pages,
  books,
  events,
  artists,
  mediaMentions,
  usedBooksFaqs,
  rareBooksGallery,
  archiveGallery,
  pageContent,
};
