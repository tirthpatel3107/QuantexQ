// React & Hooks
import { useMemo, useCallback } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import { TemperaturePanel } from "./panels/TemperaturePanel";

// Services & Types
import {
  useTemperatureData,
  useSaveTemperatureData,
  useTemperatureOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveTemperaturePayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "../MudPropertiesContext";

export function Temperature() {
  const { data: temperatureResponse, isLoading } = useTemperatureData();
  const { data: optionsResponse } = useTemperatureOptions();
  const { mutate: saveTemperatureData } = useSaveTemperatureData();
  const { registerSaveHandler, unregisterSaveHandler } = useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!temperatureResponse?.data) return undefined;
    const { surfaceTemp, bottomholeTemp, tempGradient, flowlineTemp, ambientTemp, staticTemp, circulatingTemp } = temperatureResponse.data;
    return { surfaceTemp, bottomholeTemp, tempGradient, flowlineTemp, ambientTemp, staticTemp, circulatingTemp };
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
    confirmDescription: "Are you sure you want to save these temperature changes?",
  });

  // Adapter for existing panels that expect (prev => ({...prev, ...new})) style setter
  const setFluidAdapter = useCallback((update: any) => {
    if (typeof update === 'function') {
      form.setFormData(update);
    } else {
      form.updateLocalField(update);
    }
  }, [form]);

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const fluid = form.formData;

  return (
    <>
      <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
        <TemperaturePanel fluid={fluid as any} setFluid={setFluidAdapter} />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
