/**
 * Reveal-on-scroll: adds `.in-view` to `[data-reveal]` elements as they enter the
 * viewport. Honours `prefers-reduced-motion` (reveals everything immediately) and is
 * idempotent / re-runnable so it survives Astro view transitions.
 *
 * Optional per-element stagger via `data-reveal-delay` (milliseconds), applied as a
 * CSS custom property the motion stylesheet reads.
 */

const SELECTOR = '[data-reveal]';

function revealAll(): void {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => el.classList.add('in-view'));
}

function applyDelay(el: HTMLElement): void {
  const delay = el.dataset.revealDelay;
  if (delay) el.style.setProperty('--reveal-delay', `${parseInt(delay, 10)}ms`);
}

export function initReveal(): void {
  // Mark JS as available so the no-js fallback in motion.css stays inert.
  document.documentElement.classList.remove('no-js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        applyDelay(el);
        el.classList.add('in-view');
        obs.unobserve(el);
      }
    },
    // Fire as soon as the element's top edge enters the viewport (by 40px), regardless of
    // its height. A ratio-based threshold made tall blocks (e.g. a whole guide article in
    // one Reveal) stay hidden until scrolled deep into them, so the text appeared too late.
    { rootMargin: '0px 0px -40px 0px', threshold: 0 },
  );

  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    if (el.classList.contains('in-view')) return;
    observer.observe(el);
  });
}
