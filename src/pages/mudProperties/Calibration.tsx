// React & Hooks
import { useMemo } from "react";

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - Common
import {
  RestoreDefaultsButton,
  CommonInput,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/shared";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Services & API
import {
  useCalibrationData,
  useSaveCalibrationData,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import type { SaveCalibrationPayload } from "@/services/api/mudproperties/mudproperties.types";

// Contexts
import { useMudPropertiesContext } from "@/context/mudProperties";

/**
 * Calibration Component
 *
 * Manages the calibration dates and offsets for various sensors including
 * viscometers, density meters, and temperature sensors.
 *
 * @returns JSX.Element
 */
export function Calibration() {
  // ---- Data & State ----
  const { data: calibrationResponse, isLoading } = useCalibrationData();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  /**
   * Memoize initial data from the API response.
   * This provides a stable object for the form initialization.
   */
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

  // ---- Form Management ----
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
    return <SectionSkeleton count={3} />;
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
