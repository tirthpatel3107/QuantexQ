import * as React from "react";
import { Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export interface CommonDropdownOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export interface CommonDropdownMenuProps {
  /** Current selected value */
  value: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Array of options to display */
  options: CommonDropdownOption[];
  /** Label text to display in trigger button */
  triggerLabel?: string;
  /** Icon to display in trigger button */
  triggerIcon?: LucideIcon;
  /** Dropdown menu title/label */
  menuLabel?: string;
  /** Alignment of dropdown content */
  align?: "start" | "center" | "end";
  /** Width of dropdown content */
  contentWidth?: string;
  /** Additional className for trigger button */
  triggerClassName?: string;
  /** Whether to highlight trigger when value is not default */
  highlightActive?: boolean;
  /** Default value to compare against for highlighting */
  defaultValue?: string;
  /** Tooltip title for trigger button */
  title?: string;
}

/**
 * A reusable dropdown menu component with consistent styling.
 * Used for filters, group by selectors, and other option selections.
 */
export function CommonDropdownMenu({
  value,
  onValueChange,
  options,
  triggerLabel,
  triggerIcon: TriggerIcon,
  menuLabel,
  align = "start",
  contentWidth = "w-[180px]",
  triggerClassName,
  highlightActive = false,
  defaultValue = "all",
  title,
}: CommonDropdownMenuProps) {
  const isActive = highlightActive && value !== defaultValue;
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-9 px-3 flex items-center justify-center gap-2 rounded-md border border-border bg-white/5 text-foreground hover:border-primary/50 hover:bg-primary/5 shadow-sm transition-all active:scale-95 whitespace-nowrap text-[13px]",
            isActive && "border-primary/50 text-primary bg-primary/5",
            triggerClassName,
          )}
          title={title}
        >
          {TriggerIcon && <TriggerIcon className="h-4 w-4" />}
          {triggerLabel && <span>{triggerLabel}</span>}
          {!triggerLabel && selectedOption && (
            <span>{selectedOption.label}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn(
          contentWidth,
          "bg-background/95 backdrop-blur-md border-white/10",
        )}
      >
        {menuLabel && (
          <>
            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
              {menuLabel}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
          </>
        )}
        {options.map((option) => {
          const OptionIcon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onValueChange(option.value)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                {OptionIcon && (
                  <OptionIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-sm transition-colors",
                    value === option.value
                      ? "text-primary font-medium"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {option.label}
                </span>
              </div>
              {value === option.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
