import { Link } from "@tanstack/react-router";
import type { Tables } from "@/integrations/supabase/types";
import { formatMatchDate, formatMatchTime } from "@/lib/format";

export function MatchCard({ match, minPrice }: { match: Tables<"matches">; minPrice?: number }) {
  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: match.id }}
      className="group flex flex-col gap-6 border border-border bg-card p-6 transition-colors hover:bg-turf"
    >
      <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
        <span>{match.stage}{match.group_name ? ` · Group ${match.group_name}` : ""}</span>
        <span>{formatMatchDate(match.kickoff_at)}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-border bg-secondary text-[10px] font-bold text-muted-foreground transition-colors group-hover:border-gold/50">
            {match.team_home_code ?? match.team_home.slice(0, 3).toUpperCase()}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">{match.team_home}</span>
        </div>
        <div className="font-mono text-xl text-foreground/20">VS</div>
        <div className="flex flex-col items-center gap-2">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-border bg-secondary text-[10px] font-bold text-muted-foreground transition-colors group-hover:border-gold/50">
            {match.team_away_code ?? match.team_away.slice(0, 3).toUpperCase()}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">{match.team_away}</span>
        </div>
      </div>
      <div className="flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Venue</p>
          <p className="text-xs font-medium">{match.venue}, {match.city}</p>
          <p className="text-[10px] text-muted-foreground">{formatMatchTime(match.kickoff_at)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase text-muted-foreground">From</p>
          <p className="font-mono text-lg font-bold text-gold">
            {minPrice != null ? `$${minPrice.toFixed(0)}` : "TBA"}
          </p>
        </div>
      </div>
    </Link>
  );
}