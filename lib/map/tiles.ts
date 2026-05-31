const DEFAULT_STYLE = 'topo-v2';

export function getMapStyleUrl(styleName: string = DEFAULT_STYLE) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (key) {
    return `https://api.maptiler.com/maps/${styleName}/style.json?key=${key}`;
  }

  return '/api/map-fallback-style';
}

export function isUsingFallback() {
  return !process.env.NEXT_PUBLIC_MAPTILER_KEY;
}

// MapTiler Terrain-RGB tiles for 3D terrain / hillshade. Null when no key (fallback style).
export function getTerrainTilesUrl() {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  return key ? `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}` : null;
}