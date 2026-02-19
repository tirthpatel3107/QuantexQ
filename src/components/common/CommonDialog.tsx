import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CommonDialogProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: React.ReactNode;
  /** Optional dialog description */
  description?: string;
  /** Dialog body content */
  children: React.ReactNode;
  /** Optional footer content (usually buttons) */
  footer?: React.ReactNode;
  /** Optional class name for the DialogContent */
  className?: string;
  /** Max width class for the dialog (defaults to sm:max-w-[425px]) */
  maxWidth?: string;
  /** Whether to show the divider line after the header (defaults to true) */
  showDivider?: boolean;
  /** Whether to hide the default close button (defaults to false) */
  hideClose?: boolean;
}

/**
 * A reusable Dialog component that provides a consistent layout
 * with header, divider, body, and footer.
 */
export function CommonDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  maxWidth = "sm:max-w-[425px]",
  showDivider = true,
  hideClose = false,
}: CommonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(maxWidth, className)} hideClose={hideClose}>
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Consistent divider line after header */}
        {showDivider && <div className="h-[1px] w-full bg-border" />}

        {/* Dialog Body */}
        <div className="py-2">{children}</div>

        {/* Dialog Footer */}
        {footer && (
          <DialogFooter className="gap-2 sm:gap-0 mt-2">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
