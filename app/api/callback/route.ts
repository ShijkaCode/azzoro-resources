import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');
  const stateCookie = req.cookies.get('oauth_state')?.value;

  if (!code) return errorPage('Missing authorization code in callback.');
  if (!stateParam || !stateCookie || stateParam !== stateCookie) {
    return errorPage('OAuth state mismatch (possible CSRF or expired session).');
  }

  const clientId = process.env.GITHUB_APP_CLIENT_ID;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return errorPage('GITHUB_APP_CLIENT_ID or GITHUB_APP_CLIENT_SECRET env var is not set.');
  }

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (tokenData.error || !tokenData.access_token) {
    return errorPage(
      `GitHub token exchange failed: ${tokenData.error ?? 'no token returned'}${
        tokenData.error_description ? ' — ' + tokenData.error_description : ''
      }`,
    );
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Authenticating…</title></head>
<body>
<p>Completing sign-in… you can close this window if it doesn't close automatically.</p>
<script>
(function () {
  var message = 'authorization:github:success:' + ${JSON.stringify(payload)};
  if (window.opener) {
    window.opener.postMessage(message, '*');
    setTimeout(function () { window.close(); }, 200);
  } else {
    document.body.innerText = 'No opener window — copy this token manually: ' + ${JSON.stringify(tokenData.access_token)};
  }
})();
</script>
</body>
</html>`;

  const response = new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
  response.cookies.delete('oauth_state');
  return response;
}

function errorPage(message: string): NextResponse {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Sign-in error</title></head>
<body><h1>Sign-in error</h1><pre>${escapeHtml(message)}</pre></body></html>`;
  return new NextResponse(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
