import path from 'node:path';
import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { mergeLocale } from '@/lib/content/localeFallback';

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

// Load the first existing file among the given suffixes for a slug.
async function loadFromSuffixes<T>(slug: string, suffixes: string[]): Promise<LoadedSingleton<T> | null> {
  for (const suffix of suffixes) {
    const filePath = path.join(CONTENT_ROOT, `${slug}${suffix}`);
    const raw = await readIfExists(filePath);
    if (!raw) continue;

    if (filePath.endsWith('.md')) {
      const { data, content } = matter(raw);
      return { ...(data as T), markdown: content.trim() };
    }
    return parseYaml(raw) as LoadedSingleton<T>;
  }
  return null;
}

export async function loadSingleton<T extends Record<string, unknown>>(
  slug: string,
  locale?: Locale
): Promise<LoadedSingleton<T>> {
  // EN (default) is the source of truth: load it as the base structure.
  const base = await loadFromSuffixes<T>(slug, [
    `.${defaultLocale}.md`,
    `.${defaultLocale}.yml`,
    '.md',
    '.yml',
  ]);

  // Default locale (or none): return EN directly — never merged.
  if (!locale || locale === defaultLocale) {
    if (!base) throw new Error(`Unable to load singleton content for slug: ${slug}`);
    return base;
  }

  // Non-default locale: overlay its translation onto the EN base.
  const override = await loadFromSuffixes<T>(slug, [`.${locale}.md`, `.${locale}.yml`]);

  if (!base) {
    if (!override) throw new Error(`Unable to load singleton content for slug: ${slug}`);
    return override;
  }
  if (!override) return base;

  return mergeLocale(base, override);
}
