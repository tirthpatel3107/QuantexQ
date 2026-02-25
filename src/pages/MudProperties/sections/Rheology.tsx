import { RheologyPanel } from "./panels/RheologyPanel";
import { FluidData } from "@/types/mud";
import { useRheologyData } from "@/services/api/mudproperties/mudproperties.api";
import { useEffect } from "react";

interface RheologySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Rheology({ fluid, setFluid }: RheologySectionProps) {
  const { data: rheologyResponse, isLoading, error } = useRheologyData();
  const rheologyData = rheologyResponse?.data;

  // Update fluid state when API data loads
  useEffect(() => {
    if (rheologyData) {
      setFluid((prev) => ({
        ...prev,
        rheologySource: rheologyData.rheologySource,
        pv: rheologyData.pv,
        yp: rheologyData.yp,
        gel10s: rheologyData.gel10s,
        gel10m: rheologyData.gel10m,
      }));
    }
  }, [rheologyData, setFluid]);

  if (isLoading) {
    return <div className="p-4">Loading rheology data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading rheology data</div>;
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <RheologyPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
