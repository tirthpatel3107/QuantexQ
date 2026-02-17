import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PanelCardProps {
  /** Card section title (string or node for icon + text) */
  title: React.ReactNode;
  /** Optional action in header (e.g. restore defaults button) */
  headerAction?: React.ReactNode;
  /** Main content of the card */
  children: React.ReactNode;
  /** Extra class names for the root Card */
  className?: string;
  /** Extra class names for CardContent */
  contentClassName?: string;
}

/**
 * Shared panel card used on Settings and Mud Properties pages.
 * Renders a card with title, optional header action, divider, and content.
 */
const PanelCard = React.forwardRef<HTMLDivElement, PanelCardProps>(
  ({ title, headerAction, children, className, contentClassName }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "dashboard-panel h-full min-w-0 p-5 border-0 shadow-none",
          className,
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 min-h-[36px] p-0">
          <CardTitle className="text-base flex items-center gap-2">
            {title}
          </CardTitle>
          {headerAction}
        </CardHeader>
        <hr className="mt-3 mb-4" />
        <CardContent className={cn("p-0", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    );
  },
);
PanelCard.displayName = "PanelCard";

export { PanelCard };
