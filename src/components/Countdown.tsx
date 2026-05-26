import { useEffect, useState } from "react";

const OPENING = new Date("2026-06-11T20:00:00Z").getTime();

function getDiff() {
  const now = Date.now();
  const ms = Math.max(0, OPENING - now);
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return { d, h, m, s };
}

export function Countdown() {
  const [t, setT] = useState(getDiff());
  useEffect(() => {
    const id = setInterval(() => setT(getDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "Days", value: t.d },
    { label: "Hours", value: t.h },
    { label: "Mins", value: t.m },
    { label: "Secs", value: t.s },
  ];

  return (
    <div className="flex gap-3 font-mono">
      {items.map((i, idx) => (
        <div key={i.label} className="flex items-end gap-3">
          <div className="flex flex-col">
            <span className="text-3xl font-bold tabular-nums text-foreground md:text-4xl">
              {String(i.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {i.label}
            </span>
          </div>
          {idx < items.length - 1 && <span className="text-3xl font-bold text-foreground/20 md:text-4xl">:</span>}
        </div>
      ))}
    </div>
  );
}