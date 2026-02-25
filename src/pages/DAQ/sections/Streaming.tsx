import { CommonSkeleton, SectionSkeleton } from "@/components/common";
import { useStreamingData } from "@/services/api/daq/daq.api";

export function Streaming() {
  const { data: streamingResponse, isLoading, error } = useStreamingData();
  const streamingData = streamingResponse?.data;

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading streaming data</div>;
  }

  if (!streamingData) {
    return <div className="p-4">No streaming data available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Streaming & Logging DAQ Section - API Connected (WITS:{" "}
      {streamingData.witsStream.enabled ? "Enabled" : "Disabled"})
    </div>
  );
}
