/**
 * Shared status and type enums used across dashboard, charts, and notifications.
 */

/** Card/chart border status for visual state (normal, warning, critical). */
export const STATUS_LEVEL = {
  NORMAL: "normal",
  WARNING: "warning",
  CRITICAL: "critical",
} as const;
export type StatusLevel = (typeof STATUS_LEVEL)[keyof typeof STATUS_LEVEL];

/** Pump run state. */
export const PUMP_STATUS = {
  RUNNING: "running",
  STOP: "stop",
} as const;
export type PumpStatus = (typeof PUMP_STATUS)[keyof typeof PUMP_STATUS];

/** Notification severity for alerts and notifications panel. */
export const NOTIFICATION_TYPE = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;
export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/** Metric trend direction for chart badges. */
export const TREND = {
  UP: "up",
  DOWN: "down",
  STABLE: "stable",
} as const;
export type Trend = (typeof TREND)[keyof typeof TREND];
