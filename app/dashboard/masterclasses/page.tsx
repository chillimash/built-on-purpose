import { getMasterclasses } from "@/lib/data/content";
import { isFuture } from "@/lib/format";
import { MasterclassCard } from "@/components/dashboard/MasterclassCard";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default async function MasterclassesPage() {
  const masterclasses = await getMasterclasses();

  const upcomingLive = masterclasses.filter(
    (m) => m.format === "live" && isFuture(m.live_at)
  );
  const rest = masterclasses.filter((m) => !upcomingLive.includes(m));

  return (
    <div>
      <div className="mb-10">
        <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
          Learn
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-1">
          Masterclasses
        </h1>
        <p className="text-ink-soft text-sm mt-2 max-w-md">
          Live sessions and a growing video library, organized around the six frameworks.
        </p>
      </div>

      {masterclasses.length === 0 ? (
        <EmptyState
          title="Nothing scheduled yet"
          body="Masterclasses — live and on-demand — will appear here as they're added."
        />
      ) : (
        <div className="flex flex-col gap-12">
          {upcomingLive.length > 0 && (
            <section>
              <h2 className="font-utility text-xs uppercase tracking-wider text-orange mb-4">
                Upcoming live sessions
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingLive.map((mc) => (
                  <MasterclassCard key={mc.id} mc={mc} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-utility text-xs uppercase tracking-wider text-ink-soft mb-4">
              Library
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((mc) => (
                <MasterclassCard key={mc.id} mc={mc} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
