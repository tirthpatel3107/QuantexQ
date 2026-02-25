// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useAboutDiagnosticsSettings,
  useSaveAboutDiagnosticsSettings,
  useAboutDiagnosticsOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../SettingsContext";

export function AboutDiagnostics() {
  const { data: aboutResponse, isLoading } = useAboutDiagnosticsSettings();
  const { data: optionsResponse } = useAboutDiagnosticsOptions();
  const { mutate: saveAboutDiagnosticsData } =
    useSaveAboutDiagnosticsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    return aboutResponse?.data;
  }, [aboutResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<any>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveAboutDiagnosticsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "About & Diagnostics settings saved successfully",
    errorMessage: "Failed to save about & diagnostics settings",
    confirmTitle: "Save About & Diagnostics Settings",
    confirmDescription: "Are you sure you want to save these changes?",
  });
  
if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
          About / Diagnostics Settings Section - Implementation Pending
        </div>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
