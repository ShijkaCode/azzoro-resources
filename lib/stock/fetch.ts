import 'server-only';

export type StockSnapshot = {
  ticker: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  marketCap?: number;
  asOf: string;
};

const DEFAULT_TICKER = process.env.STOCK_TICKER_FALLBACK ?? 'AZ9';
// Public access token embedded in the asx.com.au front end. Override via env if it ever rotates.
const ASX_API_TOKEN = process.env.ASX_API_TOKEN ?? '83ff96335c2d45a094df02a206a39ff4';

/**
 * Live snapshot for an ASX-listed security.
 * Primary source is the ASX MarkitDigital JSON feed (the same data behind
 * asx.com.au) which provides last price, change and market cap in one call.
 * Falls back to Yahoo Finance for price/change (no market cap) if ASX fails.
 */
export async function fetchStockSnapshot(ticker: string = DEFAULT_TICKER): Promise<StockSnapshot | null> {
  const asxSymbol = ticker.replace(/\.AX$/i, '').toUpperCase();
  return (await fetchFromAsx(asxSymbol)) ?? (await fetchFromYahoo(asxSymbol));
}

async function fetchFromAsx(symbol: string): Promise<StockSnapshot | null> {
  const url = `https://asx.api.markitdigital.com/asx-research/1.0/companies/${encodeURIComponent(
    symbol
  )}/header?access_token=${ASX_API_TOKEN}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'azzororesources.com bot (contact: tech@azzororesources.com)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    const data = json?.data;

    if (!data || typeof data.priceLast !== 'number') {
      return null;
    }

    return {
      ticker: data.symbol ?? symbol,
      price: data.priceLast,
      currency: 'AUD',
      change: typeof data.priceChange === 'number' ? data.priceChange : 0,
      changePercent: typeof data.priceChangePercent === 'number' ? data.priceChangePercent : 0,
      marketCap: typeof data.marketCap === 'number' ? data.marketCap : undefined,
      asOf: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fetchFromYahoo(symbol: string): Promise<StockSnapshot | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}.AX?interval=1d&range=1d`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; azzororesources.com bot; contact: tech@azzororesources.com)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    const meta = json?.chart?.result?.[0]?.meta;

    if (!meta || typeof meta.regularMarketPrice !== 'number') {
      return null;
    }

    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPrice;
    const change = meta.regularMarketPrice - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;

    return {
      ticker: (meta.symbol ?? `${symbol}.AX`).replace(/\.AX$/i, ''),
      price: meta.regularMarketPrice,
      currency: meta.currency ?? 'AUD',
      change,
      changePercent,
      asOf: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
