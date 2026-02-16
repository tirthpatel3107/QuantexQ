import { memo, useState, useMemo, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Maximize2 } from "lucide-react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
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
import type { VerticalChartMetric } from "@/types/chart";

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
}

const ChartInner = memo(function ChartInner({
  data,
  metrics,
  threshold,
  height = "100%",
  badgeColors,
  isDark,
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
      setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const option: EChartsOption = useMemo(() => {
    const times = data.map((d) => d.time);
    
    // Theme-specific colors
    const axisColor = isDark ? "#ffffff" : "hsl(var(--foreground))";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
    const tooltipBg = isDark ? "hsl(var(--card))" : "#ffffff";
    const tooltipText = isDark ? "#ffffff" : "#000000";

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
          color: badgeColors[i] || m.color || "#3b82f6",
        },
        ...(threshold && i === metrics.length - 1
          ? {
              markLine: {
                symbol: "none",
                label: { 
                  formatter: threshold.label, 
                  position: "start", // Moved to top
                  color: isDark ? "#ffffff" : "#000000",
                  fontSize: 11
                },
                lineStyle: { 
                  type: "dashed", 
                  color: isDark ? "#ffffff" : "#000000", 
                  width: 2 
                },
                data: [{ xAxis: threshold.value }],
              },
            }
          : {}),
      }));

    return {
      tooltip: {
        trigger: "axis",
        appendToBody: true, // Render directly in body to avoid container scaling/transform issues which cause blur
        renderMode: "html",
        transitionDuration: 0,
        backgroundColor: tooltipBg,
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        textStyle: {
          color: tooltipText,
          fontSize: 12,
          fontFamily: "inherit",
          fontWeight: 600, // Thicker text for clarity
        },
        // Combine crisp text settings with a clean shadow and high z-index
        extraCssText: "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 6px; z-index: 9999; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;", 
        padding: [8, 12],
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const time = params[0].axisValueLabel;
          let content = `<div class="font-bold mb-1.5" style="color:${tooltipText}; font-size: 13px;">${time}</div>`;
          params.forEach((p: any) => {
             const metric = metrics.find(m => m.label === p.seriesName);
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
        right: 20,
        bottom: 10,
        left: 10,
        containLabel: true,
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
          lineStyle: { color: gridColor } 
        },
        axisLabel: { 
          show: true,
          fontSize: 11,
          fontWeight: "normal", // Set to normal
          color: axisColor,
          rotate: 90,
          interval: 0 
        },
        axisLine: { show: false },
        axisTick: { show: true, lineStyle: { color: axisColor } },
        scale: true, 
      },
      yAxis: {
        type: "category",
        data: times,
        inverse: true,
        show: true,
        axisLine: { show: false },
        axisTick: { show: true, lineStyle: { color: axisColor } },
        axisLabel: { 
           show: true,
           interval: Math.floor(data.length / 10),
           fontSize: 11,
           fontWeight: "normal", // Set to normal
           color: axisColor
        },
        splitLine: { 
          show: true, // Show horizontal lines
          lineStyle: { color: gridColor }
        },
      },
      series: series as any,
      animation: false,
    };
  }, [data, metrics, threshold, badgeColors, isDark]);

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
}: VerticalChartCardProps) {
  const showSkeleton = useInitialSkeleton();
  const [expandOpen, setExpandOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" ? !document.documentElement.classList.contains("light") : true
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(!document.documentElement.classList.contains("light"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Badge colors logic - recreated from previous version
  const badgeBgColors = ["#21d5ed", "#f59f0a"] as const;
  
  // Pre-calculate colors for chart lines to match badges
  const seriesLineColors = useMemo(() => {
    return metrics.map((_, i) => {
       const isLastBadge = i % 3 === 2;
       // For line colors:
       // 1st badge (i=0) -> #21d5ed (Cyan)
       // 2nd badge (i=1) -> #f59f0a (Orange)
       // 3rd badge (i=2) -> White (Dark mode) / Black (Light mode)
       if (isLastBadge) return isDark ? "#ffffff" : "#000000"; 
       return badgeBgColors[i % badgeBgColors.length];
    });
  }, [metrics, isDark]);


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
    <div 
      className={cn("dashboard-panel group flex flex-col relative h-full antialiased cursor-pointer select-none", statusBorderColors[status], className)}
      onDoubleClick={onDoubleClick}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header: left = Icon + Title, right = main count */}
      <div className="panel-header flex items-center justify-between gap-2 min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
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
      </div>

      {/* Chart area */}
      <div className="vertical-line-chart flex flex-col px-0 pb-0 min-h-[420px] flex-1 w-full max-h-[540px] overflow-hidden relative">
        <div className="px-2.5 py-2 flex flex-col gap-1 pointer-events-none">
          {metrics.map((m, i) => (
            <div 
              key={i} 
              className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider h-4" 
              style={{ color: seriesLineColors[i] }}
            >
              <span className="truncate mr-2 max-w-[60%]">{m.label}</span>
              <span className="tabular-nums shrink-0">{m.value} {m.unit}</span>
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
          <div className="flex-1 w-full min-h-0 flex flex-col relative">
            <div className="px-4 py-2 flex flex-col gap-1 pointer-events-none">
              {metrics.map((m, i) => (
                <div 
                  key={i} 
                  className="flex justify-between items-center text-xs font-bold uppercase tracking-wider h-5" 
                  style={{ color: seriesLineColors[i] }}
                >
                  <span className="truncate mr-2 max-w-[70%]">{m.label}</span>
                  <span className="tabular-nums shrink-0">{m.value} {m.unit}</span>
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
               />
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
