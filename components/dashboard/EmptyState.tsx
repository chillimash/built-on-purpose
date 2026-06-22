export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-dashed border-tan/40 rounded-sm py-16 px-6 text-center">
      <p className="font-display text-xl text-ink mb-2">{title}</p>
      <p className="text-ink-soft text-sm max-w-md mx-auto">{body}</p>
    </div>
  );
}
