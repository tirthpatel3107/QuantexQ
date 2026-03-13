import { cn } from "@/utils/lib/utils";

export interface StatusIndicatorProps {
  color: string;
  label: string;
  className?: string;
}

export function StatusIndicator({ color, label, className }: StatusIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-success text-[12px] font-bold uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}