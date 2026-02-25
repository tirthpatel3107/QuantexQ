import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import {
  useDisplayData,
  useSaveDisplayData,
  useDisplayOptions,
} from "@/services/api/daq/daq.api";
import type { SaveDisplayPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../DAQContext";

export function Display() {
  const { data: displayResponse, isLoading } = useDisplayData();
  const { data: optionsResponse } = useDisplayOptions();
  const { mutate: saveDisplayData } = useSaveDisplayData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  const initialData = useMemo(() => {
    if (!displayResponse?.data) return undefined;
    const { sections } = displayResponse.data;
    return { sections };
  }, [displayResponse?.data]);

  const form = useSectionForm<SaveDisplayPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDisplayData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Display settings saved successfully",
    errorMessage: "Failed to save display settings",
    confirmTitle: "Save Display Settings",
    confirmDescription: "Are you sure you want to save these display changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { sections } = form.formData;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Display DAQ Section ({sections.length} sections available)
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
