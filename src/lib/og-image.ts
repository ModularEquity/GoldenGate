/**
 * Fetch Open Graph image URL from a property listing page (Redfin, etc.).
 */
export async function fetchOgImageUrl(pageUrl: string): Promise<string | null> {
  const url = pageUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return null;
  }

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ModularEquityBot/1.0; +https://modularequity.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(t);
    if (!res.ok) return null;

    const html = await res.text();
    const og =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      );
    const href = og?.[1]?.trim();
    if (!href) return null;
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) {
      const u = new URL(url);
      return `${u.origin}${href}`;
    }
    return href;
  } catch (e) {
    console.warn("[og-image] fetch failed:", url, e);
    return null;
  }
}
