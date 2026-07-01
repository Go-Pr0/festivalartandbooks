/** @typedef {Record<string, unknown>} DecapField */

/**
 * Reusable Decap CMS field factory functions.
 * Each returns a plain object matching Decap's field schema.
 */

export function stringField(label, name, opts = {}) {
  return { label, name, widget: 'string', ...opts };
}

export function textField(label, name, opts = {}) {
  return { label, name, widget: 'text', ...opts };
}

export function markdownField(label, name, opts = {}) {
  return { label, name, widget: 'markdown', ...opts };
}

export function booleanField(label, name, opts = {}) {
  return { label, name, widget: 'boolean', ...opts };
}

export function numberField(label, name, opts = {}) {
  return { label, name, widget: 'number', ...opts };
}

export function datetimeField(label, name, opts = {}) {
  return { label, name, widget: 'datetime', ...opts };
}

export function selectField(label, name, options, opts = {}) {
  return { label, name, widget: 'select', options, ...opts };
}

export function imageField(label, name, opts = {}) {
  return { label, name, widget: 'image', ...opts };
}

export function listField(label, name, fields, opts = {}) {
  return { label, name, widget: 'list', fields, ...opts };
}

/** List where each item is a single sub-field (images, string paragraphs, etc.). */
export function singletonListField(label, name, field, opts = {}) {
  return { label, name, widget: 'list', field, ...opts };
}

/** List of primitive strings — Decap requires inner field.name; site normalizes on load. */
export function stringListField(label, name, itemLabel = 'Paragraph', opts = {}) {
  return singletonListField(
    label,
    name,
    { label: itemLabel, name: 'paragraph', widget: 'string' },
    {
      hint: 'Add one entry per paragraph. Each paragraph appears as a separate block on the site.',
      ...opts,
    },
  );
}

/** List of image paths for book catalogue entries. */
export function imageListField(label, name, opts = {}) {
  return singletonListField(
    label,
    name,
    {
      label: 'Image',
      name: 'image',
      widget: 'image',
      hint: 'Use a descriptive filename, e.g. tolkien-hobbit-1937-first-edition-front-cover.jpg',
    },
    { required: false, collapsed: true, summary: '{{fields.image}}', ...opts },
  );
}

export function objectField(label, name, fields, opts = {}) {
  return { label, name, widget: 'object', fields, collapsed: true, ...opts };
}

/** SEO block — title optional (home uses description only). */
export function seoFields({ titleRequired = false } = {}) {
  return objectField('SEO', 'seo', [
    stringField('Meta title', 'title', { required: titleRequired }),
    textField('Meta description', 'description', {
      hint: 'Short summary for Google and social previews — aim for ~150 characters.',
    }),
  ]);
}

export function heroFields() {
  return [
    imageField('Hero image', 'heroImage', { required: false }),
    stringField('Hero image alt text', 'heroImageAlt', { required: false }),
  ];
}

export function statsField() {
  return listField('Stats', 'stats', [
    numberField('Value', 'value'),
    stringField('Prefix', 'prefix', { required: false }),
    stringField('Suffix', 'suffix', { required: false }),
    numberField('Decimals', 'decimals', { required: false }),
    stringField('Label', 'label'),
  ], { required: false, summary: '{{fields.label}}' });
}

export function timelineField() {
  return listField('Timeline', 'timeline', [
    stringField('Year', 'year'),
    stringField('Title', 'title'),
    markdownField('Body', 'body'),
  ], { required: false, summary: '{{fields.year}} — {{fields.title}}' });
}

export function trustPointsField() {
  return listField('Trust points', 'trustPoints', [
    stringField('Heading', 'heading'),
    textField('Body', 'body'),
  ], { required: false, summary: '{{fields.heading}}' });
}

export function dealsInField() {
  return listField('What I deal in', 'dealsIn', [
    imageField('Image', 'image'),
    stringField('Alt text', 'alt'),
    stringField('Heading', 'heading'),
    textField('Body', 'body'),
    stringField('Link URL', 'href'),
    stringField('CTA label', 'cta'),
  ], { required: false, summary: '{{fields.heading}}' });
}

export function figuresField() {
  return listField('Figures', 'figures', [
    stringField('Key', 'key', { hint: 'Stable identifier used in templates, e.g. markPortrait' }),
    imageField('Image', 'src'),
    stringField('Alt text', 'alt'),
    stringField('Caption', 'caption', { required: false }),
    stringField('Frame', 'frame', { required: false, hint: 'e.g. portrait' }),
    numberField('Animation delay (ms)', 'delay', { required: false }),
    stringField('Sizes attribute', 'sizes', { required: false }),
  ], { required: false, summary: '{{fields.key}}' });
}

export function exploreCardsField() {
  return listField('Explore cards', 'exploreCards', [
    stringField('Title', 'title'),
    textField('Description', 'description'),
    stringField('Link URL', 'href'),
  ], { summary: '{{fields.title}}' });
}

/**
 * Build a collapsed text-section object containing only the keys this page uses.
 * @param {Array<{ label: string, name: string, widget?: string, required?: boolean, hint?: string }>} entries
 */
export function textSection(entries) {
  const fields = entries.map(({ label, name, widget = 'string', ...rest }) => {
    if (widget === 'markdown') return markdownField(label, name, rest);
    if (widget === 'text') return textField(label, name, rest);
    if (widget === 'list') {
      return listField(label, name, [
        stringField('Title', 'title'),
        textField('Description', 'description'),
        stringField('Link URL', 'href'),
      ], { summary: '{{fields.title}}', ...rest });
    }
    return stringField(label, name, rest);
  });
  return objectField('Page copy', 'text', fields);
}

/** Short label / heading / CTA */
export const str = (label, name) => ({ label, name, widget: 'string' });

/** Multi-line or HTML paragraph */
export const md = (label, name) => ({ label, name, widget: 'markdown' });

/** Single-line body (trust points etc.) */
export const txt = (label, name) => ({ label, name, widget: 'text' });

// ── Content collection fields ───────────────────────────────────────────────

export function draftField() {
  return booleanField('Draft (hide from site)', 'draft', {
    default: false,
    hint: 'Tick to hide this entry from the public site while you work on it.',
  });
}

export function bodyField(hint) {
  return markdownField('Body', 'body', { required: false, hint });
}

export function journalFields() {
  return [
    stringField('Title', 'title'),
    textField('Description', 'description', { hint: 'Meta description and summary.' }),
    imageField('Hero image', 'heroImage', { required: false }),
    stringField('Hero image alt text', 'heroAlt', { required: false }),
    datetimeField('Date published', 'datePublished'),
    datetimeField('Date modified', 'dateModified', { required: false }),
    draftField(),
    bodyField('Essay body rendered on the journal entry page.'),
  ];
}

export function guidesFields() {
  return [
    stringField('Title', 'title'),
    textField('Description', 'description', { hint: 'Meta description and first-100-words answer summary.' }),
    booleanField('Pillar guide', 'pillar', { default: false }),
    stringField('Cluster', 'cluster', {
      required: false,
      hint: 'e.g. hobbit-first-editions — groups supporting pages under a pillar.',
    }),
    numberField('Chapter order', 'chapterOrder', {
      required: false,
      value_type: 'int',
      hint: 'Order within a cluster/series (0 = first chapter)',
    }),
    imageField('Hero image', 'heroImage', { required: false }),
    stringField('Hero image alt text', 'heroAlt', { required: false }),
    datetimeField('Date published', 'datePublished'),
    datetimeField('Date modified', 'dateModified', { required: false }),
    listField('FAQ', 'faq', [
      stringField('Question', 'question'),
      markdownField('Answer', 'answer'),
    ], { required: false, summary: '{{fields.question}}' }),
    draftField(),
    bodyField('Guide body — use H2/H3 as real questions for GEO.'),
  ];
}

function booksListingDetailsFields() {
  return [
    stringField('Title', 'title', {
      hint: "Short working title used as the filename slug, e.g. 'Hobbit First Edition 1937 Fine'",
    }),
    textField('Description', 'description', { hint: 'One-sentence summary for SEO and catalogue listing.' }),
    stringField('Edition / Full Title', 'editionTitle', {
      required: false,
      hint: "e.g. 'The Hobbit, first edition, second impression, 1937'",
    }),
    stringField('Author', 'author', { default: 'J.R.R. Tolkien' }),
    stringField('Publisher', 'publisher', { required: false, hint: "e.g. 'George Allen & Unwin'" }),
    stringField('Year Published', 'datePublished', {
      required: false,
      hint: "The book's own publication year, e.g. '1937'",
    }),
    selectField('Format', 'bookFormat', [
      { label: 'Hardcover', value: 'Hardcover' },
      { label: 'Paperback', value: 'Paperback' },
      { label: 'EBook', value: 'EBook' },
      { label: 'AudioBook', value: 'AudioBook' },
    ], { required: false }),
    stringField('ISBN', 'isbn', { required: false }),
    selectField('Kind', 'kind', [
      { label: 'Book', value: 'book' },
      { label: 'Collectable / Memorabilia', value: 'collectable' },
    ], { required: false }),
    stringField('Condition', 'condition', {
      required: false,
      hint: "Brief condition grade, e.g. 'Fine in Very Good+ dust jacket'",
    }),
  ];
}

function booksPricingFields() {
  return [
    numberField('Price (£)', 'price', { required: false, value_type: 'float', min: 0 }),
    stringField('Currency', 'priceCurrency', { default: 'GBP' }),
    selectField('Availability', 'availability', [
      { label: 'In Stock', value: 'InStock' },
      { label: 'Sold / Out of Stock', value: 'OutOfStock' },
      { label: 'Pre-Order', value: 'PreOrder' },
    ], {
      default: 'InStock',
      hint: 'Set to Sold when the item is no longer for sale. In Stock items appear in the catalogue.',
    }),
    stringField('Listing URL (eBay / AbeBooks)', 'offerUrl', {
      required: false,
      hint: 'Full URL to the marketplace listing.',
    }),
  ];
}

export function booksFields() {
  return [
    ...booksListingDetailsFields(),
    imageListField('Images', 'images'),
    ...booksPricingFields(),
    draftField(),
    markdownField('Full description', 'body', {
      required: false,
      hint: 'Longer description, issue-point notes, provenance, etc. Rendered on the catalogue entry.',
    }),
  ];
}

// ── List / gallery data file item schemas ───────────────────────────────────

export function eventsListFields() {
  return [
    listField('Events', 'items', [
      stringField('Date', 'date'),
      stringField('Location', 'location'),
      markdownField('Detail', 'detail'),
    ], { summary: '{{fields.date}} — {{fields.location}}' }),
  ];
}

export function mediaMentionsListFields() {
  return [
    listField('Press & media mentions', 'items', [
      stringField('Outlet', 'outlet'),
      stringField('Headline', 'headline'),
      stringField('URL', 'url'),
    ], { summary: '{{fields.headline}}' }),
  ];
}

export function usedBooksFaqsListFields() {
  return [
    listField('Used books FAQs', 'items', [
      stringField('Question', 'question'),
      stringListField('Answer paragraphs', 'answer', 'Paragraph'),
    ], { summary: '{{fields.question}}' }),
  ];
}

export function artistsListFields() {
  return [
    listField('Artists', 'items', [
      stringField('Name', 'name'),
      imageField('Portrait / artwork', 'image'),
      stringField('Alt text', 'alt'),
      stringListField('Bio paragraphs', 'bio', 'Paragraph'),
    ], { summary: '{{fields.name}}' }),
  ];
}

export function rareBooksGalleryListFields() {
  return [
    listField('Gallery images', 'items', [
      imageField('Image', 'image'),
      stringField('Alt text', 'alt'),
      stringField('Caption', 'caption'),
    ], { summary: '{{fields.caption}}' }),
  ];
}

export function archiveGalleryListFields() {
  return [
    listField('Archive photos', 'items', [
      imageField('Image', 'image'),
      stringField('Alt text', 'alt'),
      stringField('Caption', 'caption'),
      selectField('Category', 'category', [
        { label: 'Article', value: 'article' },
        { label: 'Tolkien photo', value: 'tolkien-photo' },
        { label: 'Book', value: 'book' },
        { label: 'Other', value: 'other' },
      ]),
    ], { summary: '{{fields.caption}}' }),
  ];
}
