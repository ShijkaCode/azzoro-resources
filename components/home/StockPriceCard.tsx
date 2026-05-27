import { fetchStockSnapshot } from '@/lib/stock/fetch';

export async function StockPriceCard({
  investorPortalUrl,
  liveEnabled,
  locale,
}: {
  investorPortalUrl: string;
  liveEnabled: boolean;
  locale: 'en' | 'mn';
}) {
  const snapshot = liveEnabled ? await fetchStockSnapshot() : null;

  const labels =
    locale === 'mn'
      ? {
          kicker: 'Хувьцаа',
          fallback: 'Investor portal дээрх бодит үнийг харах ↗',
          portal: 'Investor portal дээр харах ↗',
          asOf: 'Шинэчилсэн огноо',
        }
      : {
          kicker: 'Stock',
          fallback: 'View live price on investor portal ↗',
          portal: 'View on investor portal ↗',
          asOf: 'As of',
        };

  if (!snapshot) {
    return (
      <section className="container-wide py-12">
        <a
          href={investorPortalUrl}
          target="_blank"
          rel="noreferrer"
          className="block max-w-md rounded-[1.5rem] border border-border bg-background p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.16)] transition hover:border-primary"
        >
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{labels.kicker}</div>
          <div className="mt-3 text-lg font-semibold">{labels.fallback}</div>
        </a>
      </section>
    );
  }

  const up = snapshot.change >= 0;

  return (
    <section className="container-wide py-12">
      <a
        href={investorPortalUrl}
        target="_blank"
        rel="noreferrer"
        className="block max-w-md rounded-[1.5rem] border border-border bg-background p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.16)] transition hover:border-primary"
      >
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{snapshot.ticker}</div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-semibold">{snapshot.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">{snapshot.currency}</span>
        </div>
        <div className={`mt-2 text-sm font-semibold ${up ? 'text-emerald-600' : 'text-red-600'}`}>
          {up ? '+' : ''}
          {snapshot.change.toFixed(2)} ({snapshot.changePercent.toFixed(2)}%)
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {labels.asOf} {new Date(snapshot.asOf).toLocaleString(locale === 'mn' ? 'mn-MN' : 'en-AU')}
        </div>
        <div className="mt-4 text-sm font-semibold text-primary">{labels.portal}</div>
      </a>
    </section>
  );
}