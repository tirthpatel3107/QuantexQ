import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
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

  return (
    <div className="dashboard-panel h-full flex flex-col">
      <div className="panel-header">
        <h3 className="panel-title">Notifications</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {notifications.map((notification) => {
          const Icon = icons[notification.type];
          return (
            <div key={notification.id} className="notification-item animate-fade-in">
              <div className={cn("shrink-0 mt-0.5", styles[notification.type])}>
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
                      notification.type === "info" && "bg-info/10 text-info",
                      notification.type === "success" && "bg-success/10 text-success",
                      notification.type === "warning" && "bg-warning/10 text-warning",
                      notification.type === "error" && "bg-destructive/10 text-destructive"
                    )}
                  >
                    {notification.category}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {notification.message}
                </p>
              </div>
              <button className="shrink-0 h-5 w-5 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
