// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useHydraulicsModelSettings,
  useSaveHydraulicsModelSettings,
  useHydraulicsModelOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../context/Settings/SettingsContext";

export function HydraulicsModel() {
  const { data: hydraulicsResponse, isLoading } = useHydraulicsModelSettings();
  const { data: optionsResponse } = useHydraulicsModelOptions();
  const { mutate: saveHydraulicsModelData } = useSaveHydraulicsModelSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    return hydraulicsResponse?.data;
  }, [hydraulicsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<any>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveHydraulicsModelData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Hydraulics Model settings saved successfully",
    errorMessage: "Failed to save hydraulics model settings",
    confirmTitle: "Save Hydraulics Model Settings",
    confirmDescription:
      "Are you sure you want to save these hydraulics model changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
          Hydraulics Model Settings Section - Implementation Pending
        </div>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
