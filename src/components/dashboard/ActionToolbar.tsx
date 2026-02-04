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
import { cn } from "@/lib/utils";

export function ActionToolbar() {
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
              "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            )}
          >
            <action.icon className="h-3.5 w-3.5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button className="action-btn action-btn-primary">
          <Play className="h-4 w-4" />
          <span>Start</span>
        </button>
        <button className="action-btn action-btn-danger">
          <Square className="h-4 w-4" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
}
