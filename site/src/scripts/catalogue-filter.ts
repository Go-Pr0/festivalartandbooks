/**
 * Client-side catalogue search, filters, sort, and URL sync for /books.
 * Operates on pre-rendered <li> items via data attributes — no image re-render.
 * Idempotent; re-run after Astro view transitions via astro:after-swap.
 */

const SORT_OPTIONS = ['price-asc', 'price-desc', 'title-asc', 'title-desc'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];
type KindFilter = 'all' | 'book' | 'collectable';

const DEFAULT_SORT: SortOption = 'title-asc';

interface FilterState {
  q: string;
  kind: KindFilter;
  min: number | null;
  max: number | null;
  sort: SortOption;
}

function parsePrice(value: string): number | null {
  if (value.trim() === '') return null;
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

function isKindFilter(value: string): value is KindFilter {
  return value === 'all' || value === 'book' || value === 'collectable';
}

function defaultState(): FilterState {
  return { q: '', kind: 'all', min: null, max: null, sort: DEFAULT_SORT };
}

function readStateFromUrl(): Partial<FilterState> {
  const params = new URLSearchParams(window.location.search);
  const partial: Partial<FilterState> = {};

  const q = params.get('q');
  if (q) partial.q = q;

  const kind = params.get('kind');
  if (kind && isKindFilter(kind)) partial.kind = kind;

  const min = params.get('min');
  if (min !== null) partial.min = parsePrice(min);

  const max = params.get('max');
  if (max !== null) partial.max = parsePrice(max);

  const sort = params.get('sort');
  if (sort && isSortOption(sort)) partial.sort = sort;

  return partial;
}

function mergeState(partial: Partial<FilterState>): FilterState {
  return { ...defaultState(), ...partial };
}

function readStateFromControls(toolbar: HTMLElement): FilterState {
  const search = toolbar.querySelector<HTMLInputElement>('#catalogue-search');
  const minInput = toolbar.querySelector<HTMLInputElement>('#catalogue-min-price');
  const maxInput = toolbar.querySelector<HTMLInputElement>('#catalogue-max-price');
  const sortSelect = toolbar.querySelector<HTMLSelectElement>('#catalogue-sort');

  const activeKind = toolbar.querySelector<HTMLButtonElement>('.catalogue-kind-btn[data-active]');
  const kind = (activeKind?.dataset.kind ?? 'all') as KindFilter;

  return {
    q: search?.value.trim() ?? '',
    kind: isKindFilter(kind) ? kind : 'all',
    min: minInput ? parsePrice(minInput.value) : null,
    max: maxInput ? parsePrice(maxInput.value) : null,
    sort: sortSelect && isSortOption(sortSelect.value) ? sortSelect.value : DEFAULT_SORT,
  };
}

function applyStateToControls(toolbar: HTMLElement, state: FilterState): void {
  const search = toolbar.querySelector<HTMLInputElement>('#catalogue-search');
  const minInput = toolbar.querySelector<HTMLInputElement>('#catalogue-min-price');
  const maxInput = toolbar.querySelector<HTMLInputElement>('#catalogue-max-price');
  const sortSelect = toolbar.querySelector<HTMLSelectElement>('#catalogue-sort');

  if (search) search.value = state.q;
  if (minInput) minInput.value = state.min !== null ? String(state.min) : '';
  if (maxInput) maxInput.value = state.max !== null ? String(state.max) : '';
  if (sortSelect) sortSelect.value = state.sort;

  toolbar.querySelectorAll<HTMLButtonElement>('.catalogue-kind-btn').forEach((btn) => {
    const active = btn.dataset.kind === state.kind;
    if (active) btn.setAttribute('data-active', '');
    else btn.removeAttribute('data-active');
    btn.setAttribute('aria-pressed', String(active));
  });

  syncPresetChips(toolbar, state);
}

function syncPresetChips(toolbar: HTMLElement, state: FilterState): void {
  toolbar.querySelectorAll<HTMLButtonElement>('.catalogue-preset').forEach((chip) => {
    const chipMin = parseFloat(chip.dataset.presetMin ?? '0');
    const chipMaxRaw = chip.dataset.presetMax;
    const chipMax = chipMaxRaw === '' || chipMaxRaw === undefined ? null : parseFloat(chipMaxRaw);
    const active =
      state.min === chipMin &&
      (chipMax === null ? state.max === null : state.max === chipMax);
    if (active) chip.setAttribute('data-active', '');
    else chip.removeAttribute('data-active');
  });
}

function updateUrl(state: FilterState): void {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.kind !== 'all') params.set('kind', state.kind);
  if (state.min !== null) params.set('min', String(state.min));
  if (state.max !== null) params.set('max', String(state.max));
  if (state.sort !== DEFAULT_SORT) params.set('sort', state.sort);

  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

function itemMatches(item: HTMLElement, state: FilterState): boolean {
  const searchText = item.dataset.searchText ?? '';
  const kind = item.dataset.kind ?? 'book';
  const priceStr = item.dataset.price;
  const price = priceStr !== undefined && priceStr !== '' ? parseFloat(priceStr) : null;

  if (state.q && !searchText.includes(state.q.toLowerCase())) return false;
  if (state.kind !== 'all' && kind !== state.kind) return false;
  if (state.min !== null && (price === null || price < state.min)) return false;
  if (state.max !== null && (price === null || price > state.max)) return false;
  return true;
}

function sortItems(items: HTMLElement[], sort: SortOption): HTMLElement[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sort === 'price-asc' || sort === 'price-desc') {
      const pa = parseFloat(a.dataset.price ?? '');
      const pb = parseFloat(b.dataset.price ?? '');
      const aPrice = Number.isFinite(pa) ? pa : Infinity;
      const bPrice = Number.isFinite(pb) ? pb : Infinity;
      return sort === 'price-asc' ? aPrice - bPrice : bPrice - aPrice;
    }
    const ta = (a.dataset.title ?? '').toLowerCase();
    const tb = (b.dataset.title ?? '').toLowerCase();
    const cmp = ta.localeCompare(tb);
    return sort === 'title-asc' ? cmp : -cmp;
  });
  return sorted;
}

function hasActiveFilters(state: FilterState): boolean {
  return (
    state.q !== '' ||
    state.kind !== 'all' ||
    state.min !== null ||
    state.max !== null ||
    state.sort !== DEFAULT_SORT
  );
}

function applyFilters(
  grid: HTMLElement,
  toolbar: HTMLElement,
  empty: HTMLElement | null,
  state: FilterState,
): void {
  const total = parseInt(toolbar.dataset.total ?? '0', 10);
  const items = [...grid.querySelectorAll<HTMLElement>(':scope > li')];

  const matching = items.filter((item) => itemMatches(item, state));
  const sorted = sortItems(matching, state.sort);

  items.forEach((item) => {
    item.hidden = true;
  });

  sorted.forEach((item) => {
    item.hidden = false;
    grid.appendChild(item);
  });

  const countEl = toolbar.querySelector('#catalogue-count');
  if (countEl) {
    countEl.textContent =
      matching.length === total ? `${total} items` : `${matching.length} of ${total}`;
  }

  const clearBtn = toolbar.querySelector<HTMLButtonElement>('#catalogue-clear');
  if (clearBtn) {
    const active = hasActiveFilters(state);
    clearBtn.hidden = !active;
    clearBtn.classList.toggle('hidden', !active);
  }

  if (empty) {
    const showEmpty = matching.length === 0;
    empty.hidden = !showEmpty;
    empty.classList.toggle('hidden', !showEmpty);
  }

  updateUrl(state);
}

const toolbarControllers = new WeakMap<HTMLElement, AbortController>();
let afterSwapBound = false;

export function initCatalogueFilter(): void {
  const toolbar = document.getElementById('catalogue-toolbar');
  const grid = document.getElementById('catalogue-grid');
  if (!toolbar || !grid) return;

  toolbarControllers.get(toolbar)?.abort();
  const ac = new AbortController();
  toolbarControllers.set(toolbar, ac);
  const { signal } = ac;

  const empty = document.getElementById('catalogue-empty');
  const state = mergeState(readStateFromUrl());
  applyStateToControls(toolbar, state);
  applyFilters(grid, toolbar, empty, state);

  const onChange = (): void => {
    const next = readStateFromControls(toolbar);
    applyFilters(grid, toolbar, empty, next);
  };

  const search = toolbar.querySelector<HTMLInputElement>('#catalogue-search');
  search?.addEventListener('input', onChange, { signal });

  toolbar.querySelector<HTMLInputElement>('#catalogue-min-price')?.addEventListener('input', onChange, { signal });
  toolbar.querySelector<HTMLInputElement>('#catalogue-max-price')?.addEventListener('input', onChange, { signal });
  toolbar.querySelector<HTMLSelectElement>('#catalogue-sort')?.addEventListener('change', onChange, { signal });

  toolbar.querySelectorAll<HTMLButtonElement>('.catalogue-kind-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      toolbar.querySelectorAll<HTMLButtonElement>('.catalogue-kind-btn').forEach((b) => {
        b.removeAttribute('data-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.setAttribute('data-active', '');
      btn.setAttribute('aria-pressed', 'true');
      onChange();
    }, { signal });
  });

  toolbar.querySelectorAll<HTMLButtonElement>('.catalogue-preset').forEach((chip) => {
    chip.addEventListener('click', () => {
      const minInput = toolbar.querySelector<HTMLInputElement>('#catalogue-min-price');
      const maxInput = toolbar.querySelector<HTMLInputElement>('#catalogue-max-price');
      if (minInput) minInput.value = chip.dataset.presetMin ?? '';
      if (maxInput) {
        const max = chip.dataset.presetMax;
        maxInput.value = max === '' || max === undefined ? '' : max;
      }
      onChange();
    }, { signal });
  });

  toolbar.querySelector<HTMLButtonElement>('#catalogue-clear')?.addEventListener('click', () => {
    applyStateToControls(toolbar, defaultState());
    onChange();
    search?.focus();
  }, { signal });
}

/** Initialise catalogue filtering and bind a single astro:after-swap handler. */
export function setupCatalogueFilter(): void {
  initCatalogueFilter();
  if (!afterSwapBound) {
    afterSwapBound = true;
    document.addEventListener('astro:after-swap', initCatalogueFilter);
  }
}
