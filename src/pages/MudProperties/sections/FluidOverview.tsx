import { CommonSkeleton, SectionSkeleton } from "@/components/common";
import { FluidSystemPanel } from "./panels/FluidSystemPanel";
import { RheologyPanel } from "./panels/RheologyPanel";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";
import { useFluidOverviewData } from "@/services/api/mudproperties/mudproperties.api";
import { useEffect } from "react";

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
  const { data: overviewResponse, isLoading, error } = useFluidOverviewData();
  const overviewData = overviewResponse?.data;

  // Update fluid state when API data loads
  useEffect(() => {
    if (overviewData) {
      setFluid((prev) => ({
        ...prev,
        type: overviewData.type,
        baseFluid: overviewData.baseFluid,
        activePitsVolume: overviewData.activePitsVolume,
        flowlineTemp: overviewData.flowlineTemp,
      }));
    }
  }, [overviewData, setFluid]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }
  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading fluid overview data</div>
    );
  }

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
