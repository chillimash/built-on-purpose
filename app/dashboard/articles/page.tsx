import { getArticles } from "@/lib/data/content";
import { ArticleCard } from "@/components/dashboard/ArticleCard";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <div className="mb-10">
        <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
          Read
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-1">
          Articles
        </h1>
        <p className="text-ink-soft text-sm mt-2 max-w-md">
          Longer-form writing on character, purpose, and the work of becoming.
        </p>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          title="No articles yet"
          body="New articles will appear here as soon as they're published."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
