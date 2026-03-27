/**
 * Fetch best property image URL from a listing page (Redfin, etc.).
 * Tries og:image, twitter:image, JSON-LD image, and common Redfin patterns.
 */
export async function fetchOgImageUrl(pageUrl: string): Promise<string | null> {
  const url = pageUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return null;
  }

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(t);
    if (!res.ok) return null;

    const html = await res.text();
    const base = new URL(url);

    const candidates: string[] = [];

    const push = (raw: string | undefined | null) => {
      if (!raw) return;
      const s = raw.trim();
      if (!s || s.length < 10) return;
      if (s.startsWith("//")) {
        candidates.push(`https:${s}`);
        return;
      }
      if (s.startsWith("http")) {
        candidates.push(s);
        return;
      }
      if (s.startsWith("/")) {
        candidates.push(`${base.origin}${s}`);
        return;
      }
    };

    const og =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      );
    push(og?.[1]);

    const tw =
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      );
    push(tw?.[1]);

    const ld = html.match(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    if (ld?.[1]) {
      try {
        const json = JSON.parse(ld[1]) as unknown;
        const extractImg = (o: unknown): void => {
          if (!o || typeof o !== "object") return;
          const r = o as Record<string, unknown>;
          if (typeof r.image === "string") push(r.image);
          if (Array.isArray(r.image)) {
            for (const x of r.image) {
              if (typeof x === "string") push(x);
              if (x && typeof x === "object" && "url" in x)
                push(String((x as { url: string }).url));
            }
          }
          if (r["@graph"] && Array.isArray(r["@graph"])) {
            for (const g of r["@graph"]) extractImg(g);
          }
        };
        extractImg(json);
      } catch {
        /* ignore */
      }
    }

    const photoRe =
      /https:\/\/ssl\.cdn-redfin\.com\/photo\/[^"'\s>]+/gi;
    let m: RegExpExecArray | null;
    while ((m = photoRe.exec(html)) !== null) {
      push(m[0].replace(/\\u002F/g, "/"));
    }

    const uniq = [...new Set(candidates)].filter((u) => {
      try {
        const p = new URL(u);
        return p.protocol === "https:" || p.protocol === "http:";
      } catch {
        return false;
      }
    });

    const prefer = (list: string[]) =>
      list.find(
        (u) =>
          /\.(jpg|jpeg|png|webp)(\?|$)/i.test(u) &&
          !u.includes("avatar") &&
          !u.includes("logo"),
      ) ?? list[0];

    return prefer(uniq) ?? null;
  } catch (e) {
    console.warn("[og-image] fetch failed:", url, e);
    return null;
  }
}
