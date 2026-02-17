import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface CommonInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon to display at the start of the input */
  icon?: React.ElementType;
  /** Optional suffix (e.g. unit text or action icon) */
  suffix?: React.ReactNode;
}

/**
 * Reusable input component with consistent theme styles.
 * Features a hover effect matching the CommonSelect component.
 */
const CommonInput = React.forwardRef<HTMLInputElement, CommonInputProps>(
  ({ className, icon: Icon, suffix, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Icon className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
        )}
        <Input
          ref={ref}
          disabled={disabled}
          className={cn(
            "bg-background border-border/50 hover:border-primary/30 focus-visible:border-primary/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200",
            Icon && "pl-9",
            suffix && "pr-12",
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-wider uppercase pointer-events-none select-none">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

CommonInput.displayName = "CommonInput";

export { CommonInput };
