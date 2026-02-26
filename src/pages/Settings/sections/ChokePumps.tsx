// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Services & Types
import {
  useChokePumpsSettings,
  useSaveChokePumpsSettings,
  useChokePumpsOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../../context/Settings/SettingsContext";

export function ChokePumps() {
  const { data: chokePumpsResponse, isLoading } = useChokePumpsSettings();
  const { data: optionsResponse } = useChokePumpsOptions();
  const { mutate: saveChokePumpsData } = useSaveChokePumpsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    return chokePumpsResponse?.data;
  }, [chokePumpsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<any>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveChokePumpsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Choke & Pumps settings saved successfully",
    errorMessage: "Failed to save choke & pumps settings",
    confirmTitle: "Save Choke & Pumps Settings",
    confirmDescription:
      "Are you sure you want to save these choke & pumps changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
          Choke & Pumps Settings Section - Implementation Pending
        </div>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
