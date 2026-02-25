import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useUnitsSettings,
  useSaveUnitsSettings,
  useUnitsOptions,
} from "@/services/api/settings/settings.api";

export function Units() {
  const { data: unitsResponse, isLoading, error } = useUnitsSettings();
  const { data: optionsResponse } = useUnitsOptions();
  const { mutate: saveUnitsData } = useSaveUnitsSettings();

  const unitsData = unitsResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when unitsData loads
  useEffect(() => {
    if (unitsData) {
      setFormData(unitsData);
    }
  }, [unitsData]);

  // Save data to API
  const handleSaveData = (updatedData: any) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveUnitsData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={1} className="p-4" />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading units settings</div>;
  }

  if (!unitsData || !formData) {
    return <div className="p-4">No units settings available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Units Settings Section - API Connected (Pressure: {formData.pressure})
    </div>
  );
}
