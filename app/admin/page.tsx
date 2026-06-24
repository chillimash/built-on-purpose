import Link from "next/link";
import {
  getAllWeeklyUpdates,
  getAllMasterclasses,
  getAllArticles,
  getAllSubscribers,
} from "@/lib/data/admin";

export default async function AdminOverviewPage() {
  const [updates, masterclasses, articles, subscribers] = await Promise.all([
    getAllWeeklyUpdates(),
    getAllMasterclasses(),
    getAllArticles(),
    getAllSubscribers(),
  ]);

  const stats = [
    {
      label: "Field notes",
      total: updates.length,
      published: updates.filter((u) => u.published).length,
      href: "/admin/updates",
    },
    {
      label: "Masterclasses",
      total: masterclasses.length,
      published: masterclasses.filter((m) => m.published).length,
      href: "/admin/masterclasses",
    },
    {
      label: "Articles",
      total: articles.length,
      published: articles.filter((a) => a.published).length,
      href: "/admin/articles",
    },
    {
      label: "Subscribers",
      total: subscribers.length,
      published: subscribers.filter((s) => s.subscribed).length,
      href: "/admin/subscribers",
      publishedLabel: "subscribed",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
          Admin
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-1">
          Overview
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border border-tan/30 bg-paper-dim rounded-sm p-6 hover:border-orange/50 transition-colors"
          >
            <p className="font-utility text-xs uppercase tracking-wider text-ink-soft mb-3">
              {s.label}
            </p>
            <p className="font-display text-3xl text-ink">{s.total}</p>
            <p className="text-xs text-ink-soft mt-1">
              {s.published} {s.publishedLabel ?? "published"}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/updates/new"
          className="font-utility text-xs uppercase tracking-wider bg-ink text-paper px-5 py-3 rounded-sm hover:bg-orange transition-colors"
        >
          + New field note
        </Link>
        <Link
          href="/admin/masterclasses/new"
          className="font-utility text-xs uppercase tracking-wider border border-ink text-ink px-5 py-3 rounded-sm hover:bg-ink hover:text-paper transition-colors"
        >
          + New masterclass
        </Link>
        <Link
          href="/admin/articles/new"
          className="font-utility text-xs uppercase tracking-wider border border-ink text-ink px-5 py-3 rounded-sm hover:bg-ink hover:text-paper transition-colors"
        >
          + New article
        </Link>
      </div>
    </div>
  );
}
