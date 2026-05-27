'use client';

import { useState } from 'react';
import type { ContactContent } from '@/lib/content/types';

export function PhoneDropdown({ groups }: { groups: ContactContent['phone_groups'] }) {
  const [open, setOpen] = useState<string | null>(groups[0]?.category ?? null);

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.category} className="overflow-hidden rounded-[1.25rem] border border-border">
          <button
            type="button"
            onClick={() => setOpen((current) => (current === group.category ? null : group.category))}
            aria-expanded={open === group.category}
            className="flex w-full items-center justify-between bg-background px-5 py-4 text-left transition hover:bg-muted"
          >
            <span className="font-semibold">{group.category}</span>
            <span aria-hidden>{open === group.category ? '−' : '+'}</span>
          </button>
          {open === group.category ? (
            <div className="space-y-2 border-t border-border bg-muted/30 px-5 py-4">
              {group.numbers.map((number) => (
                <div key={`${group.category}-${number.label}`} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{number.label}</span>
                  <a href={`tel:${number.number.replace(/\s+/g, '')}`} className="font-mono text-sm font-semibold transition hover:text-primary">
                    {number.number}
                  </a>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}