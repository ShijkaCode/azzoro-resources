'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapType } from 'maplibre-gl';
import { getMapStyleUrl, isMapTilerLoadError, MAP_FALLBACK_STYLE } from '@/lib/map/tiles';

// Small non-interactive location map for an office card. Uses the same vector
// tile setup as the projects map (the Static Maps API isn't on the plan).
export function OfficeMap({ lng, lat, label }: { lng: number; lat: number; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapType | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let cleanup = () => {};

    void import('maplibre-gl').then((module) => {
      if (cancelled || !containerRef.current) return;
      const maplibregl = module.default;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getMapStyleUrl('dataviz-dark'),
        center: [lng, lat],
        zoom: 13,
        attributionControl: false,
        interactive: false,
      });
      mapRef.current = map;

      // Fall back to the local OSM raster style if the MapTiler key is rejected
      // (403 domain restriction, quota, expired key) so the card still shows a map.
      let usedFallback = false;
      map.on('error', (event) => {
        if (usedFallback || !isMapTilerLoadError(event)) return;
        usedFallback = true;
        map.setStyle(MAP_FALLBACK_STYLE);
      });

      const pin = document.createElement('div');
      pin.style.cssText =
        'width:14px;height:14px;border-radius:9999px;background:hsl(var(--copper));border:2px solid #fff;box-shadow:0 0 0 4px rgba(0,0,0,0.25);';
      new maplibregl.Marker({ element: pin }).setLngLat([lng, lat]).addTo(map);

      cleanup = () => {
        map.remove();
        mapRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [lng, lat]);

  return <div ref={containerRef} aria-label={`Map of ${label}`} role="img" className="h-full w-full" />;
}

export default OfficeMap;
