import { MarkdownBody } from '@/components/shared/MarkdownBody';

type TitledBody = { title: string; body: string };

export function EsgApproach({
  eyebrow,
  body,
  principles,
  commitmentsEyebrow,
  commitments,
}: {
  eyebrow: string;
  body: string;
  principles: TitledBody[];
  commitmentsEyebrow: string;
  commitments: TitledBody[];
}) {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div className="max-w-[64ch]">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{eyebrow}</p>
        <MarkdownBody className="mt-6 prose-p:text-xl prose-p:leading-relaxed prose-p:text-ink/85">{body}</MarkdownBody>
      </div>

      {principles.length > 0 ? (
        <ol className="mt-16 grid grid-cols-1 border-t border-rule md:grid-cols-3">
          {principles.map((principle, idx) => (
            <li
              key={principle.title}
              className="group relative flex flex-col border-b border-rule py-9 transition-colors duration-300 hover:bg-ink/[0.015] md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0 lg:px-10"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <span className="num-display text-4xl font-medium leading-none text-[hsl(var(--eco))] transition-colors duration-300 group-hover:text-[hsl(var(--copper))]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-ink">
                {principle.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{principle.body}</p>
            </li>
          ))}
        </ol>
      ) : null}

      {commitments.length > 0 ? (
        <div className="mt-16 border-t border-rule pt-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[hsl(var(--eco))]">{commitmentsEyebrow}</p>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
            {commitments.map((commitment) => (
              <li key={commitment.title} className="flex flex-col border-t-2 border-[hsl(var(--eco))] pt-5">
                <h3 className="font-display text-lg font-medium leading-snug tracking-[-0.01em] text-ink">
                  {commitment.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{commitment.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export default EsgApproach;
