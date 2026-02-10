import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
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
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  id,
}: SearchInputProps) {
  return (
    <div className={cn("relative flex-1 min-w-[200px] max-w-xl", className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
      />
    </div>
  );
}
