import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import {
  useHydraulicsData,
  useSaveHydraulicsData,
} from "@/services/api/daq/daq.api";
import type { SaveHydraulicsPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../context/DAQ/DAQContext";

export function Hydraulics() {
  const { data: hydraulicsResponse, isLoading } = useHydraulicsData();
  const { mutate: saveHydraulicsData } = useSaveHydraulicsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const initialData = useMemo(() => {
    if (!hydraulicsResponse?.data) return undefined;
    const { modelsUsed, parameterLists } = hydraulicsResponse.data;
    return { modelsUsed, parameterLists };
  }, [hydraulicsResponse?.data]);

  const form = useSectionForm<SaveHydraulicsPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveHydraulicsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Hydraulics settings saved successfully",
    errorMessage: "Failed to save hydraulics settings",
    confirmTitle: "Save Hydraulics Settings",
    confirmDescription:
      "Are you sure you want to save these hydraulics changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { modelsUsed, parameterLists } = form.formData;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Hydraulics Models DAQ Section ({modelsUsed.length} models)
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
