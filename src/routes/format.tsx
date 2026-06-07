import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Trophy, Users } from "lucide-react";

export const Route = createFileRoute("/format")({
  head: () => ({
    meta: [
      { title: "Tournament Format — 2026 FIFA World Cup" },
      { name: "description", content: "How the expanded 48-team 2026 FIFA World Cup works — groups, knockouts, dates and the road to the final at MetLife Stadium." },
      { property: "og:title", content: "Tournament Format — 2026 FIFA World Cup" },
      { property: "og:description", content: "The new 12-group, 48-team format explained." },
    ],
  }),
  component: FormatPage,
});

const STAGES = [
  { name: "Group Stage", dates: "Jun 11 – Jun 27, 2026", detail: "12 groups of 4 teams. Each team plays 3 matches. Top 2 from each group plus the 8 best third-placed teams advance — 32 teams in total." },
  { name: "Round of 32", dates: "Jun 28 – Jul 3, 2026", detail: "A brand new knockout round added for 2026. Single-leg ties; extra time and penalties if level." },
  { name: "Round of 16", dates: "Jul 4 – Jul 7, 2026", detail: "The traditional last-16 stage — winners of R32 face off." },
  { name: "Quarter-finals", dates: "Jul 9 – Jul 11, 2026", detail: "Eight teams remain; venues across all three host nations." },
  { name: "Semi-finals", dates: "Jul 14 – Jul 15, 2026", detail: "Hosted in the United States — AT&T Stadium (Dallas) and one other US venue." },
  { name: "Third-place play-off", dates: "Jul 18, 2026", detail: "The losing semi-finalists meet at Hard Rock Stadium, Miami." },
  { name: "Final", dates: "Jul 19, 2026", detail: "MetLife Stadium, New York / New Jersey — the 23rd FIFA World Cup champion is crowned." },
];

function FormatPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold">A new era for the World Cup</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Tournament Format</h1>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          The 2026 edition is the largest FIFA World Cup ever — 48 teams, 104 matches, 39 days. Here's how it works, stage by stage.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Stat icon={<Users className="h-5 w-5" />} label="Teams" value="48" />
        <Stat icon={<Calendar className="h-5 w-5" />} label="Matches" value="104" />
        <Stat icon={<Trophy className="h-5 w-5" />} label="Final" value="Jul 19, 2026" />
      </div>

      <ol className="mt-10 space-y-4">
        {STAGES.map((s, i) => (
          <li key={s.name} className="relative rounded-lg border border-border bg-card p-5 md:pl-16">
            <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold font-mono text-sm font-bold text-pitch md:absolute md:left-4 md:top-5 md:mb-0">
              {i + 1}
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">{s.name}</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{s.dates}</span>
            </div>
            <p className="mt-2 text-sm text-foreground/80">{s.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-lg border border-gold/40 bg-gold/5 p-6">
        <h3 className="text-lg font-bold">Why 12 groups?</h3>
        <p className="mt-2 text-sm text-foreground/80">
          Expanding to 48 teams meant FIFA needed a new structure. The 12-group format keeps every group meaningful: only the top two automatic spots plus the eight best third-place finishers progress, so a strong third-place run can still send a team into the knockouts.
        </p>
        <Link to="/matches" className="mt-4 inline-flex h-10 items-center rounded-md bg-gold px-4 text-sm font-bold text-pitch hover:bg-gold-glow">
          See the fixtures
        </Link>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-gold">{icon}<span className="text-xs font-bold uppercase tracking-widest">{label}</span></div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}