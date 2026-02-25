import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useChokePumpsSettings,
  useSaveChokePumpsSettings,
  useChokePumpsOptions,
} from "@/services/api/settings/settings.api";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useSettingsContext } from "../SettingsContext";

export function ChokePumps() {
  const {
    data: chokePumpsResponse,
    isLoading,
    error,
  } = useChokePumpsSettings();
  const { data: optionsResponse } = useChokePumpsOptions();
  const { mutate: saveChokePumpsData } = useSaveChokePumpsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const chokePumpsData = chokePumpsResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when chokePumpsData loads
  useEffect(() => {
    if (chokePumpsData) {
      setFormData(chokePumpsData);
    }
  }, [chokePumpsData]);

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
        saveChokePumpsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Choke & Pumps settings saved successfully",
    errorMessage: "Failed to save choke & pumps settings",
    confirmTitle: "Save Choke & Pumps Settings",
    confirmDescription: "Are you sure you want to save these choke & pumps changes?",
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
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
          Choke & Pumps Settings Section - Implementation Pending
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
