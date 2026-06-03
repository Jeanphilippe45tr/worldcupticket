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
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const fetchAdminStatus = useServerFn(getAdminStatus);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: isAdmin ? "/admin" : "/", replace: true });
  }, [user, isAdmin, authLoading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
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