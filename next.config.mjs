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
};

export default withBundleAnalyzer(withNextIntl(nextConfig));