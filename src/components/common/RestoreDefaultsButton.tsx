import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommonTooltip } from "./CommonTooltip";

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
    <CommonTooltip content="Restore defaults">
      <Button
        variant="ghost"
        size={size}
        onClick={onClick}
        aria-label={ariaLabel}
        className="group relative bg-white dark:bg-transparent hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-transparent hover:border-primary/20"
      >
        {/* Animated glow ring on hover */}
        <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/5 blur-sm pointer-events-none" />
        <RotateCcw className="h-[15px] w-[15px] text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
      </Button>
    </CommonTooltip>
  );
}
