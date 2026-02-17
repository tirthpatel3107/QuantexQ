import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface CommonAlertDialogProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description or content */
  description: string | React.ReactNode;
  /** Text for the cancel button. If omitted, no cancel button is shown. */
  cancelText?: string;
  /** Text for the primary action button */
  actionText: string;
  /** Callback for primary action */
  onAction: () => void;
  /** Optional class name for the action button */
  actionClassName?: string;
  /** Callback for cancel action */
  onCancel?: () => void;
}

/**
 * A reusable AlertDialog component to provide consistent confirmation UI
 * across the application.
 */
export function CommonAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText,
  actionText,
  onAction,
  actionClassName,
  onCancel,
}: CommonAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText && (
            <AlertDialogCancel
              onClick={onCancel}
              className="border-border hover:bg-accent hover:text-foreground"
            >
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={onAction}
            className={cn(
              "font-medium transition-all active:scale-95",
              actionClassName,
            )}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
