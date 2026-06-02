import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { newsQuery } from "@/lib/queries";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "News — World Cup Tickets 2026" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery),
  component: NewsPage,
  errorComponent: ({ error }) => <div className="p-8">Failed: {error.message}</div>,
});

function NewsPage() {
  const { data: news } = useSuspenseQuery(newsQuery);
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="mb-8 border-b border-border pb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-gold">Latest</span>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-5xl">News & Updates</h1>
      </div>
      {news.length === 0 ? (
        <p className="text-muted-foreground">No news yet.</p>
      ) : (
        <div className="space-y-6">
          {news.map((n) => (
            <article key={n.id} className="border border-border bg-card p-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold">{n.category}</span>
              <h2 className="mt-2 text-xl font-bold">{n.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(n.published_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
              {n.excerpt && <p className="mt-3 text-sm text-muted-foreground">{n.excerpt}</p>}
              {n.body && <p className="mt-3 whitespace-pre-wrap text-sm">{n.body}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}