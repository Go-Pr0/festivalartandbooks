import { cmsCallbackUrl, cmsSiteUrl, missingConfigResponse } from './_cms-oauth.mjs';

export const handler = async () => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId || !cmsSiteUrl()) {
    return missingConfigResponse();
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: cmsCallbackUrl(),
    scope: 'repo,user',
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Cache-Control': 'no-store',
    },
  };
};
