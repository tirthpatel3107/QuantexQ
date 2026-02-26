// React & Hooks
import { useState, useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useSectionForm } from "@/shared/hooks/useSectionForm";

// Components - UI & Icons
import { Bell, Trash2, Activity, Zap, PlusCircle } from "lucide-react";
import {
  CommonTable,
  CommonTabs,
  CommonTabsContent,
  CommonTabsNav,
  CommonInput,
  CommonSelect,
  CommonButton,
  RestoreDefaultsButton,
  CommonCheckbox,
  SectionSkeleton,
  FormSaveDialog,
  CommonAlertDialog,
} from "@/shared/components";
import { PanelCard } from "@/pages/Dashboard/components/PanelCard";

// Services & Types
import {
  useAlarmsSettings,
  useSaveAlarmsSettings,
  useAlarmsOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../../context/SettingsContext";

type SensorLimit = {
  id: string;
  name: string;
  lowLimit: string;
  highLimit: string;
  unit: string;
};

const sensorColumnHelper = createColumnHelper<SensorLimit>();

export function Alarms() {
  const { data: alarmsResponse, isLoading } = useAlarmsSettings();
  const { data: optionsResponse } = useAlarmsOptions();
  const { mutate: saveAlarmsData } = useSaveAlarmsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;
  const [activeTab, setActiveTab] = useState("kick");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorLimit | null>(
    null,
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!alarmsResponse?.data) return undefined;
    return alarmsResponse.data;
  }, [alarmsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<any>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveAlarmsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Alarms settings saved successfully",
    errorMessage: "Failed to save alarms settings",
    confirmTitle: "Save Alarms Settings",
    confirmDescription: "Are you sure you want to save these alarms changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { formData } = form;
  const sensorsData = formData.sensors || [];

  const columns = [
    sensorColumnHelper.accessor("name", {
      header: "Sensor Name",
      cell: (info) => (
        <span className="text-[13px] font-medium text-foreground/90">
          {info.getValue()}
        </span>
      ),
    }),
    sensorColumnHelper.accessor("lowLimit", {
      header: "Low Limit",
      cell: (info) => (
        <CommonInput
          value={info.getValue()}
          className="h-8 w-24 text-center text-[12px]"
          onChange={(e) => {
            const newValue = e.target.value;
            const updatedSensors = sensorsData.map((item: SensorLimit) =>
              item.id === info.row.original.id
                ? { ...item, lowLimit: newValue }
                : item,
            );
            form.updateLocalField({ sensors: updatedSensors });
          }}
        />
      ),
    }),
    sensorColumnHelper.accessor("highLimit", {
      header: "High Limit",
      cell: (info) => (
        <CommonInput
          value={info.getValue()}
          className="h-8 w-24 text-center text-[12px]"
          onChange={(e) => {
            const newValue = e.target.value;
            const updatedSensors = sensorsData.map((item: SensorLimit) =>
              item.id === info.row.original.id
                ? { ...item, highLimit: newValue }
                : item,
            );
            form.updateLocalField({ sensors: updatedSensors });
          }}
        />
      ),
    }),
    sensorColumnHelper.accessor("unit", {
      header: "Units",
      cell: (info) => (
        <span className="text-[12px] text-muted-foreground">
          {info.getValue()}
        </span>
      ),
    }),
    sensorColumnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <div className="flex justify-end pr-2">
          <button
            className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Delete Sensor"
            onClick={() => {
              setSelectedSensor(info.row.original);
              setIsDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  const sensorsTable = useReactTable({
    data: sensorsData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const tabs = [
    { value: "kick", label: "Kick and Loss" },
    { value: "sensors", label: "Sensors" },
  ];

  const handleDeleteSensor = () => {
    if (selectedSensor) {
      const updatedSensors = sensorsData.filter(
        (s: SensorLimit) => s.id !== selectedSensor.id,
      );
      form.updateLocalField({ sensors: updatedSensors });
      setIsDeleteConfirmOpen(false);
      setSelectedSensor(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CommonTabs value={activeTab} onValueChange={setActiveTab}>
        <CommonTabsNav items={tabs} />

        {/* Kick and Loss Tab */}
        <CommonTabsContent value="kick" className="space-y-4 ">
          <PanelCard
            title={
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                <Activity className="h-4 w-4 text-primary" />
                Alarm Thresholds
              </div>
            }
            headerAction={<RestoreDefaultsButton size="sm" />}
          >
            <div className="space-y-6">
              <div className="space-y-3 pb-5">
                <CommonCheckbox
                  id="dynamic-limits"
                  checked={formData.dynamicLimitsEnabled}
                  onCheckedChange={(checked) =>
                    form.updateLocalField({ dynamicLimitsEnabled: checked })
                  }
                  label="Enable adjustable dynamic limits"
                  containerClassName="gap-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <CommonInput
                  label="Kick Limit (bbl)"
                  value={formData.kickLimit}
                  onChange={(e) =>
                    form.updateLocalField({ kickLimit: e.target.value })
                  }
                  type="number"
                />
                <CommonInput
                  label="Loss Limit (bbl)"
                  value={formData.lossLimit}
                  onChange={(e) =>
                    form.updateLocalField({ lossLimit: e.target.value })
                  }
                  type="number"
                />
                <CommonInput
                  label="Pit Gain Limit (bbl)"
                  value={formData.pitGainLimit}
                  onChange={(e) =>
                    form.updateLocalField({ pitGainLimit: e.target.value })
                  }
                  type="number"
                />
                <CommonInput
                  label="SPP High Limit (psi)"
                  value={formData.sppHighLimit}
                  onChange={(e) =>
                    form.updateLocalField({ sppHighLimit: e.target.value })
                  }
                  type="number"
                />
                <CommonInput
                  label="PPP High Limit (psi)"
                  value={formData.pppHighLimit}
                  onChange={(e) =>
                    form.updateLocalField({ pppHighLimit: e.target.value })
                  }
                  type="number"
                />
                <CommonInput
                  label="Pit Volume High Lim."
                  value={formData.pitVolumeHighLimit}
                  onChange={(e) =>
                    form.updateLocalField({
                      pitVolumeHighLimit: e.target.value,
                    })
                  }
                  type="number"
                />
                <CommonInput
                  label="Pit Volume High Lim. (bbl)"
                  value={formData.pitVolumeHighLimitBbl}
                  onChange={(e) =>
                    form.updateLocalField({
                      pitVolumeHighLimitBbl: e.target.value,
                    })
                  }
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
              headerAction={<RestoreDefaultsButton size="sm" />}
            >
              <div className="space-y-5">
                <div className="space-y-3 pb-5">
                  <CommonCheckbox
                    id="logic-gains"
                    checked={formData.logicActivateWhenGainsStop}
                    onCheckedChange={(checked) =>
                      form.updateLocalField({
                        logicActivateWhenGainsStop: checked,
                      })
                    }
                    label="Activate when gains / losses stop"
                  />
                  <CommonCheckbox
                    id="logic-sticky"
                    checked={formData.logicActivateStickyAlarms}
                    onCheckedChange={(checked) =>
                      form.updateLocalField({
                        logicActivateStickyAlarms: checked,
                      })
                    }
                    label="Activate sticky alarms"
                  />
                  <CommonCheckbox
                    id="logic-secondary"
                    checked={formData.logicActivateSecondaryAlarms}
                    onCheckedChange={(checked) =>
                      form.updateLocalField({
                        logicActivateSecondaryAlarms: checked,
                      })
                    }
                    label="Activate secondary alarms"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pb-2">
                  <CommonSelect
                    label="Delay (seconds)"
                    value={formData.logicDelay}
                    options={options?.delayOptions || []}
                    onValueChange={(delay) =>
                      form.updateLocalField({ logicDelay: delay })
                    }
                  />

                  <CommonInput
                    label="Monitor duration (seconds)"
                    value={formData.logicMonitorDuration}
                    onChange={(e) =>
                      form.updateLocalField({
                        logicMonitorDuration: e.target.value,
                      })
                    }
                    type="number"
                    className="h-9"
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
              headerAction={<RestoreDefaultsButton size="sm" />}
            >
              <div className="space-y-5">
                <div className="space-y-3 pb-5">
                  <CommonCheckbox
                    id="notify-offline"
                    checked={formData.notifyOfflineAlarm}
                    onCheckedChange={(checked) =>
                      form.updateLocalField({ notifyOfflineAlarm: checked })
                    }
                    label="Activate offline alarm output when connections are down"
                  />
                  <CommonCheckbox
                    id="notify-online"
                    checked={formData.notifyOnlineAlarm}
                    onCheckedChange={(checked) =>
                      form.updateLocalField({ notifyOnlineAlarm: checked })
                    }
                    label="Use rig online alarm output when connected"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CommonSelect
                    label="Kick Delay (sec)"
                    value={formData.kickDelay}
                    options={options?.delayOptions || []}
                    onValueChange={(kickDelay) =>
                      form.updateLocalField({ kickDelay })
                    }
                  />
                  <CommonSelect
                    label="Loss Delay (sec)"
                    value={formData.lossDelay}
                    options={options?.delayOptions || []}
                    onValueChange={(lossDelay) =>
                      form.updateLocalField({ lossDelay })
                    }
                  />

                  <CommonSelect
                    label="Offline Output"
                    value={formData.offlineOutput}
                    options={options?.outputOptions || []}
                    onValueChange={(offlineOutput) =>
                      form.updateLocalField({ offlineOutput })
                    }
                  />
                  <CommonSelect
                    label="Online Output"
                    value={formData.onlineOutput}
                    options={options?.alarmTypeOptions || []}
                    onValueChange={(onlineOutput) =>
                      form.updateLocalField({ onlineOutput })
                    }
                  />
                </div>
              </div>
            </PanelCard>
          </div>
        </CommonTabsContent>

        {/* Sensors Tab */}
        <CommonTabsContent value="sensors" className="space-y-4">
          <PanelCard
            title={
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                <Activity className="h-4 w-4 text-primary" />
                Sensor Limit Settings
              </div>
            }
            headerAction={
              <div className="flex gap-2">
                <CommonButton variant="outline" size="sm" icon={PlusCircle}>
                  Add Custom Sensor
                </CommonButton>
                <RestoreDefaultsButton size="sm" />
              </div>
            }
          >
            <CommonTable
              table={sensorsTable}
              showPagination={false}
              isLightTheme
            />
          </PanelCard>
        </CommonTabsContent>
      </CommonTabs>

      <FormSaveDialog form={form} />

      {/* Delete Confirmation */}
      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Sensor Limit?"
        description={`Are you sure you want to delete the sensor limit for "${selectedSensor?.name}"? This action cannot be undone.`}
        actionText="Delete"
        cancelText="Cancel"
        onAction={handleDeleteSensor}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
