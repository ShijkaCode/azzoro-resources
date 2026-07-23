'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import type { Map as MapType, Popup as PopupType, LngLatBoundsLike } from 'maplibre-gl';
import type { Project } from '@/lib/content/types';
import { primaryCommodityColor } from '@/lib/map/markers';
import { getMapStyleUrl, isMapTilerLoadError, MAP_FALLBACK_STYLE } from '@/lib/map/tiles';

const T = {
  en: {
    eyebrow: 'Portfolio',
    headline: 'Built across Mongolia’s mineral belt.',
    viewAll: 'View all projects',
    overview: 'Overview',
    attribution: '© MapTiler · OpenStreetMap',
  },
  mn: {
    eyebrow: 'Төслүүд',
    headline: 'Монголын ашигт малтмалын бүсэд тархсан.',
    viewAll: 'Бүх төслийг үзэх',
    overview: 'Бүх төсөл',
    attribution: '© MapTiler · OpenStreetMap',
  },
} as const;

const PROJECT_ZOOM: Record<string, number> = {
  yambat: 6.5,
  'copper-ridge': 7,
  'red-hill': 7,
  'khukh-tag': 6,
  'tsagaan-ders': 6,
};
const DEFAULT_ZOOM = 6;

// Whole-country overview (Mongolia bbox + a little margin) — the default + reset view.
const MONGOLIA_BOUNDS: [[number, number], [number, number]] = [
  [87.7, 41.4],
  [120.2, 52.3],
];
const OVERVIEW_PITCH = 0; // top-down (perpendicular) — 3D removed, map stays flat

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function popupHTML(project: Project): string {
  const title = escapeHtml(project.title);
  const meta = escapeHtml(
    [project.commodity.join(' · '), project.region].filter(Boolean).join(' · ')
  );
  // Route local /uploads heroes through Next's image optimizer so the popup
  // loads a ~640px WebP/AVIF variant instead of the full-resolution original
  // (some heroes are multi-MB). CSS backgrounds can't use next/image directly,
  // so we build the /_next/image URL by hand. External URLs are used as-is.
  const rawImage = project.hero_image || '';
  const image = rawImage.startsWith('/')
    ? `/_next/image?url=${encodeURIComponent(rawImage)}&w=640&q=70`
    : rawImage;
  return `
    <div class="project-popup-inner">
      <div class="project-popup-image" style="background-image: url('${image.replace(/'/g, '%27')}')"></div>
      <div class="project-popup-text">
        <p class="project-popup-title">${title}</p>
        <p class="project-popup-meta">${meta}</p>
      </div>
    </div>
  `;
}

export function ProjectsMapPreview({
  projects,
  mainProjects,
  extraListItem,
  showHeading = true,
  showViewAll = true,
}: {
  projects: Project[];
  mainProjects?: Project[];
  extraListItem?: { title: string; meta?: string; href: string };
  showHeading?: boolean;
  showViewAll?: boolean;
}) {
  const listProjects = mainProjects ?? projects;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapType | null>(null);
  const wrapsRef = useRef<Map<string, HTMLElement>>(new Map());
  const popupRef = useRef<PopupType | null>(null);
  const boundsRef = useRef<LngLatBoundsLike | null>(null);
  const locale = useLocale() as keyof typeof T;
  const copy = T[locale] ?? T.en;
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let cleanup = () => {};

    void import('maplibre-gl').then((module) => {
      if (cancelled || !containerRef.current) return;

      const maplibregl = module.default;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getMapStyleUrl('hybrid'),
        center: [104, 47.2],
        zoom: 4,
        pitch: OVERVIEW_PITCH,
        maxPitch: 0,
        attributionControl: false,
        scrollZoom: true,
        dragPan: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        keyboard: false,
      });
      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), 'top-right');

      // Rendered flat / top-down (pitch 0, maxPitch 0). 3D terrain is
      // intentionally NOT enabled: draping the map over a terrain mesh makes
      // MapLibre re-project HTML markers (our pins) a frame behind the tiles,
      // so they visibly lag/drift while panning — badly on mobile. The hybrid
      // satellite style already shows real terrain texture in a flat top-down view.

      // Mongolia outline overlay — crisp national border with a soft halo.
      // Re-added on every style load so it survives a fallback style swap.
      function addOutline() {
        if (!mapRef.current || map.getSource('mn-outline')) return;
        fetch('/geo/mongolia.json')
          .then((response) => response.json())
          .then((geojson) => {
            if (!mapRef.current || map.getSource('mn-outline')) return;
            map.addSource('mn-outline', { type: 'geojson', data: geojson });
            map.addLayer({
              id: 'mn-outline-halo',
              type: 'line',
              source: 'mn-outline',
              paint: { 'line-color': '#ffffff', 'line-width': 5, 'line-opacity': 0.5 },
            });
            map.addLayer({
              id: 'mn-outline-line',
              type: 'line',
              source: 'mn-outline',
              paint: { 'line-color': 'hsl(0, 0%, 100%)', 'line-width': 1, 'line-opacity': 0.9 },
            });
          })
          .catch(() => {});
      }

      map.on('load', addOutline);

      // If the MapTiler style/tiles are rejected (403 domain restriction, quota,
      // expired key) fall back to the local OSM raster style once, so the map
      // still renders instead of leaving a blank container.
      let usedFallback = false;
      map.on('error', (event) => {
        if (usedFallback || !isMapTilerLoadError(event)) return;
        usedFallback = true;
        map.setStyle(MAP_FALLBACK_STYLE);
        map.once('styledata', addOutline);
      });

      projects.forEach((project) => {
        const wrap = document.createElement('div');
        wrap.className = 'project-pin-wrap';
        wrap.dataset.slug = project.slug;
        wrap.style.setProperty('--pin-color', primaryCommodityColor(project.commodity));

        const ring = document.createElement('div');
        ring.className = 'project-pin-ring';

        const dot = document.createElement('div');
        dot.className = 'project-pin-dot';

        wrap.appendChild(ring);
        wrap.appendChild(dot);

        wrap.addEventListener('click', () => {
          setActiveSlug(project.slug);
        });

        wrapsRef.current.set(project.slug, wrap);
        new maplibregl.Marker({ element: wrap }).setLngLat([project.lng, project.lat]).addTo(map);
      });

      // Default to the whole of Mongolia; clicking a project zooms in.
      boundsRef.current = MONGOLIA_BOUNDS;
      map.fitBounds(MONGOLIA_BOUNDS, { padding: 40, duration: 0, pitch: OVERVIEW_PITCH });

      cleanup = () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        map.remove();
        wrapsRef.current.clear();
        mapRef.current = null;
        boundsRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [projects]);

  // Sync pin active state + popup + camera with active project.
  useEffect(() => {
    wrapsRef.current.forEach((wrap, slug) => {
      wrap.classList.toggle('active', slug === activeSlug);
    });

    const map = mapRef.current;
    if (!map) return;

    const active = projects.find((p) => p.slug === activeSlug);

    if (!active) {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      return;
    }

    void import('maplibre-gl').then((module) => {
      const maplibregl = module.default;
      if (popupRef.current) {
        popupRef.current.remove();
      }
      popupRef.current = new maplibregl.Popup({
        offset: 18,
        closeButton: false,
        closeOnClick: false,
        className: 'project-popup',
        maxWidth: 'none',
      })
        .setLngLat([active.lng, active.lat])
        .setHTML(popupHTML(active))
        .addTo(map);

      const zoom = PROJECT_ZOOM[active.slug] ?? DEFAULT_ZOOM;
      map.easeTo({
        center: [active.lng, active.lat],
        zoom,
        pitch: 0,
        duration: 1600,
        essential: true,
      });
    });
  }, [activeSlug, projects]);

  function resetOverview() {
    setActiveSlug(null);
    const map = mapRef.current;
    if (!map || !boundsRef.current) return;
    map.fitBounds(boundsRef.current, { padding: 40, duration: 1200, pitch: OVERVIEW_PITCH, essential: true });
  }

  return (
    <section className="bg-paper text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] lg:h-[calc(100dvh-6rem)]">
        <div className="relative bg-[#e8e5dd]">
          <div ref={containerRef} className="aspect-[4/3] w-full lg:aspect-auto lg:h-full" />

          <button
            type="button"
            onClick={resetOverview}
            className="absolute left-4 top-4 inline-flex items-center gap-2 border border-white/25 bg-black/45 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition-colors hover:border-[hsl(var(--copper))] hover:bg-black/65 sm:left-6 sm:top-6"
          >
            <span aria-hidden="true">←</span>
            {copy.overview}
          </button>

          <p className="absolute bottom-3 right-3 bg-black/45 px-2 py-1 text-[10px] leading-tight text-white/75 sm:bottom-4 sm:right-4">
            {copy.attribution}
          </p>
        </div>

        <div className="flex flex-col border-rule px-6 py-16 sm:px-10 sm:py-20 lg:h-full lg:overflow-y-auto lg:border-l lg:px-12 lg:py-12">
          {showHeading ? (
            <>
              <p className="kicker">{copy.eyebrow}</p>
              <h2 className="mt-6 max-w-[18ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
                {copy.headline}
              </h2>
            </>
          ) : null}

          <ul className={`${showHeading ? 'mt-12' : ''} border-b border-rule`}>
            {listProjects.map((project, idx) => {
              const isActive = project.slug === activeSlug;
              return (
                <li key={project.slug}>
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    onFocus={() => setActiveSlug(project.slug)}
                    className={`group relative grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 border-t border-rule py-6 transition-colors sm:grid-cols-[4rem_1fr_auto] sm:gap-x-8 sm:py-7 ${isActive ? '' : 'hover:bg-ink/[0.025]'}`}
                  >
                    <span className={`num-display text-xl font-medium leading-none transition-colors sm:text-2xl ${isActive ? 'text-[hsl(var(--copper))]' : 'text-muted-ink group-hover:text-[hsl(var(--copper))]'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className={`font-display text-2xl font-medium leading-tight transition-colors sm:text-[1.75rem] ${isActive ? 'text-[hsl(var(--copper))]' : 'text-ink/75 group-hover:text-[hsl(var(--copper))]'}`}>
                        {project.title}
                      </p>
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                        {project.commodity.join(' · ')}
                      </p>
                      {isActive ? (
                        <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-ink/75 sm:text-[15px]">
                          {project.summary}
                        </p>
                      ) : null}
                    </div>
                    <span aria-hidden="true" className={`text-base transition-all ${isActive ? 'translate-x-1 text-[hsl(var(--copper))]' : 'text-ink/35 group-hover:translate-x-1 group-hover:text-[hsl(var(--copper))]'}`}>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
            {extraListItem ? (
              <li>
                <Link
                  href={extraListItem.href}
                  onMouseEnter={resetOverview}
                  onFocus={resetOverview}
                  className="group relative grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 border-t border-rule py-6 transition-colors hover:bg-ink/[0.025] sm:grid-cols-[4rem_1fr_auto] sm:gap-x-8 sm:py-7"
                >
                  <span className="num-display text-xl font-medium leading-none text-muted-ink transition-colors group-hover:text-[hsl(var(--copper))] sm:text-2xl">
                    {String(listProjects.length + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-display text-2xl font-medium leading-tight text-ink/75 transition-colors group-hover:text-[hsl(var(--copper))] sm:text-[1.75rem]">
                      {extraListItem.title}
                    </p>
                    {extraListItem.meta ? (
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                        {extraListItem.meta}
                      </p>
                    ) : null}
                  </div>
                  <span aria-hidden="true" className="text-base text-ink/35 transition-all group-hover:translate-x-1 group-hover:text-[hsl(var(--copper))]">
                    →
                  </span>
                </Link>
              </li>
            ) : null}
          </ul>

          {showViewAll ? (
            <Link
              href={`/${locale}/projects`}
              className="cta-link mt-10"
            >
              {copy.viewAll}
              <span aria-hidden="true" className="cta-arrow">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
