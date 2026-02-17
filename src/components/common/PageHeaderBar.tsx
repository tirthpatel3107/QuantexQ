import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderBarProps {
  /** Icon or element shown next to title. */
  icon: ReactNode;
  title: string;
  /** Optional metadata (e.g. "Active Profile: ..."). */
  metadata?: ReactNode;
  /** Action buttons (Save, Discard, etc.). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Page header strip: icon + title + metadata + actions. Used on Settings and Mud Properties.
 */
export function PageHeaderBar({
  icon,
  title,
  metadata,
  actions,
  className,
}: PageHeaderBarProps) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-border bg-card/95 backdrop-blur px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h1 className="text-base font-bold tracking-tight">{title}</h1>
        </div>
        {metadata != null && (
          <>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              |
            </span>
            <span className="text-sm text-muted-foreground">{metadata}</span>
          </>
        )}
      </div>
      {actions != null && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
