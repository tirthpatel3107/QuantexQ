import { cn } from "@/lib/utils";

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
}

export function StatusPanel({ title, items, statusIndicator }: StatusPanelProps) {
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
    </div>
  );
}
