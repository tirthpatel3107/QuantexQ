// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useAutoControlSettings,
  useSaveAutoControlSettings,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "@/context/Settings";

export function AutoControl() {
  const { data: autoControlResponse, isLoading } = useAutoControlSettings();
  const { mutate: saveAutoControlData } = useSaveAutoControlSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    return autoControlResponse?.data;
  }, [autoControlResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<Record<string, unknown>>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveAutoControlData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Auto control settings saved successfully",
    errorMessage: "Failed to save auto control settings",
    confirmTitle: "Save Auto Control Settings",
    confirmDescription:
      "Are you sure you want to save these auto control changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
          Auto Control Settings Section - Implementation Pending
        </div>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
