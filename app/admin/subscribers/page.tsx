import { getAllSubscribers } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function SubscribersPage() {
  const subscribers = await getAllSubscribers();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Subscribers</h1>
          <p className="text-ink-soft text-sm mt-1">
            {subscribers.length} {subscribers.length === 1 ? "person has" : "people have"} joined.
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <EmptyState title="No subscribers yet" body="People who create an account will show up here." />
      ) : (
        <div className="border border-tan/30 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper-dim border-b border-tan/30">
                <th className="text-left font-utility text-xs uppercase tracking-wider text-ink-soft px-4 py-3">
                  Name
                </th>
                <th className="text-left font-utility text-xs uppercase tracking-wider text-ink-soft px-4 py-3">
                  Email
                </th>
                <th className="text-left font-utility text-xs uppercase tracking-wider text-ink-soft px-4 py-3">
                  Joined
                </th>
                <th className="text-left font-utility text-xs uppercase tracking-wider text-ink-soft px-4 py-3">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-tan/15 last:border-b-0">
                  <td className="px-4 py-3 text-ink">{s.full_name || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{s.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    {s.role === "admin" ? (
                      <span className="font-utility text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm bg-orange/15 text-orange">
                        Admin
                      </span>
                    ) : (
                      <span className="font-utility text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm bg-teal/15 text-teal">
                        Member
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
