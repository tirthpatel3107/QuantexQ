import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { FluidData } from "@/types/mud";
import {
  useDensityData,
  useSaveDensityData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveDensityPayload } from "@/services/api/mudproperties/mudproperties.types";

interface DensitySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Density({ fluid, setFluid }: DensitySectionProps) {
  const { data: densityResponse, isLoading, error } = useDensityData();
  const { mutate: saveDensityData } = useSaveDensityData();

  const densityData = densityResponse?.data;

  const [formData, setFormData] = useState<SaveDensityPayload | null>(null);

  // Initialize form data when densityData loads
  useEffect(() => {
    if (densityData) {
      const { mudWeightIn, mudWeightOut, oilWaterRatio, salinity } =
        densityData;
      setFormData({ mudWeightIn, mudWeightOut, oilWaterRatio, salinity });
      setFluid((prev) => ({
        ...prev,
        oilWater: oilWaterRatio,
        salinity,
      }));
    }
  }, [densityData, setFluid]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveDensityPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
    saveDensityData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
