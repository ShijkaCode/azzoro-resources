import { describe, expect, it } from 'vitest';
import { loadSingleton } from './loadSingleton';

describe('loadSingleton', () => {
  it('reads EN singleton markdown and returns frontmatter plus body', async () => {
    const result = await loadSingleton<{ title: string; body: string }>('test-fixtures/sample', 'en');

    expect(result.title).toBe('Sample Page');
    expect(result.body).toBe('This is the body in EN.');
    expect(result.markdown).toContain('Markdown body content here.');
  });

  it('reads MN singleton markdown', async () => {
    const result = await loadSingleton<{ title: string }>('test-fixtures/sample', 'mn');

    expect(result.title).toBe('Жишээ хуудас');
  });

  it('reads singleton YAML when locale is omitted', async () => {
    const result = await loadSingleton<{ label: string }>('test-fixtures/global');

    expect(result.label).toBe('Global fixture');
  });

  it('throws on a missing file', async () => {
    await expect(loadSingleton('test-fixtures/does-not-exist', 'en')).rejects.toThrow();
  });
});