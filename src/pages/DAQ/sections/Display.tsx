import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useDisplayData,
  useSaveDisplayData,
  useDisplayOptions,
} from "@/services/api/daq/daq.api";
import type { SaveDisplayPayload } from "@/services/api/daq/daq.types";

export function Display() {
  const { data: displayResponse, isLoading, error } = useDisplayData();
  const { data: optionsResponse } = useDisplayOptions();
  const { mutate: saveDisplayData } = useSaveDisplayData();

  const displayData = displayResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveDisplayPayload | null>(null);

  // Initialize form data when displayData loads
  useEffect(() => {
    if (displayData) {
      const { sections } = displayData;
      setFormData({ sections });
    }
  }, [displayData]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveDisplayPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveDisplayData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading display data</div>;
  }

  if (!displayData || !formData) {
    return <div className="p-4">No display data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Display DAQ Section - API Connected ({formData.sections.length}{" "}
      sections available)
    </div>
  );
}
