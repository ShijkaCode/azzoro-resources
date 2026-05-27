const MAPTILER_STYLE = 'topo-v2';

export function getMapStyleUrl() {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (key) {
    return `https://api.maptiler.com/maps/${MAPTILER_STYLE}/style.json?key=${key}`;
  }

  return '/api/map-fallback-style';
}

export function isUsingFallback() {
  return !process.env.NEXT_PUBLIC_MAPTILER_KEY;
}