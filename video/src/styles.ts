// Shared design tokens for all scenes
export const COLORS = {
  bg: "#0f172a",
  text: "#f8fafc",
  textDim: "#94a3b8",
  blue: "#3b82f6",
  emerald: "#10b981",
  amber: "#f59e0b",
  purple: "#a855f7",
  pink: "#ec4899",
  red: "#ef4444",
  codeBg: "#1e293b",
  codeText: "#e2e8f0",
  border: "#334155",
} as const;

export const FONTS = {
  sans: "Inter, system-ui, -apple-system, sans-serif",
  mono: "JetBrains Mono, Menlo, Consolas, monospace",
} as const;

export const SAFE = { margin: 60 } as const;
