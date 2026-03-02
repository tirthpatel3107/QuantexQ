import { toast } from "@/hooks/use-toast";

export type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info";

interface ShowToastParams {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  showIcon?: boolean;
}

/**
 * Common toast utility for showing notifications
 * Positioned at top-right of the screen with modern design
 */
export const showToast = ({
  title,
  description,
  variant = "default",
  duration = 3000,
  showIcon = true,
}: ShowToastParams) => {
  return toast({
    title,
    description,
    variant,
    duration,
    showIcon,
  });
};

/**
 * Convenience methods for common toast types
 */
export const CommonToast = {
  success: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "success", duration }),

  error: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "destructive", duration }),

  warning: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "warning", duration }),

  info: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "info", duration }),
};
