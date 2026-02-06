import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { Maximize2 } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

export interface VerticalChartMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "critical";
}

interface VerticalChartCardProps {
  title: string;
  icon?: LucideIcon;
  metrics: VerticalChartMetric[];
  data: { time: string; value: number }[];
  color?: string;
  threshold?: { value: number; label: string };
  status?: "normal" | "warning" | "critical";
}

const statusBorderColors = {
  normal: "border-border",
  warning: "border-warning/50",
  critical: "border-destructive/50",
};

const trendIcons = {
  up: "↑",
  down: "↓",
  stable: "=",
};

const trendColors = {
  up: "text-success",
  down: "text-destructive",
  stable: "text-muted-foreground",
};

const metricStatusColors = {
  normal: "text-foreground",
  warning: "text-warning",
  critical: "text-destructive",
};

export const VerticalChartCard = memo(function VerticalChartCard({
  title,
  icon: Icon,
  metrics,
  data,
  color = "hsl(var(--primary))",
  threshold,
  status = "normal",
}: VerticalChartCardProps) {
  const showSkeleton = useInitialSkeleton();

  const mainMetric = metrics[0];
  const mainDisplay = mainMetric
    ? `${mainMetric.value}${mainMetric.unit != null && mainMetric.unit !== "" ? ` ${mainMetric.unit}` : ""}`
    : "—";

  if (showSkeleton) {
    return (
      <div className={cn("dashboard-panel group", statusBorderColors[status])}>
        <div className="panel-header flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="skeleton h-4 w-20 rounded-md" />
          </div>
          <div className="skeleton h-6 w-16 rounded-md" />
        </div>
        <div className="px-3 pb-1.5 flex gap-2">
          <div className="skeleton h-5 w-14 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
        </div>
        <div className="p-2.5 pt-0 min-h-[140px]">
          <div className="skeleton h-[140px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("dashboard-panel group flex flex-col relative", statusBorderColors[status])}>
      {/* Expand icon: absolute, visible only on hover */}
      <button
        type="button"
        className="absolute top-1.5 right-1.5 z-10 h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Expand chart"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>

      {/* Header: left = Icon + Title (truncate with ... when overflows), right = main count (teal) */}
      <div className="panel-header flex items-center justify-between gap-2 min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          {Icon && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <h3 className="panel-title min-w-0 truncate text-white font-medium uppercase tracking-wide" title={title}>
            {title}
          </h3>
        </div>
        <span className="text-xl font-bold tabular-nums text-primary flex-shrink-0">
          {mainDisplay}
        </span>
      </div>

      {/* Badges: one line, small font; truncate with ... if overflow */}
      <div className="px-3 pb-1.5 flex flex-nowrap gap-1.5 overflow-hidden min-w-0">
        {metrics.map((m, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex min-w-0 flex-shrink items-center rounded border px-1.5 py-0.5 text-[10px] font-medium tabular-nums overflow-hidden",
              "border-border/80 bg-muted/40",
              m.status === "warning" && "border-warning/40",
              m.status === "critical" && "border-destructive/40"
            )}
          >
            <span className="text-white/90 mr-0.5 shrink-0">{m.label}:</span>
            <span className={cn(
              "min-w-0 truncate",
              m.status === "warning" && "text-warning",
              m.status === "critical" && "text-destructive",
              !m.status || m.status === "normal" ? "text-primary" : ""
            )}>
              {m.value}
            </span>
            {m.unit != null && m.unit !== "" && (
              <span className="text-white/70 ml-0.5 shrink-0">{m.unit}</span>
            )}
            {m.trend && (
              <span className={cn("ml-0.5 shrink-0 text-[9px]", trendColors[m.trend])} aria-hidden>
                {trendIcons[m.trend]}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Chart area only */}
      <div className="vertical-line-chart px-2.5 pb-2 min-h-[140px] flex-1 w-full max-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 6, right: 6, bottom: 6, left: 2 }}
              layout="vertical"
            >
              <XAxis
                type="category"
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={false}
                width={0}
              />
              <YAxis
                type="number"
                dataKey="value"
                domain={["auto", "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                itemStyle={{ color }}
                formatter={(value: number) => [value, "Value"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              {threshold && (
                <ReferenceLine
                  y={threshold.value}
                  stroke="hsl(var(--warning))"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                activeDot={{
                  r: 3,
                  fill: color,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 1,
                }}
              />
            </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
