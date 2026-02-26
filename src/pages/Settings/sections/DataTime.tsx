// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useDataTimeSettings,
  useSaveDataTimeSettings,
  useDataTimeOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../../context/Settings/SettingsContext";

export function DataTime() {
  const { data: dataTimeResponse, isLoading } = useDataTimeSettings();
  const { data: optionsResponse } = useDataTimeOptions();
  const { mutate: saveDataTimeData } = useSaveDataTimeSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    return dataTimeResponse?.data;
  }, [dataTimeResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<any>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDataTimeData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Data & Time settings saved successfully",
    errorMessage: "Failed to save data & time settings",
    confirmTitle: "Save Data & Time Settings",
    confirmDescription:
      "Are you sure you want to save these data & time changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { formData } = form;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Data & Time Settings Section (NTP:{" "}
        {formData.ntpEnabled ? "Enabled" : "Disabled"})
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
