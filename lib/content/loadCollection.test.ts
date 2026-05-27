import { describe, expect, it } from 'vitest';
import { loadCollection } from './loadCollection';

describe('loadCollection', () => {
  it('reads all markdown entries for a locale', async () => {
    const items = await loadCollection<{ title: string; order: number }>('test-fixtures/items', 'en');

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.title)).toEqual(['Item One', 'Item Two']);
  });

  it('attaches a slug derived from the filename', async () => {
    const items = await loadCollection<{ title: string }>('test-fixtures/items', 'en');

    expect(items.map((item) => item.slug)).toEqual(['item-1', 'item-2']);
  });

  it('loads non-localized YAML entries too', async () => {
    const items = await loadCollection<{ label: string; order: number }>('test-fixtures/global-items');

    expect(items.map((item) => item.label)).toEqual(['First global item', 'Second global item']);
  });
});