// React & Hooks
import { useMemo, useCallback } from "react";

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - Common
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Components - Local
import { DensitySolidsPanel } from "./fluidOverview/DensitySolidsPanel";

// Services & API
import {
  useDensityData,
  useSaveDensityData,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import type { SaveDensityPayload } from "@/services/api/mudproperties/mudproperties.types";

// Contexts
import { useMudPropertiesContext } from "@/context/mudProperties";

/**
 * Density Component
 *
 * Manages the fluid density and solids content configuration.
 * Provides inputs for mud weight (In/Out), salinity, and various solids categories.
 *
 * @returns JSX.Element
 */
export function Density() {
  // ---- Data & State ----
  const { data: densityResponse, isLoading } = useDensityData();
  const { mutate: saveDensityData } = useSaveDensityData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  /**
   * Memoize initial data from the API response.
   * This provides a stable object for the form initialization.
   */
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

  // ---- Form Management ----
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

  /**
   * Adapter for existing panels that expect (prev => ({...prev, ...new})) style setter.
   * Helps bridge between the useSectionForm hook and legacy component prop patterns.
   */
  const setFluidAdapter = useCallback(
    (update: unknown) => {
      if (typeof update === "function") {
        form.setFormData(
          update as React.SetStateAction<SaveDensityPayload | null>,
        );
      } else {
        form.updateLocalField(update as Partial<SaveDensityPayload>);
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
        <DensitySolidsPanel
          fluid={fluid as unknown as import("@/utils/types/mud").FluidData}
          setFluid={
            setFluidAdapter as React.Dispatch<
              React.SetStateAction<import("@/utils/types/mud").FluidData>
            >
          }
        />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
