import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface LabeledInputWithUnitProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  unit: string;
  readOnly?: boolean;
  /** Optional suffix (e.g. lock/expand buttons). */
  suffix?: React.ReactNode;
  /** Input id for label. */
  id?: string;
  className?: string;
  /** Use muted background when read-only. */
  inputClassName?: string;
}

/**
 * Label + input with trailing unit (and optional suffix). Used across Mud Properties
 * for PV, YP, Gel, Salinity, Temperature, etc.
 */
export function LabeledInputWithUnit({
  label,
  value,
  onChange,
  unit,
  readOnly = false,
  suffix,
  id,
  className,
  inputClassName,
}: LabeledInputWithUnitProps) {
  const containerClass =
    "flex h-10 items-center rounded-md border border-border/30 overflow-hidden focus-within:border-primary/50";
  const bgClass = readOnly ? "bg-muted/30" : "bg-accent/10";

  return (
    <div className={cn("space-y-2 min-w-0", className)}>
      <Label htmlFor={id} className="h-5 flex items-center text-sm">
        {label}
      </Label>
      <div className={cn(containerClass, bgClass, inputClassName)}>
        <Input
          id={id}
          value={value}
          readOnly={readOnly}
          onChange={
            onChange != null ? (e) => onChange(e.target.value) : undefined
          }
          className="h-10 flex-1 min-w-0 border-0 bg-transparent pl-4 pr-1 text-left text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
        />
        {suffix ?? (
          <span className="px-2.5 text-[11px] text-muted-foreground shrink-0">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
