import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonSelect,
  CommonInput,
} from "@/components/common";
import { FluidData } from "@/types/mud";

interface FluidSystemPanelProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
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
        <CommonSelect
          label="Type"
          options={typeOptions}
          value={fluid.type}
          onValueChange={(v) => setFluid((f) => ({ ...f, type: v }))}
        />

        <CommonSelect
          label="Base Fluid"
          options={baseFluidOptions}
          value={fluid.baseFluid}
          onValueChange={(v) => setFluid((f) => ({ ...f, baseFluid: v }))}
        />

        <CommonInput
          label="Active pits volume (bbl)"
          value={fluid.activePitsVolume}
          onChange={(e) =>
            setFluid((f) => ({
              ...f,
              activePitsVolume: e.target.value,
            }))
          }
        />

        <CommonSelect
          label="Flowline temperature"
          options={tempOptions}
          value={fluid.flowlineTemp}
          onValueChange={(v) => setFluid((f) => ({ ...f, flowlineTemp: v }))}
        />
      </div>
    </PanelCard>
  );
}
