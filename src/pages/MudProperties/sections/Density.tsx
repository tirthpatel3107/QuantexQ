import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { FluidData } from "@/types/mud";
import {
  useDensityData,
  useSaveDensityData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveDensityPayload } from "@/services/api/mudproperties/mudproperties.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useMudPropertiesContext } from "../MudPropertiesContext";

interface DensitySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Density({ fluid, setFluid }: DensitySectionProps) {
  const { data: densityResponse, isLoading, error } = useDensityData();
  const { mutate: saveDensityData } = useSaveDensityData();
  const { registerSaveHandler, unregisterSaveHandler } = useMudPropertiesContext();

  const densityData = densityResponse?.data;

  const [formData, setFormData] = useState<SaveDensityPayload | null>(null);

  // Initialize form data when densityData loads
  useEffect(() => {
    if (densityData) {
      const { mudWeightIn, mudWeightOut, oilWaterRatio, salinity } =
        densityData;
      setFormData({ mudWeightIn, mudWeightOut, oilWaterRatio, salinity });
      setFluid((prev) => ({
        ...prev,
        oilWater: oilWaterRatio,
        salinity,
      }));
    }
  }, [densityData, setFluid]);

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    isSaving,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<SaveDensityPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDensityData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Density settings saved successfully",
    errorMessage: "Failed to save density settings",
    confirmTitle: "Save Density Settings",
    confirmDescription: "Are you sure you want to save these density changes?",
  });

  // Update local state only
  const handleSaveData = (updatedData: Partial<SaveDensityPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    setFluid((prev) => ({ ...prev, ...updatedData }));
  };

  const handleSave = () => {
    if (formData) {
      requestSave(formData);
    }
  };

  // Register save handler with parent context
  useEffect(() => {
    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid gap-4 mb-4 grid-cols-1 max-w-2xl">
        <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
      </div>

      <CommonAlertDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        cancelText="Cancel"
        actionText="Save"
        onAction={handleConfirmedSave}
        onCancel={handleCancel}
      />
    </>
  );
}
