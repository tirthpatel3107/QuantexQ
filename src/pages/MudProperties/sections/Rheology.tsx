import { RheologyPanel } from "./panels/RheologyPanel";

interface RheologySectionProps {
  fluid: any;
  setFluid: (updater: (prev: any) => any) => void;
}

export function Rheology({ fluid, setFluid }: RheologySectionProps) {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
      <RheologyPanel fluid={fluid} setFluid={setFluid} />
    </div>
  );
}
