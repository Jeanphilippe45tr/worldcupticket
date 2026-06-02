import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { matchesQuery } from "@/lib/queries";
import { MatchCard } from "@/components/MatchCard";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const ticketsMinQuery = queryOptions({
  queryKey: ["tickets", "min"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("ticket_categories")
      .select("match_id, price");
    if (error) throw error;
    const map: Record<string, number> = {};
    for (const t of data ?? []) {
      const p = Number(t.price);
      if (map[t.match_id] == null || p < map[t.match_id]) map[t.match_id] = p;
    }
    return map;
  },
});

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "All Matches — World Cup Tickets 2026" },
      { name: "description", content: "Browse every fixture of the 2026 FIFA World Cup and secure your tickets." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(matchesQuery);
    context.queryClient.ensureQueryData(ticketsMinQuery);
  },
  component: MatchesPage,
  errorComponent: ({ error }) => <div className="p-8">Failed: {error.message}</div>,
});

function MatchesPage() {
  const { data: matches } = useSuspenseQuery(matchesQuery);
  const { data: mins } = useSuspenseQuery(ticketsMinQuery);
  const [stage, setStage] = useState<string>("All");

  const stages = ["All", ...Array.from(new Set(matches.map((m) => m.stage)))];
  const filtered = stage === "All" ? matches : matches.filter((m) => m.stage === stage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8 border-b border-border pb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-gold">Fixtures</span>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-5xl">All Matches</h1>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {stages.map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`rounded-md border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
              stage === s ? "bg-gold text-pitch" : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No matches yet. <Link to="/" className="text-gold">Go home</Link></p>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MatchCard key={m.id} match={m} minPrice={mins[m.id]} />
          ))}
        </div>
      )}
    </div>
  );
}