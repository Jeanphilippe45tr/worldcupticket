import { Link } from "@tanstack/react-router";
import { ShoppingCart, Trophy, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export function SiteHeader() {
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold uppercase tracking-tighter">
          <Trophy className="h-5 w-5 text-gold" />
          <span className="text-base md:text-lg">
            World Cup <span className="text-gold">Tickets</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className="text-foreground/70 transition-colors hover:text-gold [&.active]:text-gold">
            Home
          </Link>
          <Link to="/matches" className="text-foreground/70 transition-colors hover:text-gold [&.active]:text-gold">
            Matches
          </Link>
          <Link to="/news" className="text-foreground/70 transition-colors hover:text-gold [&.active]:text-gold">
            News
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-foreground/70 transition-colors hover:text-gold [&.active]:text-gold">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-pitch">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={() => signOut()}
              className="hidden h-10 items-center rounded-md border border-border bg-transparent px-3 text-sm font-medium hover:bg-secondary md:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="hidden h-10 items-center rounded-md bg-gold px-3 text-sm font-bold text-pitch hover:bg-gold-glow md:inline-flex"
            >
              Sign in
            </Link>
          )}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 text-sm">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">Home</Link>
            <Link to="/matches" onClick={() => setOpen(false)} className="py-2">Matches</Link>
            <Link to="/news" onClick={() => setOpen(false)} className="py-2">News</Link>
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-2">Admin</Link>}
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="py-2 text-left">Sign out</button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="py-2 text-gold">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}