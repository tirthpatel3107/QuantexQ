import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import { RheologyPanel } from "./panels/RheologyPanel";
import { FluidData } from "@/types/mud";
import {
  useRheologyData,
  useSaveRheologyData,
} from "@/services/api/mudproperties/mudproperties.api";
import type { SaveRheologyPayload } from "@/services/api/mudproperties/mudproperties.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useMudPropertiesContext } from "../MudPropertiesContext";

interface RheologySectionProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function Rheology({ fluid, setFluid }: RheologySectionProps) {
  const { data: rheologyResponse, isLoading, error } = useRheologyData();
  const { mutate: saveRheologyData } = useSaveRheologyData();
  const { registerSaveHandler, unregisterSaveHandler } = useMudPropertiesContext();

  const rheologyData = rheologyResponse?.data;

  const [formData, setFormData] = useState<SaveRheologyPayload | null>(null);

  // Initialize form data when rheologyData loads
  useEffect(() => {
    if (rheologyData) {
      const { rheologySource, pv, yp, gel10s, gel10m } = rheologyData;
      setFormData({ rheologySource, pv, yp, gel10s, gel10m });
      setFluid((prev) => ({
        ...prev,
        rheologySource,
        pv,
        yp,
        gel10s,
        gel10m,
      }));
    }
  }, [rheologyData, setFluid]);

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
  } = useSaveWithConfirmation<SaveRheologyPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveRheologyData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Rheology settings saved successfully",
    errorMessage: "Failed to save rheology settings",
    confirmTitle: "Save Rheology Settings",
    confirmDescription: "Are you sure you want to save these rheology changes?",
  });

  // Update local state only
  const handleSaveData = (updatedData: Partial<SaveRheologyPayload>) => {
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
        <RheologyPanel fluid={fluid} setFluid={setFluid} />
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
