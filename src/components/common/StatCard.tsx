import { ReactNode } from "react";
import { cn } from "../../utils/lib/utils";

interface StatCardProps {
  label: string;
  value: string | ReactNode;
  subtitle?: string | ReactNode;
  valueClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  valueClassName,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-foreground/[0.03] p-3 border border-border/10 px-4 group hover:bg-foreground/[0.06] hover:border-primary/20 transition-all cursor-default",
        className
      )}
    >
      <div className="space-y-1">
        <div className="text-sm opacity-50 group-hover:opacity-70 transition-opacity">
          {label}
        </div>
        {subtitle && (
          <div className="text-sm font-black text-foreground/80 group-hover:text-primary transition-colors">
            {subtitle}
          </div>
        )}
      </div>
      <div
        className={cn(
          "text-2xl font-mono font-black text-foreground/95 flex items-baseline gap-1.5 group-hover:scale-110 transition-transform origin-right",
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  );
}
