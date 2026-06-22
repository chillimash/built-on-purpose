import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/data/admin";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">Edit article</h1>
      <ArticleForm existing={article} />
    </div>
  );
}
