import { describe, expect, it } from 'vitest';
import { loadGlobal } from './loadGlobal';

describe('loadGlobal', () => {
  it('reads a global YAML file', async () => {
    const result = await loadGlobal<{ label: string }>('test-fixtures/global');

    expect(result.label).toBe('Global fixture');
  });

  it('throws on missing file', async () => {
    await expect(loadGlobal('test-fixtures/missing')).rejects.toThrow();
  });
});