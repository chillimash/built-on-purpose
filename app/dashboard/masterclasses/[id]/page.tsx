import Link from "next/link";
import { notFound } from "next/navigation";
import { getMasterclass } from "@/lib/data/content";
import { formatDateTime, isFuture } from "@/lib/format";
import { Stamp } from "@/components/ui/Stamp";
import { Button } from "@/components/ui/Button";

function toEmbedUrl(url: string): string {
  // YouTube watch URL -> embed
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export default async function MasterclassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mc = await getMasterclass(id);

  if (!mc) notFound();

  const upcoming = mc.format === "live" && isFuture(mc.live_at);

  return (
    <article>
      <Link
        href="/dashboard/masterclasses"
        className="font-utility text-xs uppercase tracking-wider text-ink-soft hover:text-orange"
      >
        ← Masterclasses
      </Link>

      <header className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {mc.theme && <Stamp theme={mc.theme} />}
          <span className="font-utility text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm bg-ink-soft/10 text-ink-soft">
            {mc.format === "live" ? "Live session" : "Video"}
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
          {mc.title}
        </h1>
        {mc.description && (
          <p className="text-ink-soft mt-3 max-w-2xl">{mc.description}</p>
        )}
      </header>

      {mc.format === "video" && mc.video_url && (
        <div className="aspect-video rounded-sm overflow-hidden border border-tan/30 bg-ink">
          <iframe
            src={toEmbedUrl(mc.video_url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={mc.title}
          />
        </div>
      )}

      {mc.format === "live" && (
        <div className="border border-tan/30 bg-paper-dim rounded-sm p-8 text-center">
          <p className="font-utility text-xs uppercase tracking-wider text-ink-soft mb-2">
            {upcoming ? "Scheduled for" : "Was held on"}
          </p>
          <p className="font-display text-2xl text-ink mb-6">
            {formatDateTime(mc.live_at)}
          </p>
          {upcoming && mc.live_link ? (
            <a href={mc.live_link} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">Join the session</Button>
            </a>
          ) : upcoming ? (
            <p className="text-ink-soft text-sm">
              The join link will appear here closer to the date.
            </p>
          ) : (
            <p className="text-ink-soft text-sm">
              This live session has ended. A recording may be added to the library soon.
            </p>
          )}
        </div>
      )}
    </article>
  );
}
