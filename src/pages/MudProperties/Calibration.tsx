// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonInput,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";

// Services & Types
import {
  useCalibrationData,
  useSaveCalibrationData,
  useCalibrationOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveCalibrationPayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "@/context/MudProperties";

export function Calibration() {
  const { data: calibrationResponse, isLoading } = useCalibrationData();
  const { data: optionsResponse } = useCalibrationOptions();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!calibrationResponse?.data) return undefined;
    const {
      viscometerCalDate,
      densityCalDate,
      tempSensorOffset,
      pressureSensorCal,
      flowMeterCal,
      lastCalibrationBy,
      nextCalibrationDue,
    } = calibrationResponse.data;
    return {
      viscometerCalDate,
      densityCalDate,
      tempSensorOffset,
      pressureSensorCal,
      flowMeterCal,
      lastCalibrationBy,
      nextCalibrationDue,
    };
  }, [calibrationResponse?.data]);

  // Use the reusable form hook
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

  const { formData } = form;

  return (
    <>
      <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
        <PanelCard title="Calibration" headerAction={<RestoreDefaultsButton />}>
          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <CommonInput
              label="Viscometer cal. date"
              value={formData.viscometerCalDate}
              onChange={(e) =>
                form.updateLocalField({ viscometerCalDate: e.target.value })
              }
              placeholder="—"
              type="date"
            />

            <CommonInput
              label="Density cal. date"
              value={formData.densityCalDate}
              onChange={(e) =>
                form.updateLocalField({ densityCalDate: e.target.value })
              }
              placeholder="—"
              type="date"
            />

            <CommonInput
              label="Temp. sensor offset"
              value={formData.tempSensorOffset}
              onChange={(e) =>
                form.updateLocalField({ tempSensorOffset: e.target.value })
              }
              placeholder="°F"
            />
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
