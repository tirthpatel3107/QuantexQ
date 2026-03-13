import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/utils/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 pr-10 shadow-2xl backdrop-blur-md transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-full data-[state=open]:duration-300 data-[state=closed]:duration-200",
  {
    variants: {
      variant: {
        default:
          "border-border/50 bg-background/95 text-foreground backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-lg",
        destructive:
          "destructive group border-red-500/50 bg-red-50/95 text-red-900 dark:bg-red-950/95 dark:text-red-50 backdrop-blur-md supports-[backdrop-filter]:bg-red-50/90 dark:supports-[backdrop-filter]:bg-red-950/90 shadow-red-500/20",
        success:
          "border-green-500/50 bg-green-50/95 text-green-900 dark:bg-green-950/95 dark:text-green-50 backdrop-blur-md supports-[backdrop-filter]:bg-green-50/90 dark:supports-[backdrop-filter]:bg-green-950/90 shadow-green-500/20",
        warning:
          "border-amber-500/50 bg-amber-50/95 text-amber-900 dark:bg-amber-950/95 dark:text-amber-50 backdrop-blur-md supports-[backdrop-filter]:bg-amber-50/90 dark:supports-[backdrop-filter]:bg-amber-950/90 shadow-amber-500/20",
        info: "border-blue-500/50 bg-blue-50/95 text-blue-900 dark:bg-blue-950/95 dark:text-blue-50 backdrop-blur-md supports-[backdrop-filter]:bg-blue-50/90 dark:supports-[backdrop-filter]:bg-blue-950/90 shadow-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      duration?: number;
      showIcon?: boolean;
    }
>(({ className, variant, duration, showIcon = true, ...props }, ref) => {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (!duration || duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration]);

  const getIcon = () => {
    if (!showIcon) return null;

    const iconClass = "h-5 w-5 shrink-0 mt-0.5";
    switch (variant) {
      case "success":
        return (
          <CheckCircle2
            className={cn(iconClass, "text-green-600 dark:text-green-400")}
          />
        );
      case "destructive":
        return (
          <AlertCircle
            className={cn(iconClass, "text-red-600 dark:text-red-400")}
          />
        );
      case "warning":
        return (
          <AlertTriangle
            className={cn(iconClass, "text-amber-600 dark:text-amber-400")}
          />
        );
      case "info":
        return (
          <Info className={cn(iconClass, "text-blue-600 dark:text-blue-400")} />
        );
      default:
        return <Info className={cn(iconClass, "text-foreground/60")} />;
    }
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }),
        "relative overflow-hidden",
        className,
      )}
      {...props}
    >
      {getIcon()}
      <div className="flex-1 space-y-1">{props.children}</div>
      {duration && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
          <div
            className={cn(
              "h-full transition-all duration-75 ease-linear",
              variant === "success" && "bg-green-500",
              variant === "destructive" && "bg-red-500",
              variant === "warning" && "bg-amber-500",
              variant === "info" && "bg-blue-500",
              variant === "default" && "bg-foreground/40",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1.5 text-foreground/50 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-foreground/20 hover:scale-110 active:scale-95",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-snug", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
