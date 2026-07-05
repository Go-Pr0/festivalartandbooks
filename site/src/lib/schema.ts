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
 logo: `${SITE.url}/logo.png`,
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
 contactPoint: {
 '@type': 'ContactPoint',
 contactType: 'customer service',
 email: SITE.email,
 areaServed: 'Worldwide',
 },
 founder: { '@id': `${SITE.url}/#mark-faith` },
 sameAs: [EXTERNAL.ebay, EXTERNAL.abebooks, EXTERNAL.youtube, EXTERNAL.podcast],
 };
}

export function person() {
 return {
 '@context': 'https://schema.org',
 '@type': 'Person',
 '@id': `${SITE.url}/#mark-faith`,
 name: 'Mark Faith',
 jobTitle: 'Specialist Tolkien Rare Book Dealer',
 hasOccupation: {
 '@type': 'Occupation',
 name: 'Specialist Tolkien Rare Book Dealer',
 },
 description:
 'Specialist Tolkien rare book dealer with 25+ years handling rare and first-edition J.R.R. Tolkien books.',
 knowsAbout: ['J.R.R. Tolkien', 'Rare Books', 'First Editions', 'Book Collecting'],
 worksFor: { '@id': `${SITE.url}/#organization` },
 url: `${SITE.url}/about`,
 sameAs: [EXTERNAL.ebay, EXTERNAL.abebooks, EXTERNAL.youtube, EXTERNAL.podcast], // add IOBA listing, press mentions
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
 potentialAction: {
 '@type': 'SearchAction',
 target: {
 '@type': 'EntryPoint',
 urlTemplate: `${SITE.url}/books?q={search_term_string}`,
 },
 'query-input': 'required name=search_term_string',
 },
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

/**
 * An Offer attached to a Book or Product, sales happen on a marketplace.
 * Callers should pass the live eBay or AbeBooks listing URL in `offer.url` when
 * available; fall back to the on-site catalogue page URL only when no listing exists.
 */
export interface OfferInput {
  /** Price as a string, e.g. '54000'. Omit for "price on application". */
 price?: string;
 priceCurrency?: string;
  /** Marketplace listing URL (eBay / AbeBooks) — preferred over the on-site page URL. */
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

/** Schema.org ContactPage — use on the contact route. */
export function contactPage(opts: { description?: string; url?: string } = {}) {
 return {
 '@context': 'https://schema.org',
 '@type': 'ContactPage',
 name: 'Contact',
 description:
 opts.description ??
 `Contact ${SITE.founder}, specialist Tolkien rare book dealer at ${SITE.name}.`,
 url: absolute(opts.url ?? '/contact'),
 mainEntity: { '@id': `${SITE.url}/#organization` },
 isPartOf: { '@id': `${SITE.url}/#website` },
 };
}

/** Schema.org WebPage for generic static pages. */
export function webPage(opts: { name: string; description: string; url: string }) {
 return {
 '@context': 'https://schema.org',
 '@type': 'WebPage',
 name: opts.name,
 description: opts.description,
 url: absolute(opts.url),
 isPartOf: { '@id': `${SITE.url}/#website` },
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
