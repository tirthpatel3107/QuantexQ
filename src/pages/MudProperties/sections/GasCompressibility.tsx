import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RestoreDefaultsButton, CommonInput } from "@/components/common";

interface GasCompressibilityProps {
  fluid: any;
  setFluid: (updater: (prev: any) => any) => void;
}

export function GasCompressibility({ fluid, setFluid }: GasCompressibilityProps) {
  return (
    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
      <PanelCard title="Gas / Compressibility" headerAction={<RestoreDefaultsButton />}>
        <div className="grid grid-cols-[140px_120px_auto] gap-3 items-center">
          <Label className="text-xs text-muted-foreground text-left">Gas solubility</Label>
          <CommonInput
            value={fluid.gasSolubility}
            onChange={(e) =>
              setFluid((f: any) => ({
                ...f,
                gasSolubility: e.target.value,
              }))
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">scf/bbl</span>
          
          <Label className="text-xs text-muted-foreground text-left">Compressibility factor</Label>
          <CommonInput
            value={fluid.compressibilityFactor}
            onChange={(e) =>
              setFluid((f: any) => ({
                ...f,
                compressibilityFactor: e.target.value,
              }))
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">—</span>
          
          <Label className="text-xs text-muted-foreground text-left">Gas/oil ratio</Label>
          <CommonInput
            value={fluid.gasOilRatio}
            onChange={(e) =>
              setFluid((f: any) => ({
                ...f,
                gasOilRatio: e.target.value,
              }))
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">scf/stb</span>
        </div>
      </PanelCard>
    </div>
  );
}
