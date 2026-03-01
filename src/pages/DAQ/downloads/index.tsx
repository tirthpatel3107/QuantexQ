import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import {
  useDownloadsData,
  useSaveDownloadsData,
} from "@/services/api/daq/daq.api";
import type { SaveDownloadsPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../../context/DAQ/DAQContext";
import { DownloadPanel } from "./download";
import { DownloadHistory } from "./DownloadHistory";

export function Downloads() {
  const { data: downloadsResponse, isLoading } = useDownloadsData();
  const { mutate: saveDownloadsData } = useSaveDownloadsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const initialData = useMemo(() => {
    if (!downloadsResponse?.data) return undefined;
    const { logs, quickExport } = downloadsResponse.data;
    return { logs, quickExport };
  }, [downloadsResponse?.data]);

  const form = useSectionForm<SaveDownloadsPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDownloadsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Downloads settings saved successfully",
    errorMessage: "Failed to save downloads settings",
    confirmTitle: "Save Downloads Settings",
    confirmDescription:
      "Are you sure you want to save these downloads changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-3">
        <DownloadPanel />
        <DownloadHistory />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
