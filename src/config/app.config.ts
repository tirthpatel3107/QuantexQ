export const THEME_STORAGE_KEY = "vite-ui-theme";
export const ACCENT_COLOR_STORAGE_KEY = "accent-color";
export const SIMULATION_TIMER_STORAGE_KEY = "simulation-timer";
export const SKELETON_DURATION_MS = 1000;
export const CHART_UPDATE_INTERVAL_MS = 1000;
export const TIMER_TICK_MS = 100;

export const APP_CONFIG = {
  name: "QuantEx Q",
  version: "0.0.0",
  apiTimeout: 30000,
  queryStaleTime: 60000,
} as const;
