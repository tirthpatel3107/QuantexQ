import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import { TemperaturePanel } from "./panels/TemperaturePanel";
import { FluidData } from "@/types/mud";
import {
  useTemperatureData,
  useSaveTemperatureData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveTemperaturePayload } from "@/services/api/mudproperties/mudproperties.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useMudPropertiesContext } from "../MudPropertiesContext";

interface TemperatureSectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Temperature({ fluid, setFluid }: TemperatureSectionProps) {
  const { data: temperatureResponse, isLoading, error } = useTemperatureData();
  const { mutate: saveTemperatureData } = useSaveTemperatureData();
  const { registerSaveHandler, unregisterSaveHandler } = useMudPropertiesContext();

  const temperatureData = temperatureResponse?.data;

  const [formData, setFormData] = useState<SaveTemperaturePayload | null>(null);

  // Initialize form data when temperatureData loads
  useEffect(() => {
    if (temperatureData) {
      const { surfaceTemp, bottomholeTemp, tempGradient, flowlineTemp } =
        temperatureData;
      setFormData({ surfaceTemp, bottomholeTemp, tempGradient, flowlineTemp });
      setFluid((prev) => ({
        ...prev,
        surfaceTemp,
        bottomholeTemp,
        tempGradient,
        flowlineTemp,
      }));
    }
  }, [temperatureData, setFluid]);

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
  } = useSaveWithConfirmation<SaveTemperaturePayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveTemperatureData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Temperature settings saved successfully",
    errorMessage: "Failed to save temperature settings",
    confirmTitle: "Save Temperature Settings",
    confirmDescription: "Are you sure you want to save these temperature changes?",
  });

  // Update local state only
  const handleSaveData = (updatedData: Partial<SaveTemperaturePayload>) => {
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
