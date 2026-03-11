import type { AccentColor, AccentColorProviderState } from "./types";

export const initialState: AccentColorProviderState = {
  accentColor: "white",
  setAccentColor: () => null,
};

// Dark mode HSL values
export const ACCENT_COLOR_MAP_DARK: Record<AccentColor, string> = {
  white: "0 0% 98%",
  blue: "217 91% 60%",
  green: "158 64% 52%",
  orange: "38 92% 50%",
  pink: "330 81% 60%",
  purple: "271 81% 66%",
  cyan: "188 94% 43%",
};

// Light mode HSL values (adjusted for better visibility on light backgrounds)
export const ACCENT_COLOR_MAP_LIGHT: Record<AccentColor, string> = {
  white: "0 0% 10%", // Black for light mode
  blue: "217 91% 50%", // Slightly darker blue
  green: "158 64% 42%", // Slightly darker green
  orange: "38 92% 45%", // Slightly darker orange
  pink: "330 81% 50%", // Slightly darker pink
  purple: "271 81% 56%", // Slightly darker purple
  cyan: "188 94% 38%", // Slightly darker cyan
};
