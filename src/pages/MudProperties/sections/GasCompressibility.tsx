// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonInput,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";

// Services & Types
import {
  useGasCompressibilityData,
  useSaveGasCompressibilityData,
  useGasCompressibilityOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveGasCompressibilityPayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "../MudPropertiesContext";

export function GasCompressibility() {
  const { data: gasResponse, isLoading } = useGasCompressibilityData();
  const { data: optionsResponse } = useGasCompressibilityOptions();
  const { mutate: saveGasCompressibilityData } =
    useSaveGasCompressibilityData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!gasResponse?.data) return undefined;
    const {
      gasSolubility,
      compressibilityFactor,
      gasOilRatio,
      gasGravity,
      criticalPressure,
      criticalTemp,
    } = gasResponse.data;
    return {
      gasSolubility,
      compressibilityFactor,
      gasOilRatio,
      gasGravity,
      criticalPressure,
      criticalTemp,
    };
  }, [gasResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveGasCompressibilityPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveGasCompressibilityData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Gas compressibility settings saved successfully",
    errorMessage: "Failed to save gas compressibility settings",
    confirmTitle: "Save Gas Compressibility Settings",
    confirmDescription:
      "Are you sure you want to save these gas compressibility changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { formData } = form;

  return (
    <>
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
                form.updateLocalField({ gasSolubility: e.target.value })
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
                form.updateLocalField({ compressibilityFactor: e.target.value })
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
                form.updateLocalField({ gasOilRatio: e.target.value })
              }
              placeholder="—"
            />
            <span className="text-[11px] text-muted-foreground">scf/stb</span>
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
