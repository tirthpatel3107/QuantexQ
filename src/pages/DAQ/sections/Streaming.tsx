import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import {
  useStreamingData,
  useSaveStreamingData,
  useStreamingOptions,
} from "@/services/api/daq/daq.api";
import type { SaveStreamingPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../../context/DAQ/DAQContext";

export function Streaming() {
  const { data: streamingResponse, isLoading } = useStreamingData();
  const { data: optionsResponse } = useStreamingOptions();
  const { mutate: saveStreamingData } = useSaveStreamingData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  const initialData = useMemo(() => {
    if (!streamingResponse?.data) return undefined;
    const { witsStream, edrLogging, dataRate, liveExport } =
      streamingResponse.data;
    return { witsStream, edrLogging, dataRate, liveExport };
  }, [streamingResponse?.data]);

  const form = useSectionForm<SaveStreamingPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveStreamingData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Streaming settings saved successfully",
    errorMessage: "Failed to save streaming settings",
    confirmTitle: "Save Streaming Settings",
    confirmDescription:
      "Are you sure you want to save these streaming changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { witsStream, edrLogging, dataRate, liveExport } = form.formData;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Streaming & Logging DAQ Section (WITS:{" "}
        {witsStream.enabled ? "Enabled" : "Disabled"})
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
