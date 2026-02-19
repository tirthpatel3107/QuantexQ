import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CommonCheckboxProps = React.ComponentPropsWithoutRef<typeof Checkbox> & {
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
};

const CommonCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  CommonCheckboxProps
>(({ id, label, className, labelClassName, containerClassName, ...props }, ref) => {
  return (
    <div className={cn("flex items-center gap-2.5", containerClassName)}>
      <Checkbox id={id} ref={ref} className={className} {...props} />
      {label && (
        id ? (
          <Label
            htmlFor={id}
            className={cn("text-[13px] font-medium cursor-pointer", labelClassName)}
          >
            {label}
          </Label>
        ) : (
          <span className={cn("text-[13px] font-medium", labelClassName)}>{label}</span>
        )
      )}
    </div>
  );
});

CommonCheckbox.displayName = "CommonCheckbox";

export { CommonCheckbox };

