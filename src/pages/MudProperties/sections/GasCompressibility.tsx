import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonInput,
  CommonSkeleton,
  SectionSkeleton,
} from "@/components/common";
import { FluidData } from "@/types/mud";
import { useGasCompressibilityData } from "@/services/api/mudproperties/mudproperties.api";
import { useEffect } from "react";

interface GasCompressibilityProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function GasCompressibility({
  fluid,
  setFluid,
}: GasCompressibilityProps) {
  const { data: gasResponse, isLoading, error } = useGasCompressibilityData();
  const gasData = gasResponse?.data;

  // Update fluid state when API data loads
  useEffect(() => {
    if (gasData) {
      setFluid((prev) => ({
        ...prev,
        gasSolubility: gasData.gasSolubility,
        compressibilityFactor: gasData.compressibilityFactor,
        gasOilRatio: gasData.gasOilRatio,
      }));
    }
  }, [gasData, setFluid]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading gas compressibility data
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
      <PanelCard
        title="Gas / Compressibility"
        headerAction={<RestoreDefaultsButton />}
      >
        <div className="grid grid-cols-[140px_120px_auto] gap-3 items-center">
          <Label className="text-xs text-muted-foreground text-left">
            Gas solubility
          </Label>
          <CommonInput
            value={fluid.gasSolubility}
            onChange={(e) =>
              setFluid((f) => ({
                ...f,
                gasSolubility: e.target.value,
              }))
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">scf/bbl</span>

          <Label className="text-xs text-muted-foreground text-left">
            Compressibility factor
          </Label>
          <CommonInput
            value={fluid.compressibilityFactor}
            onChange={(e) =>
              setFluid((f) => ({
                ...f,
                compressibilityFactor: e.target.value,
              }))
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">—</span>

          <Label className="text-xs text-muted-foreground text-left">
            Gas/oil ratio
          </Label>
          <CommonInput
            value={fluid.gasOilRatio}
            onChange={(e) =>
              setFluid((f) => ({
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
