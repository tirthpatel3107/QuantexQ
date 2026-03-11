// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useDataTimeSettings,
  useSaveDataTimeSettings,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "@/context/settings";

interface DataTimeFormData {
  ntpEnabled: boolean;
  ntpServer?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  syncInterval?: number;
  lastSync?: string;
  [key: string]: unknown;
}

export function DataTime() {
  const { data: dataTimeResponse, isLoading } = useDataTimeSettings();
  const { mutate: saveDataTimeData } = useSaveDataTimeSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    return dataTimeResponse?.data as unknown as DataTimeFormData;
  }, [dataTimeResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<DataTimeFormData>({
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
    return <SectionSkeleton count={3} />;
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
