import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useDisplayData,
  useSaveDisplayData,
  useDisplayOptions,
} from "@/services/api/daq/daq.api";
import type { SaveDisplayPayload } from "@/services/api/daq/daq.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

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

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    isSaving,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<SaveDisplayPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDisplayData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Display settings saved successfully",
    errorMessage: "Failed to save display settings",
    confirmTitle: "Save Display Settings",
    confirmDescription: "Are you sure you want to save these display changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: Partial<SaveDisplayPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    requestSave(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Display DAQ Section - API Connected ({formData?.sections.length}{" "}
        sections available)
        <button
          onClick={() => handleSaveData(formData!)}
          disabled={isSaving}
          className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
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
