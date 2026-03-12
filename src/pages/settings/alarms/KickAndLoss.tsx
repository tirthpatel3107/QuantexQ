// React & Hooks
import { Control } from "react-hook-form";

// Components - Common
import {
  CommonFormInput,
  CommonFormSelect,
  CommonFormCheckbox,
  RestoreDefaultsButton,
} from "@/components/shared";
import type { CommonSelectOption } from "@/components/shared/CommonSelect";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Types & Schemas
import type { AlarmsFormValues } from "@/utils/schemas/alarms";

// Icons
import { Activity, Zap, Bell } from "lucide-react";

interface KickAndLossProps {
  control: Control<AlarmsFormValues>;
  options: Record<string, CommonSelectOption[]>;
}

export function KickAndLoss({ control, options }: KickAndLossProps) {
  return (
    <div className="space-y-4">
      <PanelCard
        title={
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
            <Activity className="h-4 w-4 text-primary" />
            Alarm Thresholds
          </div>
        }
        headerAction={<RestoreDefaultsButton />}
      >
        <div className="space-y-6">
          <div className="space-y-3 pb-3">
            <CommonFormCheckbox
              name="dynamicLimitsEnabled"
              control={control}
              label="Enable adjustable dynamic limits"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <CommonFormInput
              name="kickLimit"
              control={control}
              label="Kick Limit (bbl)"
              placeholder="0"
              type="number"
            />
            <CommonFormInput
              name="lossLimit"
              control={control}
              label="Loss Limit (bbl)"
              placeholder="0"
              type="number"
            />
            <CommonFormInput
              name="pitGainLimit"
              control={control}
              label="Pit Gain Limit (bbl)"
              placeholder="0"
              type="number"
            />
            <CommonFormInput
              name="sppHighLimit"
              control={control}
              label="SPP High Limit (psi)"
              placeholder="0"
              type="number"
            />
            <CommonFormInput
              name="pppHighLimit"
              control={control}
              label="PPP High Limit (psi)"
              placeholder="0"
              type="number"
            />
            <CommonFormInput
              name="pitVolumeHighLimit"
              control={control}
              label="Pit Volume High Lim."
              placeholder="0"
              type="number"
            />
            <CommonFormInput
              name="pitVolumeHighLimitBbl"
              control={control}
              label="Pit Volume High Lim. (bbl)"
              placeholder="0"
              type="number"
            />
          </div>
        </div>
      </PanelCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Alarm Logic */}
        <PanelCard
          title={
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
              <Zap className="h-4 w-4 text-primary" />
              Alarm Logic
            </div>
          }
          headerAction={<RestoreDefaultsButton />}
        >
          <div className="space-y-5">
            <div className="space-y-3 pb-3">
              <CommonFormCheckbox
                name="logicActivateWhenGainsStop"
                control={control}
                label="Activate when gains / losses stop"
              />
              <CommonFormCheckbox
                name="logicActivateStickyAlarms"
                control={control}
                label="Activate sticky alarms"
              />
              <CommonFormCheckbox
                name="logicActivateSecondaryAlarms"
                control={control}
                label="Activate secondary alarms"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2">
              <CommonFormSelect
                name="logicDelay"
                control={control}
                label="Delay (seconds)"
                options={options?.delayOptions || []}
              />

              <CommonFormInput
                name="logicMonitorDuration"
                control={control}
                label="Monitor duration (seconds)"
                placeholder="0"
                type="number"
              />
            </div>
          </div>
        </PanelCard>

        {/* Alarm Notifications */}
        <PanelCard
          title={
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
              <Bell className="h-4 w-4 text-primary" />
              Alarm Notifications
            </div>
          }
          headerAction={<RestoreDefaultsButton />}
        >
          <div className="space-y-5">
            <div className="space-y-3 pb-3">
              <CommonFormCheckbox
                name="notifyOfflineAlarm"
                control={control}
                label="Activate offline alarm output when connections are down"
              />
              <CommonFormCheckbox
                name="notifyOnlineAlarm"
                control={control}
                label="Use rig online alarm output when connected"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CommonFormSelect
                name="kickDelay"
                control={control}
                label="Kick Delay (sec)"
                options={options?.delayOptions || []}
              />
              <CommonFormSelect
                name="lossDelay"
                control={control}
                label="Loss Delay (sec)"
                options={options?.delayOptions || []}
              />

              <CommonFormSelect
                name="offlineOutput"
                control={control}
                label="Offline Output"
                options={options?.outputOptions || []}
              />
              <CommonFormSelect
                name="onlineOutput"
                control={control}
                label="Online Output"
                options={options?.alarmTypeOptions || []}
              />
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
