// React & Hooks
import { useMemo, useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

// Third-party
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";

// Components - Common
import {
  CommonTable,
  CommonFormInput,
  CommonButton,
  RestoreDefaultsButton,
  CommonAlertDialog,
} from "@/components/shared";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Types & Schemas
import type { AlarmsFormValues } from "@/utils/schemas/alarms";

// Icons
import { Activity, Trash2, PlusCircle } from "lucide-react";

interface SensorsProps {
  control: Control<AlarmsFormValues>;
}

const sensorColumnHelper = createColumnHelper<AlarmsFormValues["sensors"][0]>();

export function Sensors({ control }: SensorsProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { fields, remove } = useFieldArray({
    control,
    name: "sensors",
  });

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
        cell: (info) => {
          const index = fields.findIndex((f) => f.id === info.row.original.id);
          return (
            <CommonFormInput
              name={`sensors.${index}.lowLimit`}
              control={control}
              containerClassName="h-8 w-24"
              className="h-8 w-24 text-center text-[12px]"
            />
          );
        },
      }),
      sensorColumnHelper.accessor("highLimit", {
        header: "High Limit",
        cell: (info) => {
          const index = fields.findIndex((f) => f.id === info.row.original.id);
          return (
            <CommonFormInput
              name={`sensors.${index}.highLimit`}
              control={control}
              containerClassName="h-8 w-24"
              className="h-8 w-24 text-center text-[12px]"
            />
          );
        },
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
                const index = fields.findIndex(
                  (f) => f.id === info.row.original.id
                );
                setSelectedIndex(index);
                setIsDeleteConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    [fields, control]
  );

  const sensorsTable = useReactTable({
    data: fields,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleDeleteSensor = () => {
    if (selectedIndex !== null) {
      remove(selectedIndex);
      setIsDeleteConfirmOpen(false);
      setSelectedIndex(null);
    }
  };

  const selectedSensorName = selectedIndex !== null ? fields[selectedIndex]?.name : "";

  return (
    <>
      <PanelCard
        title={
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
            <Activity className="h-4 w-4 text-primary" />
            Sensor Limit Settings
          </div>
        }
        headerAction={
          <div className="flex gap-2">
            <CommonButton variant="outline" icon={PlusCircle}>
              Add Custom Sensor
            </CommonButton>
            <RestoreDefaultsButton />
          </div>
        }
      >
        <CommonTable
          table={sensorsTable}
          showPagination={false}
          isLightTheme
        />
      </PanelCard>

      {/* Delete Confirmation */}
      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Sensor Limit?"
        description={`Are you sure you want to delete the sensor limit for "${selectedSensorName}"? This action cannot be undone.`}
        actionText="Delete"
        cancelText="Cancel"
        onAction={handleDeleteSensor}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </>
  );
}
