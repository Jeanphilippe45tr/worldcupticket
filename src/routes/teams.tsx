import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams — 2026 FIFA World Cup" },
      { name: "description", content: "All 48 nations competing at the 2026 FIFA World Cup, grouped by confederation." },
      { property: "og:title", content: "Teams — 2026 FIFA World Cup" },
      { property: "og:description", content: "Meet the 48 nations on the road to the 2026 FIFA World Cup." },
    ],
  }),
  component: TeamsPage,
});

type Confederation = { name: string; slots: number; teams: { name: string; flag: string; status: "Qualified" | "Host" | "In Qualifying" }[] };

const CONFEDS: Confederation[] = [
  {
    name: "CONCACAF (North & Central America)",
    slots: 6,
    teams: [
      { name: "United States", flag: "🇺🇸", status: "Host" },
      { name: "Canada", flag: "🇨🇦", status: "Host" },
      { name: "Mexico", flag: "🇲🇽", status: "Host" },
      { name: "Costa Rica", flag: "🇨🇷", status: "In Qualifying" },
      { name: "Panama", flag: "🇵🇦", status: "In Qualifying" },
      { name: "Jamaica", flag: "🇯🇲", status: "In Qualifying" },
    ],
  },
  {
    name: "UEFA (Europe)",
    slots: 16,
    teams: [
      { name: "France", flag: "🇫🇷", status: "In Qualifying" },
      { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", status: "In Qualifying" },
      { name: "Germany", flag: "🇩🇪", status: "In Qualifying" },
      { name: "Spain", flag: "🇪🇸", status: "In Qualifying" },
      { name: "Portugal", flag: "🇵🇹", status: "In Qualifying" },
      { name: "Italy", flag: "🇮🇹", status: "In Qualifying" },
      { name: "Netherlands", flag: "🇳🇱", status: "In Qualifying" },
      { name: "Belgium", flag: "🇧🇪", status: "In Qualifying" },
      { name: "Croatia", flag: "🇭🇷", status: "In Qualifying" },
    ],
  },
  {
    name: "CONMEBOL (South America)",
    slots: 6,
    teams: [
      { name: "Argentina", flag: "🇦🇷", status: "Qualified" },
      { name: "Brazil", flag: "🇧🇷", status: "In Qualifying" },
      { name: "Uruguay", flag: "🇺🇾", status: "In Qualifying" },
      { name: "Colombia", flag: "🇨🇴", status: "In Qualifying" },
      { name: "Ecuador", flag: "🇪🇨", status: "In Qualifying" },
      { name: "Paraguay", flag: "🇵🇾", status: "In Qualifying" },
    ],
  },
  {
    name: "AFC (Asia)",
    slots: 8,
    teams: [
      { name: "Japan", flag: "🇯🇵", status: "Qualified" },
      { name: "Iran", flag: "🇮🇷", status: "Qualified" },
      { name: "South Korea", flag: "🇰🇷", status: "Qualified" },
      { name: "Australia", flag: "🇦🇺", status: "In Qualifying" },
      { name: "Saudi Arabia", flag: "🇸🇦", status: "In Qualifying" },
      { name: "Qatar", flag: "🇶🇦", status: "In Qualifying" },
    ],
  },
  {
    name: "CAF (Africa)",
    slots: 9,
    teams: [
      { name: "Morocco", flag: "🇲🇦", status: "In Qualifying" },
      { name: "Senegal", flag: "🇸🇳", status: "In Qualifying" },
      { name: "Egypt", flag: "🇪🇬", status: "In Qualifying" },
      { name: "Nigeria", flag: "🇳🇬", status: "In Qualifying" },
      { name: "Algeria", flag: "🇩🇿", status: "In Qualifying" },
      { name: "Ivory Coast", flag: "🇨🇮", status: "In Qualifying" },
    ],
  },
  {
    name: "OFC (Oceania)",
    slots: 1,
    teams: [
      { name: "New Zealand", flag: "🇳🇿", status: "Qualified" },
    ],
  },
];

function TeamsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">48 nations · 6 confederations</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Teams</h1>
        <p className="mt-4 text-muted-foreground">
          The 2026 World Cup expands to 48 teams for the first time in history. The three hosts qualify automatically; the remaining 45 spots are decided through regional qualifying tournaments running through to spring 2026.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {CONFEDS.map((conf) => (
          <section key={conf.name} className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-bold">{conf.name}</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-gold">{conf.slots} slots</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {conf.teams.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-2">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-xl">{t.flag}</span>{t.name}
                  </span>
                  <span className={
                    t.status === "Host"
                      ? "rounded bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold"
                      : t.status === "Qualified"
                      ? "rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400"
                      : "rounded bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                  }>{t.status}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Qualification standings are updated by FIFA throughout the qualifying cycle. This page lists notable participants per confederation; the full 48-team field will be finalised ahead of the 2026 draw.
      </p>
    </div>
  );
}