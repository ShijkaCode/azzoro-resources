'use client';

import { useState } from 'react';
import type { ContactContent } from '@/lib/content/types';

export function PhoneDropdown({ groups }: { groups: ContactContent['phone_groups'] }) {
  const [open, setOpen] = useState<string | null>(groups[0]?.category ?? null);

  return (
    <div className="border-t border-rule">
      {groups.map((group) => {
        const isOpen = open === group.category;
        return (
          <div key={group.category} className="border-b border-rule">
            <button
              type="button"
              onClick={() => setOpen((current) => (current === group.category ? null : group.category))}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink">{group.category}</span>
              <span aria-hidden className={`text-lg leading-none transition-colors ${isOpen ? 'text-[hsl(var(--copper))]' : 'text-ink/50'}`}>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <div className="space-y-3 pb-5">
                {group.numbers.map((number) => (
                  <div key={`${group.category}-${number.label}`} className="flex items-baseline justify-between gap-4">
                    <span className="text-[14px] text-ink/65">{number.label}</span>
                    <a
                      href={`tel:${number.number.replace(/\s+/g, '')}`}
                      className="num-tabular text-[14px] font-medium text-ink transition-colors hover:text-[hsl(var(--copper))]"
                    >
                      {number.number}
                    </a>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
