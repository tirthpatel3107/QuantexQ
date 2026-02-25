import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";
import {
  useTemperatureData,
  useSaveTemperatureData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveTemperaturePayload } from "@/services/api/mudproperties/mudproperties.types";

interface TemperatureSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Temperature({ fluid, setFluid }: TemperatureSectionProps) {
  const { data: temperatureResponse, isLoading, error } = useTemperatureData();
  const { mutate: saveTemperatureData } = useSaveTemperatureData();

  const temperatureData = temperatureResponse?.data;

  const [formData, setFormData] = useState<SaveTemperaturePayload | null>(null);

  // Initialize form data when temperatureData loads
  useEffect(() => {
    if (temperatureData) {
      const { surfaceTemp, bottomholeTemp, tempGradient, flowlineTemp } = temperatureData;
      setFormData({ surfaceTemp, bottomholeTemp, tempGradient, flowlineTemp });
      setFluid((prev) => ({
        ...prev,
        surfaceTemp,
        bottomholeTemp,
        tempGradient,
        flowlineTemp,
      }));
    }
  }, [temperatureData, setFluid]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveTemperaturePayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
    saveTemperatureData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading temperature data</div>
    );
  }

  if (!temperatureData || !formData) {
    return <div className="p-4">No temperature data available</div>;
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <TemperaturePanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
