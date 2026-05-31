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
    download: locale === 'mn' ? 'Татах' : 'Download',
  };

  return (
    <section>
      <h2 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">{labels.heading}</h2>
      <div className="mt-8 space-y-8">
        {categories.map((category) => {
          const filtered = documents.filter((document) => document.category === category);
          if (filtered.length === 0) {
            return null;
          }

          return (
            <div key={category}>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-ink">{category}</p>
              <ul className="mt-2 border-t border-rule">
                {filtered.map((document) => (
                  <li key={document.slug}>
                    <a
                      href={document.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${labels.download}: ${document.title}`}
                      className="group flex items-center justify-between gap-4 border-b border-rule py-3 transition-colors hover:bg-ink/[0.03]"
                    >
                      <span className="text-[14px] text-ink/85 transition-colors group-hover:text-ink">{document.title}</span>
                      <span
                        aria-hidden
                        className="flex h-7 w-7 shrink-0 items-center justify-center text-ink/40 transition-all group-hover:translate-y-0.5 group-hover:text-[hsl(var(--copper))]"
                      >
                        ↓
                      </span>
                    </a>
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
