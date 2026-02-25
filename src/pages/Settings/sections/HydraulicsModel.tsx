import { SectionSkeleton } from "@/components/common";
import { useHydraulicsModelSettings } from "@/services/api/settings/settings.api";

export function HydraulicsModel() {
  const { data, isLoading, error } = useHydraulicsModelSettings();

  if (isLoading) {
    return <SectionSkeleton count={1} className="p-4" />;
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg text-destructive">
        Error loading settings: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Hydraulics Model Settings Section - Implementation Pending
        <div className="mt-2 text-xs">API Connected: {data ? "✓" : "✗"}</div>
      </div>
    </div>
  );
}
