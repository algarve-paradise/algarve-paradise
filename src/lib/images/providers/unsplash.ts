import { env } from "@/lib/env";
import type { StockImage } from "../index";

type UnsplashResponse = {
  results: Array<{
    urls: { regular?: string; full?: string };
    user: { name: string; links: { html: string } };
    links: { html: string };
  }>;
};

export async function findUnsplashImage(query: string): Promise<StockImage | null> {
  if (!env.UNSPLASH_ACCESS_KEY) return null;

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");

  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}` },
  });
  if (!response.ok) {
    throw new Error(`Unsplash ${response.status}`);
  }

  const payload = (await response.json()) as UnsplashResponse;
  const photo = payload.results[0];
  if (!photo) return null;

  return {
    url: photo.urls.regular ?? photo.urls.full ?? "",
    credit: `Foto: ${photo.user.name} / Unsplash`,
    creditUrl: photo.user.links.html,
  };
}
