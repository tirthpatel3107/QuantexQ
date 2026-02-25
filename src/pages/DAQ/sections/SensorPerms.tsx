import { CommonSkeleton, SectionSkeleton } from "@/components/common";
import { useSensorPermsData } from "@/services/api/daq/daq.api";

export function SensorPerms() {
  const { data: sensorPermsResponse, isLoading, error } = useSensorPermsData();
  const sensorPermsData = sensorPermsResponse?.data;

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading sensor permissions data
      </div>
    );
  }

  if (!sensorPermsData) {
    return <div className="p-4">No sensor permissions data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Sensor Perms DAQ Section - API Connected ({sensorPermsData.sensors.length}{" "}
      sensors)
    </div>
  );
}
