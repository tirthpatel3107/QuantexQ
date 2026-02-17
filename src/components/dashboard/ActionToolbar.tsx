import {
  Settings,
  Network,
  Wrench,
  Info,
  Plus,
  Play,
  Square,
  Sliders,
} from "lucide-react";
import { useState } from "react";
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

export function ActionToolbar() {
  const [confirmAction, setConfirmAction] = useState<"start" | "stop" | null>(
    null,
  );

  const actions = [
    { icon: Settings, label: "Settings" },
    { icon: Network, label: "Network" },
    { icon: Sliders, label: "Valve Config" },
    { icon: Wrench, label: "Equipment" },
    { icon: Info, label: "Well Info" },
    { icon: Plus, label: "Create" },
  ];

  return (
    <div className="border-t border-border bg-card px-3 sm:px-4 py-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left Actions */}
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        {actions.map((action, i) => (
          <button
            key={i}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium",
              "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
            )}
          >
            <action.icon className="h-3.5 w-3.5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="action-btn action-btn-primary"
          onClick={() => setConfirmAction("start")}
        >
          <Play className="h-4 w-4" />
          <span>Start</span>
        </button>
        <button
          type="button"
          className="action-btn action-btn-danger"
          onClick={() => setConfirmAction("stop")}
        >
          <Square className="h-4 w-4" />
          <span>Stop</span>
        </button>
      </div>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "start"
                ? "Start operation?"
                : "Stop operation?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "start"
                ? "Are you sure you want to start? This will begin the operation."
                : "Are you sure you want to stop? This will halt the current operation."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmAction === "stop"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={() => setConfirmAction(null)}
            >
              {confirmAction === "start" ? "Start" : "Stop"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
