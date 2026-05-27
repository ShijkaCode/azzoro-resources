'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import type { Project } from '@/lib/content/types';
import { getMapStyleUrl } from '@/lib/map/tiles';
import { primaryCommodityColor } from '@/lib/map/markers';
import { ProjectSidePanel } from './ProjectSidePanel';

type ProjectsMapProps = {
  projects: Project[];
  initialCenter?: [number, number];
  initialZoom?: number;
};

export function ProjectsMap({
  projects,
  initialCenter = [105, 47],
  initialZoom = 4.5,
}: ProjectsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center: initialCenter,
      zoom: initialZoom,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current = map;

    const markers: Marker[] = [];

    projects.forEach((project) => {
      const element = document.createElement('button');
      element.className = 'project-pin';
      element.style.width = '28px';
      element.style.height = '28px';
      element.style.cursor = 'pointer';
      element.style.background = primaryCommodityColor(project.commodity);
      element.setAttribute('aria-label', `Open ${project.title}`);
      element.addEventListener('click', () => setSelected(project));

      const marker = new maplibregl.Marker({ element })
        .setLngLat([project.lng, project.lat])
        .addTo(map);

      markers.push(marker);
    });

    if (projects.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      projects.forEach((project) => bounds.extend([project.lng, project.lat]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 6.5 });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom, projects]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || projects.length <= 1) {
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    projects.forEach((project) => bounds.extend([project.lng, project.lat]));
    map.fitBounds(bounds, { padding: 80, maxZoom: 6.5, duration: 800 });
  }, [projects]);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)]">
      <div ref={containerRef} className="h-[70vh] min-h-[32rem] w-full" />
      {selected ? <ProjectSidePanel project={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}