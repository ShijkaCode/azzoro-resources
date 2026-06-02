import 'server-only';
import { XMLParser } from 'fast-xml-parser';

export type InvestorNewsItem = {
  title: string;
  summary: string;
  href: string;
  publishedAt: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  parseTagValue: false,
  cdataPropName: '__cdata',
});

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function pickText(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  const record = value as Record<string, unknown>;

  return [record['#text'], record.__cdata, record.summary, record.title]
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .find(Boolean) ?? '';
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeDate(value: string): string {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
}

function parseRssFeed(xml: string): InvestorNewsItem[] {
  const document = parser.parse(xml);
  const items = ensureArray(document?.rss?.channel?.item);

  return items
    .map((item) => {
      const record = item as Record<string, unknown>;

      return {
        title: pickText(record.title),
        summary: stripHtml(pickText(record.description) || pickText(record['content:encoded'])),
        href: pickText(record.link),
        publishedAt: normalizeDate(pickText(record.pubDate)),
      };
    })
    .filter((item) => item.title && item.href);
}

function parseAtomFeed(xml: string): InvestorNewsItem[] {
  const document = parser.parse(xml);
  const entries = ensureArray(document?.feed?.entry);

  return entries
    .map((entry) => {
      const record = entry as Record<string, unknown>;
      const links = ensureArray(record.link as Record<string, unknown> | Record<string, unknown>[] | undefined);
      const primaryLink =
        links.find((link) => (link?.['@_rel'] as string | undefined) === 'alternate') ?? links[0];

      return {
        title: pickText(record.title),
        summary: stripHtml(pickText(record.summary) || pickText(record.content)),
        href: typeof primaryLink?.['@_href'] === 'string' ? primaryLink['@_href'] : '',
        publishedAt: normalizeDate(pickText(record.updated) || pickText(record.published)),
      };
    })
    .filter((item) => item.title && item.href);
}

function parseJsonFeed(payload: string): InvestorNewsItem[] {
  const document = JSON.parse(payload) as {
    items?: Array<{
      title?: string;
      url?: string;
      summary?: string;
      content_text?: string;
      date_published?: string;
    }>;
  };

  return ensureArray(document.items)
    .map((item) => ({
      title: item.title?.trim() ?? '',
      summary: stripHtml(item.summary?.trim() || item.content_text?.trim() || ''),
      href: item.url?.trim() ?? '',
      publishedAt: normalizeDate(item.date_published ?? ''),
    }))
    .filter((item) => item.title && item.href);
}

function parseInvestorNews(payload: string, contentType: string | null): InvestorNewsItem[] {
  const trimmed = payload.trim();

  if (!trimmed) {
    return [];
  }

  if (contentType?.includes('json') || trimmed.startsWith('{')) {
    return parseJsonFeed(trimmed);
  }

  if (trimmed.includes('<feed')) {
    return parseAtomFeed(trimmed);
  }

  return parseRssFeed(trimmed);
}

export async function fetchInvestorNews(limit = 3): Promise<InvestorNewsItem[]> {
  const feedUrl = process.env.INVESTOR_FEED_URL?.trim();

  if (!feedUrl) {
    return [];
  }

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 900 },
      headers: {
        'User-Agent': 'azzuroresources.com bot (contact: tech@azzuroresources.com)',
      },
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.text();
    return parseInvestorNews(payload, response.headers.get('content-type')).slice(0, limit);
  } catch {
    return [];
  }
}