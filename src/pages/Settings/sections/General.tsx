import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonSelect,
  CommonInput,
  CommonToggle,
} from "@/components/common";
import { GeneralSettingsData } from "@/types/settings";

interface GeneralSettingsProps {
  general: GeneralSettingsData;
  setGeneral: React.Dispatch<React.SetStateAction<GeneralSettingsData>>;
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
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-3">
      <PanelCard title="Project / Well Context">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <CommonInput
            label="Default Well Name"
            value={general.defaultWellName}
            onChange={(e) =>
              setGeneral((g) => ({
                ...g,
                defaultWellName: e.target.value,
              }))
            }
          />

          <CommonSelect
            label="Default Rig name"
            options={rigOptions}
            value={general.defaultRigName}
            onValueChange={(v) =>
              setGeneral((g) => ({ ...g, defaultRigName: v }))
            }
          />

          <CommonSelect
            label="Default Scenario"
            options={scenarioOptions}
            value={general.defaultScenario}
            onValueChange={(v) =>
              setGeneral((g) => ({ ...g, defaultScenario: v }))
            }
          />

          <CommonSelect
            label="Startup Screen"
            options={screenOptions}
            value={general.startupScreen1}
            onValueChange={(v) =>
              setGeneral((g) => ({
                ...g,
                startupScreen1: v,
                startupScreen2: v,
              }))
            }
          />

          <CommonSelect
            label="Startup Screen (secondary)"
            options={screenOptions}
            value={general.startupScreen2}
            onValueChange={(v) =>
              setGeneral((g) => ({ ...g, startupScreen2: v }))
            }
          />
        </div>
      </PanelCard>

      <PanelCard
        title="Safety"
        headerAction={<RestoreDefaultsButton size="sm" />}
      >
        <CommonToggle
          id="safety-confirm"
          label="Enable safety confirmations"
          description="Confirmations for Auto Control ON, PRC ON, Mode change, and Import settings."
          checked={safetyConfirmations}
          onCheckedChange={setSafetyConfirmations}
        />
      </PanelCard>
    </div>
  );
}
