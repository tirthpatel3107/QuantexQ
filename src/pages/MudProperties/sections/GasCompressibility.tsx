import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonInput,
  SectionSkeleton,
} from "@/components/common";
import { FluidData } from "@/types/mud";
import {
  useGasCompressibilityData,
  useSaveGasCompressibilityData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveGasCompressibilityPayload } from "@/services/api/mudproperties/mudproperties.types";

interface GasCompressibilityProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function GasCompressibility({
  fluid,
  setFluid,
}: GasCompressibilityProps) {
  const { data: gasResponse, isLoading, error } = useGasCompressibilityData();
  const { mutate: saveGasCompressibilityData } = useSaveGasCompressibilityData();

  const gasData = gasResponse?.data;

  const [formData, setFormData] = useState<SaveGasCompressibilityPayload | null>(null);

  // Initialize form data when gasData loads
  useEffect(() => {
    if (gasData) {
      const { gasSolubility, compressibilityFactor, gasOilRatio } = gasData;
      setFormData({ gasSolubility, compressibilityFactor, gasOilRatio });
      setFluid((prev) => ({
        ...prev,
        gasSolubility,
        compressibilityFactor,
        gasOilRatio,
      }));
    }
  }, [gasData, setFluid]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveGasCompressibilityPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
    saveGasCompressibilityData(newFormData);
  };

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

  if (!gasData || !formData) {
    return <div className="p-4">No gas compressibility data available</div>;
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
            value={formData.gasSolubility}
            onChange={(e) =>
              handleSaveData({ gasSolubility: e.target.value })
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">scf/bbl</span>

          <Label className="text-xs text-muted-foreground text-left">
            Compressibility factor
          </Label>
          <CommonInput
            value={formData.compressibilityFactor}
            onChange={(e) =>
              handleSaveData({ compressibilityFactor: e.target.value })
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">—</span>

          <Label className="text-xs text-muted-foreground text-left">
            Gas/oil ratio
          </Label>
          <CommonInput
            value={formData.gasOilRatio}
            onChange={(e) =>
              handleSaveData({ gasOilRatio: e.target.value })
            }
            placeholder="—"
          />
          <span className="text-[11px] text-muted-foreground">scf/stb</span>
        </div>
      </PanelCard>
    </div>
  );
}
