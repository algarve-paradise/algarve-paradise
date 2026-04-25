/**
 * Polite HTTP fetcher used by the ingestion pipeline.
 *
 * - Identifies itself with a custom User-Agent so portals can rate-limit /
 *   block us if they wish.
 * - Honours a per-call timeout (default 15s).
 * - Sends If-Modified-Since when we have a previous fetch timestamp.
 */

const USER_AGENT =
  "AlgarveParadiseBot/1.0 (+https://algarveparadisemedia.pt; contact: geral@algarveparadisemedia.pt)";

export type FetchOptions = {
  timeoutMs?: number;
  ifModifiedSince?: string | null;
};

export type FetchResult = {
  ok: boolean;
  status: number;
  body: string;
  notModified: boolean;
  contentType: string | null;
};

export async function politeFetch(url: string, options: FetchOptions = {}): Promise<FetchResult> {
  const { timeoutMs = 15_000, ifModifiedSince } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    Accept:
      "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, text/html;q=0.5, */*;q=0.1",
    "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.5",
  };
  if (ifModifiedSince) {
    headers["If-Modified-Since"] = new Date(ifModifiedSince).toUTCString();
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
      redirect: "follow",
    });

    if (response.status === 304) {
      return {
        ok: true,
        status: 304,
        body: "",
        notModified: true,
        contentType: response.headers.get("content-type"),
      };
    }

    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      body,
      notModified: false,
      contentType: response.headers.get("content-type"),
    };
  } finally {
    clearTimeout(timer);
  }
}
