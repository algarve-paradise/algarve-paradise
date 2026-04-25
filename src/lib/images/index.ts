/**
 * Stock-image lookup for AI-generated drafts.
 *
 * Returns a URL + attribution string for the closest free-license cover
 * we can find for the article topic. Always tolerant: if no provider is
 * configured or the lookup fails, returns null and the draft is created
 * without a cover (the human reviewer can attach one later).
 */
import { env } from "@/lib/env";
import { findPexelsImage } from "./providers/pexels";
import { findUnsplashImage } from "./providers/unsplash";

export type StockImage = {
  url: string;
  /** Human-readable credit, e.g. "Foto: Joao Silva / Pexels". */
  credit: string;
  /** Photographer profile or photo page on the source site. */
  creditUrl: string | null;
};

export async function findCoverImage(query: string): Promise<StockImage | null> {
  const provider = env.IMAGE_PROVIDER;
  if (provider === "none") return null;

  try {
    if (provider === "unsplash") {
      return await findUnsplashImage(query);
    }
    return await findPexelsImage(query);
  } catch (error) {
    // Log but never let an image failure block the pipeline.
    console.warn(`findCoverImage(${provider}) failed:`, (error as Error).message);
    return null;
  }
}
