import { useEffect } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonSelect,
  CommonInput,
  CommonToggle,
  SectionSkeleton,
  CommonAlertDialog,
} from "@/components/common";
import { GeneralSettingsData } from "@/types/settings";
import {
  useGeneralSettings,
  useSaveGeneralSettings,
  useGeneralOptions,
} from "@/services/api/settings/settings.api";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useSettingsContext } from "../SettingsContext";

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
  const { data: generalResponse, isLoading, error } = useGeneralSettings();
  const { data: optionsResponse } = useGeneralOptions();
  const { mutate: saveGeneralData } = useSaveGeneralSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const generalData = generalResponse?.data;
  const options = optionsResponse?.data;

  // Update general state when API data loads
  useEffect(() => {
    if (generalData) {
      setGeneral({
        defaultWellName: generalData.applicationName || general.defaultWellName,
        defaultRigName: general.defaultRigName,
        defaultScenario: general.defaultScenario,
        startupScreen1: general.startupScreen1,
        startupScreen2: general.startupScreen2,
      });
    }
  }, [generalData]);

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<any>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveGeneralData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "General settings saved successfully",
    errorMessage: "Failed to save general settings",
    confirmTitle: "Save General Settings",
    confirmDescription: "Are you sure you want to save these general settings changes?",
  });

  // Save data to API with confirmation
  const handleSaveData = (updatedData: any) => {
    requestSave(updatedData);
  };

  const handleSave = () => {
    handleSaveData({
      defaultWellName: general.defaultWellName,
      defaultRigName: general.defaultRigName,
      defaultScenario: general.defaultScenario,
      startupScreen1: general.startupScreen1,
      startupScreen2: general.startupScreen2,
      safetyConfirmations,
    });
  };

  // Register save handler with parent context
  useEffect(() => {
    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [general, safetyConfirmations]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-3">
      <PanelCard title="Project / Well Context">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <CommonInput
            label="Default Well Name"
            value={general.defaultWellName}
            onChange={(e) => {
              const newValue = e.target.value;
              setGeneral((g) => ({
                ...g,
                defaultWellName: newValue,
              }));
              handleSaveData({ defaultWellName: newValue });
            }}
          />

          <CommonSelect
            label="Default Rig name"
            options={options?.rigOptions || []}
            value={general.defaultRigName}
            onValueChange={(v) => {
              setGeneral((g) => ({ ...g, defaultRigName: v }));
              handleSaveData({ defaultRigName: v });
            }}
          />

          <CommonSelect
            label="Default Scenario"
            options={options?.scenarioOptions || []}
            value={general.defaultScenario}
            onValueChange={(v) => {
              setGeneral((g) => ({ ...g, defaultScenario: v }));
              handleSaveData({ defaultScenario: v });
            }}
          />

          <CommonSelect
            label="Startup Screen"
            options={options?.screenOptions || []}
            value={general.startupScreen1}
            onValueChange={(v) => {
              setGeneral((g) => ({
                ...g,
                startupScreen1: v,
                startupScreen2: v,
              }));
              handleSaveData({ startupScreen1: v, startupScreen2: v });
            }}
          />

          <CommonSelect
            label="Startup Screen (secondary)"
            options={options?.screenOptions || []}
            value={general.startupScreen2}
            onValueChange={(v) => {
              setGeneral((g) => ({ ...g, startupScreen2: v }));
              handleSaveData({ startupScreen2: v });
            }}
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
          onCheckedChange={(checked) => {
            setSafetyConfirmations(checked);
            handleSaveData({ safetyConfirmations: checked });
          }}
        />
      </PanelCard>
    </div>

    <CommonAlertDialog
      open={isConfirmOpen}
      onOpenChange={setIsConfirmOpen}
      title={confirmTitle}
      description={confirmDescription}
      cancelText="Cancel"
      actionText="Save"
      onAction={handleConfirmedSave}
      onCancel={handleCancel}
    />
  </>
  );
}
