import { cn } from "@/lib/utils";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface StatusItem {
  label: string;
  value: string;
  unit?: string;
  status?: "normal" | "warning" | "critical";
}

interface StatusPanelProps {
  title: string;
  items: StatusItem[];
  statusIndicator?: "normal" | "warning" | "critical";
  pieData?: { label: string; value: number; unit?: string; status?: "normal" | "warning" | "critical" }[];
}

export function StatusPanel({ title, items, statusIndicator, pieData }: StatusPanelProps) {
  const pieColors: Record<string, string> = {
    normal: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    critical: "hsl(var(--destructive))",
    default: "hsl(var(--primary))",
  };

  const normalizedPieData =
    pieData?.map((slice) => ({
      ...slice,
      value: Math.max(0, Number.isFinite(slice.value) ? slice.value : 0),
      color: pieColors[slice.status || ""] || pieColors.default,
    })) || [];

  const showPie = normalizedPieData.length > 0;

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          {statusIndicator && (
            <div
              className={cn(
                "status-indicator",
                statusIndicator === "normal" && "online",
                statusIndicator === "warning" && "warning",
                statusIndicator === "critical" && "offline"
              )}
            />
          )}
          <h3 className="panel-title">{title}</h3>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
          >
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                item.status === "warning" && "text-warning",
                item.status === "critical" && "text-destructive",
                (!item.status || item.status === "normal") && "text-foreground"
              )}
            >
              {item.value}
              {item.unit && (
                <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {showPie && (
        <div className="p-3 pt-1 border-t border-border/40">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={normalizedPieData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                >
                  {normalizedPieData.map((slice) => (
                    <Cell key={slice.label} fill={slice.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            {normalizedPieData.map((slice) => (
              <div key={slice.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="flex-1 flex items-center justify-between">
                  <span>{slice.label}</span>
                  <span className="tabular-nums text-foreground">
                    {slice.value}
                    {slice.unit && <span className="text-muted-foreground ml-1">{slice.unit}</span>}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
