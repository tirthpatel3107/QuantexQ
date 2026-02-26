import { CommonSkeleton } from "./CommonSkeleton";
import { cn } from "@/shared/utils/utils";

interface SectionSkeletonProps {
  /** Number of cards to display, default is 6 */
  count?: number;
  /** Custom class for the outer wrapper */
  className?: string;
  /** Custom class for the grid container */
  gridClassName?: string;
}

/**
 * A common skeleton component for page sections.
 * Standardizes the loading state layout across Settings, Network, DAQ, and Mud Properties.
 */
export function SectionSkeleton({
  count = 6,
  className,
  gridClassName,
}: SectionSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", className)}>
      <div
        className={cn("grid grid-cols-1 xl:grid-cols-3 gap-3", gridClassName)}
      >
        <CommonSkeleton variant="card" count={count} />
      </div>
    </div>
  );
}
