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
import { useMudPropertiesContext } from "@/context/MudProperties";

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
    (update: unknown) => {
      if (typeof update === "function") {
        form.setFormData(
          update as React.SetStateAction<SaveFluidOverviewPayload | null>,
        );
      } else {
        form.updateLocalField(update as Partial<SaveFluidOverviewPayload>);
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
          fluid={fluid as unknown as import("@/utils/types/mud").FluidData}
          setFluid={
            setFluidAdapter as React.Dispatch<
              React.SetStateAction<import("@/utils/types/mud").FluidData>
            >
          }
          typeOptions={options?.typeOptions || []}
          baseFluidOptions={options?.baseFluidOptions || []}
          tempOptions={options?.tempOptions || []}
        />
        <RheologyPanel
          fluid={fluid as unknown as import("@/utils/types/mud").FluidData}
          setFluid={
            setFluidAdapter as React.Dispatch<
              React.SetStateAction<import("@/utils/types/mud").FluidData>
            >
          }
        />
        <DensitySolidsPanel
          fluid={fluid as unknown as import("@/utils/types/mud").FluidData}
          setFluid={
            setFluidAdapter as React.Dispatch<
              React.SetStateAction<import("@/utils/types/mud").FluidData>
            >
          }
        />
        <TemperaturePanel
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
