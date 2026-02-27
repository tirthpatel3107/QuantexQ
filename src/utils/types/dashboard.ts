/**
 * Status levels for the application components
 */
export enum StatusLevel {
  SAFE = "safe",
  WARNING = "warning",
  DANGER = "danger",
}

/**
 * Common metrics structure
 */
export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  status?: StatusLevel;
}

/**
 * Pump status types
 */
export enum PumpStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  MAINTENANCE = "maintenance",
}

/**
 * Common simulation actions
 */
export enum SimulationAction {
  START = "start",
  STOP = "stop",
}
