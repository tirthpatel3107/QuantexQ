import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import {
  systemSettingsFormSchema,
  type SystemSettingsFormValues,
} from "@/utils/schemas/systemSettings";

import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonButton,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
} from "@/components/common";
import { RestoreDefaultsButton } from "@/components/common/RestoreDefaultsButton";
import { Settings } from "lucide-react";
import {
  useSystemSettingsData,
  useSaveSystemSettingsData,
  useSystemSettingsOptions,
} from "@/services/api/daq/daq.api";
import type { SaveSystemSettingsPayload } from "@/services/api/daq/daq.types";

// Context
import { useDAQContext } from "@/context/daq";

export function SystemSettings() {
  const { data: systemSettingsResponse, isLoading } = useSystemSettingsData();
  const { data: optionsResponse } = useSystemSettingsOptions();
  const { mutate: saveSystemSettingsData } = useSaveSystemSettingsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  // Initialize form
  const formMethods = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // Watch toggle states to conditionally show/hide fields
  const autoPresetRestoreTime = useWatch({
    control,
    name: "systemSettings.autoPresetRestoreTime",
  });
  const realtimeStreamingEnabled = useWatch({
    control,
    name: "alarmSettings.realtimeStreamingEnabled",
  });
  const autoMuteAlarms = useWatch({
    control,
    name: "alarmSettings.autoMuteAlarms",
  });
  const autoUTCSync = useWatch({
    control,
    name: "scheduleTime.autoUTCSync",
  });

  // Track if we have set initial data
  const [hasSetInitial, setHasSetInitial] = useState(false);

  useEffect(() => {
    if (systemSettingsResponse?.data && !hasSetInitial) {
      const { systemSettings, alarmSettings, accountSecurity, scheduleTime } =
        systemSettingsResponse.data;
      reset({ systemSettings, alarmSettings, accountSecurity, scheduleTime });
      // Use timeout to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setHasSetInitial(true);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [systemSettingsResponse, hasSetInitial, reset]);

  // Handle save and confirmation using the same UI flow as useSectionForm
  const saveWithConfirmation =
    useSaveWithConfirmation<SaveSystemSettingsPayload>({
      onSave: (data) => {
        return new Promise<void>((resolve, reject) => {
          saveSystemSettingsData(data, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      },
      successMessage: "System settings saved successfully",
      errorMessage: "Failed to save system settings",
      confirmTitle: "Save System Settings",
      confirmDescription:
        "Are you sure you want to save these system settings changes?",
    });

  // Attach context's save to RHF handleSubmit
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveSystemSettingsPayload);
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

  if (isLoading || !hasSetInitial || !systemSettingsResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {/* Left Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* System Settings Panel */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Settings
              </div>
            }
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
              <CommonFormSelect
                name="systemSettings.systemType"
                control={control}
                label="System Type"
                options={options?.systemTypeOptions || []}
                placeholder="Select System Type"
              />

              <CommonFormSelect
                name="systemSettings.mudSystem"
                control={control}
                label="Mud System"
                options={options?.mudSystemOptions || []}
                placeholder="Select Mud System"
              />

              <CommonFormSelect
                name="systemSettings.controlMode"
                control={control}
                label="Control Mode"
                options={options?.controlModeOptions || []}
                placeholder="Select Control Mode"
              />
              <CommonFormSelect
                name="systemSettings.exportCompatibility"
                control={control}
                label="Export Compatibility"
                options={options?.exportCompatibilityOptions || []}
                placeholder="Select Export Compatibility"
              />
              <CommonFormInput
                name="systemSettings.cursorDataRate"
                control={control}
                label="Cursor Data Rate"
                type="text"
                suffix="counts/sec"
                placeholder="Enter Cursor Data Rate"
              />

              <CommonFormSelect
                name="systemSettings.displayLanguage"
                control={control}
                label="Display Language"
                options={options?.displayLanguageOptions || []}
                placeholder="Select Display Language"
              />

              <CommonFormSelect
                name="systemSettings.quickLaunchGUI"
                control={control}
                label="Quick Launch GUI"
                options={options?.quickLaunchGUIOptions || []}
                placeholder="Select Quick Launch GUI"
              />
            </div>

            <hr className="my-5" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
              <div className="flex items-center">
                <CommonFormToggle
                  name="systemSettings.autoPresetRestoreTime"
                  control={control}
                  label="Auto Preset Restore"
                  containerClassName="w-auto"
                />
              </div>

              {autoPresetRestoreTime && (
                <>
                  <CommonFormSelect
                    name="systemSettings.restoreAfterHours"
                    control={control}
                    options={options?.restoreAfterHoursOptions || []}
                    containerClassName="mb-0"
                    placeholder="Select Hours"
                  />
                  <CommonFormSelect
                    name="systemSettings.presetToRestore"
                    control={control}
                    label="Preset to Restore"
                    options={options?.presetToRestoreOptions || []}
                    placeholder="Select Preset"
                  />
                </>
              )}
            </div>
          </PanelCard>

          {/* Alarm Settings Panel */}
          <PanelCard
            title="Alarm Settings"
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="space-y-3">
              {/* Row 1: Sound Volume and Alert Length */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
                <CommonFormSelect
                  name="alarmSettings.soundVolume"
                  control={control}
                  label="Sound Volume"
                  options={options?.soundVolumeOptions || []}
                  placeholder="Select Volume"
                />

                <CommonFormSelect
                  name="alarmSettings.alertLength"
                  control={control}
                  label="Alert Length"
                  options={options?.alertLengthOptions || []}
                  placeholder="Select Length"
                />
              </div>

              {/* Row 4: Surface Temp, HP Low, HP High */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 auto-rows-max">
                <CommonFormInput
                  name="alarmSettings.surfaceTempOffset"
                  control={control}
                  label="Surface Temp offset"
                  type="text"
                  containerClassName="mb-0"
                  placeholder="Enter Offset"
                />
                <CommonFormInput
                  name="alarmSettings.hpLow"
                  control={control}
                  label="HP Low"
                  type="text"
                  suffix="psi"
                  containerClassName="mb-0"
                  placeholder="Enter HP Low"
                />
                <CommonFormInput
                  name="alarmSettings.hpHigh"
                  control={control}
                  label="HP High"
                  type="text"
                  suffix="psi"
                  containerClassName="mb-0"
                  placeholder="Enter HP High"
                />
              </div>

              {/* Row 5: Bit Size and Email Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 auto-rows-max">
                <CommonFormInput
                  name="alarmSettings.bitSize"
                  control={control}
                  label="Bit Size"
                  type="text"
                  containerClassName="mb-0"
                  placeholder="Enter Bit Size"
                />

                <CommonFormSelect
                  name="alarmSettings.bitSizeStandard"
                  control={control}
                  options={options?.bitSizeStandardOptions || []}
                  containerClassName="mt-6"
                  placeholder="Select Standard"
                />

                <CommonFormInput
                  name="alarmSettings.bitSizePlus"
                  control={control}
                  type="text"
                  containerClassName="mt-8 mb-0"
                  placeholder="Enter Value"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
                <CommonFormSelect
                  name="alarmSettings.emailAlerts"
                  control={control}
                  label="Email Alerts"
                  options={options?.emailAlertsOptions || []}
                  containerClassName="mb-0"
                  placeholder="Select Email"
                />
                <CommonFormSelect
                  name="alarmSettings.emailAudity"
                  control={control}
                  options={options?.emailAudityOptions || []}
                  containerClassName="mt-6 mb-0"
                  placeholder="Select Audity"
                />
              </div>
            </div>

            <hr className="my-5" />

            {/* Row 2: Realtime Streaming */}
            <div
              className={`grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr] gap-3 items-center ${realtimeStreamingEnabled ? "mb-3" : "mb-5"} `}
            >
              <CommonFormToggle
                name="alarmSettings.realtimeStreamingEnabled"
                control={control}
                label="Realtime Streaming"
                containerClassName="w-auto"
              />

              {realtimeStreamingEnabled && (
                <>
                  <CommonFormSelect
                    name="alarmSettings.realtimeStreaming"
                    control={control}
                    options={options?.realtimeStreamingOptions || []}
                    placeholder="Select Realtime Streaming"
                  />

                  <CommonButton
                    type="button"
                    variant="outline"
                    className="mt-2"
                  >
                    Edit Test Alerts
                  </CommonButton>
                </>
              )}
            </div>

            {/* Row 3: Auto Mute and Capture Recirculation */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr] gap-3 items-center">
              <CommonFormToggle
                name="alarmSettings.autoMuteAlarms"
                control={control}
                label="Auto Mute Alarms for Sequence"
                containerClassName="w-auto"
              />

              {autoMuteAlarms && (
                <>
                  <CommonFormSelect
                    name="alarmSettings.captureRecirculation"
                    control={control}
                    options={options?.captureRecirculationOptions || []}
                    placeholder="Select Capture Settings"
                  />

                  <CommonFormInput
                    name="alarmSettings.captureRecirculation"
                    control={control}
                    type="text"
                    containerClassName="mt-2"
                    placeholder="Enter Recirculation Value"
                  />
                </>
              )}
            </div>
          </PanelCard>
        </div>

        {/* Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
          {/* Account & Security Panel */}
          <PanelCard
            title="Account & Security"
            headerAction={
              <CommonButton type="button" variant="outline">
                Set Permissions
              </CommonButton>
            }
          >
            <div className="space-y-4">
              {/* Row 1: Timeouts and Retrieve Decals */}
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3 items-center">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Timeouts</label>

                  <CommonFormSelect
                    name="accountSecurity.timeouts"
                    control={control}
                    options={options?.timeoutsOptions || []}
                    containerClassName="w-60"
                    placeholder="Select Timeout"
                  />
                </div>

                <CommonButton
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Restore Defaults
                </CommonButton>
              </div>

              {/* Row 2: User Login and Update Firewall */}
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3 items-center">
                <label className="text-sm font-medium">
                  User Login / Permissions
                </label>
                <CommonButton
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Update Firewall
                </CommonButton>
              </div>

              {/* Row 3: System Security and Always Backup */}
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3 items-center">
                <label className="text-sm font-medium">System Security</label>
                <CommonButton
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Always Backup
                </CommonButton>
              </div>

              {/* Row 4: Backup Database and Change Password */}
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3 items-center">
                <label className="text-sm font-medium">
                  Backup Database to Directory
                </label>
                <CommonButton
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Change Password
                </CommonButton>
              </div>
            </div>
          </PanelCard>

          {/* Schedule & Time Panel */}
          <PanelCard
            title="Schedule & Time"
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-3 items-center">
                <CommonFormToggle
                  name="scheduleTime.autoUTCSync"
                  control={control}
                  label="Auto UTC Sync"
                  containerClassName="w-auto"
                />

                {autoUTCSync && (
                  <>
                    <CommonFormInput
                      name="scheduleTime.syncTime"
                      control={control}
                      type="text"
                      containerClassName="mt-2"
                      placeholder="Enter Sync Time (e.g. 2a.55 n0.am)"
                    />
                    <CommonFormSelect
                      name="scheduleTime.clipTimeMode"
                      control={control}
                      options={options?.clipTimeModeOptions || []}
                      placeholder="Select Time Mode"
                    />
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-3 auto-rows-max">
                <CommonFormInput
                  name="scheduleTime.localTime"
                  control={control}
                  label="Local Time"
                  type="text"
                  containerClassName="mb-0"
                  placeholder="Enter Local Time"
                />

                <CommonFormSelect
                  name="scheduleTime.localTime"
                  control={control}
                  options={options?.localTimeFormatOptions || []}
                  containerClassName="mt-6"
                  placeholder="Select Format"
                />

                <CommonFormSelect
                  name="scheduleTime.localTime"
                  control={control}
                  options={options?.utcTimeOptions || []}
                  containerClassName="mt-6"
                  placeholder="Select Timezone"
                />
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
