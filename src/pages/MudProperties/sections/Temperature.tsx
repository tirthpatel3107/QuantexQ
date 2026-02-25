import { CommonSkeleton, SectionSkeleton } from "@/components/common";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";
import { useTemperatureData } from "@/services/api/mudproperties/mudproperties.api";
import { useEffect } from "react";

interface TemperatureSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Temperature({ fluid, setFluid }: TemperatureSectionProps) {
  const { data: temperatureResponse, isLoading, error } = useTemperatureData();
  const temperatureData = temperatureResponse?.data;

  // Update fluid state when API data loads
  useEffect(() => {
    if (temperatureData) {
      setFluid((prev) => ({
        ...prev,
        surfaceTemp: temperatureData.surfaceTemp,
        bottomholeTemp: temperatureData.bottomholeTemp,
        tempGradient: temperatureData.tempGradient,
        flowlineTemp: temperatureData.flowlineTemp,
      }));
    }
  }, [temperatureData, setFluid]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading temperature data</div>
    );
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <TemperaturePanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
