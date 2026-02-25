import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useAboutDiagnosticsSettings,
  useSaveAboutDiagnosticsSettings,
  useAboutDiagnosticsOptions,
} from "@/services/api/settings/settings.api";

export function AboutDiagnostics() {
  const {
    data: aboutResponse,
    isLoading,
    error,
  } = useAboutDiagnosticsSettings();
  const { data: optionsResponse } = useAboutDiagnosticsOptions();
  const { mutate: saveAboutDiagnosticsData } =
    useSaveAboutDiagnosticsSettings();

  const aboutData = aboutResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when aboutData loads
  useEffect(() => {
    if (aboutData) {
      setFormData(aboutData);
    }
  }, [aboutData]);

  // Save data to API
  const handleSaveData = (updatedData: any) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveAboutDiagnosticsData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={1} className="p-4" />;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        About / Diagnostics Settings Section - Implementation Pending
        <div className="mt-2 text-xs">API Connected: ✓</div>
      </div>
    </div>
  );
}
