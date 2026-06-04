import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { matchDetailQuery } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { formatMatchDate, formatMatchTime, formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin, Clock, Trophy, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/matches/$matchId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(matchDetailQuery(params.matchId)),
  component: MatchDetail,
  errorComponent: ({ error }) => <div className="p-8">Failed: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Match not found.</div>,
});

function MatchDetail() {
  const { matchId } = Route.useParams();
  const { data } = useSuspenseQuery(matchDetailQuery(matchId));
  const { add } = useCart();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  if (!data.match) throw notFound();
  const m = data.match;
  const selectedTicket = data.tickets.find((ticket) => ticket.id === selectedTicketId) ?? data.tickets[0];

  function addTicketToCart(ticket: NonNullable<typeof selectedTicket>, quantity: number) {
    add({
      ticketId: ticket.id,
      matchId: m.id,
      matchLabel: `${m.team_home} vs ${m.team_away}`,
      venue: `${m.venue}, ${m.city}`,
      kickoffAt: m.kickoff_at,
      categoryName: ticket.name,
      price: Number(ticket.price),
      quantity,
    });
    toast.success(`${quantity}× ${ticket.name} added to cart`, {
      action: {
        label: "View cart",
        onClick: () => { window.location.href = "/cart"; },
      },
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <Link to="/matches" className="font-mono text-xs uppercase tracking-widest text-gold hover:text-gold-glow">
        ← All matches
      </Link>
      <div className="mt-6 border border-border bg-card p-8">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-muted-foreground">
          <span>{m.stage}{m.group_name ? ` · Group ${m.group_name}` : ""}</span>
          <span>Match #{m.match_number ?? "—"}</span>
        </div>
        <div className="my-8 flex items-center justify-around">
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-gold/40 bg-secondary text-sm font-black">
              {m.team_home_code ?? m.team_home.slice(0, 3).toUpperCase()}
            </div>
            <p className="mt-3 text-lg font-bold uppercase">{m.team_home}</p>
          </div>
          <div className="font-mono text-3xl text-foreground/30">VS</div>
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-gold/40 bg-secondary text-sm font-black">
              {m.team_away_code ?? m.team_away.slice(0, 3).toUpperCase()}
            </div>
            <p className="mt-3 text-lg font-bold uppercase">{m.team_away}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 border-t border-border pt-6 text-sm md:grid-cols-3">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" />{formatMatchDate(m.kickoff_at)} · {formatMatchTime(m.kickoff_at)}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />{m.venue}, {m.city}</div>
          <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" />{m.country}</div>
        </div>
      </div>

      <h2 className="mt-12 mb-4 text-xl font-bold uppercase tracking-tight">Select Tickets</h2>
      {data.tickets.length === 0 ? (
        <p className="text-muted-foreground">No tickets available yet for this match.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
          {data.tickets.map((t) => {
            const q = qty[t.id] ?? 1;
            const selected = selectedTicket?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`flex cursor-pointer flex-wrap items-center justify-between gap-4 border bg-card p-4 transition-colors ${selected ? "border-gold/70" : "border-border hover:border-gold/40"}`}
              >
                <div className="flex-1 min-w-[200px]">
                  {selected && <p className="mb-1 font-mono text-[10px] uppercase text-gold">Selected ticket</p>}
                  <h3 className="font-bold uppercase tracking-tight">{t.name}</h3>
                  {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                  <p className="mt-1 text-[10px] font-mono uppercase text-muted-foreground">{t.available} available</p>
                </div>
                <div className="font-mono text-xl font-bold text-gold">{formatPrice(Number(t.price))}</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={q}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setQty((s) => ({ ...s, [t.id]: Math.max(1, Math.min(10, +e.target.value || 1)) }))}
                    className="h-10 w-16 rounded-md border border-border bg-secondary px-2 text-center"
                  />
                  <div className="hidden min-w-24 text-right text-xs text-muted-foreground sm:block">
                    Total <span className="font-mono font-bold text-gold">{formatPrice(Number(t.price) * q)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addTicketToCart(t, q);
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-gold px-4 text-sm font-bold uppercase text-pitch hover:bg-gold-glow"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to cart
                  </button>
                </div>
              </div>
            );
          })}
          </div>
          {selectedTicket && (
            <aside className="h-fit border border-gold/40 bg-card p-5">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Ticket preview</p>
              <h3 className="mt-2 text-lg font-bold uppercase tracking-tight">{selectedTicket.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.team_home} vs {m.team_away}</p>
              <p className="text-xs text-muted-foreground">{formatMatchDate(m.kickoff_at)} · {m.venue}, {m.city}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-mono font-bold">{qty[selectedTicket.id] ?? 1}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-mono text-2xl font-bold text-gold">
                  {formatPrice(Number(selectedTicket.price) * (qty[selectedTicket.id] ?? 1))}
                </span>
              </div>
              <button
                onClick={() => addTicketToCart(selectedTicket, qty[selectedTicket.id] ?? 1)}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gold font-bold uppercase text-pitch hover:bg-gold-glow"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
              <Link to="/cart" className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md border border-border text-sm font-bold uppercase hover:bg-secondary">
                View cart
              </Link>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}