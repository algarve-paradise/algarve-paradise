import { cache } from "react";
import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteRoutes } from "@/lib/site";
import type { NewsCategory, NewsItem } from "@/types/content";

export type NewsRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  cover_image_url: string | null;
  cover_image_path: string | null;
  featured: boolean;
  live: boolean;
  status: "draft" | "published";
  source_name: string | null;
  source_url: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function mapNewsRecordToItem(record: NewsRecord): NewsItem {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content: record.content,
    date: record.published_at ?? record.created_at,
    category: record.category,
    href: `${siteRoutes.news}/${record.slug}`,
    imageLabel: record.title,
    imageUrl: record.cover_image_url,
    authorName: record.author_name,
    sourceName: record.source_name,
    sourceUrl: record.source_url,
    status: record.status,
    featured: record.featured,
    live: record.live,
  };
}

export const getPublishedNews = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Failed to load published news", error);
    return [] as NewsItem[];
  }

  return (data as NewsRecord[]).map(mapNewsRecordToItem);
});

export const getPublishedNewsBySlug = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapNewsRecordToItem(data as NewsRecord);
});

export async function getPublishedNewsOrThrow(slug: string) {
  const item = await getPublishedNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return item;
}

export async function getAdminNewsList() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as NewsRecord[]).map(mapNewsRecordToItem);
}

export async function getAdminNewsById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("news_posts").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapNewsRecordToItem(data as NewsRecord) : null;
}

export async function getAdminSummary() {
  const items = await getAdminNewsList();

  return {
    total: items.length,
    published: items.filter((item) => item.status === "published").length,
    featured: items.filter((item) => item.featured).length,
    live: items.filter((item) => item.live).length,
  };
}
