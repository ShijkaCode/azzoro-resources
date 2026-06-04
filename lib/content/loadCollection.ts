import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { mergeLocale } from '@/lib/content/localeFallback';

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

// "slug.en.md" -> { slug, locale: 'en' }; "site.yml" -> { slug, locale: null }.
function parseFilename(filename: string): { slug: string; locale: string | null } | null {
  const m = filename.match(/^(.+?)(?:\.(en|mn))?\.(?:md|yml)$/u);
  if (!m) return null;
  return { slug: m[1], locale: m[2] ?? null };
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

  // Read + classify every entry file by its locale: en / mn / shared (no locale).
  const enMap = new Map<string, CollectionEntry<T>>();
  const localeMap = new Map<string, CollectionEntry<T>>(); // the requested non-default locale
  const sharedMap = new Map<string, CollectionEntry<T>>();

  await Promise.all(
    files.map(async (file) => {
      const parsed = parseFilename(file);
      if (!parsed) return;
      const raw = await readFile(path.join(directory, file), 'utf8');

      let entry: CollectionEntry<T>;
      if (file.endsWith('.md')) {
        const { data, content } = matter(raw);
        entry = { ...(data as T), slug: parsed.slug, markdown: content.trim() };
      } else {
        entry = { ...(parseYaml(raw) as T), slug: parsed.slug };
      }

      if (parsed.locale === defaultLocale) enMap.set(parsed.slug, entry);
      else if (locale && parsed.locale === locale) localeMap.set(parsed.slug, entry);
      else if (parsed.locale === null) sharedMap.set(parsed.slug, entry);
    })
  );

  // EN is the structure source; fall back to shared files for non-i18n collections.
  const isI18n = enMap.size > 0;
  const baseMap = isI18n ? enMap : sharedMap;
  const baseEntries = [...baseMap.values()];

  // Default locale, no locale, or a non-i18n (shared) collection: return base as-is.
  if (!locale || locale === defaultLocale || !isI18n) {
    return sortEntries(baseEntries as Array<CollectionEntry<T> & { order?: number }>);
  }

  // Non-default locale: overlay each translation onto its EN base entry.
  const merged = baseEntries.map((base) => {
    const override = localeMap.get(base.slug);
    return override ? mergeLocale(base, override) : base;
  });

  // Preserve translation-only slugs with no EN counterpart (rare).
  for (const [slug, override] of localeMap) {
    if (!enMap.has(slug)) merged.push(override);
  }

  return sortEntries(merged as Array<CollectionEntry<T> & { order?: number }>);
}
