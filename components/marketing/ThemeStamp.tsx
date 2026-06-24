import { THEME_FRAMEWORKS } from "@/types/database";

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1"];
const COLORS = ["text-orange", "text-teal", "text-tan", "text-orange", "text-teal", "text-tan"];

export function ThemeStamp({ theme, index }: { theme: string; index: number }) {
  const acronym = THEME_FRAMEWORKS[theme];
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const color = COLORS[index % COLORS.length];

  return (
    <div className="border border-tan/30 bg-paper-dim rounded-sm p-6 flex flex-col gap-4">
      <span className={`stamp ${color} ${rotation} text-sm w-fit`}>
        {acronym}
      </span>
      <h3 className="font-display text-lg text-ink leading-snug">{theme}</h3>
    </div>
  );
}
