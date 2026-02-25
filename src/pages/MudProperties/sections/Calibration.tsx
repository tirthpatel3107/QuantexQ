import { useState, useEffect } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonInput,
  SectionSkeleton,
  CommonAlertDialog,
} from "@/components/common";
import { FluidData } from "@/types/mud";
import {
  useCalibrationData,
  useSaveCalibrationData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveCalibrationPayload } from "@/services/api/mudproperties/mudproperties.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useMudPropertiesContext } from "../MudPropertiesContext";

interface CalibrationProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Calibration({ fluid, setFluid }: CalibrationProps) {
  const { data: calibrationResponse, isLoading, error } = useCalibrationData();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();
  const { registerSaveHandler, unregisterSaveHandler } = useMudPropertiesContext();

  const calibrationData = calibrationResponse?.data;

  const [formData, setFormData] = useState<SaveCalibrationPayload | null>(null);

  // Initialize form data when calibrationData loads
  useEffect(() => {
    if (calibrationData) {
      const { viscometerCalDate, densityCalDate, tempSensorOffset } =
        calibrationData;
      setFormData({ viscometerCalDate, densityCalDate, tempSensorOffset });
      setFluid((prev) => ({
        ...prev,
        viscometerCalDate,
        densityCalDate,
        tempSensorOffset,
      }));
    }
  }, [calibrationData, setFluid]);

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    isSaving,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<SaveCalibrationPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveCalibrationData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Calibration settings saved successfully",
    errorMessage: "Failed to save calibration settings",
    confirmTitle: "Save Calibration Settings",
    confirmDescription: "Are you sure you want to save these calibration changes?",
  });

  // Update local state only
  const handleSaveData = (updatedData: Partial<SaveCalibrationPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
  };

  const handleSave = () => {
    if (formData) {
      requestSave(formData);
    }
  };

  // Register save handler with parent context
  useEffect(() => {
    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
        <PanelCard title="Calibration" headerAction={<RestoreDefaultsButton />}>
          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <CommonInput
              label="Viscometer cal. date"
              value={formData.viscometerCalDate}
              onChange={(e) =>
                handleSaveData({ viscometerCalDate: e.target.value })
              }
              placeholder="—"
              type="date"
            />

            <CommonInput
              label="Density cal. date"
              value={formData.densityCalDate}
              onChange={(e) => handleSaveData({ densityCalDate: e.target.value })}
              placeholder="—"
              type="date"
            />

            <CommonInput
              label="Temp. sensor offset"
              value={formData.tempSensorOffset}
              onChange={(e) =>
                handleSaveData({ tempSensorOffset: e.target.value })
              }
              placeholder="°F"
            />
          </div>
        </PanelCard>
      </div>

      <CommonAlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        cancelText="Cancel"
        actionText="Save"
        onAction={handleConfirmedSave}
        onCancel={handleCancel}
      />
    </>
  );
}
