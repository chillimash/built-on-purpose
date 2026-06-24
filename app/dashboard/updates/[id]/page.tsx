import Link from "next/link";
import { notFound } from "next/navigation";
import { getWeeklyUpdate } from "@/lib/data/content";
import { formatDate } from "@/lib/format";
import { Stamp } from "@/components/ui/Stamp";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

export default async function WeeklyUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const update = await getWeeklyUpdate(id);

  if (!update) notFound();

  return (
    <article>
      <Link
        href="/dashboard"
        className="font-utility text-xs uppercase tracking-wider text-ink-soft hover:text-orange"
      >
        ← Field Notes
      </Link>

      <header className="mt-6 mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="font-utility text-xs text-ink-soft">
            {formatDate(update.published_at ?? update.created_at)}
          </span>
          {update.theme && <Stamp theme={update.theme} />}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
          {update.title}
        </h1>
      </header>

      <MarkdownContent markdown={update.body} />
    </article>
  );
}
