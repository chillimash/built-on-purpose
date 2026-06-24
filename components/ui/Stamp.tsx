import { THEME_FRAMEWORKS } from "@/types/database";

const THEME_COLORS: Record<string, string> = {
  "Personal Responsibility": "text-orange",
  "Purpose-Driven Living": "text-teal",
  "Character Before Achievement": "text-tan",
  "Growth Through Adversity": "text-orange",
  "Legacy and Generational Impact": "text-teal",
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
