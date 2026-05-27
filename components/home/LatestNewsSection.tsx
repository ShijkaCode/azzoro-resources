import Link from 'next/link';
import { fetchInvestorNews } from '@/lib/news/fetch';
import type { Locale } from '@/lib/i18n/config';

type LatestNewsSectionProps = {
  investorPortalUrl: string;
  locale: Locale;
};

export async function LatestNewsSection({ investorPortalUrl, locale }: LatestNewsSectionProps) {
  const items = await fetchInvestorNews(3);
  const labels =
    locale === 'mn'
      ? {
          kicker: 'Хамгийн сүүлийн мэдээ',
          title: 'Хөрөнгө оруулагчийн шинэчлэлтүүд',
          body: 'Албан ёсны мэдээ, нийтлэл, зах зээлийн шинэчлэлтүүд хөрөнгө оруулагчийн порталд үргэлжлэн нийтлэгдэнэ.',
          cta: 'Бүх мэдээг үзэх',
          fallback: 'Инвесторын мэдээний feed тохируулагдаагүй байна. Портал дээрх хамгийн сүүлийн нийтлэлүүдийг үзнэ үү.',
        }
      : {
          kicker: 'Latest news',
          title: 'Investor updates',
          body: 'Official releases, market updates, and investor communications continue through the investor portal.',
          cta: 'View all releases',
          fallback: 'The investor news feed is not configured yet. Use the portal for the latest releases.',
        };

  return (
    <section className="container-wide py-8 sm:py-10">
      <div className="surface-card p-8 sm:p-10 lg:p-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">{labels.kicker}</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">{labels.title}</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">{items.length > 0 ? labels.body : labels.fallback}</p>
          </div>
          <Link
            href={investorPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {labels.cta}
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.href} className="rounded-[1.5rem] border border-border bg-background p-6 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.24)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {new Date(item.publishedAt).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground">{item.summary}</p>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex text-sm font-semibold text-primary transition hover:text-primary/80"
                >
                  {labels.cta} →
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}