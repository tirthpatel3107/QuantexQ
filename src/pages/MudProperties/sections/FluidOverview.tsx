// React & Hooks
import { useMemo, useCallback } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { SectionSkeleton, FormSaveDialog } from "@/components/common";

// Components - Local Panels
import { FluidSystemPanel } from "./panels/FluidSystemPanel";
import { RheologyPanel } from "./panels/RheologyPanel";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { TemperaturePanel } from "./panels/TemperaturePanel";

// Services & Types
import {
  useFluidOverviewData,
  useSaveFluidOverviewData,
  useFluidOverviewOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveFluidOverviewPayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "../../../context/MudProperties/MudPropertiesContext";

export function FluidOverview() {
  const { data: overviewResponse, isLoading } = useFluidOverviewData();
  const { data: optionsResponse } = useFluidOverviewOptions();
  const { mutate: saveFluidOverviewData } = useSaveFluidOverviewData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!overviewResponse?.data) return undefined;
    const { type, baseFluid, activePitsVolume, flowlineTemp } =
      overviewResponse.data;
    return { type, baseFluid, activePitsVolume, flowlineTemp };
  }, [overviewResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveFluidOverviewPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveFluidOverviewData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Fluid overview settings saved successfully",
    errorMessage: "Failed to save fluid overview settings",
    confirmTitle: "Save Fluid Overview Settings",
    confirmDescription:
      "Are you sure you want to save these fluid overview changes?",
  });

  // Adapter for existing panels that expect (prev => ({...prev, ...new})) style setter
  const setFluidAdapter = useCallback(
    (update: any) => {
      if (typeof update === "function") {
        // This is a bit tricky since form.formData might be null initially
        // But useSectionForm ensures it's populated if initialData is there
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
      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
        <FluidSystemPanel
          fluid={fluid as any}
          setFluid={setFluidAdapter}
          typeOptions={options?.typeOptions || []}
          baseFluidOptions={options?.baseFluidOptions || []}
          tempOptions={options?.tempOptions || []}
        />
        <RheologyPanel fluid={fluid as any} setFluid={setFluidAdapter} />
        <DensitySolidsPanel fluid={fluid as any} setFluid={setFluidAdapter} />
        <TemperaturePanel fluid={fluid as any} setFluid={setFluidAdapter} />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
