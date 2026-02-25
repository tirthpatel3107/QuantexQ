import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useCalibrationData,
  useSaveCalibrationData,
  useCalibrationOptions,
} from "@/services/api/daq/daq.api";
import type { SaveCalibrationPayload } from "@/services/api/daq/daq.types";

export function Calibration() {
  const { data: calibrationResponse, isLoading, error } = useCalibrationData();
  const { data: optionsResponse } = useCalibrationOptions();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();

  const calibrationData = calibrationResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveCalibrationPayload | null>(null);

  // Initialize form data when calibrationData loads
  useEffect(() => {
    if (calibrationData) {
      const { calibrations, permissions } = calibrationData;
      setFormData({ calibrations, permissions });
    }
  }, [calibrationData]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveCalibrationPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveCalibrationData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Calibration DAQ Section - API Connected ({formData.calibrations.length}{" "}
      calibrations)
    </div>
  );
}
