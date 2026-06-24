import Link from "next/link";
import type { Article } from "@/types/database";
import { formatDate } from "@/lib/format";
import { Stamp } from "@/components/ui/Stamp";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/dashboard/articles/${article.id}`}
      className="group block border border-tan/30 bg-paper-dim rounded-sm overflow-hidden hover:border-orange/50 transition-colors"
    >
      <div className="aspect-[16/9] bg-ink/5 overflow-hidden">
        {article.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl text-tan/40">¶</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {article.theme && <Stamp theme={article.theme} />}
          <span className="font-utility text-xs text-ink-soft">
            {formatDate(article.published_at ?? article.created_at)}
          </span>
        </div>
        <h3 className="font-display text-lg text-ink group-hover:text-orange transition-colors leading-snug">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-ink-soft text-sm mt-2 line-clamp-2">{article.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
