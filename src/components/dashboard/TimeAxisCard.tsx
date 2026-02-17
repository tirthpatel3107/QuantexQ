import { memo, useMemo, useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { COLORS } from "@/constants/colors";
import { useTheme } from "@/components/theme-provider";
import { Clock } from "lucide-react";

interface TimeAxisCardProps {
  data: any[];
  className?: string;
}

const ChartInner = memo(function ChartInner({
  data,
  isDark,
}: {
  data: any[];
  isDark: boolean;
}) {
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
        prev.width === w && prev.height === h ? prev : { width: w, height: h }
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

    return {
      grid: {
        top: 25,
        right: 2,
        bottom: 50, // Match the bottom margin of content charts
        left: 35,
        containLabel: false,
      },
      xAxis: {
        type: "value",
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        type: "category",
        data: times,
        inverse: true,
        boundaryGap: false, // Align labels exactly with grid lines
        show: true,
        axisLine: { show: false },
        axisTick: { show: true, lineStyle: { color: axisColor } },
        axisLabel: {
          show: true,
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
      series: [],
      animation: false,
    };
  }, [data, isDark]);

  const chartHeight = size.height;
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

export const TimeAxisCard = memo(function TimeAxisCard({
  data,
  className,
}: TimeAxisCardProps) {
  const showSkeleton = useInitialSkeleton();
  const { theme } = useTheme();

  const isDark = useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  }, [theme]);

  if (showSkeleton) {
    return (
      <div
        className={cn(
          "dashboard-panel group h-full flex flex-col",
          className
        )}
      >
        <div className="panel-header flex items-center justify-center gap-2">
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
        <div className="p-2.5 pt-0 flex-1">
          <div className="skeleton h-full w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "dashboard-panel group flex flex-col relative h-full antialiased select-none",
        className
      )}
    >
      {/* Header with Clock Icon */}
      <div className="panel-header flex items-center justify-center gap-2 min-w-0">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Clock className="h-4 w-4" aria-hidden />
        </div>
      </div>

      {/* Time axis area - matching the chart height */}
      <div className="vertical-line-chart flex flex-col px-0 pb-0 flex-1 w-full overflow-hidden relative">
        {/* Empty space to match metrics height */}
        <div className="px-2.5 py-3 h-[60px]" />
        
        {/* Chart area with only Y-axis */}
        <div className="flex-1 min-h-0 px-2 py-2">
          <ChartInner data={data} isDark={isDark} />
        </div>
      </div>
    </div>
  );
});
