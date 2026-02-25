import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useAutoControlSettings,
  useSaveAutoControlSettings,
  useAutoControlOptions,
} from "@/services/api/settings/settings.api";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useSettingsContext } from "../SettingsContext";

export function AutoControl() {
  const {
    data: autoControlResponse,
    isLoading,
    error,
  } = useAutoControlSettings();
  const { data: optionsResponse } = useAutoControlOptions();
  const { mutate: saveAutoControlData } = useSaveAutoControlSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const autoControlData = autoControlResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when autoControlData loads
  useEffect(() => {
    if (autoControlData) {
      setFormData(autoControlData);
    }
  }, [autoControlData]);

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<any>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveAutoControlData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Auto control settings saved successfully",
    errorMessage: "Failed to save auto control settings",
    confirmTitle: "Save Auto Control Settings",
    confirmDescription: "Are you sure you want to save these auto control changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: any) => {
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
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
          Auto Control Settings Section - Implementation Pending
          <div className="mt-2 text-xs">API Connected: ✓</div>
        </div>
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
