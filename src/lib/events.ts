import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteRoutes } from "@/lib/site";
import type { EventItem } from "@/types/content";

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  category: string;
  cover_image_url: string | null;
  cover_image_path: string | null;
  source_name: string | null;
  source_url: string | null;
  status: "draft" | "published";
  region: string | null;
  ai_generated: boolean | null;
  ai_provider: string | null;
  ai_model: string | null;
  ai_confidence: number | null;
  ai_review_deadline: string | null;
  ingest_item_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function mapEventRecordToItem(record: EventRecord): EventItem {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    date: dateFormatter.format(new Date(record.starts_at)),
    startsAt: record.starts_at,
    endsAt: record.ends_at,
    location: record.location,
    href: `${siteRoutes.events}#${record.slug}`,
    imageLabel: record.title,
    imageUrl: record.cover_image_url,
    sourceName: record.source_name,
    sourceUrl: record.source_url,
    status: record.status,
    region: record.region ?? "algarve",
    aiGenerated: record.ai_generated ?? false,
    aiProvider: record.ai_provider,
    aiModel: record.ai_model,
    aiConfidence: record.ai_confidence,
    aiReviewDeadline: record.ai_review_deadline,
  };
}

export const getHomepageEvents = cache(async () => {
  const events = await getPublishedEvents();
  return [...events].sort((a, b) => {
    const aHasImage = a.imageUrl ? 1 : 0;
    const bHasImage = b.imageUrl ? 1 : 0;
    if (aHasImage !== bHasImage) return bHasImage - aHasImage;
    const dateA = a.startsAt ? new Date(a.startsAt).getTime() : 0;
    const dateB = b.startsAt ? new Date(b.startsAt).getTime() : 0;
    return dateA - dateB;
  });
});

export const getPublishedEvents = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("Failed to load published events", error);
    return [] as EventItem[];
  }
  return (data as EventRecord[]).map(mapEventRecordToItem);
});

export async function getAdminEventsList() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data as EventRecord[]).map(mapEventRecordToItem);
}

export async function getAdminEventById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data ? mapEventRecordToItem(data as EventRecord) : null;
}

