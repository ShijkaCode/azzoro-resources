import { ImageResponse } from 'next/og';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    return new ImageResponse(<div />, size);
  }

  const projects = await loadCollection<Project>('projects', locale);
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return new ImageResponse(<div />, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #082f49 0%, #0f172a 52%, #1d4ed8 100%)',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {project.commodity.slice(0, 3).map((commodity) => (
            <div
              key={commodity}
              style={{
                border: '1px solid rgba(255,255,255,0.24)',
                borderRadius: '999px',
                padding: '10px 18px',
                fontSize: 22,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {commodity}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.04, maxWidth: 900 }}>{project.title}</div>
          <div style={{ fontSize: 28, marginTop: 24, maxWidth: 760, opacity: 0.88 }}>{project.summary}</div>
        </div>
      </div>
    ),
    size
  );
}