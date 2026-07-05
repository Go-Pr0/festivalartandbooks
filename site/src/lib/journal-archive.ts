/**
 * Festival in the Shire / Festival Art and Books online magazine archive (2009–2010).
 * HTML issues live under `public/journal/archive/` — copied from the legacy site export.
 */

export const JOURNAL_ARCHIVE_BASE = '/journal/archive';

export interface JournalArchiveIssue {
  number: number;
  folder: string;
  label: string;
  published: string;
  summary: string;
  thumbnail: string;
  /** CSS object-position for the card crop — e.g. tall posters need `center top`. */
  thumbnailPosition?: string;
}

/** Magazine issues 1–10 — read online at `{JOURNAL_ARCHIVE_BASE}/{folder}/index.html`. */
export const JOURNAL_ARCHIVE_ISSUES: readonly JournalArchiveIssue[] = [
  {
    number: 1,
    folder: 'journal1bdx',
    label: 'December 2009',
    published: '2009-12',
    summary:
      'Daphne Castell on her interview with Tolkien, a primary-school Tolkien project, Jane Chance, Jef Murray, Arjan Kiel and Martin Romberg — edited by Colin Duriez.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal1bdx/Daphne-Castell.jpg`,
    thumbnailPosition: 'center top',
  },
  {
    number: 2,
    folder: 'journal2cmy',
    label: 'February 2010',
    published: '2010-02',
    summary:
      '“Goblin Feet”, Jef Murray, Clyde S. Kilby on The Silmarillion, Corey Olsen’s Tolkien Professor column, and interviews with John Howe, Ted Nasmith, Tom Shippey, Rodney Matthews and Michael Hague.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal2cmy/treebeard.jpg`,
  },
  {
    number: 3,
    folder: 'journal3gfo',
    label: 'March 2010',
    published: '2010-03',
    summary:
      'Meeting Professor Tolkien, Leaf By Niggle, Born of Many Hopes, a review of Dimitra Fimi’s Tolkien, Race and Cultural History, and interviews with Verlyn Flieger, Fimi, Stephen Walsh and Michael Drout.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal3gfo/bofh1.jpg`,
  },
  {
    number: 4,
    folder: 'journal4kde',
    label: 'April 2010',
    published: '2010-04',
    summary:
      'Tolkien’s Balrog and Peter Jackson, Sarehole Dreams, Smith of Wootton Major, Tim Tolkien, Alex Lewis, Douglas Anderson, Brian Sibley, Peter Pracownik, Nicola-Clare Lydon and Ruth Lacon.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal4kde/4Balrog.jpg`,
  },
  {
    number: 5,
    folder: 'journal5hts',
    label: 'May 2010',
    published: '2010-05',
    summary:
      'Character development in The Hobbit, On Fairy-Stories, Moseley Bog, Corey Olsen, interviews with Simon Tolkien and Colin Duriez, and a preview of Aberystwyth.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal5hts/5bog083.jpg`,
  },
  {
    number: 6,
    folder: 'journal6pgw',
    label: 'June 2010',
    published: '2010-06',
    summary:
      'Tom Bombadil as romantic hero, Farmer Giles of Ham, Christchurch Meadows, Edouard Klotcko, Sam Roads, and Verlyn Flieger & Douglas Anderson on On Fairy-Stories.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal6pgw/6tolkplace1.jpg`,
  },
  {
    number: 7,
    folder: 'journal7ohv',
    label: 'July 2010',
    published: '2010-07',
    summary:
      'Tom Bombadil (part 2), romance in a Hobbit film, City of Still-Present Sorrow, Paul Raymond Gregory, Dimitra Fimi, The Epic Realm of Tolkien, Rick Wakeman and Marco Lo Muscio.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal7ohv/7Hampton-Court.jpg`,
  },
  {
    number: 8,
    folder: 'journal8kjh',
    label: 'August 2010',
    published: '2010-08',
    summary:
      'Tom Bombadil (part 3), Oxonmoot, crossword, Corey Olsen, Sue Wookey, Philip Smith, Melissa Ruth Arul and The Lay of Leithian.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal8kjh/8wookeypic.jpg`,
  },
  {
    number: 9,
    folder: 'journal9gfx',
    label: 'September 2010',
    published: '2010-09',
    summary:
      'Tolkien’s Places, violence in The Lord of the Rings, People and Places, Colin Duriez & Corey Olsen, Arda Reconstructed, The Green Book of Olwen Ellis and Festival in the Shire in pictures.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal9gfx/9festpic1.jpg`,
  },
  {
    number: 10,
    folder: 'journal10nbf',
    label: 'October 2010',
    published: '2010-10',
    summary:
      'Merton College, Oxford (part 1), Festival in the Shire review, Simon Tolkien’s Inheritance, a Gollum poem and fiction by Jeremy Masters — the final free issue.',
    thumbnail: `${JOURNAL_ARCHIVE_BASE}/journal10nbf/10piclage.jpg`,
  },
] as const;

export function journalIssueUrl(folder: string): string {
  return `${JOURNAL_ARCHIVE_BASE}/${folder}/index.html`;
}

/** Leiden Exhibition Special (2012) — PDF only in the archive. */
export const JOURNAL_LEIDEN_SPECIAL = {
  title: 'Leiden Exhibition Special',
  label: '2012',
  published: '2012',
  summary:
    'John Howe, Rodney Matthews, Weta, Daniel Grotta, Cor Blok’s 2012 Tolkien calendar, Tim Kirk, Ruth Lacon, Merton College Oxford and more — from the Leiden exhibition.',
  pdf: `${JOURNAL_ARCHIVE_BASE}/Journal%20Leiden%20Exhibition%20Special.pdf`,
} as const;

/**
 * Mark Faith dealer newsletter PDF (separate from the Festival in the Shire magazine HTML archive).
 * Originally offered as a downloadable collecting guide.
 */
export const JOURNAL_DEALER_NEWSLETTER = {
  title: 'Festival Art and Books Journal — Issue 1 (2009)',
  description:
    'A downloadable collecting newsletter — commentary, market notes and dealer insight from Mark Faith.',
  pdf: '/downloads/festival-art-and-books-journal-issue-1-2009.pdf',
  published: '2009',
  pages: 8,
} as const;

export const JOURNAL_ARCHIVE_INDEX = `${JOURNAL_ARCHIVE_BASE}/index.html`;
