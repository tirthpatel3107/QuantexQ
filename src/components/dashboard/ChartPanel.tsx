import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

interface ChartPanelProps {
  title: string;
  data: { time: string; value: number }[];
  color?: string;
  status?: "normal" | "warning" | "critical";
  threshold?: { value: number; label: string };
}

export function ChartPanel({
  title,
  data,
  color = "hsl(var(--primary))",
  status = "normal",
  threshold,
}: ChartPanelProps) {
  const [open, setOpen] = useState(false);
  const showSkeleton = useInitialSkeleton();

  const statusBorderColors = {
    normal: "border-border",
    warning: "border-warning/50",
    critical: "border-destructive/50",
  };

  if (showSkeleton) {
    return (
      <div className={cn("dashboard-panel group", statusBorderColors[status])}>
        <div className="panel-header relative">
          <div className="flex items-center gap-3">
            <div className="skeleton h-4 w-24 rounded-md" />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="skeleton h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="p-3">
          <div className="skeleton h-[140px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  const ChartContent = ({ className }: { className?: string }) => (
    <div className={cn("chart-container", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            width={35}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            itemStyle={{ color: color }}
          />
          {threshold && (
            <ReferenceLine
              y={threshold.value}
              stroke="hsl(var(--warning))"
              strokeDasharray="3 3"
              label={{
                value: threshold.label,
                position: "right",
                fill: "hsl(var(--warning))",
                fontSize: 10,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: color,
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

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

        <div className="p-3">
          <ChartContent />
        </div>
      </div>

      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader className="mb-2">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-[420px] sm:h-[520px]">
          <ChartContent className="h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
