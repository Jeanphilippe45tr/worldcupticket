import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-pitch">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-bold uppercase tracking-tighter">
            <Trophy className="h-5 w-5 text-gold" />
            World Cup <span className="text-gold">Tickets</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Your gateway to the 2026 FIFA World Cup across the United States, Canada, and Mexico.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm md:col-span-2 md:justify-self-end">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/matches" className="hover:text-foreground">All Matches</Link></li>
              <li><Link to="/news" className="hover:text-foreground">News</Link></li>
              <li><Link to="/cart" className="hover:text-foreground">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Account</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
              <li><Link to="/admin" className="hover:text-foreground">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© 2026 World Cup Tickets. All rights reserved.</p>
          <p className="font-mono uppercase tracking-widest">Verified Official Ticket Agent</p>
        </div>
      </div>
    </footer>
  );
}