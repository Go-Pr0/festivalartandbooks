/**
 * Header interactivity: scroll-condense state, the mobile menu toggle, and accessible
 * desktop Resources dropdowns (click + hover, keyboard, Escape, click-outside).
 * Idempotent and re-run after Astro view transitions via astro:after-swap.
 */

function setupScrollState(header: HTMLElement): void {
  const onScroll = (): void => {
    if (window.scrollY > 8) header.setAttribute('data-scrolled', '');
    else header.removeAttribute('data-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMobileMenu(): void {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.hidden = open;
  });
}

function closeDropdown(trigger: HTMLElement, menu: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'false');
  menu.classList.add('invisible', 'opacity-0', 'translate-y-1');
}

function openDropdown(trigger: HTMLElement, menu: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'true');
  menu.classList.remove('invisible', 'opacity-0', 'translate-y-1');
}

function setupDropdowns(): void {
  const dropdowns = document.querySelectorAll<HTMLElement>('.nav-dropdown');

  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector<HTMLElement>('.nav-dropdown__trigger');
    const menu = dd.querySelector<HTMLElement>('.nav-dropdown__menu');
    if (!trigger || !menu) return;

    const open = (): void => openDropdown(trigger, menu);
    const close = (): void => closeDropdown(trigger, menu);

    trigger.addEventListener('click', () => {
      trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    dd.addEventListener('mouseenter', open);
    dd.addEventListener('mouseleave', close);
    dd.addEventListener('focusout', (e) => {
      if (!dd.contains(e.relatedTarget as Node)) close();
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (e) => {
    dropdowns.forEach((dd) => {
      if (dd.contains(e.target as Node)) return;
      const trigger = dd.querySelector<HTMLElement>('.nav-dropdown__trigger');
      const menu = dd.querySelector<HTMLElement>('.nav-dropdown__menu');
      if (trigger && menu) closeDropdown(trigger, menu);
    });
  });
}

export function initHeader(): void {
  const header = document.getElementById('site-header');
  if (header) setupScrollState(header);
  setupMobileMenu();
  setupDropdowns();
}
