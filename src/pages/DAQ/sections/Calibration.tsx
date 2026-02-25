import { useCalibrationData } from "@/services/api/daq/daq.api";

export function Calibration() {
  const { data: calibrationResponse, isLoading, error } = useCalibrationData();
  const calibrationData = calibrationResponse?.data;

  if (isLoading) {
    return <div className="p-4">Loading calibration data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading calibration data</div>;
  }

  if (!calibrationData) {
    return <div className="p-4">No calibration data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Calibration DAQ Section - API Connected ({calibrationData.calibrations.length} calibrations)
    </div>
  );
}
