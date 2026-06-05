import { MediaImage as Image } from '@/components/shared/MediaImage';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import type { Project } from '@/lib/content/types';

type Locale = 'en' | 'mn';

const LABELS = {
  en: {
    licence: 'Licence',
    area: 'Area',
    ownership: 'Ownership',
    province: 'Province',
    galleryTitle: 'Field & core',
    drillTitle: 'Notable drill intercepts',
    drillHole: 'Drillhole',
    drillIntercept: 'Intercept',
    resourceTitle: 'Mineral Resource',
    category: 'Category',
    tonnes: 'Tonnes',
    grade: 'Grade',
    contained: 'Contained',
    caution: 'Cautionary statement',
  },
  mn: {
    licence: 'Лиценз',
    area: 'Талбай',
    ownership: 'Эзэмшил',
    province: 'Аймаг',
    galleryTitle: 'Хээр ба өрөмдлөгийн зүсэлт',
    drillTitle: 'Сонгосон өрөмдлөгийн үр дүн',
    drillHole: 'Цооног',
    drillIntercept: 'Огтлол',
    resourceTitle: 'Ашигт малтмалын нөөц',
    category: 'Ангилал',
    tonnes: 'Тонн',
    grade: 'Агуулга',
    contained: 'Агуулагдах',
    caution: 'Анхааруулга',
  },
} as const;

export function TenureBar({ project, locale }: { project: Project; locale: Locale }) {
  const t = LABELS[locale] ?? LABELS.en;
  const tenure = project.tenure;
  if (!tenure) return null;

  const cells = [
    tenure.licence ? { label: tenure.licence_type ? `${tenure.licence_type} licence` : t.licence, value: tenure.licence } : null,
    tenure.area_km2 ? { label: t.area, value: `${tenure.area_km2} km²` } : null,
    tenure.ownership ? { label: t.ownership, value: tenure.ownership } : null,
    tenure.province ? { label: t.province, value: tenure.province } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (cells.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 border-l border-t border-rule md:grid-cols-4">
      {cells.map((cell) => (
        <div key={cell.label} className="border-b border-r border-rule px-5 py-6 sm:px-6">
          <dt className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">{cell.label}</dt>
          <dd className="num-tabular mt-2 text-[15px] font-medium text-ink">{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DrillResultsTable({ project, locale, title }: { project: Project; locale: Locale; title?: string }) {
  const t = LABELS[locale] ?? LABELS.en;
  const rows = project.drill_highlights;
  if (!rows || rows.length === 0) return null;

  return (
    <div>
      <span aria-hidden="true" className="mb-5 block h-0.5 w-10 bg-[hsl(var(--copper))]" />
      <h2 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">{title || t.drillTitle}</h2>
      <div className="mt-6 border border-rule">
        <div className="grid grid-cols-[8rem_1fr] border-b border-rule bg-paper sm:grid-cols-[12rem_1fr]">
          <div className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-ink">{t.drillHole}</div>
          <div className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-ink">{t.drillIntercept}</div>
        </div>
        {rows.map((row, idx) => (
          <div
            key={`${row.hole}-${idx}`}
            className={`grid grid-cols-[8rem_1fr] sm:grid-cols-[12rem_1fr] ${idx > 0 ? 'border-t border-rule' : ''}`}
          >
            <div className="num-tabular px-4 py-4 text-[14px] font-medium text-ink">{row.hole}</div>
            <div className="num-tabular px-4 py-4 text-[14px] leading-relaxed text-ink/80">{row.intercept}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResourceTable({ project, locale }: { project: Project; locale: Locale }) {
  const t = LABELS[locale] ?? LABELS.en;
  const table = project.resource_table;
  if (!table || table.rows.length === 0) return null;

  return (
    <div>
      <span aria-hidden="true" className="mb-5 block h-0.5 w-10 bg-[hsl(var(--copper))]" />
      <h2 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">{t.resourceTitle}</h2>
      {table.note ? <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{table.note}</p> : null}
      <div className="mt-6 overflow-x-auto border border-rule">
        <table className="w-full min-w-[34rem] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-rule bg-paper">
              <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.2em] text-muted-ink">{t.category}</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.2em] text-muted-ink">{t.tonnes}</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.2em] text-muted-ink">{t.grade}</th>
              <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.2em] text-muted-ink">{t.contained}</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, idx) => {
              const isTotal = idx === table.rows.length - 1;
              return (
                <tr key={row.category} className={`border-t border-rule ${isTotal ? 'bg-paper font-medium' : ''}`}>
                  <td className="px-4 py-3 text-ink">{row.category}</td>
                  <td className="num-tabular px-4 py-3 text-right text-ink/85">{row.tonnes}</td>
                  <td className="num-tabular px-4 py-3 text-right text-ink/85">{row.grade}</td>
                  <td className="num-tabular px-4 py-3 text-right text-ink/85">{row.contained}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Large, captioned geological figures (maps, sections, core). Uses object-contain
// so detailed map legends and labels are never cropped.
export function ProjectFigures({
  figures,
  title,
}: {
  figures?: { image: string; caption?: string }[];
  title: string;
}) {
  const items = (figures ?? []).filter((figure) => figure && figure.image);
  if (items.length === 0) return null;

  return (
    <div className="space-y-8">
      {items.map((figure, idx) => (
        <figure key={`${figure.image}-${idx}`} className="border border-rule bg-paper">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={figure.image}
              alt={figure.caption || `${title} — figure ${idx + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
            />
          </div>
          {figure.caption ? (
            <figcaption className="border-t border-rule px-4 py-3 text-[13px] leading-relaxed text-muted-ink">
              {figure.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

// Renders the flexible body: text and image sections in author-defined order.
// Falls back to the legacy single body for any entry without content_blocks.
export function ProjectContent({
  project,
  locale,
}: {
  project: Project & { markdown?: string };
  locale: Locale;
}) {
  const blocks = project.content_blocks ?? [];

  if (blocks.length === 0) {
    const legacy = project.markdown || project.body;
    return legacy ? <MarkdownBody className="mx-auto max-w-[68ch]">{legacy}</MarkdownBody> : null;
  }

  return (
    <>
      {blocks.map((block, idx) => {
        if (block.type === 'image') {
          return block.image ? (
            <ProjectFigures key={idx} figures={[{ image: block.image, caption: block.caption }]} title={project.title} />
          ) : null;
        }

        if (block.type === 'drill') {
          return <DrillResultsTable key={idx} project={project} locale={locale} title={block.title} />;
        }

        if (block.type === 'split') {
          const text = block.body ? <MarkdownBody>{block.body}</MarkdownBody> : null;
          const image = block.image ? (
            <ProjectFigures figures={[{ image: block.image, caption: block.caption }]} title={project.title} />
          ) : null;
          if (!text && !image) return null;
          // Text-first on mobile; on desktop `reverse` swaps the columns.
          return (
            <div key={idx} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className={block.reverse ? 'lg:order-2' : ''}>{text}</div>
              <div className={block.reverse ? 'lg:order-1' : ''}>{image}</div>
            </div>
          );
        }

        return block.body ? (
          <MarkdownBody key={idx} className="mx-auto max-w-[68ch]">
            {block.body}
          </MarkdownBody>
        ) : null;
      })}
    </>
  );
}

export function CautionaryCallout({
  label,
  statement,
  cautionary,
  locale,
}: {
  label: string;
  statement: string;
  cautionary: string;
  locale: Locale;
}) {
  const t = LABELS[locale] ?? LABELS.en;
  return (
    <div className="border border-rule bg-white">
      <p className="border-b border-rule px-6 py-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">{label}</p>
      <div className="px-6 py-6">
        <p className="num-tabular font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">{statement}</p>
        <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-ink/65">
          <span aria-hidden="true" className="mt-[1px] shrink-0 font-medium text-ink/80">{t.caution}:</span>
          <span>{cautionary}</span>
        </p>
      </div>
    </div>
  );
}
