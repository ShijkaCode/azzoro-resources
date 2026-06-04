// Locale fallback: EN is the source of truth. Non-default locales (mn) render
// EN's full structure and images, with translated TEXT overlaid where the
// client has actually entered it. Result:
//   - missing/empty MN text  -> shows EN text (never blank)
//   - MN structure (lists, cards, sections) always matches EN
//   - images always come from EN (MN image divergence is ignored)
// EN itself is never merged — it loads directly, so the primary locale is
// completely unaffected.

const UPLOADS_RE = /^\/uploads\//;
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|avif|svg|gif)$/i;

function isImagePath(value: unknown): value is string {
  return typeof value === 'string' && UPLOADS_RE.test(value) && IMAGE_EXT_RE.test(value);
}

/**
 * Deep-merge a translation (`override`, e.g. MN) onto a base (`base`, e.g. EN).
 * `base` defines the structure; `override` only contributes non-empty text.
 */
export function mergeLocale<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (base === undefined || base === null) return override as T;

  // Arrays: EN defines length/shape; overlay translations by index. Extra MN
  // items beyond EN's length are dropped so structure always matches EN.
  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;
    return base.map((item, i) => mergeLocale(item, override[i])) as unknown as T;
  }

  // Objects: iterate EN keys (structure source); merge MN where present.
  if (typeof base === 'object') {
    if (typeof override !== 'object' || Array.isArray(override)) return base;
    const out: Record<string, unknown> = {};
    const baseObj = base as Record<string, unknown>;
    const overObj = override as Record<string, unknown>;
    for (const key of Object.keys(baseObj)) {
      out[key] = mergeLocale(baseObj[key], overObj[key]);
    }
    // Preserve any MN-only keys (harmless extra data, never structural).
    for (const key of Object.keys(overObj)) {
      if (!(key in out)) out[key] = overObj[key];
    }
    return out as T;
  }

  // Strings: images always come from EN; other text uses MN when non-empty.
  if (typeof base === 'string') {
    if (isImagePath(base)) return base;
    if (typeof override === 'string' && override.trim() !== '') return override as T;
    return base;
  }

  // Numbers / booleans: EN is the source of truth for structure & config.
  return base;
}
