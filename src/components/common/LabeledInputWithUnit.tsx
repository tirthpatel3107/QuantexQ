import { CommonInput } from "./CommonInput";
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
  return (
    <div className={cn("space-y-2 min-w-0", className)}>
      <Label htmlFor={id} className="h-5 flex items-center text-sm">
        {label}
      </Label>
      <CommonInput
        id={id}
        value={value}
        readOnly={readOnly}
        onChange={
          onChange != null ? (e) => onChange(e.target.value) : undefined
        }
        suffix={suffix ?? unit}
        className={cn(inputClassName)}
      />
    </div>
  );
}
