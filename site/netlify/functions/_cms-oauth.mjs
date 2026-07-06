/** HTML page that completes the Decap CMS ↔ GitHub OAuth postMessage handshake. */
export function oauthCallbackHtml(status, content) {
  const serialized = JSON.stringify(content);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Signing in…</title>
</head>
<body>
  <p>Signing in to Content Manager… You can close this window if it does not close automatically.</p>
  <script>
    (function () {
      var payload = ${serialized};
      var sent = false;

      function sendSuccess(origin) {
        if (sent || !window.opener) return;
        sent = true;
        window.opener.postMessage(
          'authorization:github:${status}:' + JSON.stringify(payload),
          origin
        );
        window.removeEventListener('message', onMessage, false);
        window.close();
      }

      function onMessage(message) {
        // Decap CMS replies after the popup posts "authorizing:github".
        if (message.source === window.opener) {
          sendSuccess(message.origin);
        }
      }

      window.addEventListener('message', onMessage, false);

      if (window.opener) {
        // Kick off the handshake expected by Decap CMS / netlify-cms-lib-auth.
        window.opener.postMessage('authorizing:github', '*');
      }
    })();
  </script>
</body>
</html>`;
}
