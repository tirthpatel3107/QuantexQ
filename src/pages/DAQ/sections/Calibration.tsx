import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useCalibrationData,
  useSaveCalibrationData,
  useCalibrationOptions,
} from "@/services/api/daq/daq.api";
import type { SaveCalibrationPayload } from "@/services/api/daq/daq.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

export function Calibration() {
  const { data: calibrationResponse, isLoading, error } = useCalibrationData();
  const { data: optionsResponse } = useCalibrationOptions();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();

  const calibrationData = calibrationResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveCalibrationPayload | null>(null);

  // Initialize form data when calibrationData loads
  useEffect(() => {
    if (calibrationData) {
      const { calibrations, permissions } = calibrationData;
      setFormData({ calibrations, permissions });
    }
  }, [calibrationData]);

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
  } = useSaveWithConfirmation<SaveCalibrationPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveCalibrationData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Calibration settings saved successfully",
    errorMessage: "Failed to save calibration settings",
    confirmTitle: "Save Calibration Settings",
    confirmDescription: "Are you sure you want to save these calibration changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: Partial<SaveCalibrationPayload>) => {
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
        Calibration DAQ Section - API Connected (
        {formData?.calibrations.length} calibrations)
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
