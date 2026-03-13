// React & Hooks
import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
} from "@/components/shared";
import type { CommonSelectOption } from "@/components/shared/CommonSelect";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";
import { RestoreDefaultsButton } from "@/components/shared";

// Services & API
import {
  useGeneralSettings,
  useSaveGeneralSettings,
  useGeneralOptions,
} from "@/services/api/settings/settings.api";

// Types & Schemas
import {
  generalSettingsSchema,
  type GeneralFormData,
} from "@/utils/schemas/general";
import type { SaveGeneralPayload } from "@/services/api/settings/settings.types";

// Contexts
import { useSettingsContext } from "@/context/settings";

// Icons & Utils

export function GeneralSettings() {
  // ---- Data & State ----
  const { data: generalResponse, isLoading } = useGeneralSettings();
  const { data: optionsResponse } = useGeneralOptions();
  const { mutate: saveGeneralData } = useSaveGeneralSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = (optionsResponse?.data || {}) as Record<
    string,
    CommonSelectOption[]
  >;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<GeneralFormData>({
    resolver: zodResolver(generalSettingsSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (generalResponse?.data && !hasSetInitial) {
      const {
        applicationName,
        defaultRigName,
        defaultScenario,
        startupScreen1,
        startupScreen2,
      } = generalResponse.data;

      reset({
        defaultWellName: (applicationName as string) || "",
        defaultRigName: (defaultRigName as string) || "",
        defaultScenario: (defaultScenario as string) || "",
        startupScreen1: (startupScreen1 as string) || "",
        startupScreen2: (startupScreen2 as string) || "",
        safetyConfirmations: true,
      });

      // Use timeout to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setHasSetInitial(true);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [generalResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   * This logic is shared across settings pages for a consistent experience.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveGeneralPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveGeneralData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "General settings saved successfully",
    errorMessage: "Failed to save general settings",
    confirmTitle: "Save General Settings",
    confirmDescription:
      "Are you sure you want to save these general settings changes?",
  });

  /**
   * Register the save handler with the SettingsContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      // Map form data to API payload
      const payload: SaveGeneralPayload = {
        applicationName: validData.defaultWellName,
        defaultRigName: validData.defaultRigName,
        defaultScenario: validData.defaultScenario,
        startupScreen1: validData.startupScreen1,
        startupScreen2: validData.startupScreen2,
        safetyConfirmations: validData.safetyConfirmations,
      };
      saveWithConfirmation.requestSave(payload);
    });

    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [
    handleSubmit,
    registerSaveHandler,
    unregisterSaveHandler,
    saveWithConfirmation,
  ]);

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !generalResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-3">
        <PanelCard title="Project / Well Context">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <CommonFormInput
              name="defaultWellName"
              control={control}
              label="Well Name"
              placeholder="Well Name"
            />

            <CommonFormSelect
              name="defaultRigName"
              control={control}
              label="Rig name"
              options={options?.rigOptions || []}
            />

            <CommonFormSelect
              name="defaultScenario"
              control={control}
              label="Scenario"
              options={options?.scenarioOptions || []}
            />

            <CommonFormSelect
              name="startupScreen1"
              control={control}
              label="Startup Screen"
              options={options?.screenOptions || []}
            />

            <CommonFormSelect
              name="startupScreen2"
              control={control}
              label="Startup Screen (secondary)"
              options={options?.screenOptions || []}
            />
          </div>
        </PanelCard>

        <PanelCard
          title="Safety"
          headerAction={<RestoreDefaultsButton size="sm" />}
        >
          <CommonFormToggle
            name="safetyConfirmations"
            control={control}
            label="Enable safety confirmations"
            description="Confirmations for Auto Control ON, PRC ON, Mode change, and Import settings."
          />
        </PanelCard>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
