import Link from 'next/link';
import { fetchInvestorNews } from '@/lib/news/fetch';
import type { Locale } from '@/lib/i18n/config';

type LatestNewsSectionProps = {
  investorPortalUrl: string;
  locale: Locale;
};

export async function LatestNewsSection({ investorPortalUrl, locale }: LatestNewsSectionProps) {
  const items = await fetchInvestorNews(4);
  const labels =
    locale === 'mn'
      ? {
          eyebrow: 'Хамгийн сүүлийн мэдээ',
          headline: 'Хөрөнгө оруулагчийн шинэчлэлтүүд',
          body: 'Албан ёсны мэдээ, зах зээлийн шинэчлэлтийг хөрөнгө оруулагчийн порталаар тогтмол нийтэлдэг.',
          fallback: 'Албан ёсны мэдээ, ASX мэдэгдлүүдийг хөрөнгө оруулагчийн порталаар нийтэлдэг.',
          cta: 'Бүх мэдээг үзэх',
          read: 'Унших',
        }
      : {
          eyebrow: 'Latest news',
          headline: 'Investor updates',
          body: 'Official releases and market updates are published regularly through the investor portal.',
          fallback: 'Official releases and ASX announcements are published through the investor portal.',
          cta: 'View all releases',
          read: 'Read',
        };

  const hasItems = items.length > 0;

  return (
    <section className="bg-paper text-ink">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker">{labels.eyebrow}</p>
            <h2 className="mt-6 max-w-[18ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {labels.headline}
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">
              {hasItems ? labels.body : labels.fallback}
            </p>
          </div>
          <a
            href={investorPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="cta-link"
          >
            {labels.cta}
            <span aria-hidden="true" className="cta-arrow">↗</span>
          </a>
        </div>

        {hasItems ? (
          <ul className="mt-14 border-b border-rule lg:mt-16">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-1 gap-x-10 gap-y-3 border-t border-rule py-8 transition-colors hover:bg-ink/[0.025] sm:py-9 lg:grid-cols-[12rem_1fr_auto]"
                >
                  <p className="num-tabular text-[12px] font-medium uppercase tracking-[0.28em] text-muted-ink lg:pt-2">
                    {new Date(item.publishedAt).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-medium leading-snug text-ink transition-colors sm:text-2xl">
                      {item.title}
                    </h3>
                    {item.summary ? (
                      <p className="mt-3 line-clamp-2 max-w-[64ch] text-[14px] leading-relaxed text-ink/65 sm:text-[15px]">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-[12px] font-medium uppercase tracking-[0.28em] text-ink/40 transition-all group-hover:translate-x-1 group-hover:text-[hsl(var(--copper))] lg:pt-2"
                  >
                    {labels.read} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
