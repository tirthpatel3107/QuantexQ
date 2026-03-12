// React & Hooks
import { useMemo } from "react";

// Form & Validation

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Services & API
import {
  useChokePumpsSettings,
  useSaveChokePumpsSettings,
} from "@/services/api/settings/settings.api";

// Types & Schemas

// Components - Common
import { SectionSkeleton, FormSaveDialog } from "@/components/shared";

// Components - Local

// Contexts
import { useSettingsContext } from "@/context/settings";

// Icons & Utils

export function ChokePumps() {
  const { data: chokePumpsResponse, isLoading } = useChokePumpsSettings();
  const { mutate: saveChokePumpsData } = useSaveChokePumpsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    return chokePumpsResponse?.data;
  }, [chokePumpsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<Record<string, unknown>>({
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
    return <SectionSkeleton count={3} />;
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
