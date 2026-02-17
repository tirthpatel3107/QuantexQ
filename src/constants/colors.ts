/**
 * Central color constants for the application.
 * These should ideally reference CSS variables defined in index.css
 */

export const COLORS = {
  // Base theme colors
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))",
  border: "hsl(var(--border))",

  // Status colors
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  info: "hsl(var(--info))",

  // Chart specific colors (can be matched to hsl vars if needed)
  charts: {
    1: "hsl(var(--chart-1))",
    2: "hsl(var(--chart-2))",
    3: "hsl(var(--chart-3))",
    4: "hsl(var(--chart-4))",
    5: "hsl(var(--chart-5))",
    6: "hsl(var(--chart-6))",
  },

  // Specific data colors used in dashboard
  data: {
    in: "#22c55e", // Success green (kept for status)
    out: "#e5e7eb", // Light Grey (was Blue)
    warning: "#fbbf24", // Amber/Warning
    error: "#ef4444", // Red/Destructive
    aux: "#d1d5db", // Grey (was Blue)
    setpoint: "#eab308",
    cyan: "#f3f4f6", // Very Light Grey (was Cyan)
    orange: "#f59f0a",
  },

  // ECharts specific colors
  charts_ui: {
    axis_dark: "#ffffff",
    axis_light: "hsl(var(--foreground))",
    grid_dark: "rgba(255, 255, 255, 0.1)",
    grid_light: "rgba(0, 0, 0, 0.05)",
    tooltip_bg_light: "#ffffff",
    tooltip_text_light: "#000000",
    tooltip_text_dark: "#ffffff",
  },
};
