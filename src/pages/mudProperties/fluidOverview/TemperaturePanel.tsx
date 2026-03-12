// React & Hooks

// Form & Validation

// Hooks

// Third-party

// Components - UI

// Components - Common
import {
  RestoreDefaultsButton,
  LabeledInputWithUnit,
} from "@/components/shared";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Services & API

// Types & Schemas
import type { FluidData } from "@/utils/types/mud";

// Contexts

// Icons & Utils

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
