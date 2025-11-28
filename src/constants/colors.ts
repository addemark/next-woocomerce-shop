const normalizeKey = (value: string) => value.trim().toLowerCase();

export const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  gray: "#6b7280",
  grey: "#6b7280",
  silver: "#e5e7eb",
  charcoal: "#374151",
  navy: "#1e3a8a",
  blue: "#3b82f6",
  lightblue: "#60a5fa",
  sky: "#38bdf8",
  teal: "#14b8a6",
  green: "#22c55e",
  olive: "#4b5563",
  yellow: "#facc15",
  gold: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
  maroon: "#7f1d1d",
  pink: "#ec4899",
  purple: "#a855f7",
  violet: "#8b5cf6",
  brown: "#92400e",
  beige: "#f5f5dc",
  cream: "#f8f5e3",
  cola: "#3b2f2f",
  "pastel gray": "#c0c0c0",
  "pullman brown": "#5c4033",
  "brown sugar": "#af6e4d",
  feldgrau: "#4d5d53",
};

export const resolveColor = (value: string) =>
  COLOR_MAP[normalizeKey(value)] ?? value;
