import { PanelCard } from "@/components/dashboard/PanelCard";
import { Check } from "lucide-react";

export function MudPropertiesSidebar() {
  return (
    <aside className="w-72 shrink-0 hidden xl:block space-y-4">
      <PanelCard title="Calculated Outputs" className="h-auto">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Calculated ECD @ Bit</span>
            <span className="font-medium tabular-nums">12.98 ppg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Annular friction loss</span>
            <span className="font-medium tabular-nums">512 psi</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pipe friction loss</span>
            <span className="font-medium tabular-nums">339 psi</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated BHP</span>
            <span className="font-medium tabular-nums">6194 psi</span>
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Preset Summary" className="h-auto">
        <div className="space-y-3 text-sm">
          {[
            { label: "Mud system", value: "OBM" },
            { label: "MW in", value: "12.4 ppg" },
            { label: "PV", value: "30 cP" },
            { label: "Gel 10s/10m", value: "12/20" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className="inline-flex items-center gap-1 font-medium text-success">
                <Check className="h-4 w-4" />
                {row.value} OK
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-border space-y-1">
            {["OW range", "Rheology range", "Temp correction"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <Check className="h-4 w-4" />
                  OK
                </span>
              </div>
            ))}
          </div>
        </div>
      </PanelCard>
    </aside>
  );
}
