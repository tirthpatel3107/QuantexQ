import { RheologyPanel } from "./panels/RheologyPanel";
import { FluidData } from "@/types/mud";

interface RheologySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Rheology({ fluid, setFluid }: RheologySectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <RheologyPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
