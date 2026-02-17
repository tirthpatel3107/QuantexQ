import { memo, useState, useMemo, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Maximize2 } from "lucide-react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VerticalChartMetric } from "@/types/chart";
import { COLORS } from "@/constants/colors";
import { useTheme } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";

export type { VerticalChartMetric };

interface VerticalChartCardProps {
  title: string;
  icon?: LucideIcon;
  metrics: VerticalChartMetric[];
  data: any[];
  color?: string; // Fallback color
  threshold?: { value: number; label: string };
  status?: "normal" | "warning" | "critical";
  className?: string;
  onDoubleClick?: () => void;
  hideYAxis?: boolean; // Hide Y-axis when TimeAxisCard is shown separately
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
  data: any[];
  metrics: VerticalChartMetric[];
  threshold?: { value: number; label: string };
  height?: number | string;
  badgeColors: string[]; // Pass badge colors to match lines
  isDark: boolean;
  hideYAxis?: boolean;
}

const ChartInner = memo(function ChartInner({
  data,
  metrics,
  threshold,
  height = "100%",
  badgeColors,
  isDark,
  hideYAxis = false,
}: ChartInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setSize((prev) =>
        prev.width === w && prev.height === h ? prev : { width: w, height: h },
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const option: EChartsOption = useMemo(() => {
    const times = data.map((d) => d.time);

    // Theme-specific colors
    const axisColor = isDark
      ? COLORS.charts_ui.axis_dark
      : COLORS.charts_ui.axis_light;
    const gridColor = isDark
      ? COLORS.charts_ui.grid_dark
      : COLORS.charts_ui.grid_light;
    const tooltipBg = isDark
      ? "hsl(var(--card))"
      : COLORS.charts_ui.tooltip_bg_light;
    const tooltipText = isDark
      ? COLORS.charts_ui.tooltip_text_dark
      : COLORS.charts_ui.tooltip_text_light;

    const series = metrics
      .filter((m) => m.dataKey)
      .map((m, i) => ({
        name: m.label,
        type: "line",
        data: data.map((d) => d[m.dataKey!]),
        symbol: "none",
        smooth: 0.4,
        lineStyle: {
          width: 1.5,
          color: badgeColors[i] || m.color || COLORS.data.out,
        },
        ...(threshold && i === metrics.length - 1
          ? {
              markLine: {
                symbol: "none",
                label: {
                  formatter: threshold.label,
                  position: "start",
                  color: isDark
                    ? COLORS.charts_ui.axis_dark
                    : COLORS.charts_ui.axis_light,
                  fontSize: 11,
                },
                lineStyle: {
                  type: "dashed",
                  color: isDark
                    ? COLORS.charts_ui.axis_dark
                    : COLORS.charts_ui.axis_light,
                  width: 2,
                },
                data: [{ xAxis: threshold.value }],
              },
            }
          : {}),
      }));

    return {
      tooltip: {
        trigger: "axis",
        appendToBody: true,
        renderMode: "html",
        transitionDuration: 0,
        backgroundColor: tooltipBg,
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        textStyle: {
          color: tooltipText,
          fontSize: 12,
          fontFamily: "inherit",
          fontWeight: 600,
        },
        extraCssText:
          "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 6px; z-index: 9999; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;",
        padding: [8, 12],
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const time = params[0].axisValueLabel;
          let content = `<div class="font-bold mb-1.5" style="color:${tooltipText}; font-size: 13px;">${time}</div>`;
          params.forEach((p: any) => {
            const metric = metrics.find((m) => m.label === p.seriesName);
            const unit = metric?.unit ? ` ${metric.unit}` : "";
            const circleColor = badgeColors[p.seriesIndex] || p.color;
            content += `
              <div class="flex items-center gap-2 text-xs mb-1 last:mb-0" style="color:${tooltipText}">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${circleColor}"></span>
                <span style="opacity: 0.8">${p.seriesName}:</span>
                <span class="font-mono font-bold">${p.value}${unit}</span>
              </div>
            `;
          });
          return content;
        },
      },
      grid: {
        top: 25,
        right: 5,
        bottom: 50, // Fixed bottom margin for rotated labels
        left: hideYAxis ? 5 : 35,
        containLabel: false,
      },
      dataZoom: [
        {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "empty",
        },
      ],
      xAxis: {
        type: "value",
        splitLine: {
          show: true,
          lineStyle: { color: gridColor },
        },
        axisLabel: {
          show: true,
          fontSize: 11,
          fontWeight: "normal",
          color: axisColor,
          rotate: 90,
          interval: 0,
        },
        axisLine: { show: false },
        axisTick: { show: true, lineStyle: { color: axisColor } },
        scale: true,
      },
      yAxis: {
        type: "category",
        data: times,
        inverse: true,
        boundaryGap: false, // Align grid lines exactly with labels
        show: true,
        axisLine: { show: false },
        axisTick: { show: !hideYAxis, lineStyle: { color: axisColor } },
        axisLabel: {
          show: !hideYAxis,
          interval: Math.floor(data.length / 10),
          fontSize: 11,
          fontWeight: "normal",
          color: axisColor,
        },
        splitLine: {
          show: true,
          lineStyle: { color: gridColor },
        },
      },
      series: series as any,
      animation: false,
    };
  }, [data, metrics, threshold, badgeColors, isDark, hideYAxis]);

  const chartHeight = typeof height === "string" ? size.height : height;
  const chartWidth = size.width;
  const hasSize = chartWidth > 0 && chartHeight > 0;

  return (
    <div ref={containerRef} className="h-full w-full min-h-0 min-w-0">
      {hasSize && (
        <ReactECharts
          option={option}
          style={{ width: chartWidth, height: chartHeight }}
          opts={{ renderer: "svg" }}
        />
      )}
    </div>
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
  onDoubleClick,
  hideYAxis = false,
}: VerticalChartCardProps) {
  const showSkeleton = useInitialSkeleton();
  const [expandOpen, setExpandOpen] = useState(false);
  const { theme } = useTheme();

  const isDark = useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark" || theme === "midnight";
  }, [theme]);

  // Badge colors logic
  const badgeBgColors = [COLORS.data.cyan, COLORS.data.orange] as const;

  // Pre-calculate colors for chart lines to match badges
  const seriesLineColors = useMemo(() => {
    return metrics.map((_, i) => {
      const isLastBadge = i % 3 === 2;
      if (isLastBadge)
        return isDark
          ? COLORS.charts_ui.axis_dark
          : COLORS.charts_ui.axis_light;
      return badgeBgColors[i % badgeBgColors.length];
    });
  }, [metrics, isDark]);

  const mainMetric = metrics[0];
  const mainDisplay = mainMetric
    ? `${mainMetric.value}${mainMetric.unit != null && mainMetric.unit !== "" ? ` ${mainMetric.unit}` : ""}`
    : "—";

  if (showSkeleton) {
    return (
      <div
        className={cn(
          "dashboard-panel group h-full flex flex-col",
          statusBorderColors[status],
          className,
        )}
      >
        <div className="panel-header flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="p-2.5 pt-0 flex-1">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="px-3 pt-1.5 pb-2 flex gap-2 justify-center">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "dashboard-panel chart-card group flex flex-col relative h-full antialiased cursor-pointer select-none",
        statusBorderColors[status],
        className,
      )}
      onDoubleClick={onDoubleClick}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header: left = Icon + Title, right = main count */}
      <div className="panel-header flex items-center justify-between gap-2 min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandOpen(true)}
            className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-primary/15 text-primary cursor-pointer focus:outline-none focus:bg-primary/25 focus:ring-2 focus:ring-primary/40 focus:ring-inset"
            aria-label="Expand chart"
          >
            {Icon && (
              <Icon
                className="h-4 w-4 transition-opacity group-hover:opacity-0"
                aria-hidden
              />
            )}
            <Maximize2
              className="absolute h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </button>
          <h3
            className="panel-title min-w-0 truncate text-foreground font-bold uppercase tracking-wide"
            title={title}
          >
            {title}
          </h3>
        </div>
      </div>

      <hr />

      {/* Chart area */}
      <div className="vertical-line-chart flex flex-col p-3 flex-1 w-full overflow-hidden relative">
        <div className="flex justify-between gap-3 pointer-events-none h-[60px]">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
              <span
                className="text-[15px] font-bold tabular-nums leading-tight"
                style={{ color: seriesLineColors[i] }}
              >
                {m.value}{" "}
                <span className="text-[12px] font-medium">{m.unit}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex-1 min-h-0">
          <ChartInner
            data={data}
            metrics={metrics}
            threshold={threshold}
            badgeColors={seriesLineColors}
            isDark={isDark}
            hideYAxis={hideYAxis}
          />
        </div>
      </div>

      {/* Expand popup */}
      <Dialog open={expandOpen} onOpenChange={setExpandOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-foreground font-bold uppercase tracking-wide">
              {title}
            </DialogTitle>
          </DialogHeader>
          <hr className="mt-2 mb-3" />
          <div className="flex-1 w-full min-h-0 flex flex-col relative">
            <div className="pb-5 flex justify-between gap-4 pointer-events-none">
              {metrics.map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </span>
                  <span
                    className="text-[20px] font-bold tabular-nums leading-tight"
                    style={{ color: seriesLineColors[i] }}
                  >
                    {m.value}{" "}
                    <span className="text-[14px] font-medium">{m.unit}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              <ChartInner
                data={data}
                metrics={metrics}
                threshold={threshold}
                badgeColors={seriesLineColors}
                height="100%"
                isDark={isDark}
                hideYAxis={false}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
