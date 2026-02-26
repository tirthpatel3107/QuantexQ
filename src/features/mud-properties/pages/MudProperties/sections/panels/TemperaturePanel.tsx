import { PanelCard } from "@/pages/Dashboard/components/PanelCard";
import {
  RestoreDefaultsButton,
  LabeledInputWithUnit,
} from "@/shared/components";
import { FluidData } from "@/types/mud";

interface TemperaturePanelProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function TemperaturePanel({ fluid, setFluid }: TemperaturePanelProps) {
  return (
    <PanelCard title="Temperature" headerAction={<RestoreDefaultsButton />}>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
        <LabeledInputWithUnit
          label="Surface temp"
          value={fluid.surfaceTemp}
          onChange={(v) => setFluid((f) => ({ ...f, surfaceTemp: v }))}
          unit="°F"
        />
        <LabeledInputWithUnit
          label="Bottomhole temp"
          value={fluid.bottomholeTemp}
          unit="°F"
          readOnly
        />
        <LabeledInputWithUnit
          label="Temperature gradient"
          value={fluid.tempGradient}
          onChange={(v) => setFluid((f) => ({ ...f, tempGradient: v }))}
          unit="°F/100 ft"
          className="sm:col-span-2"
        />
      </div>
    </PanelCard>
  );
}
