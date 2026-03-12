import { SectionSkeleton } from "@/components/shared";
import { PanelCard } from "@/components/features/dashboard/PanelCard";
import { FluidData } from "@/utils/types/mud";
import { useSummaryData } from "@/services/api/mudproperties/mudproperties.api";

interface SummaryProps {
  fluid: FluidData;
}

export function Summary({ fluid }: SummaryProps) {
  const { data: summaryResponse, isLoading } = useSummaryData();

  const summaryData = summaryResponse?.data;

  if (isLoading) {
    return <SectionSkeleton count={3} />;
  }

  // Use API data if available, otherwise fall back to fluid prop
  const displayData = summaryData || {
    fluidType: fluid.type,
    baseFluid: fluid.baseFluid,
    mudWeight: "N/A",
    viscosity: `${fluid.pv} cP`,
    yieldPoint: `${fluid.yp} lb/100ft²`,
    gelStrength: `${fluid.gel10s}/${fluid.gel10m} lb/100ft²`,
    temperature: `${fluid.surfaceTemp}°F / ${fluid.bottomholeTemp}°F`,
    oilWaterRatio: fluid.oilWater,
    lastUpdated: new Date().toISOString(),
    updatedBy: "System",
  };

  return (
    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
      <PanelCard title="Summary" className="h-auto">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mud system</span>
            <span className="font-medium">{displayData.fluidType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base fluid</span>
            <span className="font-medium">{displayData.baseFluid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mud Weight</span>
            <span className="font-medium">{displayData.mudWeight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Viscosity</span>
            <span className="font-medium">{displayData.viscosity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Yield Point</span>
            <span className="font-medium">{displayData.yieldPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gel Strength</span>
            <span className="font-medium">{displayData.gelStrength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Oil/Water</span>
            <span className="font-medium">{displayData.oilWaterRatio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Temperature</span>
            <span className="font-medium">{displayData.temperature}</span>
          </div>
          {summaryData && (
            <>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-xs">
                  {new Date(displayData.lastUpdated).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated By</span>
                <span className="font-medium">{displayData.updatedBy}</span>
              </div>
            </>
          )}
        </div>
      </PanelCard>
    </div>
  );
}
