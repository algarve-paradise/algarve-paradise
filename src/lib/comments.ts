import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type NewsComment = {
  id: string;
  article_slug: string;
  name: string;
  comment: string;
  created_at: string;
};

export const getApprovedNewsComments = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news_comments")
    .select("id, article_slug, name, comment, created_at")
    .eq("article_slug", slug)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load news comments", error);
    return [] as NewsComment[];
  }

  return data as NewsComment[];
});

