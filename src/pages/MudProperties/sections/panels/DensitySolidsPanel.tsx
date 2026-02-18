import { Label } from "@/components/ui/label";
import { Lock, ExternalLink } from "lucide-react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RestoreDefaultsButton, LabeledInputWithUnit, CommonInput } from "@/components/common";
import { FluidData } from "@/types/mud";

interface DensitySolidsPanelProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function DensitySolidsPanel({ fluid, setFluid }: DensitySolidsPanelProps) {
  return (
    <PanelCard title="Density & Solids" headerAction={<RestoreDefaultsButton />}>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
        <LabeledInputWithUnit
          label="PV"
          value={fluid.pv}
          onChange={(v) => setFluid((f) => ({ ...f, pv: v }))}
          unit="cP"
        />
        <LabeledInputWithUnit
          label="YP"
          value={fluid.yp}
          onChange={(v) => setFluid((f) => ({ ...f, yp: v }))}
          unit="lb/100ft²"
        />
        <LabeledInputWithUnit
          label="Gel 10s"
          value={fluid.gel10s}
          onChange={(v) => setFluid((f) => ({ ...f, gel10s: v }))}
          unit="lb/100ft²"
        />
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Oil/Water</Label>
          <CommonInput
            value={fluid.oilWater}
            readOnly
            suffix={
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <ExternalLink className="h-3 w-3" />
              </div>
            }
          />
        </div>
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Salinity</Label>
          <CommonInput
            value={fluid.salinity}
            onChange={(e) =>
              setFluid((f) => ({
                ...f,
                salinity: e.target.value,
              }))
            }
            suffix="ppk"
          />
        </div>
      </div>
    </PanelCard>
  );
}
