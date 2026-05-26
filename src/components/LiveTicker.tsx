import type { Tables } from "@/integrations/supabase/types";

export function LiveTicker({ matches }: { matches: Tables<"matches">[] }) {
  const items = matches.slice(0, 8);
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div className="border-b border-border bg-turf">
      <div className="flex h-10 items-center overflow-hidden">
        <div className="flex h-full flex-none items-center gap-2 bg-live px-3 text-[10px] font-bold uppercase tracking-wider text-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
          Upcoming
        </div>
        <div className="animate-marquee gap-10 px-6 text-xs font-mono whitespace-nowrap">
          {doubled.map((m, i) => (
            <span key={i} className="flex items-center gap-3 pr-10">
              <b className="text-gold">{m.team_home_code ?? m.team_home.slice(0, 3).toUpperCase()}</b>
              <span className="text-muted-foreground">vs</span>
              <b className="text-gold">{m.team_away_code ?? m.team_away.slice(0, 3).toUpperCase()}</b>
              <span className="text-muted-foreground">
                {new Date(m.kickoff_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <span className="h-3 w-px bg-border" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}