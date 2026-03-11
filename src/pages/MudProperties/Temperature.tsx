// React & Hooks
import { useMemo, useCallback } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import { TemperaturePanel } from "./fluidOverview/TemperaturePanel";

// Services & Types
import {
  useTemperatureData,
  useSaveTemperatureData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveTemperaturePayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "@/context/mudProperties";

export function Temperature() {
  const { data: temperatureResponse, isLoading } = useTemperatureData();
  const { mutate: saveTemperatureData } = useSaveTemperatureData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!temperatureResponse?.data) return undefined;
    const {
      surfaceTemp,
      bottomholeTemp,
      tempGradient,
      flowlineTemp,
      ambientTemp,
      staticTemp,
      circulatingTemp,
    } = temperatureResponse.data;
    return {
      surfaceTemp,
      bottomholeTemp,
      tempGradient,
      flowlineTemp,
      ambientTemp,
      staticTemp,
      circulatingTemp,
    };
  }, [temperatureResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveTemperaturePayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveTemperatureData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Temperature settings saved successfully",
    errorMessage: "Failed to save temperature settings",
    confirmTitle: "Save Temperature Settings",
    confirmDescription:
      "Are you sure you want to save these temperature changes?",
  });

  // Adapter for existing panels that expect (prev => ({...prev, ...new})) style setter
  const setFluidAdapter = useCallback(
    (update: unknown) => {
      if (typeof update === "function") {
        form.setFormData(
          update as React.SetStateAction<SaveTemperaturePayload | null>,
        );
      } else {
        form.updateLocalField(update as Partial<SaveTemperaturePayload>);
      }
    },
    [form],
  );

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={3} />;
  }

  const fluid = form.formData;

  return (
    <>
      <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
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
