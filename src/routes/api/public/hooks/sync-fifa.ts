import { createFileRoute } from "@tanstack/react-router";

type FDMatch = {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group: string | null;
  homeTeam: { name: string | null; tla: string | null };
  awayTeam: { name: string | null; tla: string | null };
  score: { fullTime: { home: number | null; away: number | null } };
  venue?: string | null;
};

export const Route = createFileRoute("/api/public/hooks/sync-fifa")({
  server: {
    handlers: {
      POST: async () => {
        const apiKey = process.env.FOOTBALL_DATA_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing FOOTBALL_DATA_API_KEY" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
          headers: { "X-Auth-Token": apiKey },
        });
        if (!res.ok) {
          return new Response(JSON.stringify({ error: `football-data ${res.status}` }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const json = (await res.json()) as { matches?: FDMatch[] };
        const matches = json.matches ?? [];
        let created = 0;
        let updated = 0;

        for (const m of matches) {
          const payload = {
            match_number: m.id,
            kickoff_at: m.utcDate,
            status: (m.status || "scheduled").toLowerCase(),
            stage: m.stage || "Group Stage",
            group_name: m.group ?? null,
            team_home: m.homeTeam?.name ?? "TBD",
            team_home_code: m.homeTeam?.tla ?? null,
            team_away: m.awayTeam?.name ?? "TBD",
            team_away_code: m.awayTeam?.tla ?? null,
            score_home: m.score?.fullTime?.home ?? null,
            score_away: m.score?.fullTime?.away ?? null,
            venue: m.venue ?? "TBD",
            country: "USA / Canada / Mexico",
            city: "TBD",
          };

          const { data: existing } = await supabaseAdmin
            .from("matches")
            .select("id")
            .eq("match_number", m.id)
            .maybeSingle();

          if (existing) {
            const { error } = await supabaseAdmin.from("matches").update(payload).eq("id", existing.id);
            if (!error) updated++;
          } else {
            const { data: inserted, error } = await supabaseAdmin
              .from("matches")
              .insert(payload)
              .select("id")
              .single();
            if (!error && inserted) {
              created++;
              await supabaseAdmin.from("ticket_categories").insert([
                { match_id: inserted.id, name: "Category 1 (VIP)", price: 500, available: 200, sort_order: 1 },
                { match_id: inserted.id, name: "Category 2", price: 250, available: 500, sort_order: 2 },
                { match_id: inserted.id, name: "Category 3", price: 120, available: 1000, sort_order: 3 },
                { match_id: inserted.id, name: "Category 4", price: 60, available: 2000, sort_order: 4 },
              ]);
            }
          }
        }

        return new Response(
          JSON.stringify({ success: true, total: matches.length, created, updated }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});