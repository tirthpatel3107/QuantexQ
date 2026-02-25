import { useState, useEffect } from "react";
import { SectionSkeleton } from "@/components/common";
import {
  useSensorPermsData,
  useSaveSensorPermsData,
  useSensorPermsOptions,
} from "@/services/api/daq/daq.api";
import type { SaveSensorPermsPayload } from "@/services/api/daq/daq.types";

export function SensorPerms() {
  const { data: sensorPermsResponse, isLoading, error } = useSensorPermsData();
  const { data: optionsResponse } = useSensorPermsOptions();
  const { mutate: saveSensorPermsData } = useSaveSensorPermsData();

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

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveSensorPermsPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveSensorPermsData(newFormData);
  };

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Sensor Perms DAQ Section - API Connected ({formData.sensors.length}{" "}
      sensors)
    </div>
  );
}
