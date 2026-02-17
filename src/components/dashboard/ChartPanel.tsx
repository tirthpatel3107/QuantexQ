import { memo, useState, useMemo } from "react";
import { Maximize2 } from "lucide-react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartPanelProps {
  title: string;
  data: { time: string; value: number }[];
  color?: string;
  status?: "normal" | "warning" | "critical";
  threshold?: { value: number; label: string };
}

const statusBorderColors = {
  normal: "border-border",
  warning: "border-warning/50",
  critical: "border-destructive/50",
};

function LineChartContent({
  data,
  color,
  threshold,
  className,
}: {
  data: { time: string; value: number }[];
  color: string;
  threshold?: { value: number; label: string };
  className?: string;
}) {
  const option: EChartsOption = useMemo(
    () => ({
      grid: { top: 5, right: 5, bottom: 5, left: 35, containLabel: true },
      xAxis: {
        type: "category",
        data: data.map((d) => d.time),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: "hsl(var(--muted-foreground))" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: "hsl(var(--muted-foreground))" },
        splitLine: { show: false },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        borderRadius: 6,
        textStyle: { fontSize: 12, color: "hsl(var(--muted-foreground))" },
        formatter: (params: unknown) => {
          const p = Array.isArray(params) ? params[0] : null;
          if (!p) return "";
          const point = data[p.dataIndex];
          return `${point.time}<br/><span style="color:${color};font-weight:600">${point.value}</span>`;
        },
      },
      series: [
        {
          type: "line",
          data: data.map((d) => d.value),
          smooth: true,
          symbol: "none",
          lineStyle: { width: 2, color },
          emphasis: {
            focus: "series",
            lineStyle: { width: 2 },
            itemStyle: {
              color,
              borderColor: "hsl(var(--background))",
              borderWidth: 2,
            },
          },
          ...(threshold && {
            markLine: {
              symbol: "none",
              lineStyle: {
                type: "dashed",
                color: "hsl(var(--warning))",
                width: 1.5,
              },
              label: {
                show: true,
                position: "end",
                color: "hsl(var(--warning))",
                fontSize: 10,
                formatter: threshold.label,
              },
              data: [{ yAxis: threshold.value }],
            },
          }),
        },
      ],
      animation: false,
    }),
    [data, color, threshold],
  );

  return (
    <div
      className={cn("chart-container h-full w-full min-h-0 min-w-0", className)}
    >
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}

export const ChartPanel = memo(function ChartPanel({
  title,
  data,
  color = "hsl(var(--primary))",
  status = "normal",
  threshold,
}: ChartPanelProps) {
  const [open, setOpen] = useState(false);
  const showSkeleton = useInitialSkeleton();

  if (showSkeleton) {
    return (
      <div className={cn("dashboard-panel group", statusBorderColors[status])}>
        <div className="panel-header relative">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="p-3">
          <Skeleton className="h-[140px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={cn("dashboard-panel group", statusBorderColors[status])}>
        <div className="panel-header relative">
          <div className="flex items-center gap-3">
            <h3 className="panel-title">{title}</h3>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <DialogTrigger asChild>
              <button
                className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Expand chart"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </DialogTrigger>
          </div>
        </div>

        <div className="p-3 h-[140px]">
          <LineChartContent data={data} color={color} threshold={threshold} />
        </div>
      </div>

      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader className="mb-2">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-[420px] sm:h-[520px]">
          <LineChartContent
            data={data}
            color={color}
            threshold={threshold}
            className="h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
