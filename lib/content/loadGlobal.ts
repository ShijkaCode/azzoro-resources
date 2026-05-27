import { loadSingleton } from './loadSingleton';

export async function loadGlobal<T extends Record<string, unknown>>(slug: string): Promise<T> {
  const result = await loadSingleton<T>(slug);
  const { markdown: _markdown, ...rest } = result as T & { markdown?: string };
  return rest as T;
}