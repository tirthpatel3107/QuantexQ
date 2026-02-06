import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

interface PumpStatusCardProps {
  name: string;
  status: "running" | "stop";
  disableInitialSkeleton?: boolean;
}

export function PumpStatusCard({
  name,
  status,
  disableInitialSkeleton = false,
}: PumpStatusCardProps) {
  const skeletonVisible = useInitialSkeleton();
  const showSkeleton = !disableInitialSkeleton && skeletonVisible;

  if (showSkeleton) {
    return (
      <div className="relative p-2 rounded-lg border border-border bg-card">
        <div className="skeleton h-4 w-24 rounded-md mb-2" />
        <div className="skeleton h-3 w-16 rounded-md" />
      </div>
    );
  }

  const statusConfig = {
    running: {
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      label: "Running",
    },
    stop: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      text: "text-destructive",
      label: "Stop",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative p-2 rounded-lg border transition-all",
        config.bg,
        config.border,
        "hover:shadow-md"
      )}
    >
      <div className="mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className={config.text}>{config.label}</span>
        </div>
      </div>
    </div>
  );
}
