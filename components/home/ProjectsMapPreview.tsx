'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import type { Map as MapType, Popup as PopupType, LngLatBoundsLike } from 'maplibre-gl';
import type { Project } from '@/lib/content/types';
import { primaryCommodityColor } from '@/lib/map/markers';
import { getMapStyleUrl, getTerrainTilesUrl } from '@/lib/map/tiles';

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
  'bayan-sair': 7,
  'khukh-tag': 6,
  'tsagaan-ders': 6,
};
const DEFAULT_ZOOM = 6;

// Whole-country overview (Mongolia bbox + a little margin) — the default + reset view.
const MONGOLIA_BOUNDS: [[number, number], [number, number]] = [
  [87.7, 41.4],
  [120.2, 52.3],
];
const OVERVIEW_PITCH = 40;

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
  const image = project.hero_image || '';
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
  showHeading = true,
  showViewAll = true,
}: {
  projects: Project[];
  showHeading?: boolean;
  showViewAll?: boolean;
}) {
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
        style: getMapStyleUrl('outdoor-v2'),
        center: [104, 47.2],
        zoom: 4,
        pitch: OVERVIEW_PITCH,
        maxPitch: 72,
        attributionControl: false,
        scrollZoom: true,
        dragPan: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        keyboard: false,
      });
      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: true }), 'top-right');

      map.on('load', () => {
        // 3D terrain + atmospheric sky (MapTiler Terrain-RGB) — lifts hills and relief.
        try {
          const terrainUrl = getTerrainTilesUrl();
          if (terrainUrl && typeof map.setTerrain === 'function') {
            if (!map.getSource('mt-terrain')) {
              map.addSource('mt-terrain', { type: 'raster-dem', url: terrainUrl });
            }
            map.setTerrain({ source: 'mt-terrain', exaggeration: 1.3 });
            map.setSky?.({
              'sky-color': '#cfe0ef',
              'horizon-color': '#eef2f5',
              'fog-color': '#eae6dd',
              'sky-horizon-blend': 0.6,
              'horizon-fog-blend': 0.6,
              'fog-ground-blend': 0.4,
              'atmosphere-blend': 0.6,
            });
          }
        } catch {
          // terrain is an enhancement; ignore if the DEM source is unavailable
        }

        // Mongolia outline overlay — crisp national border with a soft halo.
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
              paint: { 'line-color': 'hsl(0, 0%, 8%)', 'line-width': 3, 'line-opacity': 0.9 },
            });
          })
          .catch(() => {});
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
        pitch: 60,
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
            {projects.map((project, idx) => {
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
                      <p className="mt-2 flex flex-wrap gap-x-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                        <span>{project.commodity.join(' · ')}</span>
                        <span aria-hidden="true">/</span>
                        <span>{project.region}</span>
                        <span aria-hidden="true">/</span>
                        <span>{project.status}</span>
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
