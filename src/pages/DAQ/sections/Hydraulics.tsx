import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useHydraulicsData,
  useSaveHydraulicsData,
  useHydraulicsOptions,
} from "@/services/api/daq/daq.api";
import type { SaveHydraulicsPayload } from "@/services/api/daq/daq.types";

export function Hydraulics() {
  const { data: hydraulicsResponse, isLoading, error } = useHydraulicsData();
  const { data: optionsResponse } = useHydraulicsOptions();
  const { mutate: saveHydraulicsData } = useSaveHydraulicsData();

  const hydraulicsData = hydraulicsResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveHydraulicsPayload | null>(null);

  // Initialize form data when hydraulicsData loads
  useEffect(() => {
    if (hydraulicsData) {
      const { modelsUsed, parameterLists } = hydraulicsData;
      setFormData({ modelsUsed, parameterLists });
    }
  }, [hydraulicsData]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveHydraulicsPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveHydraulicsData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Hydraulics Models DAQ Section - API Connected (
      {formData.modelsUsed.length} models)
    </div>
  );
}
