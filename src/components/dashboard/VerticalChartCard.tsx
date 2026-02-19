import { memo, useState, useMemo, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Maximize2, MoreVertical } from "lucide-react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption, LineSeriesOption } from "echarts";
import { cn } from "@/lib/utils";
import { useSimulation } from "@/hooks/useSimulation";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { CommonDialog, CommonButton, CommonTooltip } from "@/components/common";
import type { VerticalChartMetric } from "@/types/chart";
import { COLORS } from "@/constants/colors";
import { useTheme } from "@/components/theme-provider";
import { ChartDataPoint } from "@/types/chart";

export type { VerticalChartMetric };

interface VerticalChartCardProps {
  title: string;
  icon?: LucideIcon;
  metrics: VerticalChartMetric[];
  data: ChartDataPoint[];
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

/**
 * Renders a single metric value with its label and unit
 */
const MetricDisplay = ({
  label,
  value,
  unit,
  color,
  isLarge = false,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  isLarge?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span
      className={cn(
        "font-bold uppercase tracking-wider text-muted-foreground",
        isLarge ? "text-[11px]" : "text-[12px]",
      )}
    >
      {label}
    </span>
    <span
      className={cn(
        "font-bold tabular-nums leading-tight",
        isLarge ? "text-[20px]" : "text-[15px]",
      )}
      style={{ color }}
    >
      {value}{" "}
      <span
        className={cn("font-medium", isLarge ? "text-[14px]" : "text-[12px]")}
      >
        {unit}
      </span>
    </span>
  </div>
);

interface ChartInnerProps {
  data: ChartDataPoint[];
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
          color: m.color || COLORS.data.out,
        },
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
        // Modern shadow and rounding for tooltip
        extraCssText:
          "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 6px; z-index: 9999; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;",
        padding: [8, 12],
        formatter: (params: unknown) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const firstParam = params[0] as { axisValueLabel: string };
          const time = firstParam.axisValueLabel;
          let content = `<div class="font-bold mb-1.5" style="color:${tooltipText}; font-size: 13px;">${time}</div>`;
          (
            params as Array<{
              seriesName: string;
              value: number | string;
              color: string;
              seriesIndex: number;
            }>
          ).forEach((p) => {
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
        left: hideYAxis ? 5 : 55,
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
        splitNumber: 4,
        splitLine: {
          show: true,
          lineStyle: { color: gridColor },
        },
        axisLabel: {
          show: true,
          fontSize: 11,
          fontWeight: "normal",
          color: axisColor,
          rotate: 90, // Vertical chart display requirement
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
          interval: Math.floor(data.length / 10), // Show roughly 10 labels
          fontSize: 11,
          fontWeight: "normal",
          color: axisColor,
        },
        splitLine: {
          show: true,
          lineStyle: { color: gridColor },
        },
      },
      series: series as LineSeriesOption[],
      animation: false, // Performance: disable animations for high-frequency updates
    };
  }, [data, metrics, badgeColors, isDark, hideYAxis]);

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

  // Use the color property directly defined on each metric
  const seriesLineColors = useMemo(() => {
    return metrics.map((m) => m.color || COLORS.data.out);
  }, [metrics]);

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
          <CommonTooltip content="Expand chart">
            <CommonButton
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setExpandOpen(true);
              }}
              className="flex-shrink-0 bg-white dark:bg-primary/15 text-primary hover:bg-primary/25"
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
            </CommonButton>
          </CommonTooltip>
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
            <MetricDisplay
              key={i}
              label={m.label}
              value={m.value}
              unit={m.unit}
              color={seriesLineColors[i]}
            />
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

      <CommonDialog
        open={expandOpen}
        onOpenChange={setExpandOpen}
        title={title}
        maxWidth="max-w-4xl max-h-[90vh] h-[80vh]"
      >
        <div className="flex-1 w-full min-h-0 flex flex-col relative px-4">
          <div className="pb-5 flex justify-between gap-4 pointer-events-none">
            {metrics.map((m, i) => (
              <MetricDisplay
                key={i}
                label={m.label}
                value={m.value}
                unit={m.unit}
                color={seriesLineColors[i]}
                isLarge
              />
            ))}
          </div>
          <div className="flex-1 min-h-[400px]">
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
      </CommonDialog>
    </div>
  );
});
