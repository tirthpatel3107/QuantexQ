import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useChokePumpsSettings,
  useSaveChokePumpsSettings,
  useChokePumpsOptions,
} from "@/services/api/settings/settings.api";

export function ChokePumps() {
  const {
    data: chokePumpsResponse,
    isLoading,
    error,
  } = useChokePumpsSettings();
  const { data: optionsResponse } = useChokePumpsOptions();
  const { mutate: saveChokePumpsData } = useSaveChokePumpsSettings();

  const chokePumpsData = chokePumpsResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when chokePumpsData loads
  useEffect(() => {
    if (chokePumpsData) {
      setFormData(chokePumpsData);
    }
  }, [chokePumpsData]);

  // Save data to API
  const handleSaveData = (updatedData: any) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveChokePumpsData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Choke & Pumps Settings Section - Implementation Pending
        <div className="mt-2 text-xs">API Connected: ✓</div>
      </div>
    </div>
  );
}
