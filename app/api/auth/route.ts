import { NextRequest, NextResponse } from 'next/server';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const provider = url.searchParams.get('provider');
  const scope = url.searchParams.get('scope') ?? 'repo,user';

  if (provider !== 'github') {
    return new NextResponse(`Unsupported provider: ${provider ?? '(none)'}`, { status: 400 });
  }

  const clientId = process.env.GITHUB_APP_CLIENT_ID;
  if (!clientId) {
    return new NextResponse('GITHUB_APP_CLIENT_ID env var is not set', { status: 500 });
  }

  const callbackUrl = `${url.origin}/api/callback`;
  const state = crypto.randomUUID();

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
  authorizeUrl.searchParams.set('scope', scope);
  authorizeUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return response;
}
