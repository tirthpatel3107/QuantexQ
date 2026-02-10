/**
 * Dashboard center column: vertical chart card configs (Flow, Density, etc.)
 * and helper to derive metric values from latest data point.
 */
import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  Gauge,
  Thermometer,
  Activity,
  CircleDot,
  SlidersHorizontal,
} from "lucide-react";
import type { ChartDataPoint } from "@/data/mockData";
import type { VerticalCardConfig } from "@/types/chart";
import type { VerticalChartMetric } from "@/types/chart";

/** Build metric rows with values from latest data point; use "—" when no point. */
export function metricsFromLatestPoint(
  baseMetrics: Omit<VerticalChartMetric, "value">[],
  latestPoint: ChartDataPoint | undefined
): VerticalChartMetric[] {
  if (!latestPoint) {
    return baseMetrics.map((m) => ({ ...m, value: "—" }));
  }
  return baseMetrics.map((m) => {
    const raw = m.dataKey ? latestPoint[m.dataKey] : undefined;
    const value =
      typeof raw === "number" ? String(raw) : raw != null ? String(raw) : "—";
    return { ...m, value };
  });
}

/** Six center cards: Flow, Density, Surface/Standpipe/Bottom Hole Pressure, Choke. */
export const CENTER_CARDS: VerticalCardConfig[] = [
  {
    id: "flow",
    chartKey: "flow",
    title: "Flow",
    icon: Droplets,
    metrics: [
      { label: "IN", unit: "gpm", trend: "down", dataKey: "in", color: "#fbbf24" },
      {
        label: "OUT",
        unit: "gpm",
        trend: "stable",
        status: "warning",
        dataKey: "out",
        color: "#ef4444",
      },
      {
        label: "MUD",
        unit: "ppg",
        trend: "down",
        status: "warning",
        dataKey: "mud",
        color: "#3b82f6",
      },
    ],
    color: "hsl(var(--chart-3))",
  },
  {
    id: "density",
    chartKey: "density",
    title: "Density",
    icon: Gauge,
    metrics: [
      { label: "IN", unit: "ppg", trend: "stable", dataKey: "in", color: "#22c55e" },
      { label: "OUT", unit: "ppg", trend: "stable", dataKey: "out", color: "#3b82f6" },
    ],
    color: "hsl(var(--success))",
  },
  {
    id: "surface-back-pressure",
    chartKey: "surfacePressure",
    title: "Surface Back Pressure",
    icon: Activity,
    metrics: [
      { label: "SP", unit: "psi", trend: "down", dataKey: "sp", color: "#22c55e" },
      { label: "SBP", unit: "psi", trend: "down", dataKey: "sbp", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-4))",
  },
  {
    id: "standpipe-pressure",
    chartKey: "standpipePressure",
    title: "Stand Pipe Pressure",
    icon: CircleDot,
    metrics: [
      { label: "SP", unit: "psi", trend: "stable", dataKey: "sp", color: "#22c55e" },
      { label: "SPP", unit: "psi", trend: "up", dataKey: "spp", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-4))",
  },
  {
    id: "bottom-hole-pressure",
    chartKey: "bottomHolePressure",
    title: "Bottom Hole Pressure",
    icon: Thermometer,
    metrics: [
      { label: "SP", unit: "psi", trend: "stable", dataKey: "sp", color: "#22c55e" },
      { label: "BHP", unit: "psi", trend: "stable", dataKey: "bhp", color: "#3b82f6" },
    ],
    color: "hsl(var(--chart-5))",
  },
  {
    id: "choke",
    chartKey: "choke",
    title: "Choke",
    icon: SlidersHorizontal,
    metrics: [
      { label: "Chock A", unit: "%", trend: "up", dataKey: "choke_a", color: "#22c55e" },
      {
        label: "Chock B",
        unit: "%",
        trend: "stable",
        status: "critical",
        dataKey: "choke_b",
        color: "#ef4444",
      },
      {
        label: "Set point",
        unit: "%",
        trend: "stable",
        dataKey: "set_point",
        color: "#eab308",
      },
    ],
    color: "hsl(var(--chart-6))",
    threshold: { value: 12.5, label: "Set" },
  },
];
