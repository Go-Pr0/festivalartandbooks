import { cmsSiteUrl, missingConfigResponse } from './_cms-oauth.mjs';

export const handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const origin = cmsSiteUrl();

  if (!clientId || !clientSecret || !origin) {
    return missingConfigResponse();
  }

  const code = event.queryStringParameters?.code;
  if (!code) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Missing authorization code from GitHub.',
    };
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;

  if (!token) {
    const detail = tokenData.error_description || tokenData.error || 'Unknown error';
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: `GitHub OAuth failed: ${detail}`,
    };
  }

  const payload = JSON.stringify({ token, provider: 'github' });
  const message = `authorization:github:success:${payload}`;

  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Signing in…</title>
</head>
<body>
  <p>Signing in to Content Manager… You can close this window if it does not close automatically.</p>
  <script>
    (function () {
      var message = ${JSON.stringify(message)};
      var origin = ${JSON.stringify(origin)};
      if (window.opener) {
        window.opener.postMessage(message, origin);
        window.close();
      }
    })();
  </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body,
  };
};
