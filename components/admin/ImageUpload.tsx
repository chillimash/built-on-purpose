"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  label: string;
  currentUrl: string;
  onUpload: (url: string) => void;
}

export function ImageUpload({ label, currentUrl, onUpload }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(currentUrl);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError(null);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Upload failed.");

      onUpload(json.url);
      URL.revokeObjectURL(localUrl);
      setPreview(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setPreview(currentUrl); // revert preview
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleClear() {
    setPreview("");
    onUpload("");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-utility text-xs uppercase tracking-wider text-ink-soft">
        {label}
      </span>

      {preview ? (
        <div className="relative group border border-tan/40 rounded-sm overflow-hidden bg-paper-dim">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full aspect-[16/9] object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-paper/70 flex items-center justify-center">
              <span className="font-utility text-xs uppercase tracking-wider text-ink animate-pulse">
                Uploading…
              </span>
            </div>
          )}
          {!uploading && (
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-utility text-xs uppercase tracking-wider bg-paper text-ink px-3 py-2 rounded-sm hover:bg-stamp hover:text-paper transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="font-utility text-xs uppercase tracking-wider bg-paper text-stamp px-3 py-2 rounded-sm hover:bg-stamp hover:text-paper transition-colors"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border border-dashed border-tan/50 rounded-sm aspect-[16/9] flex flex-col items-center justify-center gap-2 hover:border-stamp/60 hover:bg-paper-dim transition-colors disabled:opacity-50"
        >
          <span className="font-display text-3xl text-tan/50">↑</span>
          <span className="font-utility text-xs uppercase tracking-wider text-ink-soft">
            {uploading ? "Uploading…" : "Click to upload"}
          </span>
          <span className="text-xs text-ink-soft/60">
            JPEG, PNG, WebP, GIF · max 5 MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="sr-only"
        aria-label={`Upload ${label}`}
      />

      {error && (
        <p className="text-xs text-stamp">{error}</p>
      )}
    </div>
  );
}
