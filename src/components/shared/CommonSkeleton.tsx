import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/lib/utils";

interface CommonSkeletonProps {
  variant?: "card" | "table" | "list" | "form" | "custom";
  count?: number;
  className?: string;
}

export function CommonSkeleton({
  variant = "card",
  count = 1,
  className,
}: CommonSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return <SkeletonCard className={className} />;
      case "table":
        return <SkeletonTable className={className} />;
      case "list":
        return <SkeletonListItem className={className} />;
      case "form":
        return <SkeletonForm className={className} />;
      default:
        return <Skeleton className={className} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)}>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

function SkeletonTable({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      ))}
    </div>
  );
}

function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 p-4 border-b", className)}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

function SkeletonForm({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export { SkeletonCard, SkeletonTable, SkeletonListItem, SkeletonForm };
