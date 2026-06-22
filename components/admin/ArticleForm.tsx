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
import type { Article } from "@/types/database";

export function ArticleForm({ existing }: { existing?: Article }) {
  const router = useRouter();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [theme, setTheme] = useState(existing?.theme ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(existing?.cover_image_url ?? "");
  const [published, setPublished] = useState(existing?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = existing ? `/api/admin/articles/${existing.id}` : "/api/admin/articles";
      const method = existing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          body,
          theme,
          cover_image_url: coverImageUrl,
          published,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    if (!confirm("Delete this article? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${existing.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Couldn't delete.");
      router.push("/admin/articles");
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
        id="excerpt"
        label="Excerpt (optional, shown in listings)"
        rows={2}
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
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

      <ImageUpload
        label="Cover image (optional)"
        currentUrl={coverImageUrl}
        onUpload={(url) => setCoverImageUrl(url)}
      />

      <Textarea
        id="body"
        label="Body (Markdown supported)"
        required
        rows={16}
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
            {saving ? "Saving…" : existing ? "Save changes" : "Create article"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/articles")}>
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
