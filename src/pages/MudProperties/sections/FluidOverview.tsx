import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import { FluidSystemPanel } from "./panels/FluidSystemPanel";
import { RheologyPanel } from "./panels/RheologyPanel";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";
import {
  useFluidOverviewData,
  useSaveFluidOverviewData,
  useFluidOverviewOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveFluidOverviewPayload } from "@/services/api/mudproperties/mudproperties.types";

interface FluidOverviewSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function FluidOverview({ fluid, setFluid }: FluidOverviewSectionProps) {
  const { data: overviewResponse, isLoading, error } = useFluidOverviewData();
  const { data: optionsResponse } = useFluidOverviewOptions();
  const { mutate: saveFluidOverviewData } = useSaveFluidOverviewData();

  const overviewData = overviewResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveFluidOverviewPayload | null>(
    null,
  );

  // Initialize form data when overviewData loads
  useEffect(() => {
    if (overviewData) {
      const { type, baseFluid, activePitsVolume, flowlineTemp } = overviewData;
      setFormData({ type, baseFluid, activePitsVolume, flowlineTemp });
      setFluid((prev) => ({
        ...prev,
        type,
        baseFluid,
        activePitsVolume,
        flowlineTemp,
      }));
    }
  }, [overviewData, setFluid]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveFluidOverviewPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
    saveFluidOverviewData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
      <FluidSystemPanel
        fluid={fluid}
        setFluid={setFluid}
        typeOptions={options?.typeOptions || []}
        baseFluidOptions={options?.baseFluidOptions || []}
        tempOptions={options?.tempOptions || []}
      />
      <RheologyPanel fluid={fluid} setFluid={setFluid} />
      <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
      <TemperaturePanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
