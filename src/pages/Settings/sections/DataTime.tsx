import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useDataTimeSettings,
  useSaveDataTimeSettings,
  useDataTimeOptions,
} from "@/services/api/settings/settings.api";

export function DataTime() {
  const { data: dataTimeResponse, isLoading, error } = useDataTimeSettings();
  const { data: optionsResponse } = useDataTimeOptions();
  const { mutate: saveDataTimeData } = useSaveDataTimeSettings();

  const dataTimeData = dataTimeResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when dataTimeData loads
  useEffect(() => {
    if (dataTimeData) {
      setFormData(dataTimeData);
    }
  }, [dataTimeData]);

  // Save data to API
  const handleSaveData = (updatedData: any) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveDataTimeData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading data & time settings</div>
    );
  }

  if (!dataTimeData || !formData) {
    return <div className="p-4">No data & time settings available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Data & Time Settings Section - API Connected (NTP:{" "}
      {formData.ntpEnabled ? "Enabled" : "Disabled"})
    </div>
  );
}
