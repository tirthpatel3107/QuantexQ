import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RestoreDefaultsButton, CommonInput } from "@/components/common";
import { FluidData } from "@/types/mud";

interface CalibrationProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Calibration({ fluid, setFluid }: CalibrationProps) {
  return (
    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
      <PanelCard title="Calibration" headerAction={<RestoreDefaultsButton />}>
        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
          <Label className="text-xs text-muted-foreground text-left">Viscometer cal. date</Label>
          <CommonInput
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
          
          <Label className="text-xs text-muted-foreground text-left">Density cal. date</Label>
          <CommonInput
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
          
          <Label className="text-xs text-muted-foreground text-left">Temp. sensor offset</Label>
          <CommonInput
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
