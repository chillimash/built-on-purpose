import Link from "next/link";
import { getWeeklyUpdates } from "@/lib/data/content";
import { formatDate } from "@/lib/format";
import { Stamp } from "@/components/ui/Stamp";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function DashboardPage() {
  const updates = await getWeeklyUpdates();

  return (
    <div>
      <div className="mb-10 flex items-end justify-between flex-wrap gap-3">
        <div>
          <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
            Weekly
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-1">
            Field Notes
          </h1>
        </div>
        <p className="text-ink-soft text-sm max-w-xs">
          A weekly note on responsibility, purpose, and the work of becoming.
        </p>
      </div>

      {updates.length === 0 ? (
        <EmptyState
          title="No notes yet"
          body="Your first field note will show up here as soon as it's published. Check back soon."
        />
      ) : (
        <div className="flex flex-col">
          {updates.map((update, i) => (
            <Link
              key={update.id}
              href={`/dashboard/updates/${update.id}`}
              className="group py-6 border-b border-tan/25 first:pt-0 last:border-b-0 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
            >
              <span className="font-utility text-xs text-ink-soft shrink-0 w-24">
                {formatDate(update.published_at ?? update.created_at)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-display text-xl text-ink group-hover:text-orange transition-colors">
                    {update.title}
                  </h2>
                  {update.theme && <Stamp theme={update.theme} />}
                </div>
              </div>
              <span className="font-utility text-xs text-ink-soft shrink-0 hidden sm:inline">
                №{String(updates.length - i).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
