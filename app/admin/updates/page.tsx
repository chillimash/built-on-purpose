import Link from "next/link";
import { getAllWeeklyUpdates } from "@/lib/data/admin";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";

async function getEmailSentIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("email_sends")
    .select("content_id")
    .eq("content_type", "weekly_update");
  return new Set((data ?? []).map((r: { content_id: string }) => r.content_id));
}

export default async function AdminUpdatesPage() {
  const [updates, emailSentIds] = await Promise.all([
    getAllWeeklyUpdates(),
    getEmailSentIds(),
  ]);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Field Notes</h1>
        <Link
          href="/admin/updates/new"
          className="font-utility text-xs uppercase tracking-wider bg-ink text-paper px-5 py-3 rounded-sm hover:bg-stamp transition-colors"
        >
          + New field note
        </Link>
      </div>

      {updates.length === 0 ? (
        <EmptyState
          title="No field notes yet"
          body="Create your first weekly update to get started."
        />
      ) : (
        <div className="flex flex-col">
          {updates.map((u) => (
            <Link
              key={u.id}
              href={`/admin/updates/${u.id}/edit`}
              className="group py-4 border-b border-tan/25 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-display text-lg text-ink group-hover:text-stamp transition-colors truncate">
                  {u.title}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {formatDate(u.published_at ?? u.created_at)}
                  {u.theme ? ` · ${u.theme}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {u.published && (
                  <span
                    className={`font-utility text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                      emailSentIds.has(u.id)
                        ? "bg-forest/15 text-forest"
                        : "bg-tan/20 text-ink-soft"
                    }`}
                  >
                    {emailSentIds.has(u.id) ? "✓ Email sent" : "Email pending"}
                  </span>
                )}
                <StatusBadge published={u.published} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
