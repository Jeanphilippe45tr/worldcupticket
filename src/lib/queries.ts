import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const matchesQuery = queryOptions({
  queryKey: ["matches"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("kickoff_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const featuredMatchesQuery = queryOptions({
  queryKey: ["matches", "featured"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("featured", true)
      .order("kickoff_at", { ascending: true })
      .limit(6);
    if (error) throw error;
    return data ?? [];
  },
});

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const matchDetailQuery = (id: string) =>
  queryOptions({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data: match, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      const { data: tickets, error: tErr } = await supabase
        .from("ticket_categories")
        .select("*")
        .eq("match_id", id)
        .order("sort_order", { ascending: true });
      if (tErr) throw tErr;
      return { match, tickets: tickets ?? [] };
    },
  });