import { fetchStockSnapshot } from '@/lib/stock/fetch';
import { formatChange, formatMarketCap } from '@/lib/stock/format';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

const T = {
  en: {
    eyebrow: 'Investor snapshot',
    headline: 'A tightly held junior, listed on the ASX.',
    livePrice: 'Share price',
    asOf: 'As of',
    delayed: 'may be delayed up to 20 min',
    marketCap: 'Market capitalisation',
    portal: 'View on investor portal',
    footnote:
      'Share price and market capitalisation are sourced from the ASX and may be delayed by up to 20 minutes. For current information refer to the ASX platform and asianbatterymetals.com.',
  },
  mn: {
    eyebrow: 'Хөрөнгө оруулагчийн тойм',
    headline: 'ASX-д бүртгэлтэй, цөөн хүн эзэмшсэн жуниор компани.',
    livePrice: 'Бодит үнэ',
    asOf: 'Шинэчилсэн',
    delayed: '20 хүртэлх минутаар хоцорч болзошгүй',
    marketCap: 'Зах зээлийн үнэлгээ',
    portal: 'Хөрөнгө оруулагчийн порталд харах',
    footnote:
      'Хувьцааны бодит үнэ болон зах зээлийн үнэлгээг ASX-аас авах бөгөөд 20 хүртэлх минутаар хоцорч болзошгүй. Шинэ мэдээллийг ASX платформ болон asianbatterymetals.com-оос үзнэ үү.',
  },
} as const;

export async function StockPriceCard({
  investorPortalUrl,
  liveEnabled,
  locale,
  ticker,
  content,
}: {
  investorPortalUrl: string;
  liveEnabled: boolean;
  locale: Locale;
  ticker?: string;
  content?: HomeContent['investor_snapshot'];
}) {
  const snapshot = liveEnabled ? await fetchStockSnapshot(ticker) : null;
  const copy = T[locale] ?? T.en;

  const eyebrow = content?.eyebrow || copy.eyebrow;
  const headline = content?.headline || copy.headline;
  const footnote = content?.footnote || copy.footnote;
  const manualKpis = content?.kpis ?? [];

  const up = snapshot ? snapshot.change >= 0 : false;

  // Market cap is live; it leads the figures grid when available.
  const kpis = [
    ...(snapshot?.marketCap != null
      ? [{ value: formatMarketCap(snapshot.marketCap), label: copy.marketCap, live: true }]
      : []),
    ...manualKpis.map((kpi) => ({ ...kpi, live: false })),
  ];

  return (
    <section className="bg-primary text-white">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker kicker-invert">{eyebrow}</p>
            <h2 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {headline}
            </h2>
          </div>
          <a
            href={investorPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="cta-link cta-link-invert"
          >
            {copy.portal}
            <span aria-hidden="true" className="cta-arrow">↗</span>
          </a>
        </div>

        {snapshot ? (
          <div className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-white/15 pt-8 lg:mt-16">
            <span className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/55">{snapshot.ticker}</span>
            <span className="num-display text-4xl font-medium leading-none text-white sm:text-5xl">
              A${snapshot.price.toFixed(3)}
            </span>
            <span className={`num-tabular text-sm font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatChange(snapshot.change, snapshot.changePercent)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              {copy.livePrice} · {copy.asOf}{' '}
              {new Date(snapshot.asOf).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU')} · {copy.delayed}
            </span>
          </div>
        ) : null}

        {kpis.length > 0 ? (
          <dl
            className={`grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/15 pt-12 md:grid-cols-3 lg:gap-x-12 ${
              snapshot ? 'mt-12' : 'mt-14 lg:mt-16'
            }`}
          >
            {kpis.map((kpi) => (
              <div key={kpi.label}>
                <dt className="num-display text-4xl font-medium leading-none text-white sm:text-5xl lg:text-[3.5rem]">
                  {kpi.value}
                </dt>
                <dd className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">
                  {kpi.label}
                  {kpi.live ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400/80">
                      <span className="h-1.5 w-1.5 bg-emerald-400" aria-hidden="true" />
                      {copy.livePrice}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <p className="mt-14 max-w-prose text-[11px] leading-relaxed text-white/45 lg:mt-16">{footnote}</p>
      </div>
    </section>
  );
}
