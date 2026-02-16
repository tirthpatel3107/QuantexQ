import { memo } from "react";
import { cn } from "@/lib/utils";

interface StatRowProps {
  label: string;
  value: string;
  unit?: string;
  subValue?: string;
  highlight?: boolean;
}

export const StatRow = memo(function StatRow({
  label,
  value,
  unit,
  subValue,
  highlight,
}: StatRowProps) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-xs text-muted-foreground font-medium mb-1 truncate">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-2xl font-bold tracking-tight truncate",
            highlight ? "text-primary shadow-glow-sm" : "text-foreground",
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground font-medium">
            {unit}
          </span>
        )}
      </div>
      {subValue && (
        <div className="h-4 mt-1 flex items-center">
          <span className="text-[10px] text-muted-foreground truncate opacity-70">
            {subValue}
          </span>
        </div>
      )}
      {!subValue && <div className="h-4 mt-1" />}
    </div>
  );
});
