// React & Hooks
import { useMemo } from "react";

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - Common
import { SectionSkeleton, FormSaveDialog } from "@/components/shared";

// Components - Local
import { DownloadPanel } from "./download";
import { DownloadHistory } from "./DownloadHistory";

// Services & API
import {
  useDownloadsData,
  useSaveDownloadsData,
} from "@/services/api/daq/daq.api";
import type { SaveDownloadsPayload } from "@/services/api/daq/daq.types";

// Contexts
import { useDAQContext } from "@/context/daq";

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
    return <SectionSkeleton count={3} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        <DownloadPanel />
        <DownloadHistory />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
