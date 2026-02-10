import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface RestoreDefaultsButtonProps {
  /** Optional click handler; default is no-op. */
  onClick?: () => void;
  /** Button size. */
  size?: "sm" | "default" | "icon" | "lg";
  /** Accessible label. */
  "aria-label"?: string;
}

/**
 * Icon button with "Restore defaults" tooltip. Used in PanelCard header actions
 * (Settings, Mud Properties).
 */
export function RestoreDefaultsButton({
  onClick,
  size = "icon",
  "aria-label": ariaLabel = "Restore defaults",
}: RestoreDefaultsButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size={size} onClick={onClick} aria-label={ariaLabel}>
          <Undo2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Restore defaults</p>
      </TooltipContent>
    </Tooltip>
  );
}
