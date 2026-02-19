import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export interface CommonSelectOption {
  label: string;
  value: string;
  icon?: React.ElementType;
  description?: string;
}

export interface CommonSelectProps {
  options: CommonSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  label?: string;
}

export function CommonSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No option found.",
  className,
  triggerClassName,
  disabled = false,
  label,
}: CommonSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  return (
    <div className={cn("w-full mb-5", className)}>
      {label && <Label className="ml-[3px]">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-background font-normal border-border/50 hover:border-primary/30 transition-all duration-200 ml-0 mt-2",
              !value && "text-muted-foreground",
              triggerClassName,
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedOption?.icon && (
                <selectedOption.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 border-border/50 shadow-2xl"
          align="start"
        >
          <Command className="bg-popover">
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-10 border-none bg-transparent"
            />
            <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="flex flex-col items-start gap-0.5 py-2 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center w-full">
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="flex-1 font-medium">{option.label}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 transition-all",
                          value === option.value
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50",
                        )}
                      />
                    </div>
                    {option.description && (
                      <span className="text-[10px] text-muted-foreground line-clamp-1 pl-6">
                        {option.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
