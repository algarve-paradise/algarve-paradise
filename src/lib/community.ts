import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CommunityMessage } from "@/types/content";

type CommunityMessageRecord = {
  name: string;
  municipality: string | null;
  message: string;
};

export const getApprovedCommunityMessages = cache(async (): Promise<CommunityMessage[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("community_messages")
    .select("name, municipality, message")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Failed to load community messages", error);
    return [];
  }

  return (data as CommunityMessageRecord[]).map((r) => ({
    name: r.name,
    municipality: r.municipality ?? "Algarve",
    message: r.message,
  }));
});
