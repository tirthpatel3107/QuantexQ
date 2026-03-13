/**
 * Shared chart and dashboard types.
 */

import type { LucideIcon } from "lucide-react";

/** Keys for chart datasets in simulation state (must match mockData seriesConfigs). */
export type ChartDataKey =
  | "flow"
  | "density"
  | "surfacePressure"
  | "standpipePressure"
  | "bottomHolePressure"
  | "choke";

/** Single metric row in vertical chart card (label, value, unit, trend, status). */
export interface VerticalChartMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "critical";
  dataKey?: string;
  color?: string;
}

/** Config for dashboard center vertical chart cards (Flow, Density, etc.). */
export interface VerticalCardConfig {
  id: string;
  chartKey: ChartDataKey;
  title: string;
  icon: LucideIcon;
  metrics: Omit<VerticalChartMetric, "value">[];
  color: string;
  threshold?: { value: number; label: string };
  status?: "normal" | "warning" | "critical";
}

/** Data point in custom ECharts datasets. */
export interface ChartDataPoint {
  time: string;
  [key: string]: string | number;
}

/** Collection of chart data points. */
export type ChartDataset = ChartDataPoint[];
