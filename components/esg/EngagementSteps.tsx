type Step = { title: string; body: string };

export function EngagementSteps({ steps, eyebrow, heading }: { steps: Step[]; eyebrow: string; heading: string }) {
  if (steps.length === 0) return null;

  return (
    <section className="bg-paper text-ink px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{eyebrow}</p>
          <h2 className="mt-5 max-w-[16ch] font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
        </div>

        <ol>
          {steps.map((step, idx) => {
            const last = idx === steps.length - 1;
            return (
              <li key={step.title} className="group grid grid-cols-[2.75rem_1fr] gap-x-5 sm:grid-cols-[3.5rem_1fr] sm:gap-x-7">
                <div className="flex flex-col items-center">
                  <span className="num-display text-2xl font-medium leading-none text-[hsl(var(--eco))] transition-colors duration-300 group-hover:text-[hsl(var(--copper))] sm:text-3xl">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {!last ? <span aria-hidden="true" className="mt-3 w-px flex-1 bg-rule" /> : null}
                </div>
                <div className={last ? 'pb-0' : 'pb-12'}>
                  <h3 className="font-display text-xl font-medium leading-snug tracking-[-0.01em] text-ink sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-ink/70">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default EngagementSteps;
