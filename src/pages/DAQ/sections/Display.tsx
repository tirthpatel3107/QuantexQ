import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Badge } from "@/components/ui/badge";
import {
  useDisplayData,
  useSaveDisplayData,
} from "@/services/api/daq/daq.api";
import type { SaveDisplayPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../../context/DAQ/DAQContext";

export function Display() {
  const { data: displayResponse, isLoading } = useDisplayData();
  const { mutate: saveDisplayData } = useSaveDisplayData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const initialData = useMemo(() => {
    if (!displayResponse?.data) return undefined;
    const { sections } = displayResponse.data;
    return { sections };
  }, [displayResponse?.data]);

  const form = useSectionForm<SaveDisplayPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveDisplayData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Display settings saved successfully",
    errorMessage: "Failed to save display settings",
    confirmTitle: "Save Display Settings",
    confirmDescription: "Are you sure you want to save these display changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      {/* Top Row - 3 Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <PressuresPanel />
        <OutFlowPanel />
        <MWInOutPanel />
      </div>

      {/* Middle Row - Turbing, Annular Friction Loss, Rotary/Drilling Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 pb-4">
        <TurbingPanel />
        <AnnularFrictionPanel />
        <RotaryDrillingPanel />
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}

// Pressures Panel
function PressuresPanel() {
  return (
    <PanelCard 
      title={
        <div className="flex items-center gap-2">
          <span className="text-blue-400">💧</span>
          <span>Pressures</span>
          <span className="text-xs text-muted-foreground font-normal">(psi)</span>
        </div>
      } 
    >
      <div className="space-y-6">
        {/* SBP Large Display */}
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">SBP</div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular-nums">1,288</span>
            <span className="text-lg text-muted-foreground">psi</span>
          </div>
        </div>

        {/* HP HIGH Label */}
        <div className="text-xs text-muted-foreground uppercase tracking-wide">HP HIGH</div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: "85%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>HP High / Low</span>
            <span>Pressure</span>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

// OUT Flow Panel
function OutFlowPanel() {
  return (
    <PanelCard 
      title={
        <div className="flex items-center gap-2">
          <span className="text-blue-400">💧</span>
          <span>OUT Flow</span>
        </div>
      } 
    >
      <div className="space-y-6">
        {/* Two Values Side by Side */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">600</span>
              <span className="text-sm text-muted-foreground">gpm</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">515</span>
              <span className="text-sm text-muted-foreground">gpm</span>
            </div>
          </div>
        </div>

        {/* HP HIGH Label */}
        <div className="text-xs text-muted-foreground uppercase tracking-wide">HP HIGH</div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: "92%" }} />
          </div>
        </div>

        {/* FLOW (GPM & FT/MIN) Section */}
        <div className="space-y-3 pt-4 border-t border-muted/30">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">FLOW (GPM & FT/MIN)</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums">600</span>
            <span className="text-sm text-muted-foreground">gpm</span>
          </div>

          {/* IN FLOW Label */}
          <div className="text-xs text-muted-foreground uppercase tracking-wide">IN FLOW</div>

          {/* Progress Bar with Labels */}
          <div className="space-y-2">
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "93%" }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 gpm</span>
              <span>500 gpm</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Set Point</span>
              <span>HP gpm</span>
            </div>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

// MW In & Out Panel
function MWInOutPanel() {
  return (
    <PanelCard 
      title={
        <div className="flex items-center gap-2">
          <span>MW In & Out</span>
          <span className="text-xs text-muted-foreground font-normal">(ppg)</span>
        </div>
      } 
    >
      <div className="space-y-4">
        <MetricRow label="MW In" value="12.4" unit="ppg" />
        <MetricRow label="MW Out" value="12.4" unit="ppg" />
        <MetricRow label="BHP" value="6,186" unit="psi" />
      </div>
    </PanelCard>
  );
}

// Turbing Panel
function TurbingPanel() {
  return (
    <PanelCard 
      title={
        <div className="flex items-center gap-2">
          <span className="text-orange-400">🌡️</span>
          <span>Turbing</span>
        </div>
      } 
    >
      <div className="space-y-6">
        {/* Temperature Large Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tabular-nums">210</span>
          <span className="text-lg text-muted-foreground">°F</span>
        </div>

        {/* Temperature Label */}
        <div className="text-xs text-muted-foreground uppercase tracking-wide">TEMPERATURE</div>

        {/* Orange Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: "70%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>GFection</span>
            <span>+ 0.61 °F /100ft</span>
          </div>
        </div>

        {/* IN FLOW Section */}
        <div className="space-y-3 pt-4 border-t border-muted/30">
          <div className="text-xs text-blue-400 uppercase tracking-wide">IN FLOW</div>
          <div className="space-y-2">
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "60%" }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 gpm</span>
              <span>500 gpm</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Set Point</span>
              <span>HP gpm</span>
            </div>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

// Annular Friction Loss Panel
function AnnularFrictionPanel() {
  return (
    <PanelCard 
      title={
        <div className="flex items-center gap-2">
          <span>Annular Friction Loss</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground font-normal">Summary</span>
        </div>
      } 
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Calculated PB</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">6,186 psi</span>
            <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">OK</Badge>
          </div>
        </div>
        <MetricRow label="Annular Friction Loss" value="6.92" unit="%" />
        <MetricRow label="Circulating Flow in / Out" value="600 / 515" unit="gpm" />

        {/* Chart Placeholder */}
        <div className="pt-4">
          <div className="text-xs text-muted-foreground mb-2">Chart: Connected Depth 6,140 ft</div>
          <div className="h-32 bg-gradient-to-br from-green-900/20 to-green-600/10 rounded border border-green-600/20 relative overflow-hidden">
            {/* Simulated chart line */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points="0,80 20,75 40,70 60,60 80,45 100,30"
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="2"
                className="opacity-70"
              />
            </svg>
            <div className="absolute bottom-2 right-2 text-xs text-green-400">HGS</div>
            <div className="absolute top-2 right-2 text-xs text-muted-foreground">9.5 %</div>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

// Rotary/Drilling Panel
function RotaryDrillingPanel() {
  return (
    <PanelCard 
      title="Rotary / Drilling" 
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Surface Temp:</div>
            <div className="text-lg font-semibold">85 °F</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">ROP</div>
            <div className="text-lg font-semibold">135 ft/hr</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Methane</div>
            <div className="text-lg font-semibold">00.00%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">LGS</div>
            <div className="text-lg font-semibold">8.3%</div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="pt-2">
          <div className="text-xs text-muted-foreground mb-2">Chart: Connected Depth 6,140 ft</div>
          <div className="h-32 bg-gradient-to-br from-blue-900/20 to-blue-600/10 rounded border border-blue-600/20 relative overflow-hidden">
            {/* Simulated chart area */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points="0,90 10,88 20,85 30,82 40,78 50,72 60,65 70,55 80,42 90,35 100,30"
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="opacity-70"
              />
            </svg>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

// Helper Components
function MetricRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-semibold tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
