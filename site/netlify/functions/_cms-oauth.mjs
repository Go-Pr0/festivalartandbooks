/** Shared helpers for Decap CMS GitHub OAuth Netlify Functions. */

export function cmsSiteUrl() {
  const raw = process.env.CMS_OAUTH_ORIGIN || process.env.URL || '';
  return raw.replace(/\/$/, '');
}

export function cmsCallbackUrl() {
  return `${cmsSiteUrl()}/.netlify/functions/callback`;
}

export function missingConfigResponse() {
  return {
    statusCode: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body:
      'CMS GitHub OAuth is not configured on Netlify yet.\n\n' +
      'Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Site configuration → Environment variables, ' +
      'then redeploy. See site/DECAP.md for the GitHub OAuth App setup steps.',
  };
}
