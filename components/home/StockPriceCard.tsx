import { fetchStockSnapshot } from '@/lib/stock/fetch';
import type { Locale } from '@/lib/i18n/config';

// Corporate figures sourced from the investor presentation dated 12 Feb 2026.
// TODO — client to confirm cadence for updating these; hardcoded per current decision.
const SNAPSHOT_KPIS: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: 'A$21.3M', label: 'Market capitalisation' },
    { value: 'A$6.0M', label: 'Cash (31 Dec 2025)' },
    { value: '820.7M', label: 'Shares on issue (CDIs)' },
    { value: '409.6M', label: 'Options' },
    { value: '47.7%', label: 'Held by board + top 20' },
    { value: 'A$0.026', label: 'Share price (12 Feb 2026)' },
  ],
  mn: [
    { value: 'A$21.3 сая', label: 'Зах зээлийн үнэлгээ' },
    { value: 'A$6.0 сая', label: 'Бэлэн мөнгө (2025.12.31)' },
    { value: '820.7 сая', label: 'Гаргасан хувьцаа (CDI)' },
    { value: '409.6 сая', label: 'Опшн' },
    { value: '47.7%', label: 'Удирдлага + топ 20 эзэмшил' },
    { value: 'A$0.026', label: 'Хувьцааны үнэ (2026.02.12)' },
  ],
};

const T = {
  en: {
    eyebrow: 'Investor snapshot',
    headline: 'A tightly held junior, listed on the ASX.',
    livePrice: 'Live price',
    asOf: 'As of',
    portal: 'View on investor portal',
    footnote:
      'Corporate figures as at the investor presentation dated 12 February 2026 and are subject to change. For current information refer to the ASX platform and asianbatterymetals.com.',
  },
  mn: {
    eyebrow: 'Хөрөнгө оруулагчийн тойм',
    headline: 'ASX-д бүртгэлтэй, цөөн хүн эзэмшсэн жуниор компани.',
    livePrice: 'Бодит үнэ',
    asOf: 'Шинэчилсэн',
    portal: 'Хөрөнгө оруулагчийн порталд харах',
    footnote:
      '2026 оны 2 дугаар сарын 12-ны өдрийн хөрөнгө оруулагчийн танилцуулга дахь компанийн үзүүлэлтүүд бөгөөд өөрчлөгдөж болзошгүй. Шинэ мэдээллийг ASX платформ болон asianbatterymetals.com-оос үзнэ үү.',
  },
} as const;

export async function StockPriceCard({
  investorPortalUrl,
  liveEnabled,
  locale,
}: {
  investorPortalUrl: string;
  liveEnabled: boolean;
  locale: Locale;
}) {
  const snapshot = liveEnabled ? await fetchStockSnapshot() : null;
  const copy = T[locale] ?? T.en;
  const kpis = SNAPSHOT_KPIS[locale] ?? SNAPSHOT_KPIS.en;
  const up = snapshot ? snapshot.change >= 0 : false;

  return (
    <section className="bg-ink text-white">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{copy.eyebrow}</p>
            <h2 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {copy.headline}
            </h2>
          </div>
          <a
            href={investorPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-3 border-b border-white/40 pb-1 text-[12px] font-medium uppercase tracking-[0.32em] text-white transition-colors hover:border-white"
          >
            {copy.portal}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {snapshot ? (
          <div className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-white/15 pt-8 lg:mt-16">
            <span className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{snapshot.ticker}</span>
            <span className="num-display text-4xl font-medium leading-none text-white sm:text-5xl">
              {snapshot.price.toFixed(3)}
            </span>
            <span className="text-sm text-white/55">{snapshot.currency}</span>
            <span className={`num-tabular text-sm font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
              {up ? '+' : ''}
              {snapshot.change.toFixed(3)} ({snapshot.changePercent.toFixed(2)}%)
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
              {copy.livePrice} · {copy.asOf} {new Date(snapshot.asOf).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU')}
            </span>
          </div>
        ) : null}

        <dl className={`grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/15 pt-12 md:grid-cols-3 lg:gap-x-12 ${snapshot ? 'mt-12' : 'mt-14 lg:mt-16'}`}>
          {kpis.map((kpi) => (
            <div key={kpi.label}>
              <dt className="num-display text-4xl font-medium leading-none text-white sm:text-5xl lg:text-[3.5rem]">{kpi.value}</dt>
              <dd className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{kpi.label}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-14 max-w-prose text-[11px] leading-relaxed text-white/45 lg:mt-16">{copy.footnote}</p>
      </div>
    </section>
  );
}
