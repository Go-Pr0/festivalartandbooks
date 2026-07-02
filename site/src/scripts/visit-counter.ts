/**
 * Fire-and-forget visit counter via CountAPI. Counts once per browser session so
 * Astro view transitions do not inflate totals.
 */

const SESSION_KEY = 'fab-counted';
const HIT_URL = 'https://api.countapi.xyz/hit/festivalartandbooks.com/visits';

export function initVisitCounter(): void {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    fetch(HIT_URL, { mode: 'cors', keepalive: true }).catch(() => {});
  } catch {
    // sessionStorage unavailable (private mode, etc.) — skip silently
  }
}
