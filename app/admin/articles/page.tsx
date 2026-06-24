import Link from "next/link";
import { getAllArticles } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="font-utility text-xs uppercase tracking-wider bg-ink text-paper px-5 py-3 rounded-sm hover:bg-orange transition-colors"
        >
          + New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <EmptyState title="No articles yet" body="Write your first article to get started." />
      ) : (
        <div className="flex flex-col">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/admin/articles/${a.id}/edit`}
              className="group py-4 border-b border-tan/25 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-display text-lg text-ink group-hover:text-orange transition-colors truncate">
                  {a.title}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {formatDate(a.published_at ?? a.created_at)}
                  {a.theme ? ` · ${a.theme}` : ""}
                </p>
              </div>
              <StatusBadge published={a.published} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
