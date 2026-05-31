import type { Metadata } from 'next';
import { MediaImage as Image } from '@/components/shared/MediaImage';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import { EsgGallery } from '@/components/esg/EsgGallery';
import type { EsgContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  return buildPageMetadata({
    title: locale === 'mn' ? 'Тогтвортой байдал' : 'ESG',
    description: esg.reports_intro,
    locale,
    path: '/esg',
  });
}

export default async function EsgPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  const labels =
    locale === 'mn'
      ? {
          eyebrow: 'Тогтвортой байдал',
          title: 'Хариуцлагатай хайгуул, орон нутагтайгаа хамт.',
          environment: 'Байгаль орчин',
          community: 'Орон нутгийн оролцоо',
          governance: 'Засаглал',
          reports: 'Тайлан ба нээлттэй мэдээлэл',
          gallery: 'Хээрээс',
        }
      : {
          eyebrow: 'Sustainability',
          title: 'Exploring responsibly, alongside our communities.',
          environment: 'Environment',
          community: 'Community',
          governance: 'Governance',
          reports: 'Reports & disclosures',
          gallery: 'From the field',
        };

  const pillars = [
    { number: '01', label: labels.environment, body: esg.environment.body, image: esg.environment.image },
    { number: '02', label: labels.community, body: esg.community.body, image: esg.community.image },
    ...(esg.governance
      ? [{ number: '03', label: labels.governance, body: esg.governance.body, image: esg.governance.image }]
      : []),
  ];

  const galleryItems = (esg.gallery ?? []).filter((item) => item.image);

  return (
    <main id="main-content">
      <section className="relative -mt-24 flex min-h-[60vh] w-full flex-col justify-end overflow-hidden bg-ink text-white">
        {esg.hero_image ? (
          <Image src={esg.hero_image} alt="" fill priority className="object-cover" sizes="100vw" />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--eco)/0.85)] via-black/45 to-black/20" />
        <div className="relative px-6 pb-14 pt-36 sm:px-10 lg:px-16">
          <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/75">{labels.eyebrow}</p>
          <h1 className="mt-5 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {esg.hero_headline || labels.title}
          </h1>
        </div>
      </section>

      <section className="bg-[hsl(var(--eco-paper))] px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="border-t-2 border-[hsl(var(--eco))] pt-8">
          <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-[hsl(var(--eco))]">{labels.eyebrow}</p>
          <MarkdownBody className="mt-6 max-w-[64ch] prose-p:text-lg prose-p:text-ink/80">{esg.approach_body}</MarkdownBody>
        </div>
      </section>

      {pillars.map((pillar, idx) => {
        const imageRight = idx % 2 === 1;
        return (
          <section key={pillar.number} className="bg-[hsl(var(--eco-paper))]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className={`group relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[34rem] ${imageRight ? 'lg:order-2' : ''}`}>
                {pillar.image ? (
                  <Image
                    src={pillar.image}
                    alt={pillar.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              <div className={`flex flex-col justify-center border-rule px-6 py-16 sm:px-10 lg:px-16 ${imageRight ? 'lg:border-r' : 'lg:border-l'}`}>
                <div className="flex items-baseline gap-4">
                  <span className="num-display text-3xl font-medium leading-none text-[hsl(var(--eco))]">{pillar.number}</span>
                  <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-[hsl(var(--eco))]">{pillar.label}</p>
                </div>
                <MarkdownBody className="mt-7 max-w-[48ch]">{pillar.body}</MarkdownBody>
              </div>
            </div>
          </section>
        );
      })}

      <EsgGallery items={galleryItems} heading={labels.gallery} />

      <section className="bg-ink text-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{labels.reports}</p>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-white/75">{esg.reports_intro}</p>
      </section>
    </main>
  );
}