import { createHash } from "node:crypto";

/**
 * Stable hash for an ingested item. We use canonical URL + normalized title
 * so the same article re-published under a different mirror URL still
 * collides correctly.
 */
export function itemHash(input: { url: string; title: string }): string {
  const canonicalUrl = canonicalizeUrl(input.url);
  const normalizedTitle = input.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return createHash("sha256")
    .update(`${canonicalUrl}\n${normalizedTitle}`)
    .digest("hex");
}

/** Strip tracking params, normalize host, drop trailing slashes. */
export function canonicalizeUrl(input: string): string {
  try {
    const url = new URL(input);
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
    ];
    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }
    url.hash = "";
    url.host = url.host.toLowerCase();
    let pathname = url.pathname.replace(/\/+$/, "");
    if (!pathname) pathname = "/";
    url.pathname = pathname;
    return url.toString();
  } catch {
    return input.trim();
  }
}
