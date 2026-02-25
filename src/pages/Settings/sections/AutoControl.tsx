import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useAutoControlSettings,
  useSaveAutoControlSettings,
  useAutoControlOptions,
} from "@/services/api/settings/settings.api";

export function AutoControl() {
  const {
    data: autoControlResponse,
    isLoading,
    error,
  } = useAutoControlSettings();
  const { data: optionsResponse } = useAutoControlOptions();
  const { mutate: saveAutoControlData } = useSaveAutoControlSettings();

  const autoControlData = autoControlResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when autoControlData loads
  useEffect(() => {
    if (autoControlData) {
      setFormData(autoControlData);
    }
  }, [autoControlData]);

  // Save data to API
  const handleSaveData = (updatedData: any) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveAutoControlData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Auto Control Settings Section - Implementation Pending
        <div className="mt-2 text-xs">API Connected: ✓</div>
      </div>
    </div>
  );
}
