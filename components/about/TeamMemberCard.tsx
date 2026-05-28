'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import type { TeamMember } from '@/lib/content/types';

export function TeamMemberCard({
  member,
  locale = 'en',
  compact = false,
}: {
  member: TeamMember & { markdown?: string };
  locale?: 'en' | 'mn';
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const bio = (member.markdown?.trim() || member.bio || '').trim();
  const readLabel = locale === 'mn' ? 'Намтар унших' : 'Read bio';
  const closeLabel = locale === 'mn' ? 'Хаах' : 'Close';

  const nameClass = compact
    ? 'mt-4 font-display text-base font-medium leading-tight text-ink sm:text-lg'
    : 'mt-5 font-display text-xl font-medium leading-tight text-ink sm:text-2xl';
  const roleClass = compact
    ? 'mt-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-ink'
    : 'mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink';

  return (
    <div className="group flex flex-col">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="w-full text-left">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              sizes={compact ? '(min-width: 1024px) 16vw, 33vw' : '(min-width: 1024px) 25vw, 50vw'}
              className="object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-4xl font-medium text-muted-ink">
              {member.name.slice(0, 1)}
            </div>
          )}
        </div>
        <h3 className={nameClass}>{member.name}</h3>
        <p className={roleClass}>{member.role}</p>
        {bio ? (
          <span
            className={`mt-3 inline-flex items-center gap-1.5 border-b border-ink/40 pb-1 font-medium uppercase tracking-[0.24em] text-ink/80 transition-colors group-hover:border-ink group-hover:text-ink ${
              compact ? 'text-[9px]' : 'text-[11px] gap-2 tracking-[0.28em]'
            }`}
          >
            {open ? closeLabel : readLabel}
            <span aria-hidden="true" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>↓</span>
          </span>
        ) : null}
      </button>
      {open && bio ? (
        <div className="mt-4 border-t border-rule pt-4">
          <MarkdownBody className="prose-sm prose-p:text-ink/70">{bio}</MarkdownBody>
        </div>
      ) : null}
    </div>
  );
}
