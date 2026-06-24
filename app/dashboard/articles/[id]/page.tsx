import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/data/content";
import { formatDate } from "@/lib/format";
import { Stamp } from "@/components/ui/Stamp";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) notFound();

  return (
    <article>
      <Link
        href="/dashboard/articles"
        className="font-utility text-xs uppercase tracking-wider text-ink-soft hover:text-orange"
      >
        ← Articles
      </Link>

      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt=""
          className="w-full aspect-[16/7] object-cover rounded-sm mt-6 border border-tan/30"
        />
      )}

      <header className="mt-8 mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="font-utility text-xs text-ink-soft">
            {formatDate(article.published_at ?? article.created_at)}
          </span>
          {article.theme && <Stamp theme={article.theme} />}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-ink-soft text-lg mt-4 max-w-2xl">{article.excerpt}</p>
        )}
      </header>

      <MarkdownContent markdown={article.body} />
    </article>
  );
}
