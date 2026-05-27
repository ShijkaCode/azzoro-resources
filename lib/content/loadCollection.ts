import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import type { Locale } from '@/lib/i18n/config';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type CollectionEntry<T> = T & { slug: string; markdown?: string };

function sortEntries<T extends { order?: number; slug: string }>(entries: T[]) {
  return [...entries].sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.slug.localeCompare(right.slug);
  });
}

export async function loadCollection<T extends Record<string, unknown>>(
  folder: string,
  locale?: Locale
): Promise<Array<CollectionEntry<T>>> {
  const directory = path.join(CONTENT_ROOT, folder);

  let files: string[];
  try {
    files = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const suffixes = locale ? [`.${locale}.md`, `.${locale}.yml`] : ['.md', '.yml'];

  const entries = await Promise.all(
    files
      .filter((file) => suffixes.some((suffix) => file.endsWith(suffix)))
      .map(async (file) => {
        const filePath = path.join(directory, file);
        const raw = await readFile(filePath, 'utf8');
        const suffix = suffixes.find((candidate) => file.endsWith(candidate));
        const slug = suffix ? file.slice(0, -suffix.length) : file.replace(/\.(md|yml)$/u, '');

        if (file.endsWith('.md')) {
          const { data, content } = matter(raw);
          return {
            ...(data as T),
            slug,
            markdown: content.trim(),
          };
        }

        return {
          ...(parseYaml(raw) as T),
          slug,
        };
      })
  );

  return sortEntries(entries as Array<CollectionEntry<T>>);
}