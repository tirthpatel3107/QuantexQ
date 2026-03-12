// React
import * as React from "react";

// Components - UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icons
import { Eye, EyeOff } from "lucide-react";

// Utils
import { cn } from "@/utils/lib/utils";

export interface CommonInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon to display at the start of the input */
  icon?: React.ElementType;
  /** Optional suffix (e.g. unit text or action icon) */
  suffix?: React.ReactNode;
  /** Optional label rendered above the input */
  label?: string;
}

/**
 * Reusable input component with consistent theme styles.
 * Features a hover effect matching the CommonSelect component.
 * When type="password", renders an eye toggle to show/hide the value.
 */
const CommonInput = React.forwardRef<HTMLInputElement, CommonInputProps>(
  ({ className, icon: Icon, suffix, disabled, label, type, ...props }, ref) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);

    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    // Password toggle takes precedence over suffix when type is password
    const hasSuffix = !isPassword && !!suffix;

    return (
      <div className="w-full my-2">
        {label && <Label className="ml-[3px]">{label}</Label>}
        <div className="relative w-full group mt-2">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Icon className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </div>
          )}
          <Input
            ref={ref}
            disabled={disabled}
            type={resolvedType}
            className={cn(
              "bg-background border-border/50 dark:hover:bg-accent hover:border-primary/30 focus:outline-none focus:ring-0 focus:border-primary/30 focus-visible:border-primary/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-200",
              Icon && "pl-9",
              (hasSuffix || isPassword) && "pr-12",
              type === "number" && "input-no-spin",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          {hasSuffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-wider uppercase pointer-events-none select-none">
              {suffix}
            </div>
          )}
        </div>
      </div>
    );
  },
);

CommonInput.displayName = "CommonInput";

export { CommonInput };
