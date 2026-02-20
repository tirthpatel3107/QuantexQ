import * as React from "react";
import { Check, LucideIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CommonButton } from "./CommonButton";

export interface CommonDropdownOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export interface CommonDropdownMenuProps {
  /** Current selected value (single select) or values (multi select) */
  value: string | string[];
  /** Callback when value changes */
  onValueChange: (value: string | string[]) => void;
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
  defaultValue?: string | string[];
  /** Tooltip title for trigger button */
  title?: string;
  /** Enable search functionality */
  searchable?: boolean;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Enable multiple selection */
  multiple?: boolean;
  /** Show selected items as badges */
  showBadges?: boolean;
  /** Show count indicator on trigger */
  showCount?: boolean;
}

/**
 * A reusable dropdown menu component with consistent styling.
 * Used for filters, group by selectors, and other option selections.
 * Supports both single and multiple selection modes.
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
  searchable = false,
  searchPlaceholder = "Search...",
  multiple = false,
  showBadges = false,
  showCount = false,
}: CommonDropdownMenuProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Normalize values to array for easier handling
  const selectedValues = React.useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [value];
    }
    return [];
  }, [value, multiple]);

  const isActive =
    highlightActive &&
    (multiple
      ? selectedValues.length > 0 &&
        JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)
      : value !== defaultValue);

  const selectedOption = !multiple
    ? options.find((opt) => opt.value === value)
    : null;
  const selectedCount = multiple ? selectedValues.length : 0;

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, searchQuery, searchable]);

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onValueChange(newValues);
    } else {
      onValueChange(optionValue);
    }
  };

  const handleRemoveBadge = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const newValues = selectedValues.filter((v) => v !== optionValue);
      onValueChange(newValues);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onValueChange([]);
    }
  };

  const isOptionSelected = (optionValue: string) => {
    return multiple
      ? selectedValues.includes(optionValue)
      : value === optionValue;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
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
          {showCount && multiple && selectedCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground font-bold shadow-lg pointer-events-none">
              {selectedCount}
            </span>
          )}
        </div>
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
        {searchable && (
          <>
            <div className="px-2 py-1.5">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-sm bg-background/50 border-border/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50"
                  autoFocus
                />
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
          </>
        )}
        {showBadges && multiple && selectedCount > 0 && (
          <>
            <div className="px-2 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                  Selected ({selectedCount})
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-[10px] text-primary hover:text-primary/80 transition-colors uppercase tracking-wider font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedValues.map((val) => {
                  const option = options.find((opt) => opt.value === val);
                  if (!option) return null;
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="h-6 px-2 text-[11px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 gap-1"
                    >
                      {option.label}
                      <button
                        onClick={(e) => handleRemoveBadge(val, e)}
                        className="ml-0.5 hover:text-primary/80 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
          </>
        )}
        {filteredOptions.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No results found
          </div>
        ) : (
          filteredOptions.map((option) => {
            const OptionIcon = option.icon;
            const selected = isOptionSelected(option.value);
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  {OptionIcon && (
                    <OptionIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      selected
                        ? "text-primary font-medium"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                {selected && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
