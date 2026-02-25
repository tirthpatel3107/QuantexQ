import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { FluidData } from "@/types/mud";
import { useDensityData } from "@/services/api/mudproperties/mudproperties.api";
import { useEffect } from "react";

interface DensitySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Density({ fluid, setFluid }: DensitySectionProps) {
  const { data: densityResponse, isLoading, error } = useDensityData();
  const densityData = densityResponse?.data;

  // Update fluid state when API data loads
  useEffect(() => {
    if (densityData) {
      setFluid((prev) => ({
        ...prev,
        oilWater: densityData.oilWaterRatio,
        salinity: densityData.salinity,
      }));
    }
  }, [densityData, setFluid]);

  if (isLoading) {
    return <div className="p-4">Loading density data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading density data</div>;
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
