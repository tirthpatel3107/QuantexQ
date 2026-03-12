// React & Hooks
import { useMemo } from "react";

// Form & Validation

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Services & API
import {
  useSensorPermsData,
  useSaveSensorPermsData,
} from "@/services/api/daq/daq.api";
import type { SaveSensorPermsPayload } from "@/services/api/daq/daq.types";

// Types & Schemas

// Components - Common
import { SectionSkeleton, FormSaveDialog } from "@/components/shared";

// Components - Local

// Contexts
import { useDAQContext } from "@/context/daq";

// Icons & Utils

export function SensorPerms() {
  const { data: sensorPermsResponse, isLoading } = useSensorPermsData();
  const { mutate: saveSensorPermsData } = useSaveSensorPermsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const initialData = useMemo(() => {
    if (!sensorPermsResponse?.data) return undefined;
    const { sensors, defaultPermissions } = sensorPermsResponse.data;
    return { sensors, defaultPermissions };
  }, [sensorPermsResponse?.data]);

  const form = useSectionForm<SaveSensorPermsPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveSensorPermsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Sensor permissions saved successfully",
    errorMessage: "Failed to save sensor permissions",
    confirmTitle: "Save Sensor Permissions",
    confirmDescription:
      "Are you sure you want to save these sensor permission changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={3} />;
  }

  const { sensors } = form.formData;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Sensor Perms DAQ Section ({sensors.length} sensors)
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
