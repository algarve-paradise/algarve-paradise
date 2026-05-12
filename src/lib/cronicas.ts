import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CronicaItem, CronicaStatus } from "@/types/content";

type CronicaRecord = {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: string | null;
  author_avatar_url: string | null;
  week_label: string;
  status: CronicaStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRecord(record: CronicaRecord): CronicaItem {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    authorName: record.author_name,
    authorRole: record.author_role,
    authorAvatarUrl: record.author_avatar_url,
    weekLabel: record.week_label,
    status: record.status,
    publishedAt: record.published_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export const getLatestCronica = cache(async (): Promise<CronicaItem | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cronicas")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load latest cronica", error);
    return null;
  }

  return data ? mapRecord(data as CronicaRecord) : null;
});

export async function getAdminCronicas(): Promise<CronicaItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cronicas")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data as CronicaRecord[]).map(mapRecord);
}

export async function getAdminCronicaById(id: string): Promise<CronicaItem | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cronicas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? mapRecord(data as CronicaRecord) : null;
}
