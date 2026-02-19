import { useState, useMemo } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Bell,
  Trash2,
  Activity,
  Zap,
  PlusCircle,
} from "lucide-react";
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
} from "@/components/common";
import { CommonAlertDialog } from "@/components/common/CommonAlertDialog";
import { PanelCard } from "@/components/dashboard/PanelCard";

type SensorLimit = {
  id: string;
  name: string;
  lowLimit: string;
  highLimit: string;
  unit: string;
};

const DEFAULT_SENSORS: SensorLimit[] = [
  {
    id: "1",
    name: "Pit Volume",
    lowLimit: "80",
    highLimit: "520",
    unit: "bbl",
  },
  { id: "2", name: "Flow Out", lowLimit: "300", highLimit: "800", unit: "gpm" },
  { id: "3", name: "Flow In", lowLimit: "300", highLimit: "800", unit: "gpm" },
  {
    id: "4",
    name: "Hook Load",
    lowLimit: "5,000",
    highLimit: "40,000",
    unit: "lbs",
  },
  {
    id: "5",
    name: "Weight on Bit",
    lowLimit: "5,000",
    highLimit: "30,000",
    unit: "lbs",
  },
  {
    id: "6",
    name: "Pump Pressure",
    lowLimit: "1,200",
    highLimit: "4,200",
    unit: "psi",
  },
  {
    id: "7",
    name: "Return Flow %",
    lowLimit: "50",
    highLimit: "105",
    unit: "%",
  },
];

const sensorColumnHelper = createColumnHelper<SensorLimit>();

export function Alarms() {
  const [activeTab, setActiveTab] = useState("kick");
  const [sensorsData, setSensorsData] = useState(DEFAULT_SENSORS);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorLimit | null>(
    null,
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
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
              setSensorsData((prev) =>
                prev.map((item) =>
                  item.id === info.row.original.id
                    ? { ...item, lowLimit: newValue }
                    : item,
                ),
              );
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
              setSensorsData((prev) =>
                prev.map((item) =>
                  item.id === info.row.original.id
                    ? { ...item, highLimit: newValue }
                    : item,
                ),
              );
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
    ],
    [],
  );

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
                  defaultChecked
                  label="Enable adjustable dynamic limits"
                  containerClassName="gap-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <CommonInput
                  label="Kick Limit (bbl)"
                  defaultValue="10"
                  type="number"
                />
                <CommonInput
                  label="Loss Limit (bbl)"
                  defaultValue="25"
                  type="number"
                />
                <CommonInput
                  label="Pit Gain Limit (bbl)"
                  defaultValue="15"
                  type="number"
                />
                <CommonInput
                  label="SPP High Limit (psi)"
                  defaultValue="4000"
                  type="number"
                />
                <CommonInput
                  label="PPP High Limit (psi)"
                  defaultValue="2500"
                  type="number"
                />
                <CommonInput
                  label="Pit Volume High Lim."
                  defaultValue="545"
                  type="number"
                />
                <CommonInput
                  label="Pit Volume High Lim. (bbl)"
                  defaultValue="545"
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
                    defaultChecked
                    label="Activate when gains / losses stop"
                  />
                  <CommonCheckbox
                    id="logic-sticky"
                    defaultChecked
                    label="Activate sticky alarms"
                  />
                  <CommonCheckbox
                    id="logic-secondary"
                    defaultChecked
                    label="Activate secondary alarms"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pb-2">
                  <CommonSelect
                    label="Delay (seconds)"
                    value="15"
                    options={[
                      { label: "10", value: "10" },
                      { label: "15", value: "15" },
                      { label: "20", value: "20" },
                    ]}
                    onValueChange={() => {}}
                  />

                  <CommonInput
                    label="Monitor duration (seconds)"
                    defaultValue="180"
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
                    defaultChecked
                    label="Activate offline alarm output when connections are down"
                  />
                  <CommonCheckbox
                    id="notify-online"
                    defaultChecked
                    label="Use rig online alarm output when connected"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CommonSelect
                    label="Kick Delay (sec)"
                    value="10"
                    options={[
                      { label: "10", value: "10" },
                      { label: "15", value: "15" },
                      { label: "20", value: "20" },
                    ]}
                    onValueChange={() => {}}
                  />
                  <CommonSelect
                    label="Loss Delay (sec)"
                    value="10"
                    options={[
                      { label: "10", value: "10" },
                      { label: "15", value: "15" },
                      { label: "20", value: "20" },
                    ]}
                    onValueChange={() => {}}
                  />

                  <CommonSelect
                    label="Offline Output"
                    value="audio"
                    options={[{ label: "Audio Alarm", value: "audio" }]}
                    onValueChange={() => {}}
                  />
                  <CommonSelect
                    label="Online Output"
                    value="kick-loss"
                    options={[{ label: "Kick and Loss", value: "kick-loss" }]}
                    onValueChange={() => {}}
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
              <>
                <div>
                  <CommonButton
                    variant="outline"
                    size="sm"
                    icon={PlusCircle}
                    className="h-9 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 mr-2"
                  >
                    Add Custom Sensor
                  </CommonButton>
                  <RestoreDefaultsButton size="sm" />
                </div>
              </>
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

      {/* Delete Confirmation */}
      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Sensor Limit?"
        description={`Are you sure you want to delete the sensor limit for "${selectedSensor?.name}"? This action cannot be undone.`}
        actionText="Delete"
        cancelText="Cancel"
        onAction={() => {
          if (selectedSensor) {
            setSensorsData((prev) =>
              prev.filter((item) => item.id !== selectedSensor.id),
            );
          }
          setIsDeleteConfirmOpen(false);
        }}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
