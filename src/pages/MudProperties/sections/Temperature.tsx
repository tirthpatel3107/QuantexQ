import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";

interface TemperatureSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Temperature({ fluid, setFluid }: TemperatureSectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <TemperaturePanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
