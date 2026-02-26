export const ENV = {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  API_URL: import.meta.env.VITE_API_URL || '',
  WS_URL: import.meta.env.VITE_WS_URL || '',
} as const;
