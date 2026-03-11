// React & Hooks
import { useMemo, useCallback } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import { RheologyPanel } from "./fluidOverview/RheologyPanel";

// Services & Types
import {
  useRheologyData,
  useSaveRheologyData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveRheologyPayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "@/context/MudProperties";

export function Rheology() {
  const { data: rheologyResponse, isLoading } = useRheologyData();
  const { mutate: saveRheologyData } = useSaveRheologyData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!rheologyResponse?.data) return undefined;
    const { rheologySource, pv, yp, gel10s, gel10m, n, k, tau0 } =
      rheologyResponse.data;
    return { rheologySource, pv, yp, gel10s, gel10m, n, k, tau0 };
  }, [rheologyResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveRheologyPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveRheologyData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Rheology settings saved successfully",
    errorMessage: "Failed to save rheology settings",
    confirmTitle: "Save Rheology Settings",
    confirmDescription: "Are you sure you want to save these rheology changes?",
  });

  // Adapter for existing panels that expect (prev => ({...prev, ...new})) style setter
  const setFluidAdapter = useCallback(
    (update: unknown) => {
      if (typeof update === "function") {
        form.setFormData(
          update as React.SetStateAction<SaveRheologyPayload | null>,
        );
      } else {
        form.updateLocalField(update as Partial<SaveRheologyPayload>);
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
        <RheologyPanel
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
