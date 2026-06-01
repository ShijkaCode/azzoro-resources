import { MediaImage as Image } from '@/components/shared/MediaImage';

type Category = { category: string; title: string; body: string; image?: string };

export function LocalInvestment({
  eyebrow,
  heading,
  body,
  categories,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  categories: Category[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div className="max-w-[68ch]">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{eyebrow}</p>
        <h2 className="mt-5 font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] text-ink sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-ink/75">{body}</p>
      </div>

      <ul className="mt-14 grid grid-cols-1 border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.category} className="group flex flex-col border-b border-r border-rule">
            <div className="relative aspect-[5/4] overflow-hidden">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : null}
            </div>
            <div className="relative flex flex-1 flex-col px-6 py-7">
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[hsl(var(--eco))]">
                {category.category}
              </span>
              <h3 className="mt-3 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-ink">
                {category.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{category.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LocalInvestment;
