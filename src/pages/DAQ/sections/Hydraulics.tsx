import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useHydraulicsData,
  useSaveHydraulicsData,
} from "@/services/api/daq/daq.api";
import type { SaveHydraulicsPayload } from "@/services/api/daq/daq.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

export function Hydraulics() {
  const { data: hydraulicsResponse, isLoading } = useHydraulicsData();
  const { mutate: saveHydraulicsData } = useSaveHydraulicsData();

  const hydraulicsData = hydraulicsResponse?.data;

  const [formData, setFormData] = useState<SaveHydraulicsPayload | null>(null);

  // Initialize form data when hydraulicsData loads
  useEffect(() => {
    if (hydraulicsData) {
      const { modelsUsed, parameterLists } = hydraulicsData;
      setFormData({ modelsUsed, parameterLists });
    }
  }, [hydraulicsData]);

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
  } = useSaveWithConfirmation<SaveHydraulicsPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveHydraulicsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Hydraulics settings saved successfully",
    errorMessage: "Failed to save hydraulics settings",
    confirmTitle: "Save Hydraulics Settings",
    confirmDescription: "Are you sure you want to save these hydraulics changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: Partial<SaveHydraulicsPayload>) => {
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
        Hydraulics Models DAQ Section - API Connected (
        {formData?.modelsUsed.length} models)
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
