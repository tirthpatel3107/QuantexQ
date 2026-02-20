import { memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CommonTooltip } from "./CommonTooltip";

export interface CommonSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Input id for label association. */
  id?: string;
}

/**
 * Search field with leading search icon. Used in Settings and Mud Properties.
 */
export const CommonSearchInput = memo(function CommonSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  id,
}: CommonSearchInputProps) {
  return (
    <div
      className={cn("relative flex-1 min-w-[200px] max-w-xl group", className)}
    >
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
        aria-hidden
      />
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9 bg-background border-border/50 hover:bg-accent hover:border-primary/30 focus-visible:border-primary/30 focus-visible:ring-0 focus-visible:ring-offset-0 w-full transition-all duration-200"
      />
      {value && (
        <CommonTooltip content="Clear search">
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-primary hover:bg-primary/10 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        </CommonTooltip>
      )}
    </div>
  );
});
