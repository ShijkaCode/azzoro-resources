import { MediaImage as Image } from '@/components/shared/MediaImage';

type Story = { title: string; body: string; author: string; role: string; image?: string };

export function CommunityStories({
  eyebrow,
  heading,
  intro,
  stories,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  stories: Story[];
}) {
  if (stories.length === 0) return null;

  return (
    <section className="bg-[hsl(var(--primary))] text-white">
      <div className="px-6 pt-20 sm:px-10 sm:pt-24 lg:px-16">
        <div className="max-w-[60ch]">
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--copper))]">{eyebrow}</p>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] sm:text-4xl lg:text-5xl">{heading}</h2>
          <p className="mt-6 text-lg leading-relaxed text-white/65">{intro}</p>
        </div>
      </div>

      <div className="mt-16">
        {stories.map((story, idx) => {
          const imageRight = idx % 2 === 1;
          return (
            <article key={story.title} className="group grid grid-cols-1 border-t border-white/15 lg:grid-cols-2">
              {story.image ? (
                <div className={`relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[30rem] ${imageRight ? 'lg:order-2' : ''}`}>
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}
              <div className={`flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-16 ${imageRight ? 'lg:border-r lg:border-white/15' : 'lg:border-l lg:border-white/15'}`}>
                <h3 className="max-w-[20ch] font-display text-2xl font-medium leading-snug tracking-[-0.01em] text-white sm:text-3xl">
                  {story.title}
                </h3>
                <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-white/70 sm:text-base">{story.body}</p>
                <div className="mt-8 flex items-baseline gap-3 border-t border-white/15 pt-5">
                  <span className="text-sm font-medium text-white">{story.author}</span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--copper))]">{story.role}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CommunityStories;
