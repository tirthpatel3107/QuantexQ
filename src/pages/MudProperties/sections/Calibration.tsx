import { PanelCard } from "@/components/dashboard/PanelCard";
import { RestoreDefaultsButton, CommonInput } from "@/components/common";
import { FluidData } from "@/types/mud";
import { useCalibrationData } from "@/services/api/mudproperties/mudproperties.api";
import { useEffect } from "react";

interface CalibrationProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Calibration({ fluid, setFluid }: CalibrationProps) {
  const { data: calibrationResponse, isLoading, error } = useCalibrationData();
  const calibrationData = calibrationResponse?.data;

  // Update fluid state when API data loads
  useEffect(() => {
    if (calibrationData) {
      setFluid((prev) => ({
        ...prev,
        viscometerCalDate: calibrationData.viscometerCalDate,
        densityCalDate: calibrationData.densityCalDate,
        tempSensorOffset: calibrationData.tempSensorOffset,
      }));
    }
  }, [calibrationData, setFluid]);

  if (isLoading) {
    return <div className="p-4">Loading calibration data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading calibration data</div>;
  }

  return (
    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
      <PanelCard title="Calibration" headerAction={<RestoreDefaultsButton />}>
        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
          <CommonInput
            label="Viscometer cal. date"
            value={fluid.viscometerCalDate}
            onChange={(e) =>
              setFluid((f) => ({
                ...f,
                viscometerCalDate: e.target.value,
              }))
            }
            placeholder="—"
            type="date"
          />

          <CommonInput
            label="Density cal. date"
            value={fluid.densityCalDate}
            onChange={(e) =>
              setFluid((f) => ({
                ...f,
                densityCalDate: e.target.value,
              }))
            }
            placeholder="—"
            type="date"
          />

          <CommonInput
            label="Temp. sensor offset"
            value={fluid.tempSensorOffset}
            onChange={(e) =>
              setFluid((f) => ({
                ...f,
                tempSensorOffset: e.target.value,
              }))
            }
            placeholder="°F"
          />
        </div>
      </PanelCard>
    </div>
  );
}
