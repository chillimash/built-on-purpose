import Link from "next/link";
import { getAllMasterclasses } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function AdminMasterclassesPage() {
  const masterclasses = await getAllMasterclasses();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Masterclasses</h1>
        <Link
          href="/admin/masterclasses/new"
          className="font-utility text-xs uppercase tracking-wider bg-ink text-paper px-5 py-3 rounded-sm hover:bg-orange transition-colors"
        >
          + New masterclass
        </Link>
      </div>

      {masterclasses.length === 0 ? (
        <EmptyState title="No masterclasses yet" body="Add a video or schedule a live session to get started." />
      ) : (
        <div className="flex flex-col">
          {masterclasses.map((m) => (
            <Link
              key={m.id}
              href={`/admin/masterclasses/${m.id}/edit`}
              className="group py-4 border-b border-tan/25 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-display text-lg text-ink group-hover:text-orange transition-colors truncate">
                  {m.title}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {m.format === "live" ? `Live · ${formatDateTime(m.live_at)}` : "Video"}
                  {m.theme ? ` · ${m.theme}` : ""}
                </p>
              </div>
              <StatusBadge published={m.published} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
