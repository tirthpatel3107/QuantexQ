import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useStreamingData,
  useSaveStreamingData,
  useStreamingOptions,
} from "@/services/api/daq/daq.api";
import type { SaveStreamingPayload } from "@/services/api/daq/daq.types";

export function Streaming() {
  const { data: streamingResponse, isLoading, error } = useStreamingData();
  const { data: optionsResponse } = useStreamingOptions();
  const { mutate: saveStreamingData } = useSaveStreamingData();

  const streamingData = streamingResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveStreamingPayload | null>(null);

  // Initialize form data when streamingData loads
  useEffect(() => {
    if (streamingData) {
      const { witsStream, edrLogging, dataRate, liveExport } = streamingData;
      setFormData({ witsStream, edrLogging, dataRate, liveExport });
    }
  }, [streamingData]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveStreamingPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveStreamingData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading streaming data</div>;
  }

  if (!streamingData || !formData) {
    return <div className="p-4">No streaming data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Streaming & Logging DAQ Section - API Connected (WITS:{" "}
      {formData.witsStream.enabled ? "Enabled" : "Disabled"})
    </div>
  );
}
