import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import { FluidSystemPanel } from "./panels/FluidSystemPanel";
import { RheologyPanel } from "./panels/RheologyPanel";
import { DensitySolidsPanel } from "./panels/DensitySolidsPanel";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";
import {
  useFluidOverviewData,
  useSaveFluidOverviewData,
  useFluidOverviewOptions,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveFluidOverviewPayload } from "@/services/api/mudproperties/mudproperties.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useMudPropertiesContext } from "../MudPropertiesContext";

interface FluidOverviewSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function FluidOverview({ fluid, setFluid }: FluidOverviewSectionProps) {
  const { data: overviewResponse, isLoading, error } = useFluidOverviewData();
  const { data: optionsResponse } = useFluidOverviewOptions();
  const { mutate: saveFluidOverviewData } = useSaveFluidOverviewData();
  const { registerSaveHandler, unregisterSaveHandler } = useMudPropertiesContext();

  const overviewData = overviewResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveFluidOverviewPayload | null>(
    null,
  );

  // Initialize form data when overviewData loads
  useEffect(() => {
    if (overviewData) {
      const { type, baseFluid, activePitsVolume, flowlineTemp } = overviewData;
      setFormData({ type, baseFluid, activePitsVolume, flowlineTemp });
      setFluid((prev) => ({
        ...prev,
        type,
        baseFluid,
        activePitsVolume,
        flowlineTemp,
      }));
    }
  }, [overviewData, setFluid]);

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
  } = useSaveWithConfirmation<SaveFluidOverviewPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveFluidOverviewData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Fluid overview settings saved successfully",
    errorMessage: "Failed to save fluid overview settings",
    confirmTitle: "Save Fluid Overview Settings",
    confirmDescription: "Are you sure you want to save these fluid overview changes?",
  });

  // Update local state only
  const handleSaveData = (updatedData: Partial<SaveFluidOverviewPayload>) => {
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
      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
        <FluidSystemPanel
          fluid={fluid}
          setFluid={setFluid}
          typeOptions={options?.typeOptions || []}
          baseFluidOptions={options?.baseFluidOptions || []}
          tempOptions={options?.tempOptions || []}
        />
        <RheologyPanel fluid={fluid} setFluid={setFluid} />
        <DensitySolidsPanel fluid={fluid} setFluid={setFluid} />
        <TemperaturePanel fluid={fluid} setFluid={setFluid} />
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
