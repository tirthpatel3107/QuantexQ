import { toast } from "@/shared/hooks/use-toast";

export type ToastVariant = "default" | "destructive" | "success";

interface ShowToastParams {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

/**
 * Common toast utility for showing notifications
 * Positioned at top-right of the screen
 */
export const showToast = ({
  title,
  description,
  variant = "default",
  duration = 3000,
}: ShowToastParams) => {
  // Map success variant to default with custom styling
  const toastVariant = variant === "success" ? "default" : variant;

  return toast({
    title,
    description,
    variant: toastVariant,
    duration,
    className:
      variant === "success"
        ? "border-green-500/50 bg-green-50/95 dark:bg-green-950/95 backdrop-blur supports-[backdrop-filter]:bg-green-50/80 dark:supports-[backdrop-filter]:bg-green-950/80"
        : undefined,
  });
};

/**
 * Convenience methods for common toast types
 */
export const CommonToast = {
  success: (title: string, description?: string) =>
    showToast({ title, description, variant: "success" }),

  error: (title: string, description?: string) =>
    showToast({ title, description, variant: "destructive" }),

  info: (title: string, description?: string) =>
    showToast({ title, description, variant: "default" }),
};
