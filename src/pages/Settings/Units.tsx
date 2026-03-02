// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useUnitsSettings,
  useSaveUnitsSettings,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "@/context/Settings";

export function Units() {
  const { data: unitsResponse, isLoading } = useUnitsSettings();
  const { mutate: saveUnitsData } = useSaveUnitsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    return unitsResponse?.data as unknown as { pressure: string };
  }, [unitsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<{ pressure: string }>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveUnitsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Units settings saved successfully",
    errorMessage: "Failed to save units settings",
    confirmTitle: "Save Units Settings",
    confirmDescription: "Are you sure you want to save these units changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { formData } = form;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Units Settings Section (Pressure: {formData.pressure})
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
