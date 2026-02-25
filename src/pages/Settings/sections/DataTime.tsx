import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useDataTimeSettings,
  useSaveDataTimeSettings,
  useDataTimeOptions,
} from "@/services/api/settings/settings.api";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useSettingsContext } from "../SettingsContext";

export function DataTime() {
  const { data: dataTimeResponse, isLoading, error } = useDataTimeSettings();
  const { data: optionsResponse } = useDataTimeOptions();
  const { mutate: saveDataTimeData } = useSaveDataTimeSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const dataTimeData = dataTimeResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when dataTimeData loads
  useEffect(() => {
    if (dataTimeData) {
      setFormData(dataTimeData);
    }
  }, [dataTimeData]);

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
  } = useSaveWithConfirmation<any>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDataTimeData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Data & Time settings saved successfully",
    errorMessage: "Failed to save data & time settings",
    confirmTitle: "Save Data & Time Settings",
    confirmDescription: "Are you sure you want to save these data & time changes?",
  });

  // Update local state only
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
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Data & Time Settings Section - API Connected (NTP:{" "}
        {formData.ntpEnabled ? "Enabled" : "Disabled"})
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
