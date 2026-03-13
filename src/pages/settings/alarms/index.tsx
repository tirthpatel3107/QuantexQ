import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  CommonTabs,
  CommonTabsContent,
  CommonTabsNav,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/shared";
import type { CommonSelectOption } from "@/components/shared/CommonSelect";

// Components - Local

import { KickAndLoss } from "./KickAndLoss";
import { Sensors } from "./Sensors";

// Services & API
import {
  useAlarmsSettings,
  useSaveAlarmsSettings,
  useAlarmsOptions,
} from "@/services/api/settings/settings.api";

// Types & Schemas
import {
  alarmsFormSchema,
  type AlarmsFormValues,
  type SaveAlarmsPayload,
} from "@/utils/schemas/alarms";

// Contexts
import { useSettingsContext } from "@/context/settings";

export function Alarms() {
  const { data: alarmsResponse, isLoading } = useAlarmsSettings();
  const { data: optionsResponse } = useAlarmsOptions();
  const { mutate: saveAlarmsData } = useSaveAlarmsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const [activeTab, setActiveTab] = useState("kick");
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<AlarmsFormValues>({
    resolver: zodResolver(alarmsFormSchema),
    mode: "onBlur",
    defaultValues: {
      sensors: [],
      dynamicLimitsEnabled: false,
      kickLimit: "0",
      lossLimit: "0",
      pitGainLimit: "0",
      sppHighLimit: "0",
      pppHighLimit: "0",
      pitVolumeHighLimit: "0",
      pitVolumeHighLimitBbl: "0",
      logicActivateWhenGainsStop: false,
      logicActivateStickyAlarms: false,
      logicActivateSecondaryAlarms: false,
      logicDelay: "5",
      logicMonitorDuration: "0",
      notifyOfflineAlarm: false,
      notifyOnlineAlarm: false,
      kickDelay: "5",
      lossDelay: "5",
      offlineOutput: "audio",
      onlineOutput: "kick-loss",
    },
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (alarmsResponse?.data && !hasSetInitial) {
      reset(alarmsResponse.data);
      const timeoutId = setTimeout(() => {
        setHasSetInitial(true);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [alarmsResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveAlarmsPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveAlarmsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Alarms settings saved successfully",
    errorMessage: "Failed to save alarms settings",
    confirmTitle: "Save Alarms Settings",
    confirmDescription: "Are you sure you want to save these alarms changes?",
  });

  /**
   * Register the save handler with the SettingsContext.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveAlarmsPayload);
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
  if (isLoading || !hasSetInitial || !alarmsResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  const options = (optionsResponse?.data || {}) as Record<
    string,
    CommonSelectOption[]
  >;

  const tabs = [
    { value: "kick", label: "Kick and Loss" },
    { value: "sensors", label: "Sensors" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CommonTabs value={activeTab} onValueChange={setActiveTab}>
        <CommonTabsNav items={tabs} />

        {/* Kick and Loss Tab */}
        <CommonTabsContent value="kick" className="space-y-4">
          <KickAndLoss control={control} options={options} />
        </CommonTabsContent>

        {/* Sensors Tab */}
        <CommonTabsContent value="sensors" className="space-y-4">
          <Sensors control={control} />
        </CommonTabsContent>
      </CommonTabs>

      <FormSaveDialog form={saveWithConfirmation} />
    </div>
  );
}
