"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/types/database";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Masterclass, MasterclassFormat } from "@/types/database";

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MasterclassForm({ existing }: { existing?: Masterclass }) {
  const router = useRouter();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [theme, setTheme] = useState(existing?.theme ?? "");
  const [format, setFormat] = useState<MasterclassFormat>(existing?.format ?? "video");
  const [videoUrl, setVideoUrl] = useState(existing?.video_url ?? "");
  const [liveAt, setLiveAt] = useState(toLocalInputValue(existing?.live_at ?? null));
  const [liveLink, setLiveLink] = useState(existing?.live_link ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(existing?.thumbnail_url ?? "");
  const [published, setPublished] = useState(existing?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = existing ? `/api/admin/masterclasses/${existing.id}` : "/api/admin/masterclasses";
      const method = existing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          theme,
          format,
          video_url: videoUrl,
          live_at: liveAt ? new Date(liveAt).toISOString() : null,
          live_link: liveLink,
          thumbnail_url: thumbnailUrl,
          published,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/admin/masterclasses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    if (!confirm("Delete this masterclass? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/masterclasses/${existing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Couldn't delete.");
      router.push("/admin/masterclasses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete. Try again.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-2xl">
      {error && (
        <div className="border border-stamp/40 bg-stamp/5 text-stamp text-sm rounded-sm px-4 py-3">
          {error}
        </div>
      )}

      <Input
        id="title"
        label="Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        id="description"
        label="Description (optional)"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Select
        id="theme"
        label="Theme (optional)"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="">No theme</option>
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>

      <Select
        id="format"
        label="Format"
        value={format}
        onChange={(e) => setFormat(e.target.value as MasterclassFormat)}
      >
        <option value="video">Video (on-demand)</option>
        <option value="live">Live session</option>
      </Select>

      {format === "video" ? (
        <Input
          id="video_url"
          label="Video URL (YouTube or Vimeo)"
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      ) : (
        <>
          <Input
            id="live_at"
            label="Date & time"
            type="datetime-local"
            required
            value={liveAt}
            onChange={(e) => setLiveAt(e.target.value)}
          />
          <Input
            id="live_link"
            label="Join link (Zoom, Google Meet, etc.)"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
          />
        </>
      )}

      <ImageUpload
        label="Thumbnail image (optional)"
        currentUrl={thumbnailUrl}
        onUpload={(url) => setThumbnailUrl(url)}
      />

      <div className="border border-tan/30 bg-paper-dim rounded-sm px-4 py-3">
        <Toggle
          label="Published"
          description={published ? "Visible to all members now." : "Saved as a draft, hidden from members."}
          checked={published}
          onChange={setPublished}
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : existing ? "Save changes" : "Create masterclass"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/masterclasses")}>
            Cancel
          </Button>
        </div>
        {existing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="font-utility text-xs uppercase tracking-wider text-stamp hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}
