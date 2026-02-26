// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useUnitsSettings,
  useSaveUnitsSettings,
  useUnitsOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../../context/Settings/SettingsContext";

export function Units() {
  const { data: unitsResponse, isLoading } = useUnitsSettings();
  const { data: optionsResponse } = useUnitsOptions();
  const { mutate: saveUnitsData } = useSaveUnitsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    return unitsResponse?.data;
  }, [unitsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<any>({
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
