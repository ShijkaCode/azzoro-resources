import 'server-only';

export type StockSnapshot = {
  ticker: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  asOf: string;
};

const ticker = process.env.STOCK_TICKER_FALLBACK ?? 'ABM.L';

export async function fetchStockSnapshot(): Promise<StockSnapshot | null> {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`;

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
    const quote = json?.quoteResponse?.result?.[0];

    if (!quote) {
      return null;
    }

    return {
      ticker: quote.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      asOf: new Date(quote.regularMarketTime * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}