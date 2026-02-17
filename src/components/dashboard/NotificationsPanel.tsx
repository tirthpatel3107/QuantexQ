import { memo, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  category: string;
  message: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const styles = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

export const NotificationsPanel = memo(function NotificationsPanel({
  notifications,
}: NotificationsPanelProps) {
  const [items, setItems] = useState<Notification[]>(notifications);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const showSkeleton = useInitialSkeleton();

  // Keep local state aligned if a new notifications list is passed from above.
  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const selectedNotification = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  );

  const handleRequestRemove = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleRemove = () => {
    if (selectedId) {
      setItems((prev) => prev.filter((item) => item.id !== selectedId));
    }
    setSelectedId(null);
    setConfirmOpen(false);
  };

  const handleClearAll = () => {
    setItems([]);
    setClearAllOpen(false);
  };

  if (showSkeleton) {
    return (
      <div className="dashboard-panel h-full flex flex-col">
        <div className="panel-header">
          <div className="skeleton h-4 w-28 rounded-md" />
          <div className="skeleton h-3 w-16 rounded-md" />
        </div>

        <div className="flex-1 overflow-hidden p-4 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="skeleton h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="skeleton h-3 w-16 rounded-md" />
                  <div className="skeleton h-3 w-12 rounded-md" />
                </div>
                <div className="skeleton h-3 w-full rounded-md" />
                <div className="skeleton h-3 w-3/5 rounded-md" />
              </div>
              <div className="skeleton h-5 w-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-panel h-full flex flex-col">
        <div className="panel-header">
          <h3 className="panel-title">Notifications</h3>
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setClearAllOpen(true)}
            disabled={items.length === 0}
          >
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex items-center justify-center text-sm text-muted-foreground py-6">
              No notifications
            </div>
          ) : (
            items.map((notification) => {
              const Icon = icons[notification.type];
              return (
                <div
                  key={notification.id}
                  className="notification-item animate-fade-in"
                >
                  <div
                    className={cn("shrink-0 mt-0.5", styles[notification.type])}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {notification.timestamp}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded",
                          notification.type === "info" &&
                            "bg-info/10 text-info",
                          notification.type === "success" &&
                            "bg-success/10 text-success",
                          notification.type === "warning" &&
                            "bg-warning/10 text-warning",
                          notification.type === "error" &&
                            "bg-destructive/10 text-destructive",
                        )}
                      >
                        {notification.category}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    className="shrink-0 h-5 w-5 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-0"
                    onClick={() => handleRequestRemove(notification.id)}
                    aria-label="Remove notification"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this notification?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedNotification
                ? `${selectedNotification.category}: ${selectedNotification.message}`
                : "This will remove the selected notification."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove every notification in the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClearAllOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
