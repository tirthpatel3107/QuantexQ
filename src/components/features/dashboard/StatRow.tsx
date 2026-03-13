import { cn } from "@/utils/lib/utils";

export interface StatRowProps {
  /** Label text */
  label: string;
  /** Value to display */
  value: string | number;
  /** Unit of measurement */
  unit?: string;
  /** Optional value color class */
  valueClassName?: string;
  /** Optional label color class */
  labelClassName?: string;
  /** Optional container class */
  className?: string;
}

/**
 * StatRow - Common component for displaying label-value pairs
 * Used across dashboard panels for consistent stat display
 */
export function StatRow({
  label,
  value,
  unit,
  valueClassName,
  labelClassName,
  className,
}: StatRowProps) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <span className={cn("text-sm text-muted-foreground", labelClassName)}>
        {label}
      </span>
      <div className="text-right">
        <span className={cn("text-base font-bold", valueClassName)}>
          {value}
        </span>
        {unit && (
          <span className="text-[14px] text-muted-foreground ml-1">{unit}</span>
        )}
      </div>
    </div>
  );
}
