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
      var provider = 'github';
      var sent = false;
      var resultMessage = 'authorization:' + provider + ':${status}:' + JSON.stringify(payload);
      var channel = typeof BroadcastChannel !== 'undefined'
        ? new BroadcastChannel('fab-decap-oauth')
        : null;

      function broadcastResult() {
        if (!channel) return;
        channel.postMessage({ type: 'oauth-result', status: '${status}', content: payload });
        channel.close();
      }

      function finish(origin, useBroadcast) {
        if (sent) return;
        sent = true;
        if (useBroadcast) broadcastResult();
        if (window.opener) {
          window.opener.postMessage(resultMessage, origin);
        }
        window.removeEventListener('message', onMessage, false);
        window.close();
      }

      function onMessage(e) {
        // Match vencax/netlify-cms-github-oauth-provider: any opener reply completes the handshake.
        if (window.opener && e.source === window.opener) {
          finish(e.origin, false);
        }
      }

      window.addEventListener('message', onMessage, false);

      if (window.opener) {
        window.opener.postMessage('authorizing:' + provider, '*');
        // If postMessage is broken after the GitHub redirect (COOP), BroadcastChannel still delivers the token.
        setTimeout(function () {
          if (!sent) finish(window.location.origin, true);
        }, 3000);
        return;
      }

      broadcastResult();
      document.getElementById('status').textContent =
        'Signed in — returning to Content Manager… You can close this window.';
      setTimeout(function () { window.close(); }, 1500);
    })();
  </script>
</body>
</html>`;
}
