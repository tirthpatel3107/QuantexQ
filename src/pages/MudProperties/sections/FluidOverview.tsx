import { FluidSystemPanel } from "./panels/FluidSystemPanel";
import { RheologyPanel } from "./panels/RheologyPanel";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";

interface FluidOverviewSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
  typeOptions: { label: string; value: string }[];
  baseFluidOptions: { label: string; value: string }[];
  tempOptions: { label: string; value: string }[];
}

export function FluidOverview({
  fluid,
  setFluid,
  typeOptions,
  baseFluidOptions,
  tempOptions,
}: FluidOverviewSectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
      <FluidSystemPanel
        fluid={fluid}
        setFluid={setFluid}
        typeOptions={typeOptions}
        baseFluidOptions={baseFluidOptions}
        tempOptions={tempOptions}
      />
      <RheologyPanel fluid={fluid} setFluid={setFluid} />
      <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
      <TemperaturePanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
