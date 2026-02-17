import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface CommonButtonProps extends ButtonProps {
  /** Optional icon to display */
  icon?: React.ElementType;
  /** Position of the icon relative to children */
  iconPosition?: "left" | "right";
  /** Whether the button is in a loading state */
  loading?: boolean;
}

/**
 * A standard, reusable button component that provides consistent styling
 * and additional features like loading states and icons.
 */
const CommonButton = React.forwardRef<HTMLButtonElement, CommonButtonProps>(
  (
    {
      children,
      className,
      icon: Icon,
      iconPosition = "left",
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative transition-all duration-200 active:scale-95 select-none",
          loading && "text-transparent hover:text-transparent",
          className,
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-current">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            loading && "opacity-0",
          )}
        >
          {Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
        </span>
      </Button>
    );
  },
);

CommonButton.displayName = "CommonButton";

export { CommonButton };
