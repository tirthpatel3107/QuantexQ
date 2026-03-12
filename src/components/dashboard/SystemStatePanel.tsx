import { Check } from "lucide-react";
import { PanelCard } from "./PanelCard";

interface SystemStateItem {
  label: string;
  value: string | boolean;
  type?: "status" | "boolean" | "text";
}

interface SystemStatePanelProps {
  className?: string;
}

/**
 * SystemStatePanel Component
 *
 * Displays system state information with status indicators
 */
export function SystemStatePanel({ className }: SystemStatePanelProps) {
  const systemItems: SystemStateItem[] = [
    { label: "Flow Control Mode", value: true, type: "boolean" },
    { label: "Depth", value: true, type: "boolean" },
    { label: "Choke Status", value: "Ready", type: "text" },
    { label: "Gas Detector", value: "HP", type: "text" },
  ];

  return (
    <PanelCard
      title={<span>System State</span>}
      headerAction={
        <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/30">
          <span className="text-sm font-bold text-green-500 uppercase tracking-wider">
            READY
          </span>
        </div>
      }
      className={className}
    >
      <div className="space-y-2.5">
        {systemItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{item.label}</span>

            <div className="text-right">
              {item.type === "boolean" && item.value && (
                <div className="w-5 h-5 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-500" />
                </div>
              )}

              {item.type === "text" && (
                <span className="text-base">{item.value as string}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
