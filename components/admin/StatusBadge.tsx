export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`font-utility text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
        published ? "bg-teal/15 text-teal" : "bg-ink-soft/10 text-ink-soft"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
