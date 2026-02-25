import { useState, useEffect } from "react";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useSensorPermsData,
  useSaveSensorPermsData,
  useSensorPermsOptions,
} from "@/services/api/daq/daq.api";
import type { SaveSensorPermsPayload } from "@/services/api/daq/daq.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useDAQContext } from "../DAQContext";

export function SensorPerms() {
  const { data: sensorPermsResponse, isLoading, error } = useSensorPermsData();
  const { data: optionsResponse } = useSensorPermsOptions();
  const { mutate: saveSensorPermsData } = useSaveSensorPermsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const sensorPermsData = sensorPermsResponse?.data;
  const options = optionsResponse?.data;

  const [formData, setFormData] = useState<SaveSensorPermsPayload | null>(null);

  // Initialize form data when sensorPermsData loads
  useEffect(() => {
    if (sensorPermsData) {
      const { sensors, defaultPermissions } = sensorPermsData;
      setFormData({ sensors, defaultPermissions });
    }
  }, [sensorPermsData]);

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<SaveSensorPermsPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveSensorPermsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Sensor permissions saved successfully",
    errorMessage: "Failed to save sensor permissions",
    confirmTitle: "Save Sensor Permissions",
    confirmDescription: "Are you sure you want to save these sensor permission changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: Partial<SaveSensorPermsPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
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
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Sensor Perms DAQ Section - API Connected ({formData.sensors.length}{" "}
        sensors)
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
