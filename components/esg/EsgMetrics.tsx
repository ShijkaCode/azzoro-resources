'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { EsgMetric } from '@/lib/content/types';

// Split a CMS value like "2,300", "90%", "180+" into an animatable number and
// its non-numeric prefix/suffix so we can count up only the figure itself.
// Values may arrive as numbers (YAML parses a bare `30` as a number), so coerce.
function parseMetric(value: string | number) {
  const text = String(value);
  const match = text.match(/^(\D*)([\d.,]+)(.*)$/u);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const numeric = Number(digits.replace(/,/gu, ''));
  if (!Number.isFinite(numeric)) return null;
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  return { prefix, numeric, suffix, decimals };
}

function formatNumber(value: number, decimals: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function CountUpValue({ value, play }: { value: string | number; play: boolean }) {
  const parsed = useMemo(() => parseMetric(value), [value]);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : String(value));

  useEffect(() => {
    if (!parsed || !play) return;
    // Respect users who ask for reduced motion — show the final value at once.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(String(value));
      return;
    }

    const duration = 1400;
    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast then settles, reads as confident
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = parsed.numeric * eased;
      setDisplay(`${parsed.prefix}${formatNumber(current, parsed.decimals)}${parsed.suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parsed, play, value]);

  return <>{parsed ? display : value}</>;
}

export function EsgMetrics({ items, eyebrow }: { items: EsgMetric[]; eyebrow: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-paper text-ink">
      <div className="px-6 pt-16 sm:px-10 sm:pt-20 lg:px-16">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{eyebrow}</p>
      </div>
      <div className="mt-10 grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
        {items.map((metric, idx) => (
          <div
            key={`${metric.label}-${idx}`}
            className="group relative border-b border-rule px-6 py-12 transition-colors duration-300 hover:bg-ink/[0.015] sm:px-10 sm:py-14 lg:px-12 lg:[&:nth-child(-n+4)]:border-t-0 [&:not(:nth-child(4n))]:lg:border-r"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <p className="num-display text-5xl font-medium leading-none tracking-[-0.01em] text-[hsl(var(--eco))] sm:text-6xl lg:text-[4rem]">
              <CountUpValue value={metric.value} play={play} />
            </p>
            <p className="mt-5 text-[13px] font-medium uppercase tracking-[0.2em] text-ink">{metric.label}</p>
            {metric.detail ? <p className="mt-2 text-sm leading-snug text-muted-ink">{metric.detail}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default EsgMetrics;
