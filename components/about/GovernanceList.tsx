import { PDFDownloadButton } from '@/components/shared/PDFDownloadButton';
import type { GovernanceDocument } from '@/lib/content/types';

const categories: GovernanceDocument['category'][] = ['Constitution', 'Charters', 'Policies', 'Reports', 'Disclosures'];

export function GovernanceList({
  documents,
  locale,
}: {
  documents: GovernanceDocument[];
  locale: 'en' | 'mn';
}) {
  const labels = {
    heading: locale === 'mn' ? 'Засаглалын баримт бичгүүд' : 'Governance documents',
    download: locale === 'mn' ? 'PDF татах' : 'Download PDF',
    effective: locale === 'mn' ? 'Хүчинтэй огноо' : 'Effective',
  };

  return (
    <section className="py-4">
      <h2 className="text-3xl font-semibold">{labels.heading}</h2>
      <div className="mt-8 space-y-10">
        {categories.map((category) => {
          const filtered = documents.filter((document) => document.category === category);

          if (filtered.length === 0) {
            return null;
          }

          return (
            <div key={category}>
              <h3 className="text-xl font-semibold">{category}</h3>
              <ul className="mt-4 space-y-3">
                {filtered.map((document) => (
                  <li
                    key={document.slug}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[1.25rem] border border-border bg-background p-5"
                  >
                    <div className="max-w-2xl">
                      <div className="font-medium">{document.title}</div>
                      {document.description ? (
                        <div className="mt-1 text-sm text-muted-foreground">{document.description}</div>
                      ) : null}
                      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {labels.effective}: {new Date(document.effective_date).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU')}
                      </div>
                    </div>
                    <PDFDownloadButton href={document.file} label={labels.download} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}