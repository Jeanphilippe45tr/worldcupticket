import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, CreditCard, Shield, Ticket, Hotel, Languages } from "lucide-react";

export const Route = createFileRoute("/fan-guide")({
  head: () => ({
    meta: [
      { title: "Fan Guide — 2026 FIFA World Cup" },
      { name: "description", content: "Travel, entry, currency, transport and safety tips for fans attending the 2026 FIFA World Cup in the USA, Canada and Mexico." },
      { property: "og:title", content: "Fan Guide — 2026 FIFA World Cup" },
      { property: "og:description", content: "Everything you need to plan your trip to the 2026 FIFA World Cup." },
    ],
  }),
  component: FanGuidePage,
});

function FanGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Plan with confidence</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Fan Guide</h1>
        <p className="mt-4 text-muted-foreground">
          A practical, no-nonsense guide for fans travelling to the 2026 FIFA World Cup. Three host nations, three currencies, three sets of rules — here's what to know before you go.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card icon={<Plane />} title="Entry & visas">
          <p>Most international visitors will need an <strong>ESTA</strong> (USA), <strong>eTA</strong> (Canada) or an <strong>FMM</strong> tourist permit (Mexico). Check eligibility at least 90 days before travel — processing times spike around major tournaments.</p>
        </Card>
        <Card icon={<Ticket />} title="Tickets & FAN ID">
          <p>All match tickets are digital and tied to your account. Bring a valid passport that matches the booking name. Re-sale is permitted only through the official FIFA resale platform; tickets bought elsewhere may be cancelled at the gate.</p>
        </Card>
        <Card icon={<CreditCard />} title="Currency & payments">
          <p>USD in the United States, CAD in Canada, MXN in Mexico. Contactless cards are widely accepted in stadiums and major cities; carry small cash for transport and street food. Notify your bank before travelling to avoid fraud blocks.</p>
        </Card>
        <Card icon={<Hotel />} title="Accommodation">
          <p>Book early — host cities typically sell out 6–9 months ahead. Consider staying 30–60 minutes from the stadium and using metro / commuter rail on matchday for better value and easier transport.</p>
        </Card>
        <Card icon={<Shield />} title="Safety & health">
          <p>Travel insurance with medical cover is strongly recommended, especially for visitors to the US. Stadiums use clear-bag policies and metal detectors; arrive at least 90 minutes before kickoff. Emergency numbers: 911 (USA / Canada), 911 (Mexico).</p>
        </Card>
        <Card icon={<Languages />} title="Languages & culture">
          <p>English is universal across all host nations. Spanish is essential in Mexico and useful in many US cities. French is widely spoken in Montréal and parts of eastern Canada. A few learned phrases go a long way.</p>
        </Card>
      </div>

      <section className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-bold">Matchday checklist</h2>
        <ul className="mt-4 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
          <li>✓ Passport and digital ticket on your phone (with screenshot backup)</li>
          <li>✓ Fully charged phone or power bank</li>
          <li>✓ Empty clear bag (max 30×30×15cm in most venues)</li>
          <li>✓ Refillable water bottle (empty at security)</li>
          <li>✓ Layered clothing — weather can shift dramatically</li>
          <li>✓ Cash for transport and concessions</li>
          <li>✓ Pre-loaded transit app for your host city</li>
          <li>✓ Your team's shirt — and your voice</li>
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/host-cities" className="inline-flex h-10 items-center rounded-md border border-border bg-secondary/50 px-4 text-sm font-medium hover:bg-secondary">Browse host cities</Link>
        <Link to="/matches" className="inline-flex h-10 items-center rounded-md bg-gold px-4 text-sm font-bold text-pitch hover:bg-gold-glow">Find your match</Link>
      </div>
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-gold">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-gold/10">{icon}</span>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
      </div>
      <div className="mt-3 text-sm text-foreground/80 [&_strong]:text-foreground">{children}</div>
    </article>
  );
}