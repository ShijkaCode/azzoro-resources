'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/content/types';
import { primaryCommodityColor } from '@/lib/map/markers';
import { getMapStyleUrl } from '@/lib/map/tiles';

export function ProjectsMapPreview({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let cancelled = false;
    let cleanup = () => {};

    void import('maplibre-gl').then((module) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      const maplibregl = module.default;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getMapStyleUrl(),
        center: [105, 47],
        zoom: 4,
        interactive: false,
        attributionControl: false,
      });

      projects.forEach((project) => {
        const element = document.createElement('div');
        element.style.width = '18px';
        element.style.height = '18px';
        element.style.borderRadius = '9999px';
        element.style.background = primaryCommodityColor(project.commodity);
        element.style.border = '2px solid white';
        element.style.boxShadow = '0 0 0 1px rgba(15,23,42,0.18)';
        new maplibregl.Marker({ element }).setLngLat([project.lng, project.lat]).addTo(map);
      });

      cleanup = () => {
        map.remove();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [projects]);

  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Projects</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A preview of the portfolio footprint across Mongolia</h2>
        </div>
        <Link href={`/${locale}/projects`} className="text-sm font-semibold text-primary transition hover:text-primary/80">
          Explore all projects →
        </Link>
      </div>
      <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
        <div ref={containerRef} className="h-[24rem]" />
        <div className="border-t border-border bg-background/95 px-4 py-3 text-xs text-muted-foreground sm:px-5">
          Map rendering by{' '}
          <a href="https://maplibre.org/" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2">
            MapLibre
          </a>
          . Basemap data ©{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            OpenStreetMap contributors
          </a>
          .
        </div>
      </div>
    </section>
  );
}