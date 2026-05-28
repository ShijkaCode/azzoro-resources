import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '**.cloudflarestream.com' },
      { protocol: 'https', hostname: 'api.maptiler.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/about', destination: '/en/about', permanent: true },
      { source: '/projects', destination: '/en/projects', permanent: true },
      { source: '/our-team', destination: '/en/about', permanent: true },
      { source: '/sustainability', destination: '/en/esg', permanent: true },
      { source: '/contact', destination: '/en/contact', permanent: true },
    ];
  },
  async headers() {
    // OAuth popup flow for Sveltia /admin needs the opener page to permit
    // postMessage / window.closed polling from its popup. Default strict
    // Cross-Origin-Opener-Policy blocks both, which manifests as sign-in
    // succeeding on GitHub but Sveltia never receiving the token.
    //
    // The callback page uses unsafe-none because the popup navigates cross-
    // origin (to github.com) and back — same-origin-allow-popups isn't always
    // enough to re-join the opener's BCG after a cross-origin trip.
    const allowPopups = { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' };
    const noCoop = { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' };
    return [
      { source: '/admin', headers: [allowPopups] },
      { source: '/admin/', headers: [allowPopups] },
      { source: '/admin/:path*', headers: [allowPopups] },
      { source: '/api/auth', headers: [allowPopups] },
      { source: '/api/callback', headers: [noCoop] },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));