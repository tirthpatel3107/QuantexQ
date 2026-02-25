import { useState, useEffect } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonInput,
  SectionSkeleton,
} from "@/components/common";
import { FluidData } from "@/types/mud";
import {
  useCalibrationData,
  useSaveCalibrationData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveCalibrationPayload } from "@/services/api/mudproperties/mudproperties.types";

interface CalibrationProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Calibration({ fluid, setFluid }: CalibrationProps) {
  const { data: calibrationResponse, isLoading, error } = useCalibrationData();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();

  const calibrationData = calibrationResponse?.data;

  const [formData, setFormData] = useState<SaveCalibrationPayload | null>(null);

  // Initialize form data when calibrationData loads
  useEffect(() => {
    if (calibrationData) {
      const { viscometerCalDate, densityCalDate, tempSensorOffset } = calibrationData;
      setFormData({ viscometerCalDate, densityCalDate, tempSensorOffset });
      setFluid((prev) => ({
        ...prev,
        viscometerCalDate,
        densityCalDate,
        tempSensorOffset,
      }));
    }
  }, [calibrationData, setFluid]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveCalibrationPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
    saveCalibrationData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading calibration data</div>
    );
  }

  if (!calibrationData || !formData) {
    return <div className="p-4">No calibration data available</div>;
  }

  return (
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
            onChange={(e) =>
              handleSaveData({ densityCalDate: e.target.value })
            }
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
  );
}
