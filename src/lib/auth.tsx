import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin-auth.functions";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchAdminStatus = useServerFn(getAdminStatus);

  useEffect(() => {
    let active = true;

    async function applySession(nextSession: Session | null) {
      setLoading(true);
      setSession(nextSession);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const admin = await checkAdmin();
      if (!active) return;
      setIsAdmin(admin);
      setLoading(false);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      void applySession(sess);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        void applySession(null);
        return;
      }

      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData.user) {
        await supabase.auth.signOut();
        void applySession(null);
        return;
      }

      void applySession(data.session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [fetchAdminStatus]);

  async function checkAdmin() {
    try {
      const { isAdmin } = await fetchAdminStatus();
      return isAdmin;
    } catch (error) {
      console.error("Unable to check admin role", error);
      return false;
    }
  }

  return (
    <Ctx.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}