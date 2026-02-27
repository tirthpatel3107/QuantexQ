// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  CommonSelect,
  CommonInput,
  CommonToggle,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";

// Services & Types
import {
  useGeneralSettings,
  useSaveGeneralSettings,
  useGeneralOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../context/Settings/SettingsContext";

interface GeneralFormData {
  defaultWellName: string;
  defaultRigName: string;
  defaultScenario: string;
  startupScreen1: string;
  startupScreen2: string;
  safetyConfirmations: boolean;
  [key: string]: unknown;
}

export function GeneralSettings() {
  const { data: generalResponse, isLoading } = useGeneralSettings();
  const { data: optionsResponse } = useGeneralOptions();
  const { mutate: saveGeneralData } = useSaveGeneralSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!generalResponse?.data) return undefined;
    const data = generalResponse.data;
    return {
      defaultWellName: (data.applicationName as string) || "Quantex Q",
      defaultRigName: (data.defaultRigName as string) || "",
      defaultScenario: (data.defaultScenario as string) || "",
      startupScreen1: (data.startupScreen1 as string) || "",
      startupScreen2: (data.startupScreen2 as string) || "",
      safetyConfirmations: true,
    } as GeneralFormData;
  }, [generalResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<GeneralFormData>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveGeneralData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "General settings saved successfully",
    errorMessage: "Failed to save general settings",
    confirmTitle: "Save General Settings",
    confirmDescription:
      "Are you sure you want to save these general settings changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { formData } = form;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-3">
        <PanelCard title="Project / Well Context">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <CommonInput
              label="Default Well Name"
              value={formData.defaultWellName}
              onChange={(e) => {
                form.updateLocalField({ defaultWellName: e.target.value });
              }}
            />

            <CommonSelect
              label="Default Rig name"
              options={options?.rigOptions || []}
              value={formData.defaultRigName}
              onValueChange={(v) => {
                form.updateLocalField({ defaultRigName: v });
              }}
            />

            <CommonSelect
              label="Default Scenario"
              options={options?.scenarioOptions || []}
              value={formData.defaultScenario}
              onValueChange={(v) => {
                form.updateLocalField({ defaultScenario: v });
              }}
            />

            <CommonSelect
              label="Startup Screen"
              options={options?.screenOptions || []}
              value={formData.startupScreen1}
              onValueChange={(v) => {
                form.updateLocalField({
                  startupScreen1: v,
                  startupScreen2: v,
                });
              }}
            />

            <CommonSelect
              label="Startup Screen (secondary)"
              options={options?.screenOptions || []}
              value={formData.startupScreen2}
              onValueChange={(v) => {
                form.updateLocalField({ startupScreen2: v });
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
            checked={formData.safetyConfirmations}
            onCheckedChange={(checked) => {
              form.updateLocalField({ safetyConfirmations: checked });
            }}
          />
        </PanelCard>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
