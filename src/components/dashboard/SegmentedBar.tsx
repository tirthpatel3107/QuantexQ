import { cn } from "@/lib/utils";

interface SegmentedBarProps {
  count?: number;
  fillCount?: number;
  color?: string;
  emptyColor?: string;
}

export function SegmentedBar({
  count = 20,
  fillCount = 0,
  color = "bg-primary",
  emptyColor = "bg-muted/30 dark:bg-black/40",
}: SegmentedBarProps) {
  return (
    <div className="flex gap-[2px] h-full w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 h-full rounded-[1px] w-[6px]",
            i < fillCount ? color : emptyColor,
          )}
        />
      ))}
    </div>
  );
}
