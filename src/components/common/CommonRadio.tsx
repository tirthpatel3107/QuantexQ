import * as React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CommonRadioProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupItem
> & {
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
};

const CommonRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroupItem>,
  CommonRadioProps
>(
  (
    { id, label, className, labelClassName, containerClassName, ...props },
    ref,
  ) => {
    return (
      <div className={cn("flex items-center gap-2.5", containerClassName)}>
        <RadioGroupItem id={id} ref={ref} className={className} {...props} />
        {label &&
          (id ? (
            <Label
              htmlFor={id}
              className={cn(
                "text-[13px] font-medium cursor-pointer",
                labelClassName,
              )}
            >
              {label}
            </Label>
          ) : (
            <span className={cn("text-[13px] font-medium", labelClassName)}>
              {label}
            </span>
          ))}
      </div>
    );
  },
);

CommonRadio.displayName = "CommonRadio";

export { CommonRadio };
