import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useStreamingData,
  useSaveStreamingData,
  useStreamingOptions,
} from "@/services/api/daq/daq.api";
import type { SaveStreamingPayload } from "@/services/api/daq/daq.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useDAQContext } from "../DAQContext";

export function Streaming() {
  const { data: streamingResponse, isLoading, error } = useStreamingData();
  const { data: optionsResponse } = useStreamingOptions();
  const { mutate: saveStreamingData } = useSaveStreamingData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

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

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<SaveStreamingPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveStreamingData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Streaming settings saved successfully",
    errorMessage: "Failed to save streaming settings",
    confirmTitle: "Save Streaming Settings",
    confirmDescription: "Are you sure you want to save these streaming changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: Partial<SaveStreamingPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
  };

  const handleSave = () => {
    if (formData) {
      requestSave(formData);
    }
  };

  // Register save handler with parent context
  useEffect(() => {
    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Streaming & Logging DAQ Section - API Connected (WITS:{" "}
        {formData.witsStream.enabled ? "Enabled" : "Disabled"})
      </div>

      <CommonAlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        cancelText="Cancel"
        actionText="Save"
        onAction={handleConfirmedSave}
        onCancel={handleCancel}
      />
    </>
  );
}
