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

interface ChartPanelProps {
  title: string;
  data: { time: string; value: number }[];
  color?: string;
  unit?: string;
  currentValue?: string;
  status?: "normal" | "warning" | "critical";
  threshold?: { value: number; label: string };
}

export function ChartPanel({
  title,
  data,
  color = "hsl(var(--primary))",
  unit = "",
  currentValue,
  status = "normal",
  threshold,
}: ChartPanelProps) {
  const statusBorderColors = {
    normal: "border-border",
    warning: "border-warning/50",
    critical: "border-destructive/50",
  };

  return (
    <div className={cn("dashboard-panel", statusBorderColors[status])}>
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <h3 className="panel-title">{title}</h3>
          {currentValue && (
            <span
              className={cn(
                "text-lg font-bold tabular-nums",
                status === "normal" && "text-primary",
                status === "warning" && "text-warning",
                status === "critical" && "text-destructive"
              )}
            >
              {currentValue}
              <span className="text-xs text-muted-foreground ml-1">{unit}</span>
            </span>
          )}
        </div>
        <button className="h-6 w-6 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="chart-container">
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
      </div>
    </div>
  );
}
