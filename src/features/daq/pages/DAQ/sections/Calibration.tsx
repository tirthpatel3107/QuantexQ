import { useMemo } from "react";
import { useSectionForm } from "@/shared/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/shared/components";
import {
  useCalibrationData,
  useSaveCalibrationData,
  useCalibrationOptions,
} from "@/services/api/daq/daq.api";
import type { SaveCalibrationPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../../context/DAQContext";

export function Calibration() {
  const { data: calibrationResponse, isLoading } = useCalibrationData();
  const { data: optionsResponse } = useCalibrationOptions();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  const initialData = useMemo(() => {
    if (!calibrationResponse?.data) return undefined;
    const { calibrations, permissions } = calibrationResponse.data;
    return { calibrations, permissions };
  }, [calibrationResponse?.data]);

  const form = useSectionForm<SaveCalibrationPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveCalibrationData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Calibration settings saved successfully",
    errorMessage: "Failed to save calibration settings",
    confirmTitle: "Save Calibration Settings",
    confirmDescription:
      "Are you sure you want to save these calibration changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { calibrations, permissions } = form.formData;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Calibration DAQ Section ({calibrations.length} calibrations)
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
