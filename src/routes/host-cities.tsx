import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Users, Building2 } from "lucide-react";

export const Route = createFileRoute("/host-cities")({
  head: () => ({
    meta: [
      { title: "Host Cities — 2026 FIFA World Cup" },
      { name: "description", content: "All 16 host cities of the 2026 FIFA World Cup across the USA, Canada and Mexico — stadiums, capacities and what to expect." },
      { property: "og:title", content: "Host Cities — 2026 FIFA World Cup" },
      { property: "og:description", content: "Discover the 16 host cities for the 2026 FIFA World Cup across three nations." },
    ],
  }),
  component: HostCitiesPage,
});

type HostCity = {
  city: string;
  country: "USA" | "Canada" | "Mexico";
  stadium: string;
  capacity: string;
  matches: string;
  blurb: string;
};

const CITIES: HostCity[] = [
  { city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", capacity: "75,000", matches: "8 matches", blurb: "Retractable-roof venue hosting a Round of 16 and quarter-final tie." },
  { city: "Boston", country: "USA", stadium: "Gillette Stadium (Foxborough)", capacity: "65,878", matches: "7 matches", blurb: "Historic New England venue with multiple group-stage and knockout fixtures." },
  { city: "Dallas", country: "USA", stadium: "AT&T Stadium (Arlington)", capacity: "92,967", matches: "9 matches", blurb: "One of the largest venues — hosts a semi-final." },
  { city: "Houston", country: "USA", stadium: "NRG Stadium", capacity: "72,220", matches: "7 matches", blurb: "Climate-controlled stadium in the heart of Texas." },
  { city: "Kansas City", country: "USA", stadium: "Arrowhead Stadium", capacity: "76,416", matches: "6 matches", blurb: "Famous for the loudest crowd in American sport." },
  { city: "Los Angeles", country: "USA", stadium: "SoFi Stadium (Inglewood)", capacity: "70,240", matches: "8 matches", blurb: "State-of-the-art venue welcoming millions of visitors." },
  { city: "Miami", country: "USA", stadium: "Hard Rock Stadium", capacity: "65,326", matches: "7 matches", blurb: "Sun-soaked South Florida atmosphere with global fan culture." },
  { city: "New York / New Jersey", country: "USA", stadium: "MetLife Stadium (East Rutherford)", capacity: "82,500", matches: "8 matches", blurb: "Confirmed venue for the FIFA World Cup 2026 Final." },
  { city: "Philadelphia", country: "USA", stadium: "Lincoln Financial Field", capacity: "69,796", matches: "6 matches", blurb: "Birthplace-of-the-nation vibes meet world football." },
  { city: "San Francisco Bay Area", country: "USA", stadium: "Levi's Stadium (Santa Clara)", capacity: "68,500", matches: "6 matches", blurb: "Silicon Valley meets the beautiful game." },
  { city: "Seattle", country: "USA", stadium: "Lumen Field", capacity: "68,740", matches: "6 matches", blurb: "Soccer-mad Pacific Northwest crowds guaranteed." },
  { city: "Toronto", country: "Canada", stadium: "BMO Field", capacity: "45,500 (expanded)", matches: "6 matches", blurb: "Canada's footballing heart, freshly expanded for 2026." },
  { city: "Vancouver", country: "Canada", stadium: "BC Place", capacity: "54,500", matches: "7 matches", blurb: "Retractable-roof venue on the Pacific coast." },
  { city: "Guadalajara", country: "Mexico", stadium: "Estadio Akron", capacity: "48,071", matches: "4 matches", blurb: "Mexico's second-largest city, hosting Group-stage drama." },
  { city: "Mexico City", country: "Mexico", stadium: "Estadio Azteca", capacity: "87,000", matches: "5 matches", blurb: "The only stadium to host three World Cups — 1970, 1986 and 2026." },
  { city: "Monterrey", country: "Mexico", stadium: "Estadio BBVA", capacity: "53,500", matches: "4 matches", blurb: "Modern venue in northern Mexico's industrial powerhouse." },
];

const FLAG: Record<string, string> = { USA: "🇺🇸", Canada: "🇨🇦", Mexico: "🇲🇽" };

function HostCitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Three nations, one tournament</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Host Cities</h1>
        <p className="mt-4 text-muted-foreground">
          For the first time, the FIFA World Cup will be played across three countries — the United States, Canada and Mexico — with 16 host cities and 104 matches. Plan your trip with venue details, capacities and matchday counts.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((c) => (
          <article key={c.city} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-gold/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gold">{FLAG[c.country]} {c.country}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.matches}</span>
            </div>
            <h2 className="mt-2 text-xl font-bold">{c.city}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Building2 className="h-3.5 w-3.5" />{c.stadium}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-3.5 w-3.5" />Capacity {c.capacity}</p>
            <p className="mt-3 text-sm text-foreground/80">{c.blurb}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 text-gold" />
          <div>
            <h3 className="text-lg font-bold">Ready to pick a match?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Browse the full fixture list and secure your seats while availability lasts.</p>
            <Link to="/matches" className="mt-4 inline-flex h-10 items-center rounded-md bg-gold px-4 text-sm font-bold text-pitch hover:bg-gold-glow">
              Explore matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}