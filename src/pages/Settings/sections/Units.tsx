import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useUnitsSettings,
  useSaveUnitsSettings,
  useUnitsOptions,
} from "@/services/api/settings/settings.api";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useSettingsContext } from "../SettingsContext";

export function Units() {
  const { data: unitsResponse, isLoading, error } = useUnitsSettings();
  const { data: optionsResponse } = useUnitsOptions();
  const { mutate: saveUnitsData } = useSaveUnitsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const unitsData = unitsResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when unitsData loads
  useEffect(() => {
    if (unitsData) {
      setFormData(unitsData);
    }
  }, [unitsData]);

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
        saveUnitsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Units settings saved successfully",
    errorMessage: "Failed to save units settings",
    confirmTitle: "Save Units Settings",
    confirmDescription: "Are you sure you want to save these units changes?",
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
    return <SectionSkeleton count={1} className="p-4" />;
  }

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Units Settings Section - API Connected (Pressure: {formData.pressure})
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
