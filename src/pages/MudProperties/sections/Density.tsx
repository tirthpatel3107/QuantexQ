import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";

interface DensitySectionProps {
  fluid: any;
  setFluid: (updater: (prev: any) => any) => void;
}

export function Density({ fluid, setFluid }: DensitySectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
