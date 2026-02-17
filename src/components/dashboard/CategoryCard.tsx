import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface CategoryCardProps {
  /** Card title */
  title: string;
  /** Short description */
  description: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Click handler */
  onClick?: () => void;
  /** Extra class names for the root Card */
  className?: string;
}

/**
 * Clickable category card with icon, title and description.
 * Used on Settings page for category grid; reusable elsewhere.
 */
const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ title, description, icon: Icon, onClick, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "dashboard-panel cursor-pointer border-border/80 h-full min-w-0",
          onClick && "hover:border-primary/50 transition-colors",
          className,
        )}
        onClick={onClick}
      >
        <CardContent className="p-5 flex items-start gap-3 h-full">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
);
CategoryCard.displayName = "CategoryCard";

export { CategoryCard };
