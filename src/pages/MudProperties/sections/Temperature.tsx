import { TemperaturePanel } from "./panels/TemperaturePanel";

interface TemperatureSectionProps {
  fluid: any;
  setFluid: (updater: (prev: any) => any) => void;
}

export function Temperature({ fluid, setFluid }: TemperatureSectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <TemperaturePanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
