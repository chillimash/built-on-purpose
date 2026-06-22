import Link from "next/link";
import type { Masterclass } from "@/types/database";
import { formatDateTime, isFuture } from "@/lib/format";
import { Stamp } from "@/components/ui/Stamp";

export function MasterclassCard({ mc }: { mc: Masterclass }) {
  const upcoming = mc.format === "live" && isFuture(mc.live_at);

  return (
    <Link
      href={`/dashboard/masterclasses/${mc.id}`}
      className="group block border border-tan/30 bg-paper-dim rounded-sm overflow-hidden hover:border-stamp/50 transition-colors"
    >
      <div className="aspect-video bg-ink/5 relative flex items-center justify-center overflow-hidden">
        {mc.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mc.thumbnail_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="font-display text-4xl text-tan/40">
            {mc.format === "live" ? "◉" : "▶"}
          </span>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`font-utility text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
              mc.format === "live"
                ? upcoming
                  ? "bg-stamp text-paper"
                  : "bg-ink-soft text-paper"
                : "bg-forest text-paper"
            }`}
          >
            {mc.format === "live" ? (upcoming ? "Upcoming live" : "Past live") : "Video"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {mc.theme && <Stamp theme={mc.theme} />}
        </div>
        <h3 className="font-display text-lg text-ink group-hover:text-stamp transition-colors leading-snug">
          {mc.title}
        </h3>
        {mc.format === "live" && mc.live_at && (
          <p className="font-utility text-xs text-ink-soft mt-2">
            {formatDateTime(mc.live_at)}
          </p>
        )}
        {mc.description && (
          <p className="text-ink-soft text-sm mt-2 line-clamp-2">{mc.description}</p>
        )}
      </div>
    </Link>
  );
}
