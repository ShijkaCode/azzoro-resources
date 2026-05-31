import { fetchStockSnapshot } from '@/lib/stock/fetch';
import { formatChange, formatMarketCap, formatPrice } from '@/lib/stock/format';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

type HeroProps = {
  locale: Locale;
  hero: HomeContent['hero'];
  metrics: HomeContent['metrics'];
  liveEnabled: boolean;
  ticker?: string;
};

// Fallbacks if the CMS fields are left blank — the specific links the client requested.
const FALLBACK_ASX_URL = 'https://www.asx.com.au/markets/company/AZ9';
const FALLBACK_ANNOUNCEMENTS_URL = 'https://investors.asianbatterymetals.com/announcements';
const FALLBACK_PRESENTATION_URL =
  'https://investors.asianbatterymetals.com/announcement-detail/Corporate%20Presentation-OTc5OA==';

const COPY: Record<Locale, { livePrice: string; marketCap: string; announcementsEyebrow: string; investors: string; latestAnnouncements: string; corporatePresentation: string }> = {
  en: {
    livePrice: 'Share price',
    marketCap: 'Market capitalisation',
    announcementsEyebrow: 'ASX Announcements',
    investors: 'Investors',
    latestAnnouncements: 'Latest announcements',
    corporatePresentation: 'Corporate Presentation',
  },
  mn: {
    // TODO — client to verify Mongolian copy
    livePrice: 'Бодит үнэ',
    marketCap: 'Зах зээлийн үнэлгээ',
    announcementsEyebrow: 'ASX Announcements',
    investors: 'Хөрөнгө оруулагч',
    latestAnnouncements: 'Сүүлийн мэдэгдлүүд',
    corporatePresentation: 'Компанийн танилцуулга',
  },
};

const CELL_BASE =
  'group relative flex items-start gap-4 px-6 py-7 transition hover:bg-white/[0.05] sm:px-10 sm:py-9 lg:px-16';
const DIVIDER = 'border-b border-white/15 md:border-b-0 md:border-r';
const EYEBROW = 'text-[11px] font-medium uppercase tracking-[0.32em] text-white/55';
const TITLE = 'num-display text-xl font-medium leading-tight sm:text-2xl lg:text-3xl';
const ARROW = (
  <span
    aria-hidden="true"
    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 transition group-hover:translate-x-1 sm:right-10 lg:right-12"
  >
    ↗
  </span>
);

export default async function HeroSection({ locale, hero, liveEnabled, ticker }: HeroProps) {
  const copy = COPY[locale] ?? COPY.en;
  const snapshot = liveEnabled ? await fetchStockSnapshot(ticker) : null;
  const asxUrl = hero.asx_url || FALLBACK_ASX_URL;
  const announcementsUrl = hero.announcements_url || FALLBACK_ANNOUNCEMENTS_URL;
  const presentationUrl = hero.presentation_url || FALLBACK_PRESENTATION_URL;

  return (
    <section className="relative -mt-24 flex min-h-[88vh] w-full flex-col overflow-hidden bg-[hsl(var(--ink))] text-white md:min-h-[85vh]">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/uploads/hero-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/uploads/drone/hero_drone.MP4" type="video/mp4" />
        <source src="/videos/hero-720.mp4" type="video/mp4" />
      </video>

      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

      <div className="relative flex flex-1 flex-col justify-end px-6 pb-10 pt-28 sm:px-10 sm:pb-14 sm:pt-36 lg:px-16 lg:pb-16">
        {hero.kicker ? <p className={EYEBROW}>{hero.kicker}</p> : null}
        <h1 className="mt-5 max-w-[22ch] font-display text-balance text-[2.5rem] font-medium leading-[0.98] tracking-[-0.015em] sm:mt-7 sm:text-[3.5rem] sm:leading-[0.96] lg:text-[5rem] xl:text-[6rem] xl:leading-[0.95]">
          {hero.headline}
        </h1>
        {hero.subline ? (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:mt-8 sm:text-lg">{hero.subline}</p>
        ) : null}
      </div>

      <div className="relative grid grid-cols-1 border-t border-white/15 md:grid-cols-3">
        {/* Tile 1 — live price + market capitalisation → ASX company page */}
        <a href={asxUrl} target="_blank" rel="noreferrer" className={`${CELL_BASE} ${DIVIDER}`}>
          <div className="flex flex-1 flex-wrap items-start gap-x-10 gap-y-5 pr-10">
            <div className="flex flex-col gap-2">
              <span className={EYEBROW}>
                {copy.livePrice}
                {snapshot ? ` · ${snapshot.ticker}` : ''}
              </span>
              <span className={TITLE}>{snapshot ? formatPrice(snapshot.price) : '—'}</span>
              {snapshot ? (
                <span
                  className={`num-tabular text-sm font-medium ${snapshot.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {formatChange(snapshot.change, snapshot.changePercent)}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <span className={EYEBROW}>{copy.marketCap}</span>
              <span className={TITLE}>{snapshot?.marketCap != null ? formatMarketCap(snapshot.marketCap) : '—'}</span>
            </div>
          </div>
          {ARROW}
        </a>

        {/* Tile 2 — corporate presentation */}
        <a href={presentationUrl} target="_blank" rel="noreferrer" className={`${CELL_BASE} ${DIVIDER}`}>
          <div className="flex flex-1 flex-col gap-2 pr-10 sm:gap-3">
            <span className={EYEBROW}>{copy.investors}</span>
            <span className={TITLE}>{copy.corporatePresentation}</span>
          </div>
          {ARROW}
        </a>

        {/* Tile 3 — latest announcements */}
        <a href={announcementsUrl} target="_blank" rel="noreferrer" className={CELL_BASE}>
          <div className="flex flex-1 flex-col gap-2 pr-10 sm:gap-3">
            <span className={EYEBROW}>{copy.announcementsEyebrow}</span>
            <span className={TITLE}>{copy.latestAnnouncements}</span>
          </div>
          {ARROW}
        </a>
      </div>
    </section>
  );
}
