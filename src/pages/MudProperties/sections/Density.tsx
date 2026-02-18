import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { FluidData } from "@/types/mud";

interface DensitySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Density({ fluid, setFluid }: DensitySectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
