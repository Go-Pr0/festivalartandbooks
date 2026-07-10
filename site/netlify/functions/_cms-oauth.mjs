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

/**
 * HTML page that completes the Decap CMS ↔ GitHub OAuth postMessage handshake.
 *
 * Flow (matches decap-cms-lib-auth netlify-auth.js):
 * 1. Popup posts "authorizing:github" to opener (CMS admin window).
 * 2. CMS verifies origin === base_url, registers authorizeCallback, echoes "authorizing:github" back.
 * 3. Popup posts "authorization:github:success|error:{json}" to opener and closes.
 */
export function oauthCallbackHtml(status, content) {
  const serialized = JSON.stringify(content);
  const baseUrl = JSON.stringify(cmsSiteUrl());

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Signing in…</title>
</head>
<body>
  <p id="status">Signing in to Content Manager… You can close this window if it does not close automatically.</p>
  <script>
    (function () {
      var payload = ${serialized};
      var baseUrl = ${baseUrl};
      var provider = 'github';
      var sent = false;

      function sendResult(origin) {
        if (sent || !window.opener) return;
        sent = true;
        window.opener.postMessage(
          'authorization:' + provider + ':${status}:' + JSON.stringify(payload),
          origin
        );
        window.removeEventListener('message', onMessage, false);
        window.close();
      }

      function onMessage(e) {
        // CMS echoes "authorizing:github" after verifying e.origin === base_url.
        if (e.source === window.opener && e.data === 'authorizing:' + provider) {
          sendResult(e.origin);
        }
      }

      window.addEventListener('message', onMessage, false);

      if (!window.opener) {
        document.getElementById('status').textContent =
          'Could not connect to Content Manager. Close this window and try logging in again from /admin.';
        return;
      }

      window.opener.postMessage('authorizing:' + provider, baseUrl || '*');
    })();
  </script>
</body>
</html>`;
}
