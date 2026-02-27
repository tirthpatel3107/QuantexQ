// React & Hooks
import { useMemo, useCallback } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";

// Services & Types
import {
  useDensityData,
  useSaveDensityData,
  useDensityOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveDensityPayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "@/context/MudProperties";

export function Density() {
  const { data: densityResponse, isLoading } = useDensityData();
  const { data: optionsResponse } = useDensityOptions();
  const { mutate: saveDensityData } = useSaveDensityData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!densityResponse?.data) return undefined;
    const {
      mudWeightIn,
      mudWeightOut,
      oilWaterRatio,
      salinity,
      solidsContent,
      lowGravitySolids,
      highGravitySolids,
    } = densityResponse.data;
    return {
      mudWeightIn,
      mudWeightOut,
      oilWaterRatio,
      salinity,
      solidsContent,
      lowGravitySolids,
      highGravitySolids,
    };
  }, [densityResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveDensityPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDensityData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Density settings saved successfully",
    errorMessage: "Failed to save density settings",
    confirmTitle: "Save Density Settings",
    confirmDescription: "Are you sure you want to save these density changes?",
  });

  // Adapter for existing panels that expect (prev => ({...prev, ...new})) style setter
  const setFluidAdapter = useCallback(
    (update: any) => {
      if (typeof update === "function") {
        form.setFormData(update);
      } else {
        form.updateLocalField(update);
      }
    },
    [form],
  );

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const fluid = form.formData;

  return (
    <>
      <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
        <DensitySolidsPanel fluid={fluid as any} setFluid={setFluidAdapter} />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
