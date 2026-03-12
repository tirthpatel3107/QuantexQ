// React & Hooks
import { useMemo } from "react";

// Form & Validation

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Services & API
import {
  useHydraulicsModelSettings,
  useSaveHydraulicsModelSettings,
} from "@/services/api/settings/settings.api";

// Types & Schemas

// Components - Common
import { SectionSkeleton, FormSaveDialog } from "@/components/shared";

// Components - Local

// Contexts
import { useSettingsContext } from "@/context/settings";

// Icons & Utils

export function HydraulicsModel() {
  const { data: hydraulicsResponse, isLoading } = useHydraulicsModelSettings();
  const { mutate: saveHydraulicsModelData } = useSaveHydraulicsModelSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    return hydraulicsResponse?.data;
  }, [hydraulicsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<Record<string, unknown>>({
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
    return <SectionSkeleton count={3} />;
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
