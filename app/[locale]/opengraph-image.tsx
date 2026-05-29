import { ImageResponse } from 'next/og';
import { ShareCard, ogSize, loadOgFonts, loadLogomark } from '@/lib/og/share-card';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Azzoro Resources';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com';

export default async function Image({ params }: { params: { locale: string } }) {
  const isMn = params.locale === 'mn';
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadLogomark()]);

  return new ImageResponse(
    (
      <ShareCard
        bg={`${SITE_URL}/uploads/hero-poster.jpg`}
        logo={logo}
        eyebrow={isMn ? 'Монгол · Эрдэс баялаг' : 'Mongolia · Critical Minerals'}
        title={isMn ? 'Аззоро Ресорсэс' : 'Azzoro Resources'}
        caption={
          isMn
            ? 'Төв Азийн орогенийн бүс дэх зэс-никель-PGE хайгуул, нээлт.'
            : 'Copper-nickel-PGE exploration and discovery in the Central Asian Orogenic Belt.'
        }
      />
    ),
    { ...size, fonts }
  );
}
