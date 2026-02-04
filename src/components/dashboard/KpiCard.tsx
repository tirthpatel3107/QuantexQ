import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
  subValues?: { label: string; value: string; status?: "normal" | "warning" | "critical" }[];
}

export function KpiCard({
  title,
  value,
  unit,
  icon: Icon,
  status = "normal",
  subValues,
}: KpiCardProps) {
  const statusColors = {
    normal: "text-primary",
    warning: "text-warning glow-warning",
    critical: "text-destructive glow-danger",
  };

  return (
    <div className="kpi-card group h-full min-h-[170px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center transition-colors",
              status === "normal" && "bg-primary/10 text-primary",
              status === "warning" && "bg-warning/10 text-warning",
              status === "critical" && "bg-destructive/10 text-destructive"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="kpi-label">{title}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-2">
        <span className={cn("kpi-value", statusColors[status])}>{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>

      {/* Sub Values */}
      {subValues && subValues.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
          {subValues.map((sub, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{sub.label}</span>
              <span
                className={cn(
                  "font-medium tabular-nums",
                  sub.status === "warning" && "text-warning",
                  sub.status === "critical" && "text-destructive",
                  (!sub.status || sub.status === "normal") && "text-foreground"
                )}
              >
                {sub.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Decorative gradient line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 transition-opacity opacity-0 group-hover:opacity-100",
          status === "normal" && "bg-gradient-to-r from-transparent via-primary to-transparent",
          status === "warning" && "bg-gradient-to-r from-transparent via-warning to-transparent",
          status === "critical" && "bg-gradient-to-r from-transparent via-destructive to-transparent"
        )}
      />
    </div>
  );
}
