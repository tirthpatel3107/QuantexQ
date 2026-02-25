import { CommonSkeleton, SectionSkeleton } from "@/components/common";
import { useHydraulicsData } from "@/services/api/daq/daq.api";

export function Hydraulics() {
  const { data: hydraulicsResponse, isLoading, error } = useHydraulicsData();
  const hydraulicsData = hydraulicsResponse?.data;

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading hydraulics data</div>
    );
  }

  if (!hydraulicsData) {
    return <div className="p-4">No hydraulics data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Hydraulics Models DAQ Section - API Connected (
      {hydraulicsData.modelsUsed.length} models)
    </div>
  );
}
