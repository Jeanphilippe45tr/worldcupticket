import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { featuredMatchesQuery, matchesQuery, newsQuery, liveNewsQuery } from "@/lib/queries";
import { LiveTicker } from "@/components/LiveTicker";
import { MatchCard } from "@/components/MatchCard";
import { Countdown } from "@/components/Countdown";
import heroImg from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(featuredMatchesQuery);
    context.queryClient.ensureQueryData(matchesQuery);
    context.queryClient.ensureQueryData(newsQuery);
    context.queryClient.ensureQueryData(liveNewsQuery);
  },
  component: Index,
});

function Index() {
  const { data: featured } = useSuspenseQuery(featuredMatchesQuery);
  const { data: matches } = useSuspenseQuery(matchesQuery);
  const { data: news } = useSuspenseQuery(newsQuery);
  const { data: live } = useSuspenseQuery(liveNewsQuery);
  const headlines = [
    ...news.map((n) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt ?? "",
      category: n.category ?? "Update",
      link: null as string | null,
    })),
    ...live.map((n) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt,
      category: n.category,
      link: n.link,
    })),
  ].slice(0, 3);

  return (
    <div>
      <LiveTicker matches={matches} />

      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Stadium at night with floodlights"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 md:px-6">
          <div className="animate-fade-in-up max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-gold">
              Opening Match · June 11, 2026 · Estadio Azteca
            </span>
            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-8xl">
              United <span className="text-gold">2026</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              The largest tournament in history. 48 nations, 16 host cities,
              104 matches across the United States, Canada, and Mexico.
            </p>
            <div className="mt-10 flex flex-wrap items-end gap-6">
              <Countdown />
              <Link
                to="/matches"
                className="inline-flex h-12 items-center rounded-md bg-gold px-8 font-bold uppercase tracking-tight text-pitch transition-colors hover:bg-gold-glow"
              >
                Secure Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-10 flex items-end justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">Featured Matches</h2>
            <p className="text-sm text-muted-foreground">Marquee fixtures across the tournament.</p>
          </div>
          <Link to="/matches" className="font-mono text-xs uppercase tracking-widest text-gold hover:text-gold-glow">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {featured.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      <section className="bg-turf py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 max-w-xl">
            <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">Experience Tiers</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              From the energy of the supporters' end to private VIP hospitality suites.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { tier: "Category 3", name: "Supporter", desc: "Upper tier with panoramic stadium views.", border: "border-foreground/20" },
              { tier: "Category 2", name: "Standard", desc: "Mid-tier visibility, excellent atmosphere.", border: "border-foreground/40" },
              { tier: "Category 1", name: "Prime", desc: "Lower bowl seating, closest to the pitch.", border: "border-foreground" },
              { tier: "Hospitality", name: "VIP Club", desc: "Catering, lounge access, exclusive perks.", border: "border-gold" },
            ].map((t) => (
              <div key={t.name} className={`border-l-4 bg-card p-6 ${t.border}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t.tier}</div>
                <h4 className="mt-1 text-lg font-bold uppercase tracking-tight">{t.name}</h4>
                <p className="mt-3 text-xs text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <h2 className="mb-10 text-2xl font-bold uppercase tracking-tight md:text-3xl">Latest Updates</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {headlines.map((n) => {
            const inner = (
              <>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold">{n.category}</span>
                <h3 className="mt-2 text-lg font-bold leading-snug group-hover:text-gold">{n.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{n.excerpt}</p>
              </>
            );
            return n.link ? (
              <a key={n.id} href={n.link} target="_blank" rel="noopener noreferrer"
                className="group block border border-border bg-card p-6 transition-colors hover:bg-turf">
                {inner}
              </a>
            ) : (
              <article key={n.id} className="group cursor-pointer border border-border bg-card p-6 transition-colors hover:bg-turf">
                {inner}
              </article>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link to="/news" className="font-mono text-xs uppercase tracking-widest text-gold hover:text-gold-glow">
            All news →
          </Link>
        </div>
      </section>
    </div>
  );
}
