import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import {
  useSensorPermsData,
  useSaveSensorPermsData,
  useSensorPermsOptions,
} from "@/services/api/daq/daq.api";
import type { SaveSensorPermsPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../context/DAQ/DAQContext";

export function SensorPerms() {
  const { data: sensorPermsResponse, isLoading } = useSensorPermsData();
  const { data: optionsResponse } = useSensorPermsOptions();
  const { mutate: saveSensorPermsData } = useSaveSensorPermsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

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
    return <SectionSkeleton count={6} />;
  }

  const { sensors, defaultPermissions } = form.formData;

  return (
    <>
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Sensor Perms DAQ Section ({sensors.length} sensors)
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
