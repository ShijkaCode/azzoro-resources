import type { Partner } from '@/lib/content/types';

export default function PartnerLogos({ partners }: { partners: Partner[] }) {
  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="surface-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Partners</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Placeholder partner strip wired to the CMS collection</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {partners.map((partner) => {
            const content = (
              <div className="flex min-h-24 items-center justify-center rounded-[1.25rem] border border-border bg-background px-4 text-center text-sm font-semibold text-foreground">
                {partner.name}
              </div>
            );

            if (partner.url) {
              return (
                <a key={partner.slug} href={partner.url} target="_blank" rel="noreferrer" className="transition hover:-translate-y-0.5">
                  {content}
                </a>
              );
            }

            return <div key={partner.slug}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}