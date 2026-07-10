/**
 * Catalogue inclusion filter — site shows Tolkien stock only.
 * Used by /books and the eBay sync script (keep regex in sync script in sync).
 */
const TOLKIEN_CATALOGUE_TITLE_RE =
  /\b(tolkien|hobbit|lord of the rings|silmarillion|middle[- ]earth|beowulf|mr\.?\s*bliss|farmer giles|smith of wooton|tree and leaf|sir gawain|sir orfeo|roverandom|bombadil|bilbo|frodo|remington|ballantine|unfinished tales|pictures by|letters of jrr|unwin|pauline baynes|ruth lacon|ivan cavini|hilary tolkien|christopher tolkien|tolkien's first|tolkien society|tolkien themed|tolkien lithograph)/i;

export function isTolkienCatalogueTitle(title: string): boolean {
  return TOLKIEN_CATALOGUE_TITLE_RE.test(title);
}
