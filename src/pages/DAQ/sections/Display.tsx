import { useDisplayData } from "@/services/api/daq/daq.api";

export function Display() {
  const { data: displayResponse, isLoading, error } = useDisplayData();
  const displayData = displayResponse?.data;

  if (isLoading) {
    return <div className="p-4">Loading display data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading display data</div>;
  }

  if (!displayData) {
    return <div className="p-4">No display data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Display DAQ Section - API Connected ({displayData.sections.length} sections available)
    </div>
  );
}
