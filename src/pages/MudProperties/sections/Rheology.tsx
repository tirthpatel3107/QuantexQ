import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import { RheologyPanel } from "./panels/RheologyPanel";
import { FluidData } from "@/types/mud";
import {
  useRheologyData,
  useSaveRheologyData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveRheologyPayload } from "@/services/api/mudproperties/mudproperties.types";

interface RheologySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Rheology({ fluid, setFluid }: RheologySectionProps) {
  const { data: rheologyResponse, isLoading, error } = useRheologyData();
  const { mutate: saveRheologyData } = useSaveRheologyData();

  const rheologyData = rheologyResponse?.data;

  const [formData, setFormData] = useState<SaveRheologyPayload | null>(null);

  // Initialize form data when rheologyData loads
  useEffect(() => {
    if (rheologyData) {
      const { rheologySource, pv, yp, gel10s, gel10m } = rheologyData;
      setFormData({ rheologySource, pv, yp, gel10s, gel10m });
      setFluid((prev) => ({
        ...prev,
        rheologySource,
        pv,
        yp,
        gel10s,
        gel10m,
      }));
    }
  }, [rheologyData, setFluid]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveRheologyPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
    saveRheologyData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading rheology data</div>;
  }

  if (!rheologyData || !formData) {
    return <div className="p-4">No rheology data available</div>;
  }

  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <RheologyPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
