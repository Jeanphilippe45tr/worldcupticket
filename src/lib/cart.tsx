import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  ticketId: string;
  matchId: string;
  matchLabel: string;
  venue: string;
  kickoffAt: string;
  categoryName: string;
  price: number;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (ticketId: string) => void;
  setQty: (ticketId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "wct_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (item) =>
      setItems((prev) => {
        const existing = prev.find((p) => p.ticketId === item.ticketId);
        if (existing) {
          return prev.map((p) =>
            p.ticketId === item.ticketId ? { ...p, quantity: p.quantity + item.quantity } : p,
          );
        }
        return [...prev, item];
      }),
    remove: (id) => setItems((prev) => prev.filter((p) => p.ticketId !== id)),
    setQty: (id, qty) =>
      setItems((prev) =>
        prev
          .map((p) => (p.ticketId === id ? { ...p, quantity: Math.max(1, qty) } : p))
          .filter((p) => p.quantity > 0),
      ),
    clear: () => setItems([]),
    total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    count: items.reduce((s, i) => s + i.quantity, 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}