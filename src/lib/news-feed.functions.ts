import { createServerFn } from "@tanstack/react-start";

export type LiveNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  category: string;
  excerpt: string;
  published_at: string;
};

const FEEDS: { url: string; category: string }[] = [
  {
    url: "https://news.google.com/rss/search?q=%22FIFA+World+Cup+2026%22&hl=en-US&gl=US&ceid=US:en",
    category: "World Cup 2026",
  },
  {
    url: "https://news.google.com/rss/search?q=%22World+Cup+2026%22+tickets&hl=en-US&gl=US&ceid=US:en",
    category: "Tickets",
  },
  {
    url: "https://news.google.com/rss/search?q=%22World+Cup+2026%22+host+cities&hl=en-US&gl=US&ceid=US:en",
    category: "Host Cities",
  },
];

function pick(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

function stripHtml(s: string): string {
  // Decode entities FIRST so encoded tags (&lt;a&gt;) become real tags, then strip.
  let out = decodeEntities(s);
  out = decodeEntities(out); // handle double-encoded
  out = out.replace(/<[^>]+>/g, " ");
  return out.replace(/\s+/g, " ").trim();
}

function parseItems(xml: string, category: string): LiveNewsItem[] {
  const items: LiveNewsItem[] = [];
  const re = /<item[\s\S]*?<\/item>/gi;
  const matches = xml.match(re) ?? [];
  for (const raw of matches) {
    const title = stripHtml(pick(raw, "title"));
    const link = stripHtml(pick(raw, "link"));
    const pub = pick(raw, "pubDate");
    const desc = stripHtml(pick(raw, "description"));
    const source = stripHtml(pick(raw, "source")) || "Google News";
    if (!title || !link) continue;
    items.push({
      id: link,
      title,
      link,
      source,
      category,
      excerpt: desc.slice(0, 280),
      published_at: pub ? new Date(pub).toISOString() : new Date().toISOString(),
    });
  }
  return items;
}

export const getLiveWorldCupNews = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      const res = await fetch(f.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; WorldCupTickets/1.0)" },
      });
      if (!res.ok) throw new Error(`Feed ${f.url} returned ${res.status}`);
      const xml = await res.text();
      return parseItems(xml, f.category);
    }),
  );

  const all: LiveNewsItem[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      const key = item.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(item);
    }
  }
  all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  return all.slice(0, 30);
});