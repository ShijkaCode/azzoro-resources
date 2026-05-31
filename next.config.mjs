import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ship the OG card fonts + logomark into the serverless functions that render
  // the share images (they're read with fs at runtime, not imported).
  experimental: {
    outputFileTracingIncludes: {
      '/[locale]/opengraph-image': ['./lib/og/**'],
      // The project card reads content/*.md at runtime via loadCollection, so
      // the markdown must be traced into this dynamic function too.
      '/[locale]/projects/[slug]/opengraph-image': ['./lib/og/**', './content/**'],
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimized variants rarely change (media is re-deployed, not hot-swapped),
    // so cache them aggressively for fast repeat visits. If an image is ever
    // replaced in place, redeploy or rename to bust.
    minimumCacheTTL: 31536000,
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
      // Raw uploads (hero video + poster, lightbox originals) change rarely;
      // cache hard in the browser so reloads don't re-download them.
      {
        source: '/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));