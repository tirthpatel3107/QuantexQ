import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RestoreDefaultsButton, CommonSelect, CommonInput } from "@/components/common";

interface GeneralSettingsProps {
  general: any;
  setGeneral: (updater: (prev: any) => any) => void;
  safetyConfirmations: boolean;
  setSafetyConfirmations: (checked: boolean) => void;
}

export function GeneralSettings({
  general,
  setGeneral,
  safetyConfirmations,
  setSafetyConfirmations,
}: GeneralSettingsProps) {
  const rigOptions = [
    { label: "Rig-01", value: "Rig-01" },
    { label: "Rig-02", value: "Rig-02" },
  ];

  const scenarioOptions = [
    { label: "Static", value: "Static" },
    { label: "Dynamic", value: "Dynamic" },
  ];

  const screenOptions = [
    { label: "Quantum HUD", value: "Quantum HUD" },
    { label: "Dashboard", value: "Dashboard" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-4">
      <PanelCard title="Project / Well Context">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Default Well Name</Label>
            <CommonInput
              value={general.defaultWellName}
              onChange={(e) =>
                setGeneral((g: any) => ({
                  ...g,
                  defaultWellName: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Default Rig name</Label>
            <CommonSelect
              options={rigOptions}
              value={general.defaultRigName}
              onValueChange={(v) =>
                setGeneral((g: any) => ({ ...g, defaultRigName: v }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Default Scenario</Label>
            <CommonSelect
              options={scenarioOptions}
              value={general.defaultScenario}
              onValueChange={(v) =>
                setGeneral((g: any) => ({ ...g, defaultScenario: v }))
              }
            />
          </div>
          <div className="space-y-2 ">
            <Label>Startup Screen</Label>
            <CommonSelect
              options={screenOptions}
              value={general.startupScreen1}
              onValueChange={(v) =>
                setGeneral((g: any) => ({
                  ...g,
                  startupScreen1: v,
                  startupScreen2: v,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Startup Screen (secondary)</Label>
            <CommonSelect
              options={screenOptions}
              value={general.startupScreen2}
              onValueChange={(v) =>
                setGeneral((g: any) => ({ ...g, startupScreen2: v }))
              }
            />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Safety" headerAction={<RestoreDefaultsButton size="sm" />}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0 flex-1 pr-2">
            <Label htmlFor="safety-confirm">Enable safety confirmations</Label>
            <p className="text-xs text-muted-foreground">
              Confirmations for Auto Control ON, PRC ON, Mode change, and Import settings.
            </p>
          </div>
          <Switch
            id="safety-confirm"
            checked={safetyConfirmations}
            onCheckedChange={setSafetyConfirmations}
            className="shrink-0"
          />
        </div>
      </PanelCard>
    </div>
  );
}
