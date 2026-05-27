'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import type { TeamMember } from '@/lib/content/types';

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-[0_18px_50px_-28px_rgba(15,23,42,0.18)]">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="w-full text-left">
        <div className="relative aspect-square w-full bg-muted">
          {member.photo ? (
            <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl font-semibold text-muted-foreground">
              {member.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <div className="text-lg font-semibold">{member.name}</div>
          <div className="mt-1 text-sm text-muted-foreground">{member.role}</div>
        </div>
      </button>
      {open ? (
        <div className="border-t border-border bg-muted/40 p-4 sm:p-5">
          <MarkdownBody className="prose-sm">{member.bio}</MarkdownBody>
        </div>
      ) : null}
    </div>
  );
}