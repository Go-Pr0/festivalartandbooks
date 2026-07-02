/**
 * Central site configuration and brand facts.
 * Single source of truth for metadata, identity, and external links so SEO/schema
 * stay consistent everywhere. Update values here, not in individual pages.
 */
export const SITE = {
  name: 'Festival Art & Books',
  tagline: 'Tolkien Rare Book Dealer',
  dealerTagline: 'Specialist Tolkien Rare Book Dealer · Est. 2001',
  url: 'https://festivalartandbooks.com',
  description:
    'Specialist Tolkien rare book dealer — rare and collectible J.R.R. Tolkien books — first editions of ' +
    'The Hobbit and The Lord of the Rings — plus original Tolkien-inspired art. Run by ' +
    'Mark Faith, one of the world’s oldest and largest Tolkien rare-book dealerships, for 25+ years.',
  locale: 'en_GB',
  email: 'MarkFaith@festivalartandbooks.com',
  founder: 'Mark Faith',
  foundingDate: '2009', // trading as Festival Art and Books since 2009 (dealing since ~2001)
} as const;

/** External marketplace + profile links (sales happen off-site). */
export const EXTERNAL = {
  ebay: 'https://www.ebay.co.uk/str/festivalartandbooks',
  abebooks: 'https://www.abebooks.co.uk/festival-art-and-books-aberdyfi/51881760/sf',
  youtube: 'https://www.youtube.com/channel/UCW7s3VRIwQLS5CWcasYHsBQ/videos',
  // Add when available: IOBA listing, social profiles, press mentions — used in schema `sameAs`.
} as const;

/** A single navigation entry; `children` makes it a dropdown. */
export interface NavItem {
  label: string;
  href: string;
  children?: readonly NavItem[];
}

/** Primary navigation — canonical site routes, consumed by the Header. */
export const NAV: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Catalogue', href: '/books' },
  { label: 'Rare Books', href: '/rare-tolkien-books-collectables' },
  { label: 'Guides', href: '/guides' },
  { label: 'Used Books', href: '/used-tolkien-books' },
  { label: 'Sell & Source', href: '/sell-and-source' },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: "Collector's Guide", href: '/collectors-guide' },
      { label: 'Tolkien Collector E-book', href: '/ebook' },
      { label: 'The Journal', href: '/journal' },
      { label: 'Festival in the Shire', href: '/festival-in-the-shire' },
      { label: 'Events', href: '/events' },
      { label: 'TV Appearances', href: '/tv-appearances' },
      { label: 'News & Media', href: '/news-media' },
      { label: 'Photo Gallery', href: '/photo-gallery' },
      { label: 'Tolkien Art', href: '/tolkien-art' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Where the prominent header shop affordance points (on-site catalogue). */
export const SHOP = {
  label: 'Catalogue',
  href: '/books',
} as const;
