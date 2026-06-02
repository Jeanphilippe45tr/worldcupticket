import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { matchesQuery, settingsQuery, newsQuery } from "@/lib/queries";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { Trash2, Save, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — World Cup Tickets" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-12 text-center">
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="mb-8 text-3xl font-black uppercase tracking-tight md:text-4xl">Admin Dashboard</h1>
      <SettingsSection />
      <TicketPricingSection />
      <NewsSection />
    </div>
  );
}

function SettingsSection() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [wa, setWa] = useState("");
  const [methodsText, setMethodsText] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setWa(data.whatsapp_number ?? "");
      setMethodsText(((data.payment_methods as string[] | null) ?? []).join(", "));
      setCurrency(data.currency ?? "USD");
    }
  }, [data]);

  async function save() {
    if (!data) return;
    setSaving(true);
    const methods = methodsText.split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase
      .from("site_settings")
      .update({ whatsapp_number: wa.trim(), payment_methods: methods, currency: currency.trim().toUpperCase() })
      .eq("id", data.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  }

  return (
    <section className="mb-12 border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold uppercase tracking-tight">Site Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">WhatsApp number (with country code)</span>
          <input value={wa} onChange={(e) => setWa(e.target.value)} placeholder="+1234567890"
            className="mt-1 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm" />
        </label>
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">Currency</span>
          <input value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm" />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs uppercase text-muted-foreground">Payment methods (comma separated)</span>
          <input value={methodsText} onChange={(e) => setMethodsText(e.target.value)}
            placeholder="Bank Transfer, Mobile Money, PayPal"
            className="mt-1 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm" />
        </label>
      </div>
      <button onClick={save} disabled={saving}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-gold px-4 text-sm font-bold uppercase text-pitch hover:bg-gold-glow disabled:opacity-50">
        <Save className="h-4 w-4" /> Save Settings
      </button>
    </section>
  );
}

function TicketPricingSection() {
  const qc = useQueryClient();
  const { data: matches } = useQuery(matchesQuery);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (matches && matches.length > 0 && !selectedId) setSelectedId(matches[0].id);
  }, [matches, selectedId]);

  const ticketsQuery = useQuery({
    queryKey: ["admin", "tickets", selectedId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_categories")
        .select("*")
        .eq("match_id", selectedId)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selectedId,
  });

  async function updateTicket(id: string, fields: { price?: number; available?: number; name?: string }) {
    const { error } = await supabase.from("ticket_categories").update(fields).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin", "tickets", selectedId] });
    qc.invalidateQueries({ queryKey: ["match", selectedId] });
    qc.invalidateQueries({ queryKey: ["tickets", "min"] });
  }

  async function addTicket() {
    if (!selectedId) return;
    const order = (ticketsQuery.data?.length ?? 0) + 1;
    const { error } = await supabase.from("ticket_categories").insert({
      match_id: selectedId,
      name: `Category ${order}`,
      price: 100,
      available: 100,
      sort_order: order,
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    qc.invalidateQueries({ queryKey: ["admin", "tickets", selectedId] });
  }

  async function removeTicket(id: string) {
    const { error } = await supabase.from("ticket_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["admin", "tickets", selectedId] });
  }

  return (
    <section className="mb-12 border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold uppercase tracking-tight">Ticket Pricing</h2>
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
        className="mb-4 h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm">
        {matches?.map((m) => (
          <option key={m.id} value={m.id}>
            {m.team_home} vs {m.team_away} — {new Date(m.kickoff_at).toLocaleDateString()}
          </option>
        ))}
      </select>

      <div className="space-y-2">
        {ticketsQuery.data?.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center gap-3 border border-border bg-secondary/30 p-3">
            <input
              defaultValue={t.name}
              onBlur={(e) => e.target.value !== t.name && updateTicket(t.id, { name: e.target.value })}
              className="h-10 flex-1 min-w-[140px] rounded-md border border-border bg-secondary px-3 text-sm"
            />
            <label className="text-xs text-muted-foreground">Price
              <input type="number" defaultValue={Number(t.price)}
                onBlur={(e) => Number(e.target.value) !== Number(t.price) && updateTicket(t.id, { price: Number(e.target.value) })}
                className="ml-2 h-10 w-24 rounded-md border border-border bg-secondary px-2 text-sm" />
            </label>
            <label className="text-xs text-muted-foreground">Available
              <input type="number" defaultValue={t.available}
                onBlur={(e) => Number(e.target.value) !== t.available && updateTicket(t.id, { available: Number(e.target.value) })}
                className="ml-2 h-10 w-20 rounded-md border border-border bg-secondary px-2 text-sm" />
            </label>
            <span className="font-mono text-sm text-gold">{formatPrice(Number(t.price))}</span>
            <button onClick={() => removeTicket(t.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addTicket}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-gold/50 px-4 text-sm font-bold uppercase text-gold hover:bg-gold hover:text-pitch">
        <Plus className="h-4 w-4" /> Add ticket category
      </button>
    </section>
  );
}

function NewsSection() {
  const qc = useQueryClient();
  const { data: news } = useQuery(newsQuery);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Update");

  async function add() {
    if (!title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("news").insert({
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      body: body.trim() || null,
      category: category.trim() || "News",
    });
    if (error) return toast.error(error.message);
    toast.success("News published");
    setTitle(""); setExcerpt(""); setBody("");
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["news"] });
  }

  return (
    <section className="mb-12 border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-bold uppercase tracking-tight">News & Updates</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="h-11 rounded-md border border-border bg-secondary px-3 text-sm" />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-md border border-border bg-secondary px-3 text-sm" />
        <input placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
          className="h-11 rounded-md border border-border bg-secondary px-3 text-sm md:col-span-2" />
        <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={3}
          className="rounded-md border border-border bg-secondary px-3 py-2 text-sm md:col-span-2" />
      </div>
      <button onClick={add}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-gold px-4 text-sm font-bold uppercase text-pitch hover:bg-gold-glow">
        <Plus className="h-4 w-4" /> Publish
      </button>

      <div className="mt-6 space-y-2">
        {news?.map((n) => (
          <div key={n.id} className="flex items-center justify-between border border-border bg-secondary/30 p-3">
            <div>
              <p className="text-xs font-mono uppercase text-gold">{n.category}</p>
              <p className="font-bold">{n.title}</p>
            </div>
            <button onClick={() => remove(n.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}