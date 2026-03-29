import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface NewsItem {
  title: string;
  url: string;
  source: string;
  pubDate: string | null;
  description: string;
}

interface Cache {
  items: NewsItem[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: Cache | null = null;

const FEEDS: { url: string; source: string; type: "rss" | "atom" }[] = [
  {
    url: "https://feeds.bbci.co.uk/news/education/rss.xml",
    source: "BBC Education",
    type: "rss",
  },
  {
    url: "https://www.tes.com/news/rss",
    source: "TES",
    type: "rss",
  },
  {
    url: "https://www.gov.uk/search/news-and-communications.atom?organisations[]=department-for-education",
    source: "DfE Gov.UK",
    type: "atom",
  },
  {
    url: "https://www.timeshighereducation.com/node/feed",
    source: "Times Higher Education",
    type: "rss",
  },
];

function extractTag(xml: string, tag: string): string | null {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  ];
  for (const p of patterns) {
    const m = xml.match(p);
    if (m) return m[1].trim();
  }
  return null;
}

function extractAtomTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (m) return m[1].trim();
  const selfClose = xml.match(new RegExp(`<${tag}[^>]*href="([^"]+)"`, "i"));
  if (selfClose) return selfClose[1].trim();
  return null;
}

function parseRssItems(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = extractTag(block, "title") ?? "";
    const rawLink = extractTag(block, "link") ?? "";
    const guid = extractTag(block, "guid") ?? "";
    const url = rawLink || guid;
    const pubDate = extractTag(block, "pubDate");
    const description = extractTag(block, "description") ?? "";
    if (title && url) {
      items.push({
        title: title.replace(/<[^>]+>/g, "").trim(),
        url: url.trim(),
        source,
        pubDate,
        description: description.replace(/<[^>]+>/g, "").trim().slice(0, 180),
      });
    }
  }
  return items;
}

function parseAtomEntries(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = extractAtomTag(block, "title") ?? "";
    const url = extractAtomTag(block, "link") ?? "";
    const updated = extractAtomTag(block, "updated");
    const summary = extractAtomTag(block, "summary") ?? "";
    if (title && url) {
      items.push({
        title: title.replace(/<[^>]+>/g, "").trim(),
        url: url.trim(),
        source,
        pubDate: updated,
        description: summary.replace(/<[^>]+>/g, "").trim().slice(0, 180),
      });
    }
  }
  return items;
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "MyPassUK/1.0 (+https://mypassuk.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    if (feed.type === "atom") return parseAtomEntries(xml, feed.source);
    return parseRssItems(xml, feed.source);
  } catch {
    return [];
  }
}

async function getNews(): Promise<NewsItem[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.items;
  }

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const all: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db2 = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db2 - da;
  });

  const items = all.slice(0, 16);
  cache = { items, fetchedAt: Date.now() };
  return items;
}

router.get("/news", async (req, res) => {
  try {
    const items = await getNews();
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch news");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch news" });
  }
});

export default router;
