import path from 'node:path';
import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import type { Locale } from '@/lib/i18n/config';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type LoadedSingleton<T> = T & { markdown?: string };

async function readIfExists(filePath: string) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

export async function loadSingleton<T extends Record<string, unknown>>(
  slug: string,
  locale?: Locale
): Promise<LoadedSingleton<T>> {
  const candidates = [
    locale ? path.join(CONTENT_ROOT, `${slug}.${locale}.md`) : null,
    locale ? path.join(CONTENT_ROOT, `${slug}.${locale}.yml`) : null,
    path.join(CONTENT_ROOT, `${slug}.md`),
    path.join(CONTENT_ROOT, `${slug}.yml`),
  ].filter(Boolean) as string[];

  for (const filePath of candidates) {
    const raw = await readIfExists(filePath);

    if (!raw) {
      continue;
    }

    if (filePath.endsWith('.md')) {
      const { data, content } = matter(raw);
      return {
        ...(data as T),
        markdown: content.trim(),
      };
    }

    return parseYaml(raw) as LoadedSingleton<T>;
  }

  throw new Error(`Unable to load singleton content for slug: ${slug}`);
}