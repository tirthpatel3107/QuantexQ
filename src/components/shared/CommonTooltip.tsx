import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CommonTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  delayDuration?: number;
  disabled?: boolean;
}

/**
 * Common tooltip component that always displays on top
 * Wraps shadcn/ui tooltip with consistent positioning
 */
export const CommonTooltip: React.FC<CommonTooltipProps> = ({
  children,
  content,
  delayDuration = 200,
  disabled = false,
}) => {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" align="center">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
