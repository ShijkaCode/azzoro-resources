// Truncate (not round) to 2 decimals to mirror how asx.com.au displays figures
// (e.g. 19,696,005 → A$19.69M, matching the ASX page rather than rounding to 19.70).
export function truncate2(value: number): string {
  return (Math.trunc(value * 100) / 100).toFixed(2);
}

export function formatMarketCap(value: number): string {
  const millions = value / 1_000_000;
  if (millions >= 1000) {
    return `A$${truncate2(millions / 1000)}B`;
  }
  return `A$${truncate2(millions)}M`;
}

export function formatPrice(value: number): string {
  return `A$${value.toFixed(3)}`;
}

export function formatChange(change: number, changePercent: number): string {
  // Direction is shown by the triangle + colour, so values are absolute (no extra sign).
  const arrow = change >= 0 ? '▲' : '▼';
  return `${arrow} A$${Math.abs(change).toFixed(3)} (${Math.abs(changePercent).toFixed(2)}%)`;
}
