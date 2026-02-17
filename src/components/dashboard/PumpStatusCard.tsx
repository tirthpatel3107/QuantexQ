import { memo } from "react";
import { cn } from "@/lib/utils";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG = {
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
} as const;

interface PumpStatusCardProps {
  name: string;
  status: "running" | "stop";
  disableInitialSkeleton?: boolean;
}

export const PumpStatusCard = memo(function PumpStatusCard({
  name,
  status,
  disableInitialSkeleton = false,
}: PumpStatusCardProps) {
  const skeletonVisible = useInitialSkeleton();
  const showSkeleton = !disableInitialSkeleton && skeletonVisible;

  if (showSkeleton) {
    return (
      <div className="relative p-2 rounded-lg border border-border bg-card">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "relative p-2 rounded-lg border transition-all",
        config.bg,
        config.border,
        "hover:shadow-md",
      )}
    >
      <div className="mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs gap-2">
          <span className={cn("flex items-center gap-1.5", config.text)}>
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                status === "running" ? "bg-success" : "bg-destructive",
              )}
              aria-hidden
            />
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
});
