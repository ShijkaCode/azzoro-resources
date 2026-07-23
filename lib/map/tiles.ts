const DEFAULT_STYLE = 'topo-v2';

// OSM raster style served locally. Used when there's no MapTiler key AND as a
// runtime fallback when a present key is rejected (403 domain restriction,
// 429 quota, expired key, network failure) — see isMapTilerLoadError below.
export const MAP_FALLBACK_STYLE = '/api/map-fallback-style';

export function getMapStyleUrl(styleName: string = DEFAULT_STYLE) {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (key) {
    return `https://api.maptiler.com/maps/${styleName}/style.json?key=${key}`;
  }

  return MAP_FALLBACK_STYLE;
}

// True when a MapLibre `error` event was caused by a failed MapTiler request
// (rejected key, quota, network). Lets a map swap to MAP_FALLBACK_STYLE instead
// of rendering a blank container. The event's `error` may be a maplibre
// AJAXError (carrying `status` + `url`) or a plain fetch failure.
export function isMapTilerLoadError(event: unknown): boolean {
  const error = (event as { error?: unknown } | undefined)?.error as
    | { status?: number; url?: string; message?: string }
    | undefined;
  if (!error) return false;
  const url = error.url ?? '';
  const message = error.message ?? '';
  return url.includes('api.maptiler.com') || message.includes('api.maptiler.com');
}

export function isUsingFallback() {
  return !process.env.NEXT_PUBLIC_MAPTILER_KEY;
}

// MapTiler Terrain-RGB tiles for 3D terrain / hillshade. Null when no key (fallback style).
export function getTerrainTilesUrl() {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  return key ? `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${key}` : null;
}