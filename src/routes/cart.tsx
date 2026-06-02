import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { formatPrice, formatMatchDate } from "@/lib/format";
import { useState } from "react";
import { Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — World Cup Tickets" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: CartPage,
  errorComponent: ({ error }) => <div className="p-8">Failed: {error.message}</div>,
});

const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(5).max(300),
  paymentMethod: z.string().min(1),
});

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const methods = (settings?.payment_methods as string[] | null) ?? ["Bank Transfer", "Mobile Money", "PayPal"];
  const whatsapp = (settings?.whatsapp_number ?? "").replace(/[^\d]/g, "");
  const currency = settings?.currency ?? "USD";

  const [form, setForm] = useState({ name: "", email: "", address: "", paymentMethod: methods[0] ?? "" });

  function submit() {
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    if (items.length === 0) return;
    if (!whatsapp) {
      toast.error("Admin has not set a WhatsApp number yet.");
      return;
    }

    const lines = items
      .map((i) => `• ${i.quantity}× ${i.categoryName} — ${i.matchLabel} (${formatMatchDate(i.kickoffAt)}) — ${formatPrice(i.price * i.quantity, currency)}`)
      .join("\n");

    const msg =
      `*NEW WORLD CUP TICKETS ORDER*\n\n` +
      `*Client:* ${form.name}\n` +
      `*Email:* ${form.email}\n` +
      `*Address:* ${form.address}\n` +
      `*Payment:* ${form.paymentMethod}\n\n` +
      `*Tickets (${items.reduce((s, i) => s + i.quantity, 0)})*\n${lines}\n\n` +
      `*TOTAL: ${formatPrice(total, currency)}*`;

    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp to confirm your order…");
    setTimeout(() => clear(), 800);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-black uppercase tracking-tight md:text-4xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/matches" className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-gold">
            Browse matches →
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.ticketId} className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-4">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">{i.categoryName}</p>
                  <h3 className="font-bold uppercase">{i.matchLabel}</h3>
                  <p className="text-xs text-muted-foreground">{i.venue} · {formatMatchDate(i.kickoffAt)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) => setQty(i.ticketId, +e.target.value)}
                  className="h-10 w-16 rounded-md border border-border bg-secondary px-2 text-center"
                />
                <div className="font-mono font-bold text-gold w-24 text-right">{formatPrice(i.price * i.quantity, currency)}</div>
                <button onClick={() => remove(i.ticketId)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <aside className="space-y-4 border border-gold/40 bg-card p-6 h-fit">
            <h2 className="text-lg font-bold uppercase tracking-tight">Checkout</h2>
            <div className="space-y-3">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
                maxLength={100}
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
                maxLength={255}
              />
              <textarea
                placeholder="Delivery address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm"
                maxLength={300}
              />
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
              >
                {methods.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-mono text-2xl font-bold text-gold">{formatPrice(total, currency)}</span>
              </div>
            </div>
            <button
              onClick={submit}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-whatsapp font-bold uppercase tracking-tight text-pitch hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </button>
            <p className="text-[10px] text-muted-foreground text-center">
              Your order details will open in WhatsApp to confirm with our team.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}