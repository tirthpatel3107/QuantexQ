import { CommonSkeleton, SectionSkeleton } from "@/components/common";
import { useUnitsSettings } from "@/services/api/settings/settings.api";

export function Units() {
  const { data: unitsResponse, isLoading, error } = useUnitsSettings();
  const unitsData = unitsResponse?.data;

  if (isLoading) {
    return <SectionSkeleton count={1} className="p-4" />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading units settings</div>;
  }

  if (!unitsData) {
    return <div className="p-4">No units settings available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Units Settings Section - API Connected (Pressure: {unitsData.pressure})
    </div>
  );
}
