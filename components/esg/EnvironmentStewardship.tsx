import { MediaImage as Image } from '@/components/shared/MediaImage';
import { MarkdownBody } from '@/components/shared/MarkdownBody';

type Topic = { topic: string; body: string };

export function EnvironmentStewardship({
  eyebrow,
  heading,
  body,
  image,
  topics,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  image?: string;
  topics: Topic[];
}) {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[30rem]">
          {image ? (
            <Image src={image} alt={heading} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          ) : null}
        </div>
        <div className="flex flex-col justify-center border-rule px-6 py-16 sm:px-10 lg:border-l lg:px-16">
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{eyebrow}</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] text-ink sm:text-4xl">
            {heading}
          </h2>
          <MarkdownBody className="mt-7 max-w-[48ch] prose-p:text-ink/75">{body}</MarkdownBody>
        </div>
      </div>

      {topics.length > 0 ? (
        <ul className="grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <li
              key={topic.topic}
              className="group relative border-b border-rule px-6 py-10 transition-colors duration-300 hover:bg-ink/[0.015] sm:px-10 sm:py-11 lg:px-12 [&:not(:last-child)]:sm:border-r"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <span aria-hidden="true" className="block h-0.5 w-9 bg-[hsl(var(--eco))] transition-all duration-300 ease-out group-hover:w-14" />
              <h3 className="mt-5 text-[12px] font-medium uppercase tracking-[0.22em] text-[hsl(var(--eco))]">{topic.topic}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{topic.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default EnvironmentStewardship;
