import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { LucideIcon } from "lucide-react";

interface PumpStatusCardProps {
  name: string;
  icon: LucideIcon;
  status: "running" | "warning" | "alert" | "offline";
  efficiency?: number;
  statusMessage?: string;
  disableInitialSkeleton?: boolean;
}

export function PumpStatusCard({
  name,
  icon: Icon,
  status,
  efficiency,
  statusMessage,
  disableInitialSkeleton = false,
}: PumpStatusCardProps) {
  const skeletonVisible = useInitialSkeleton();
  const showSkeleton = !disableInitialSkeleton && skeletonVisible;

  if (showSkeleton) {
    return (
      <div className="relative p-3 rounded-lg border border-border bg-card">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="skeleton h-2.5 w-2.5 rounded-full" />
            <div className="skeleton h-4 w-24 rounded-md" />
          </div>
          <div className="skeleton h-4 w-4 rounded-full" />
        </div>

        <div className="space-y-3">
          <div className="skeleton h-3 w-16 rounded-md" />
          <div className="skeleton h-2.5 w-full rounded-full" />
          <div className="skeleton h-3 w-20 rounded-md" />
        </div>
      </div>
    );
  }

  const statusConfig = {
    running: {
      bg: "bg-success/10",
      border: "border-success/30",
      dot: "online",
      text: "text-success",
      label: "Running",
    },
    warning: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      dot: "warning",
      text: "text-warning",
      label: "Warning",
    },
    alert: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      dot: "offline",
      text: "text-destructive",
      label: "Alert",
    },
    offline: {
      bg: "bg-muted",
      border: "border-border",
      dot: "offline",
      text: "text-muted-foreground",
      label: "Offline",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border transition-all",
        config.bg,
        config.border,
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("status-indicator", config.dot)} />
          <span className="text-sm font-medium text-foreground">{name}</span>
        </div>
        <Icon className={cn("h-4 w-4", config.text)} />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className={config.text}>{config.label}</span>
        </div>

        {statusMessage && (
          <div className={cn("text-[10px]", config.text)}>{statusMessage}</div>
        )}

        {/* Efficiency bar */}
        {efficiency !== undefined && (
          <>
            <div className="h-1 bg-background/50 rounded-full overflow-hidden my-3">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  status === "running" && "bg-success",
                  status === "warning" && "bg-warning",
                  status === "alert" && "bg-destructive",
                  status === "offline" && "bg-muted-foreground"
                )}
                style={{ width: `${efficiency}%` }}
              />
            </div>
            <div className="text-[11px] text-muted-foreground">
              {efficiency}% efficiency
            </div>
          </>
        )}
      </div>
    </div>
  );
}
