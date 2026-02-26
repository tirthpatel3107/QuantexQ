import { useState, useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonSelect,
  CommonInput,
  CommonButton,
  CommonToggle,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";
import { RestoreDefaultsButton } from "@/components/common/RestoreDefaultsButton";
import { Settings } from "lucide-react";
import {
  useSystemSettingsData,
  useSaveSystemSettingsData,
  useSystemSettingsOptions,
} from "@/services/api/daq/daq.api";
import type { SaveSystemSettingsPayload } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../DAQContext";

export function SystemSettings() {
  const { data: systemSettingsResponse, isLoading } = useSystemSettingsData();
  const { data: optionsResponse } = useSystemSettingsOptions();
  const { mutate: saveSystemSettingsData } = useSaveSystemSettingsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  const initialData = useMemo(() => {
    if (!systemSettingsResponse?.data) return undefined;
    const { daqPreset, controlMode, hardwareConfig } =
      systemSettingsResponse.data;
    return { daqPreset, controlMode, hardwareConfig };
  }, [systemSettingsResponse?.data]);

  const form = useSectionForm<SaveSystemSettingsPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveSystemSettingsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "System settings saved successfully",
    errorMessage: "Failed to save system settings",
    confirmTitle: "Save System Settings",
    confirmDescription:
      "Are you sure you want to save these system settings changes?",
  });

  // System Settings state
  const [systemType, setSystemType] = useState("MPD");
  const [mudSystem, setMudSystem] = useState("OBM");
  const [controlMode, setControlMode] = useState("Manual");
  const [autoPresetRestore, setAutoPresetRestore] = useState(false);
  const [presetToRestore, setPresetToRestore] = useState("Master.deGas");
  const [exportCompatibility, setExportCompatibility] =
    useState("Compute Format");
  const [cursorDataRate, setCursorDataRate] = useState("12");
  const [displayLanguage, setDisplayLanguage] = useState("English");
  const [quickLaunchGUI, setQuickLaunchGUI] = useState("Summary");
  const [autoPresetRestoreTime, setAutoPresetRestoreTime] = useState(false);
  const [restoreAfterHours, setRestoreAfterHours] = useState("15");

  // Alarm Settings state
  const [soundVolume, setSoundVolume] = useState("Medium");
  const [alertLength, setAlertLength] = useState("3 sec");
  const [realtimeStreaming, setRealtimeStreaming] = useState("ON");
  const [autoMuteAlarms, setAutoMuteAlarms] = useState(false);
  const [captureRecirculation, setCaptureRecirculation] = useState("12/DT");
  const [surfaceTempOffset, setSurfaceTempOffset] = useState("T1");
  const [hpLow, setHpLow] = useState("1000");
  const [hpHigh, setHpHigh] = useState("2500");
  const [bitSize, setBitSize] = useState("20/11");
  const [bitSizeStandard, setBitSizeStandard] = useState("Standard");
  const [bitSizePlus, setBitSizePlus] = useState("+5°F");
  const [emailAlerts, setEmailAlerts] = useState("nfq-21@quantexq.com");
  const [emailAudity, setEmailAudity] = useState("Audity");

  // Account & Security state
  const [timeouts, setTimeouts] = useState("45min");
  const [systemSecurity, setSystemSecurity] = useState("Always Backup");
  const [backupDirectory, setBackupDirectory] = useState("");

  // Schedule & Time state
  const [autoUTCSync, setAutoUTCSync] = useState(false);
  const [localTime, setLocalTime] = useState("06 Feb 2026 / 16:37");

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { daqPreset, hardwareConfig } = form.formData;

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {/* Left Column */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {/* System Settings Panel */}
          <PanelCard
            title={
              <>
                <Settings className="h-4 w-4" />
                System Settings
              </>
            }
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
              <CommonSelect
                label="System Type"
                options={options?.systemTypeOptions || []}
                value={systemType}
                onValueChange={setSystemType}
              />

              <CommonSelect
                label="Mud System"
                options={options?.mudSystemOptions || []}
                value={mudSystem}
                onValueChange={setMudSystem}
              />

              <CommonSelect
                label="Control Mode"
                options={options?.controlModeOptions || []}
                value={controlMode}
                onValueChange={setControlMode}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
              <CommonToggle
                label="Auto Preset Restore"
                checked={autoPresetRestore}
                onCheckedChange={setAutoPresetRestore}
                className="py-5 pb-10"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
              <CommonSelect
                label="Preset to Restore"
                options={[
                  { label: "Master.deGas", value: "Master.deGas" },
                  { label: "Default", value: "Default" },
                  { label: "Custom", value: "Custom" },
                ]}
                value={presetToRestore}
                onValueChange={setPresetToRestore}
              />

              <CommonSelect
                label="Export Compatibility"
                options={[
                  { label: "Compute Format", value: "Compute Format" },
                  { label: "Legacy Format", value: "Legacy Format" },
                ]}
                value={exportCompatibility}
                onValueChange={setExportCompatibility}
              />

              <CommonInput
                label="Cursor Data Rate"
                value={cursorDataRate}
                onChange={(e) => setCursorDataRate(e.target.value)}
                suffix="counts/sec"
              />

              <CommonSelect
                label="Display Language"
                options={[
                  { label: "English", value: "English" },
                  { label: "Spanish", value: "Spanish" },
                  { label: "French", value: "French" },
                ]}
                value={displayLanguage}
                onValueChange={setDisplayLanguage}
              />

              <CommonSelect
                label="Quick Launch GUI"
                options={[
                  { label: "Summary", value: "Summary" },
                  { label: "Dashboard", value: "Dashboard" },
                  { label: "Detailed", value: "Detailed" },
                ]}
                value={quickLaunchGUI}
                onValueChange={setQuickLaunchGUI}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
              <CommonToggle
                label="Auto Preset Restore:"
                checked={autoPresetRestoreTime}
                onCheckedChange={setAutoPresetRestoreTime}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max mt-3">
                <CommonInput
                  value={restoreAfterHours}
                  onChange={(e) => setRestoreAfterHours(e.target.value)}
                  suffix="after"
                  className="mb-0"
                />
                <CommonInput value="15 hours" readOnly className="mb-0" />
              </div>
            </div>
          </PanelCard>

          {/* Alarm Settings Panel */}
          <PanelCard
            title="Alarm Settings"
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="space-y-1">
              {/* Row 1: Sound Volume and Alert Length */}
              <div className="grid grid-cols-2 gap-3">
                <CommonSelect
                  label="Sound Volume"
                  options={[
                    { label: "Low", value: "Low" },
                    { label: "Medium", value: "Medium" },
                    { label: "High", value: "High" },
                  ]}
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                />

                <CommonSelect
                  label="Alert Length"
                  options={[
                    { label: "1 sec", value: "1 sec" },
                    { label: "3 sec", value: "3 sec" },
                    { label: "5 sec", value: "5 sec" },
                  ]}
                  value={alertLength}
                  onValueChange={setAlertLength}
                />
              </div>

              {/* Row 2: Realtime Streaming */}
              <div className="mb-5">
                <label className="text-sm font-medium mb-2 block ml-[3px]">
                  Realtime Streaming:
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <CommonSelect
                      options={[
                        { label: "ON", value: "ON" },
                        { label: "OFF", value: "OFF" },
                      ]}
                      value={realtimeStreaming}
                      onValueChange={setRealtimeStreaming}
                      className="mb-0"
                    />
                  </div>
                  <div className="flex-1">
                    <CommonSelect
                      options={[
                        {
                          label: "DAQ-Notifications, Log Analysis",
                          value: "DAQ-Notifications, Log Analysis",
                        },
                      ]}
                      value="DAQ-Notifications, Log Analysis"
                      onValueChange={() => {}}
                      className="mb-0"
                    />
                  </div>
                  <CommonButton variant="outline" size="sm">
                    Edit Test Alerts
                  </CommonButton>
                </div>
              </div>

              {/* Row 3: Auto Mute and Capture Recirculation */}
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <CommonToggle
                      label="Auto Mute Alarms for Sequence:"
                      checked={autoMuteAlarms}
                      onCheckedChange={setAutoMuteAlarms}
                    />
                  </div>
                  <div className="w-56">
                    <CommonSelect
                      options={[
                        {
                          label: "Capture Recirculation",
                          value: "Capture Recirculation",
                        },
                      ]}
                      value="Capture Recirculation"
                      onValueChange={() => {}}
                      className="mb-0"
                    />
                  </div>
                  <div className="w-24">
                    <CommonInput
                      value={captureRecirculation}
                      onChange={(e) => setCaptureRecirculation(e.target.value)}
                      className="mb-0"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Surface Temp, HP Low, HP High */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <CommonInput
                  label="Surface Temp offset:"
                  value={surfaceTempOffset}
                  onChange={(e) => setSurfaceTempOffset(e.target.value)}
                  className="mb-0"
                />
                <CommonInput
                  label="HP Low"
                  value={hpLow}
                  onChange={(e) => setHpLow(e.target.value)}
                  suffix="psi"
                  className="mb-0"
                />
                <CommonInput
                  label="HP High"
                  value={hpHigh}
                  onChange={(e) => setHpHigh(e.target.value)}
                  suffix="psi"
                  className="mb-0"
                />
              </div>

              {/* Row 5: Bit Size and Email Alerts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 auto-rows-max">
                <CommonInput
                  label="Bit Size:"
                  value={bitSize}
                  onChange={(e) => setBitSize(e.target.value)}
                  className="mb-0"
                />

                <CommonSelect
                  options={[
                    { label: "Standard", value: "Standard" },
                    { label: "+5°F", value: "+5°F" },
                    { label: "+5°E", value: "+5°E" },
                  ]}
                  value={bitSizeStandard}
                  onValueChange={setBitSizeStandard}
                  className="mb-0"
                />

                <CommonInput
                  value={bitSizePlus}
                  onChange={(e) => setBitSizePlus(e.target.value)}
                  className="mb-0"
                />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
                <CommonInput
                  label="Email Alerts:"
                  value={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.value)}
                  className="mb-0"
                />
                <CommonInput
                  value={emailAudity}
                  onChange={(e) => setEmailAudity(e.target.value)}
                  className="mb-0 mt-8"
                />
              </div>
            </div>
          </PanelCard>
        </div>

        {/* Right Column */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
          {/* Account & Security Panel */}
          <PanelCard
            title="Account & Security"
            headerAction={
              <CommonButton variant="outline" size="sm">
                Set Permissions
              </CommonButton>
            }
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1">
                  <CommonSelect
                    label="Timeouts:"
                    options={[
                      { label: "15min", value: "15min" },
                      { label: "30min", value: "30min" },
                      { label: "45min", value: "45min" },
                      { label: "60min", value: "60min" },
                    ]}
                    value={timeouts}
                    onValueChange={setTimeouts}
                    className="mb-0"
                  />
                </div>
                <CommonButton variant="outline" size="sm" className="mt-7">
                  Retrieve Decals
                </CommonButton>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1">
                  <CommonButton variant="outline" className="w-full">
                    User Login / Permissions
                  </CommonButton>
                </div>
                <CommonButton variant="outline">Update Firewall</CommonButton>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1">
                  <CommonSelect
                    label="System Security:"
                    options={[
                      { label: "Always Backup", value: "Always Backup" },
                      { label: "Manual Backup", value: "Manual Backup" },
                    ]}
                    value={systemSecurity}
                    onValueChange={setSystemSecurity}
                    className="mb-0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1">
                  <CommonInput
                    label="Backup Database to Directory"
                    value={backupDirectory}
                    onChange={(e) => setBackupDirectory(e.target.value)}
                    placeholder="Select directory..."
                    className="mb-0"
                  />
                </div>
                <CommonButton variant="outline" size="sm" className="mt-7">
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
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1">
                  <CommonToggle
                    label="Auto UTC Sync:"
                    checked={autoUTCSync}
                    onCheckedChange={setAutoUTCSync}
                  />
                </div>
                <CommonButton variant="outline" size="sm">
                  Remain
                </CommonButton>
                <CommonButton variant="outline" size="sm">
                  Clip Time Tumult
                </CommonButton>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1">
                  <CommonInput
                    label="Local Time:"
                    value={localTime}
                    onChange={(e) => setLocalTime(e.target.value)}
                    className="mb-0"
                  />
                </div>
                <div className="w-40 mt-7">
                  <CommonSelect
                    options={[
                      { label: "24-Hour format", value: "24-Hour format" },
                      { label: "12-Hour format", value: "12-Hour format" },
                    ]}
                    value="24-Hour format"
                    onValueChange={() => {}}
                    className="mb-0"
                  />
                </div>
                <div className="w-32 mt-7">
                  <CommonInput value="UTC 0:00" readOnly className="mb-0" />
                </div>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
