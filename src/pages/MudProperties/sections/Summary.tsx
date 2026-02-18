import { PanelCard } from "@/components/dashboard/PanelCard";

interface SummaryProps {
  fluid: any;
}

export function Summary({ fluid }: SummaryProps) {
  return (
    <div className="grid grid-cols-1 max-w-2xl gap-4 mb-4">
      <PanelCard title="Summary" className="h-auto">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mud system</span>
            <span className="font-medium">{fluid.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base fluid</span>
            <span className="font-medium">{fluid.baseFluid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PV / YP</span>
            <span className="font-medium">
              {fluid.pv} cP / {fluid.yp} lb/100ft²
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gel 10s / 10m</span>
            <span className="font-medium">
              {fluid.gel10s} / {fluid.gel10m} lb/100ft²
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Oil/Water</span>
            <span className="font-medium">{fluid.oilWater}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Surface / BHT</span>
            <span className="font-medium">
              {fluid.surfaceTemp} °F / {fluid.bottomholeTemp} °F
            </span>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
