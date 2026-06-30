import { SITE } from './site';

export interface InquiryOpts {
  title: string;
  slug: string;
  price?: number;
  currency?: string;
}

/** Returns a mailto: URL pre-filled with subject and body referencing the item page. */
export function inquiryMailto(opts: InquiryOpts): string {
  const { title, slug, price, currency = 'GBP' } = opts;
  const itemUrl = `${SITE.url}/books/${slug}`;

  const symbol = currency === 'GBP' ? '£' : currency;
  const priceNote = price != null ? ` — listed at ${symbol}${price.toLocaleString('en-GB')}` : '';

  const subject = `Inquiry: ${title}`;
  const body = [
    `Hello Mark,`,
    ``,
    `I'm interested in the following item${priceNote}:`,
    `${title}`,
    `${itemUrl}`,
    ``,
    `Please could you let me know its current availability and condition?`,
    ``,
    `Many thanks,`,
  ].join('\n');

  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
