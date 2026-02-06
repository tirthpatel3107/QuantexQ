import { memo, useState, useCallback } from "react";
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CHART_MARGIN = { top: 6, right: 6, bottom: 6, left: 2 };
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "6px",
    fontSize: "11px",
  },
  labelStyle: { color: "hsl(var(--muted-foreground))" },
};
const Y_AXIS_TICK = { fontSize: 9, fill: "hsl(var(--muted-foreground))" };

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
  className?: string;
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

interface ChartInnerProps {
  data: { time: string; value: number }[];
  color: string;
  threshold?: { value: number; label: string };
  title: string;
}

const ChartInner = memo(function ChartInner({
  data,
  color,
  threshold,
  title,
}: ChartInnerProps) {
  const formatter = useCallback((value: number) => [value, "Value"], []);
  const labelFormatter = useCallback(
    (label: string) => `${title} — Time: ${label}`,
    [title]
  );
  return (
    <LineChart
      data={data}
      margin={CHART_MARGIN}
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
        tick={Y_AXIS_TICK}
        width={32}
      />
      <Tooltip
        contentStyle={TOOLTIP_STYLE.contentStyle}
        labelStyle={TOOLTIP_STYLE.labelStyle}
        itemStyle={{ color }}
        formatter={formatter}
        labelFormatter={labelFormatter}
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
  );
});

export const VerticalChartCard = memo(function VerticalChartCard({
  title,
  icon: Icon,
  metrics,
  data,
  color = "hsl(var(--primary))",
  threshold,
  status = "normal",
  className,
}: VerticalChartCardProps) {
  const showSkeleton = useInitialSkeleton();
  const [expandOpen, setExpandOpen] = useState(false);

  const mainMetric = metrics[0];
  const mainDisplay = mainMetric
    ? `${mainMetric.value}${mainMetric.unit != null && mainMetric.unit !== "" ? ` ${mainMetric.unit}` : ""}`
    : "—";

  if (showSkeleton) {
    return (
      <div className={cn("dashboard-panel group h-full flex flex-col", statusBorderColors[status], className)}>
        <div className="panel-header flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="skeleton h-4 w-20 rounded-md" />
          </div>
          <div className="skeleton h-6 w-16 rounded-md" />
        </div>
        <div className="p-2.5 pt-0 min-h-[420px]">
          <div className="skeleton h-[420px] w-full rounded-md" />
        </div>
        <div className="px-3 pt-1.5 pb-2 flex gap-2 justify-center">
          <div className="skeleton h-5 w-14 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("dashboard-panel group flex flex-col relative h-full", statusBorderColors[status], className)}>
      {/* Header: left = Icon (replaced by expand on hover) + Title, right = main count (teal) */}
      <div className="panel-header flex items-center justify-between gap-2 min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          {/* Chart content icon place: metric icon by default, expand icon on card hover */}
          <button
            type="button"
            onClick={() => setExpandOpen(true)}
            className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary cursor-pointer focus:outline-none focus:bg-primary/25 focus:ring-2 focus:ring-primary/40 focus:ring-inset"
            aria-label="Expand chart"
          >
            {Icon && (
              <Icon className="h-4 w-4 transition-opacity group-hover:opacity-0" aria-hidden />
            )}
            <Maximize2 className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
          </button>
          <h3 className="panel-title min-w-0 truncate text-foreground font-bold uppercase tracking-wide" title={title}>
            {title}
          </h3>
        </div>
        <span className="font-bold tabular-nums text-primary flex-shrink-0">
          {mainDisplay}
        </span>
      </div>

      {/* Chart area only */}
      <div className="vertical-line-chart px-2.5 pb-2 min-h-[420px] flex-1 w-full max-h-[540px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartInner data={data} color={color} threshold={threshold} title={title} />
        </ResponsiveContainer>
      </div>

      {/* Badges: below chart, centered; last badge: light=black bg+white text, dark=white bg+black text */}
      <div className="px-3 pt-1.5 pb-2 flex flex-wrap gap-1.5 justify-center">
        {metrics.map((m, i) => {
          const badgeBgColors = ["#21d5ed", "#f59f0a"] as const;
          const isLastBadge = i % 3 === 2;
          const bgColor = isLastBadge ? undefined : badgeBgColors[i % badgeBgColors.length];
          return (
            <UITooltip key={i}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "inline-flex min-w-0 flex-shrink items-center rounded border border-transparent px-1.5 py-0.5 text-[10px] tabular-nums overflow-hidden cursor-default font-bold",
                    isLastBadge ? "bg-black text-white dark:bg-white dark:text-black" : "text-black"
                  )}
                  style={bgColor != null ? { backgroundColor: bgColor } : undefined}
                >
                  <span className="min-w-0 truncate">
                    {m.value}
                  </span>
                  {m.unit != null && m.unit !== "" && (
                    <span className="ml-0.5 shrink-0">{m.unit}</span>
                  )}
                  {m.trend && (
                    <span className="ml-0.5 shrink-0 text-[9px]" aria-hidden>
                      {trendIcons[m.trend]}
                    </span>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{m.label}</p>
              </TooltipContent>
            </UITooltip>
          );
        })}
      </div>

      {/* Expand popup: chart in dialog */}
      <Dialog open={expandOpen} onOpenChange={setExpandOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold uppercase tracking-wide">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-[420px] w-full -mx-2">
            <ResponsiveContainer width="100%" height={420}>
              <ChartInner data={data} color={color} threshold={threshold} title={title} />
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
