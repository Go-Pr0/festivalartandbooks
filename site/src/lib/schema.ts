/**
 * Schema.org entity builders. Keep the recurring entities here so every page emits
 * consistent, valid JSON-LD. See research/seo-geo-research.md §5 for the full plan.
 */
import { SITE, EXTERNAL } from './site';

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'BookStore'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    foundingDate: SITE.foundingDate,
    logo: `${SITE.url}/logo.png`, // TODO: add a clean logo to public/
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Machynlleth',
      addressRegion: 'Mid-Wales',
      addressCountry: 'GB',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    founder: { '@id': `${SITE.url}/#mark-faith` },
    sameAs: [EXTERNAL.ebay, EXTERNAL.abebooks],
  };
}

export function person() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#mark-faith`,
    name: 'Mark Faith',
    jobTitle: 'Antiquarian Bookseller',
    description:
      'Specialist dealer in rare and collectible J.R.R. Tolkien books for 25+ years.',
    knowsAbout: ['J.R.R. Tolkien', 'Rare Books', 'First Editions', 'Book Collecting'],
    worksFor: { '@id': `${SITE.url}/#organization` },
    url: `${SITE.url}/about`,
    sameAs: [EXTERNAL.ebay, EXTERNAL.abebooks], // add IOBA listing, press mentions
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function breadcrumbs(trail: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.url),
    })),
  };
}

function absolute(url: string): string {
  return url.startsWith('http') ? url : `${SITE.url}${url}`;
}

export function article(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: absolute(opts.url),
    author: { '@id': `${SITE.url}/#mark-faith` },
    publisher: { '@id': `${SITE.url}/#organization` },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    ...(opts.image ? { image: absolute(opts.image) } : {}),
  };
}

/** An Offer attached to a Book or Product — sales happen on a marketplace. */
export interface OfferInput {
  /** Price as a string, e.g. '54000'. Omit for "price on application". */
  price?: string;
  priceCurrency?: string;
  /** Marketplace listing URL (eBay / AbeBooks). */
  url?: string;
  availability?: 'InStock' | 'OutOfStock' | 'SoldOut' | 'PreOrder';
}

function offer(input: OfferInput) {
  return {
    '@type': 'Offer',
    ...(input.price ? { price: input.price } : {}),
    priceCurrency: input.priceCurrency ?? 'GBP',
    availability: `https://schema.org/${input.availability ?? 'InStock'}`,
    seller: { '@id': `${SITE.url}/#organization` },
    ...(input.url ? { url: absolute(input.url) } : {}),
  };
}

/** Schema.org Book for a specific collectable edition. Use only with real data. */
export function book(opts: {
  name: string;
  author?: string;
  description?: string;
  url: string;
  image?: string;
  bookEdition?: string;
  datePublished?: string;
  isbn?: string;
  numberOfPages?: number;
  offer?: OfferInput;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: opts.name,
    author: opts.author ? { '@type': 'Person', name: opts.author } : undefined,
    ...(opts.description ? { description: opts.description } : {}),
    url: absolute(opts.url),
    ...(opts.image ? { image: absolute(opts.image) } : {}),
    ...(opts.bookEdition ? { bookEdition: opts.bookEdition } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.isbn ? { isbn: opts.isbn } : {}),
    ...(opts.numberOfPages ? { numberOfPages: opts.numberOfPages } : {}),
    ...(opts.offer ? { offers: offer(opts.offer) } : {}),
  };
}

/** Schema.org Product (+Offer) for a non-book collectable (art, ephemera). */
export function product(opts: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  brand?: string;
  offer?: OfferInput;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url: absolute(opts.url),
    ...(opts.image ? { image: absolute(opts.image) } : {}),
    ...(opts.brand ? { brand: { '@type': 'Brand', name: opts.brand } } : {}),
    ...(opts.offer ? { offers: offer(opts.offer) } : {}),
  };
}

/** Schema.org FAQPage from a list of question/answer pairs. */
export function faqPage(qa: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Schema.org CollectionPage for index/listing pages (guides, journal, books). */
export function collectionPage(opts: {
  name: string;
  description: string;
  url: string;
  items?: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absolute(opts.url),
    isPartOf: { '@id': `${SITE.url}/#website` },
    ...(opts.items && opts.items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: opts.items.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              url: absolute(item.url),
            })),
          },
        }
      : {}),
  };
}
