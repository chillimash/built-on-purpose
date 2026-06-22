import { THEME_FRAMEWORKS } from "@/types/database";

const THEME_COLORS: Record<string, string> = {
  "Personal Responsibility": "text-stamp",
  "Purpose-Driven Living": "text-forest",
  "Character Before Achievement": "text-tan",
  "Growth Through Adversity": "text-stamp",
  "Legacy and Generational Impact": "text-forest",
  "Faith-Based Wisdom Applied Practically": "text-tan",
};

export function Stamp({ theme }: { theme: string }) {
  const acronym = THEME_FRAMEWORKS[theme];
  const colorClass = THEME_COLORS[theme] ?? "text-ink-soft";

  return (
    <span className={`stamp ${colorClass} text-xs`} title={theme}>
      {acronym ?? theme}
    </span>
  );
}
