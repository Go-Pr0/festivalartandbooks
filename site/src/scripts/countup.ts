/**
 * Count-up for <Stat> bands. Animates `[data-countup]` numerals from 0 to their
 * target when scrolled into view. Honours `prefers-reduced-motion` (snaps to final)
 * and survives Astro view transitions (idempotent, guards already-run elements).
 */

const SELECTOR = '[data-countup]';
const DURATION = 1400;

function format(value: number, decimals: number, prefix: string, suffix: string): string {
  const fixed = value.toFixed(decimals);
  const withSeparators = Number(fixed).toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${withSeparators}${suffix}`;
}

function animate(el: HTMLElement): void {
  if (el.dataset.countupDone === 'true') return;
  el.dataset.countupDone = 'true';

  const target = parseFloat(el.dataset.countup ?? '0');
  const decimals = parseInt(el.dataset.countupDecimals ?? '0', 10);
  const prefix = el.dataset.countupPrefix ?? '';
  const suffix = el.dataset.countupSuffix ?? '';
  const start = performance.now();

  function tick(now: number): void {
    const t = Math.min((now - start) / DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format(target * eased, decimals, prefix, suffix);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = format(target, decimals, prefix, suffix);
  }
  requestAnimationFrame(tick);
}

function snap(el: HTMLElement): void {
  el.dataset.countupDone = 'true';
  const target = parseFloat(el.dataset.countup ?? '0');
  const decimals = parseInt(el.dataset.countupDecimals ?? '0', 10);
  el.textContent = format(
    target,
    decimals,
    el.dataset.countupPrefix ?? '',
    el.dataset.countupSuffix ?? '',
  );
}

export function initCountUp(): void {
  const els = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (!els.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    els.forEach(snap);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target as HTMLElement);
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => observer.observe(el));
}
