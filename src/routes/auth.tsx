import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin-auth.functions";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — World Cup Tickets" }] }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  fullName: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const fetchAdminStatus = useServerFn(getAdminStatus);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: isAdmin ? "/admin" : "/", replace: true });
  }, [user, isAdmin, authLoading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, fullName, phone, address, city, country });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              country: country.trim(),
            },
          },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        const { isAdmin } = await fetchAdminStatus();
        navigate({ to: isAdmin ? "/admin" : "/", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-tight">
        {mode === "signin" ? "Sign In" : "Create Account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signin"
          ? "Access your tickets and admin tools."
          : "Sign up to manage your orders. First account becomes admin."}
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 chars)"
          className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
        />
        {mode === "signup" && (
          <div className="space-y-3">
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
              maxLength={120}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone / WhatsApp number"
              className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
              maxLength={40}
            />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              rows={2}
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm"
              maxLength={300}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
                maxLength={100}
              />
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="h-11 w-full rounded-md border border-border bg-secondary px-3 text-sm"
                maxLength={100}
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-md bg-gold font-bold uppercase text-pitch hover:bg-gold-glow disabled:opacity-50"
        >
          {loading ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 text-center text-xs text-muted-foreground hover:text-gold"
      >
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
    </div>
  );
}