// React & Hooks
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components – UI & Icons
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonButton,
  CommonFormToggle,
  CommonFormCheckbox,
  CommonFormSelect,
  SectionSkeleton,
  FormSaveDialog,
  CommonToast,
} from "@/components/common";
import { Volume2, Play, Bell } from "lucide-react";
import { cn } from "@/utils/lib/utils";

// Services & Types
import {
  useNotificationsData,
  useSaveNotificationsData,
  useNotificationsOptions,
} from "@/services/api/daq/daq.api";
import type {
  SaveNotificationsPayload,
  NotificationLogEntry,
  NotificationsSettingsSummary,
  NotificationsStore,
} from "@/services/api/daq/daq.types";

// Context
import { useDAQContext } from "@/context/daq";

// ============================================
// Zod Schema
// ============================================

const notificationsFormSchema = z.object({
  settings: z.object({
    alarmSound: z.string().min(1, "Alarm sound is required"),
    alarmNotifications: z.boolean(),
    acceptableWrns: z.boolean(),
    acceptableCmpncs: z.boolean(),
    validityCompletion: z.boolean(),
  }),
  store: z.object({
    remindOnReset: z.boolean(),
    selfDismissing: z.boolean(),
    unusetComplessible: z.boolean(),
    enableNewAlarm: z.boolean(),
    alarmClearDiagnostics: z.boolean(),
    inboundRate: z.boolean(),
  }),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// ============================================
// Helpers
// ============================================

const getTypeIcon = (type: string) => {
  switch (type) {
    case "high":
      return "!!";
    case "medium":
      return "!!";
    case "low":
      return "i";
    default:
      return "i";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "medium":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "low":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getSeverityColor = (severity: string) => {
  const upper = severity.toUpperCase();
  if (upper.includes("HIGH") || upper.includes("ALARM"))
    return "bg-red-500/10 text-red-500 border border-red-500/20";
  if (upper.includes("DIAG") || upper.includes("SLOW"))
    return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  if (upper.includes("NEEDED") || upper.includes("SWS"))
    return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
};

// ============================================
// Component
// ============================================

export function Notifications() {
  const { data: notificationsResponse, isLoading } = useNotificationsData();
  const { data: optionsResponse } = useNotificationsOptions();
  const { mutate: saveNotificationsData } = useSaveNotificationsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = optionsResponse?.data;

  // React Hook Form
  const formMethods = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // Track if we have set initial data
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // Notification log entries (read-only from API, not saved)
  const [logEntries, setLogEntries] = useState<NotificationLogEntry[]>([]);

  useEffect(() => {
    if (notificationsResponse?.data && !hasSetInitial) {
      const { settings, store, log } = notificationsResponse.data;
      reset({ settings, store });
      // Use timeouts to avoid direct setState in effect
      const timeoutId1 = setTimeout(() => {
        setLogEntries(log);
      }, 0);
      const timeoutId2 = setTimeout(() => {
        setHasSetInitial(true);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }
  }, [notificationsResponse, hasSetInitial, reset]);

  // Handle save and confirmation using the same UI flow as useSectionForm
  const saveWithConfirmation =
    useSaveWithConfirmation<SaveNotificationsPayload>({
      onSave: (data) => {
        return new Promise<void>((resolve, reject) => {
          saveNotificationsData(data, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      },
      successMessage: "Notifications settings saved successfully",
      errorMessage: "Failed to save notifications settings",
      confirmTitle: "Save Notifications Settings",
      confirmDescription:
        "Are you sure you want to save these notifications changes?",
    });

  // Attach context's save to RHF handleSubmit
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      // Build the save payload from the validated form data
      const payload: SaveNotificationsPayload = {
        settings: validData.settings as NotificationsSettingsSummary,
        store: validData.store as NotificationsStore,
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

  const handleTestSound = () => {
    const sound = formMethods.getValues("settings.alarmSound");
    CommonToast.info(`Testing alarm sound: ${sound}`);
  };

  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Settings & Summary Panel */}
          <PanelCard title="Settings & Summary">
            <div className="space-y-4">
              {/* Alarm Sound */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Alarm sound</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <CommonFormSelect
                      name="settings.alarmSound"
                      control={control}
                      options={options?.alarmSoundOptions || []}
                      placeholder="Select alarm sound"
                    />
                  </div>
                  <CommonButton
                    variant="outline"
                    className="px-4 mt-2"
                    icon={Play}
                    onClick={handleTestSound}
                  >
                    Test
                  </CommonButton>
                </div>
              </div>

              {/* Alarm Notifications */}
              <div className="space-y-3 pt-4">
                <CommonFormToggle
                  id="alarm-notifications"
                  label="Alarm Notifications"
                  name="settings.alarmNotifications"
                  control={control}
                />

                <CommonFormToggle
                  id="acceptable-wrns"
                  label="Acceptable Wrns"
                  name="settings.acceptableWrns"
                  control={control}
                />

                <CommonFormToggle
                  id="acceptable-cmpncs"
                  label="Acceptable Cmpncs"
                  name="settings.acceptableCmpncs"
                  control={control}
                />

                <CommonFormToggle
                  id="validity-completion"
                  label="Validity Completion"
                  name="settings.validityCompletion"
                  control={control}
                />
              </div>
            </div>
          </PanelCard>

          {/* Notificating Store Panel */}
          <PanelCard title="Notificating Store">
            <div className="space-y-3">
              <CommonFormCheckbox
                id="remind-reset"
                label="Remind on reset"
                name="store.remindOnReset"
                control={control}
              />

              <CommonFormCheckbox
                id="self-dismissing"
                label="Self-dismissing alarms"
                name="store.selfDismissing"
                control={control}
              />

              <CommonFormCheckbox
                id="unuset-complessible"
                label="Unusetcomplessible"
                name="store.unusetComplessible"
                control={control}
              />

              <CommonFormToggle
                id="enable-new-alarm"
                label="Enable (new alarm principle)"
                name="store.enableNewAlarm"
                control={control}
                className="pt-3"
              />

              <CommonFormToggle
                id="alarm-clear"
                label="Alarm clear diagnostics"
                name="store.alarmClearDiagnostics"
                control={control}
              />

              <CommonFormToggle
                id="inbound-rate"
                label="inbound rate"
                name="store.inboundRate"
                control={control}
              />
            </div>
          </PanelCard>
        </div>

        {/* Notification Log Panel */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Log
            </div>
          }
          headerAction={
            <div className="flex items-center gap-2">
              <CommonButton variant="outline" size="sm">
                Edit Severity &amp; Filter
              </CommonButton>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Past 15 minutes:</span>
              <CommonButton
                variant="link"
                size="sm"
                className="h-auto p-0 text-sm"
              >
                Cleared History
              </CommonButton>
            </div>

            {/* Log Table Header */}
            <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground pb-2 border-b border-border/50">
              <div className="col-span-3">Mention/Email</div>
              <div className="col-span-5">Message</div>
              <div className="col-span-3">Severity</div>
              <div className="col-span-1"></div>
            </div>

            {/* Log Entries */}
            <div className="space-y-2">
              {logEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-12 gap-3 items-center py-2 hover:bg-accent/50 rounded transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded flex items-center justify-center text-sm font-bold border",
                        getTypeColor(entry.type),
                      )}
                    >
                      {getTypeIcon(entry.type)}
                    </div>
                    <span className="text-sm truncate">{entry.mention}</span>
                  </div>
                  <div className="col-span-5">
                    <span className="text-sm">{entry.message}</span>
                  </div>
                  <div className="col-span-3">
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded text-sm font-medium",
                        getSeverityColor(entry.severity),
                      )}
                    >
                      {entry.severity}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <span className="text-sm text-emerald-400 font-medium">
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <CommonButton variant="outline" size="sm">
                Clear Alerts History
              </CommonButton>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* FormSaveDialog needs the shape returned by useSaveWithConfirmation */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
