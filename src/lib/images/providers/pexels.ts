import { env } from "@/lib/env";
import type { StockImage } from "../index";

type PexelsResponse = {
  photos: Array<{
    src: { large2x?: string; large?: string; original?: string };
    photographer: string;
    photographer_url: string;
    url: string;
  }>;
};

export async function findPexelsImage(query: string): Promise<StockImage | null> {
  if (!env.PEXELS_API_KEY) return null;

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("locale", "pt-PT");

  const response = await fetch(url, {
    headers: { Authorization: env.PEXELS_API_KEY },
  });
  if (!response.ok) {
    throw new Error(`Pexels ${response.status}`);
  }

  const payload = (await response.json()) as PexelsResponse;
  const photo = payload.photos[0];
  if (!photo) return null;

  return {
    url: photo.src.large2x ?? photo.src.large ?? photo.src.original ?? "",
    credit: `Foto: ${photo.photographer} / Pexels`,
    creditUrl: photo.photographer_url,
  };
}
