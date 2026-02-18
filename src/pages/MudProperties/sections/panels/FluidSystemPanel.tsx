import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RestoreDefaultsButton, CommonSelect, CommonInput } from "@/components/common";

interface FluidSystemPanelProps {
  fluid: any;
  setFluid: (updater: (prev: any) => any) => void;
  typeOptions: { label: string; value: string }[];
  baseFluidOptions: { label: string; value: string }[];
  tempOptions: { label: string; value: string }[];
}

export function FluidSystemPanel({
  fluid,
  setFluid,
  typeOptions,
  baseFluidOptions,
  tempOptions,
}: FluidSystemPanelProps) {
  return (
    <PanelCard title="Fluid System" headerAction={<RestoreDefaultsButton />}>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Type</Label>
          <CommonSelect
            options={typeOptions}
            value={fluid.type}
            onValueChange={(v) => setFluid((f: any) => ({ ...f, type: v }))}
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Base Fluid</Label>
          <CommonSelect
            options={baseFluidOptions}
            value={fluid.baseFluid}
            onValueChange={(v) => setFluid((f: any) => ({ ...f, baseFluid: v }))}
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Active pits volume (bbl)</Label>
          <CommonInput
            value={fluid.activePitsVolume}
            onChange={(e) =>
              setFluid((f: any) => ({
                ...f,
                activePitsVolume: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Flowline temperature</Label>
          <CommonSelect
            options={tempOptions}
            value={fluid.flowlineTemp}
            onValueChange={(v) => setFluid((f: any) => ({ ...f, flowlineTemp: v }))}
          />
        </div>
      </div>
    </PanelCard>
  );
}
