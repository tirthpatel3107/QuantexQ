import {
  Settings,
  Network,
  Wrench,
  BookOpen,
  PlusCircle,
  Play,
  Square,
  Sliders,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CommonAlertDialog,
  CommonButton,
  CommonTooltip,
} from "@/components/common";
import { SimulationAction } from "@/types/dashboard";

/**
 * ActionToolbar provides quick access to system settings, configuration,
 * and primary simulation controls (Start/Stop).
 */
export function ActionToolbar() {
  const [confirmAction, setConfirmAction] = useState<SimulationAction | null>(
    null,
  );

  const actions = [
    { icon: Settings2, label: "Settings" },
    { icon: Network, label: "Network" },
    { icon: Sliders, label: "Valve Config" },
    { icon: Wrench, label: "Equipment" },
    { icon: BookOpen, label: "Well Info" },
    { icon: PlusCircle, label: "Create" },
  ];

  return (
    <div className="border-t border-border bg-card px-3 sm:px-4 py-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left Actions */}
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        {actions.map((action, i) => (
          <CommonTooltip key={i} content={action.label}>
            <CommonButton
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
              icon={action.icon}
            >
              {action.label}
            </CommonButton>
          </CommonTooltip>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <CommonTooltip content="Start the simulation operation">
          <CommonButton
            className="action-btn action-btn-primary"
            onClick={() => setConfirmAction(SimulationAction.START)}
            icon={Play}
          >
            Start
          </CommonButton>
        </CommonTooltip>
        <CommonTooltip content="Stop the simulation operation">
          <CommonButton
            className="action-btn action-btn-danger"
            onClick={() => setConfirmAction(SimulationAction.STOP)}
            icon={Square}
          >
            Stop
          </CommonButton>
        </CommonTooltip>
      </div>

      <CommonAlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction === SimulationAction.START
            ? "Start operation?"
            : "Stop operation?"
        }
        description={
          confirmAction === SimulationAction.START
            ? "Are you sure you want to start? This will begin the operation."
            : "Are you sure you want to stop? This will halt the current operation."
        }
        cancelText="Cancel"
        actionText={confirmAction === SimulationAction.START ? "Start" : "Stop"}
        onAction={() => setConfirmAction(null)}
        actionClassName={
          confirmAction === SimulationAction.STOP
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : ""
        }
      />
    </div>
  );
}
