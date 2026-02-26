// React & Hooks
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { useSectionForm } from "@/shared/hooks/useSectionForm";

// Components - UI & Icons
import {
  Star,
  Plus,
  Settings,
  Upload,
  Download,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  CommonButton,
  CommonSelect,
  CommonSearchInput,
  CommonTable,
  CommonDialog,
  CommonInput,
  CommonDropdownMenu,
  SectionSkeleton,
  FormSaveDialog,
  CommonAlertDialog,
} from "@/shared/components";
import { cn } from "@/shared/utils/utils";
import { Checkbox } from "@/components/ui/checkbox";

// Services & Types
import {
  useSignalsSettings,
  useSaveSignalsSettings,
  useSignalsOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../../context/SettingsContext";

type Signal = {
  id: number;
  name: string;
  subsystem: string;
  inUse: boolean;
  unit: string;
  valueRange: string;
  isFavorite: boolean;
};

const signalColumnHelper = createColumnHelper<Signal>();

export function Signals() {
  const { data: signalsResponse, isLoading } = useSignalsSettings();
  const { data: optionsResponse } = useSignalsOptions();
  const { mutate: saveSignalsData } = useSaveSignalsSettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!signalsResponse?.data?.signals) return undefined;
    return { signals: signalsResponse.data.signals };
  }, [signalsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<{ signals: Signal[] }>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveSignalsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Signals settings saved successfully",
    errorMessage: "Failed to save signals settings",
    confirmTitle: "Save Signals Settings",
    confirmDescription: "Are you sure you want to save these signals changes?",
  });

  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [subsystemFilters, setSubsystemFilters] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isAddSignalModalOpen, setIsAddSignalModalOpen] = useState(false);
  const [isConfigureTagsModalOpen, setIsConfigureTagsModalOpen] =
    useState(false);
  const [isEditSignalModalOpen, setIsEditSignalModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const signals = form.formData?.signals || [];

  const toggleFavorite = (id: number) => {
    const updatedSignals = signals.map((signal) =>
      signal.id === id ? { ...signal, isFavorite: !signal.isFavorite } : signal,
    );
    form.updateLocalField({ signals: updatedSignals });
  };

  const toggleInUse = (id: number) => {
    const updatedSignals = signals.map((signal) =>
      signal.id === id ? { ...signal, inUse: !signal.inUse } : signal,
    );
    form.updateLocalField({ signals: updatedSignals });
  };

  const handleDeleteSignal = () => {
    if (selectedSignal) {
      const updatedSignals = signals.filter(
        (signal) => signal.id !== selectedSignal.id,
      );
      form.updateLocalField({ signals: updatedSignals });
      setIsDeleteConfirmOpen(false);
      setSelectedSignal(null);
    }
  };

  const columns = [
    signalColumnHelper.display({
      id: "favorite",
      header: "",
      size: 50,
      cell: (info) => (
        <button
          onClick={() => toggleFavorite(info.row.original.id)}
          className="p-1 hover:scale-110 transition-transform"
          title={
            info.row.original.isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Star
            className={cn(
              "h-4 w-4 transition-colors",
              info.row.original.isFavorite
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground hover:text-yellow-500",
            )}
          />
        </button>
      ),
    }),
    signalColumnHelper.accessor("name", {
      header: "Signal Name",
      size: 250,
      cell: (info) => (
        <span className="text-[13px] text-foreground/90">
          {info.getValue()}
        </span>
      ),
    }),
    signalColumnHelper.accessor("subsystem", {
      header: "Subsystem",
      size: 220,
      cell: (info) => (
        <span className="text-[13px] text-muted-foreground">
          {info.getValue()}
        </span>
      ),
    }),
    signalColumnHelper.accessor("inUse", {
      header: () => <div className="text-center">In Use</div>,
      size: 100,
      cell: (info) => (
        <Checkbox
          checked={info.getValue()}
          onCheckedChange={() => toggleInUse(info.row.original.id)}
          className="h-4 w-4"
        />
      ),
    }),
    signalColumnHelper.accessor("unit", {
      header: "Unit",
      size: 120,
      cell: (info) => (
        <span className="text-[13px] text-muted-foreground">
          {info.getValue() || "-"}
        </span>
      ),
    }),
    signalColumnHelper.accessor("valueRange", {
      header: () => <div className="text-center">Value Range</div>,
      size: 150,
      cell: (info) => (
        <span className="text-[13px] text-muted-foreground flex justify-start">
          {info.getValue() || "-"}
        </span>
      ),
    }),
    signalColumnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      size: 100,
      cell: (info) => (
        <div className="flex justify-end gap-1.5">
          <button
            className="p-1.5 rounded-md text-success/70 hover:text-success hover:bg-success/10 transition-all"
            title="Edit Signal"
            onClick={() => {
              setSelectedSignal(info.row.original);
              setIsEditSignalModalOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Delete Signal"
            onClick={() => {
              setSelectedSignal(info.row.original);
              setIsDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  const filteredData = signals.filter((s) => {
    // Search filter
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    // Type filter
    if (filterBy === "favorites" && !s.isFavorite) return false;
    if (filterBy === "inUse" && !s.inUse) return false;
    if (filterBy === "notInUse" && s.inUse) return false;

    // Subsystem filter
    if (subsystemFilters.length > 0 && !subsystemFilters.includes(s.subsystem))
      return false;

    return true;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalSignals = signals.length;
  const usedSignals = signals.filter((s) => s.inUse).length;

  const filterOptions = [
    { label: "All Signals", value: "all" },
    { label: "Favorites Only", value: "favorites" },
    { label: "In Use", value: "inUse" },
    { label: "Not In Use", value: "notInUse" },
  ];

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} className="p-4" />;
  }

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Top Bar with Search and Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <CommonSearchInput
              placeholder="Search signals..."
              value={search}
              onChange={setSearch}
              className="w-full sm:w-[400px]"
            />

            {/* Filter Dropdown */}
            <CommonDropdownMenu
              value={filterBy}
              onValueChange={(value) => setFilterBy(value as string)}
              options={filterOptions}
              triggerLabel={`${filterOptions.find((f) => f.value === filterBy)?.label}`}
              triggerIcon={Filter}
              menuLabel="Filter Signals"
              highlightActive={true}
              defaultValue="all"
              title="Filter Signals"
              contentWidth="w-[180px]"
              searchable={true}
              searchPlaceholder="Search filters..."
            />

            {/* Subsystem Filter (Multi-select) */}
            <CommonDropdownMenu
              value={subsystemFilters}
              onValueChange={(value) => setSubsystemFilters(value as string[])}
              options={options?.subsystemOptions || []}
              triggerLabel="Subsystems"
              triggerIcon={Filter}
              menuLabel="Filter by Subsystem"
              title="Filter by Subsystem"
              contentWidth="w-[240px]"
              searchable={true}
              searchPlaceholder="Search subsystems..."
              multiple={true}
              showBadges={true}
              showCount={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <CommonButton
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddSignalModalOpen(true)}
            >
              Add Signal
            </CommonButton>
            <CommonButton
              variant="outline"
              size="sm"
              icon={Settings}
              onClick={() => setIsConfigureTagsModalOpen(true)}
            >
              Configure Tags
            </CommonButton>
            <CommonButton variant="outline" size="sm" icon={Upload}>
              Import Tags
            </CommonButton>
            <CommonButton variant="outline" size="sm" icon={Download}>
              Export Tags
            </CommonButton>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between text-[13px] text-muted-foreground px-1">
          <div className="flex items-center gap-4">
            <span>
              Total Signals:{" "}
              <span className="font-semibold">{totalSignals}</span>
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span>
              Used: <span className="font-semibold">{usedSignals}</span>
            </span>
          </div>
        </div>

        {/* Table */}
        <CommonTable table={table} noDataMessage="No signals found." />

        {/* Add Signal Modal */}
        <CommonDialog
          open={isAddSignalModalOpen}
          onOpenChange={setIsAddSignalModalOpen}
          title="Add New Signal"
          description="Configure a new signal for monitoring and control."
          footer={
            <>
              <CommonButton
                variant="outline"
                size="sm"
                onClick={() => setIsAddSignalModalOpen(false)}
              >
                Cancel
              </CommonButton>
              <CommonButton
                size="sm"
                onClick={() => setIsAddSignalModalOpen(false)}
              >
                Add Signal
              </CommonButton>
            </>
          }
        >
          <div className="grid gap-4">
            <CommonInput
              label="Signal Name"
              id="signal-name"
              placeholder="Enter signal name"
            />
            <CommonSelect
              label="Subsystem"
              options={options?.subsystemOptions || []}
              value=""
              onValueChange={() => {}}
              placeholder="Select subsystem"
            />
            <CommonInput
              label="Unit"
              id="unit"
              placeholder="e.g., RPM, psi, %"
            />
            <CommonInput
              label="Value Range"
              id="value-range"
              placeholder="e.g., 0-2400"
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="add-in-use" defaultChecked={true} />
              <label
                htmlFor="add-in-use"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                In Use
              </label>
            </div>
          </div>
        </CommonDialog>

        {/* Configure Tags Modal */}
        <CommonDialog
          open={isConfigureTagsModalOpen}
          onOpenChange={setIsConfigureTagsModalOpen}
          title="Configure Tags"
          description="Manage signal tags and grouping configurations."
          footer={
            <>
              <CommonButton
                variant="outline"
                size="sm"
                onClick={() => setIsConfigureTagsModalOpen(false)}
              >
                Cancel
              </CommonButton>
              <CommonButton
                size="sm"
                onClick={() => setIsConfigureTagsModalOpen(false)}
              >
                Save Configuration
              </CommonButton>
            </>
          }
        >
          <div className="text-sm text-muted-foreground">
            Tag configuration interface will be implemented here.
          </div>
        </CommonDialog>

        {/* Edit Signal Modal */}
        <CommonDialog
          open={isEditSignalModalOpen}
          onOpenChange={setIsEditSignalModalOpen}
          title="Edit Signal"
          description={`Modify details for ${selectedSignal?.name}.`}
          footer={
            <>
              <CommonButton
                variant="outline"
                size="sm"
                onClick={() => setIsEditSignalModalOpen(false)}
              >
                Cancel
              </CommonButton>
              <CommonButton
                size="sm"
                onClick={() => setIsEditSignalModalOpen(false)}
              >
                Save Changes
              </CommonButton>
            </>
          }
        >
          <div className="grid gap-4">
            <CommonInput
              label="Signal Name"
              id="edit-signal-name"
              defaultValue={selectedSignal?.name}
              placeholder="Enter signal name"
            />
            <CommonSelect
              label="Subsystem"
              options={options?.subsystemOptions || []}
              value={selectedSignal?.subsystem || ""}
              onValueChange={() => {}}
              placeholder="Select subsystem"
            />
            <CommonInput
              label="Unit"
              id="edit-unit"
              defaultValue={selectedSignal?.unit}
              placeholder="e.g., RPM, psi, %"
            />
            <CommonInput
              label="Value Range"
              id="edit-value-range"
              defaultValue={selectedSignal?.valueRange}
              placeholder="e.g., 0-2400"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-in-use"
                defaultChecked={selectedSignal?.inUse}
              />
              <label
                htmlFor="edit-in-use"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                In Use
              </label>
            </div>
          </div>
        </CommonDialog>

        {/* Delete Confirmation */}
        <CommonAlertDialog
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          title="Delete Signal?"
          description={`Are you sure you want to delete "${selectedSignal?.name}"? This action cannot be undone and will remove all associated configurations.`}
          actionText="Delete"
          cancelText="Cancel"
          onAction={handleDeleteSignal}
          actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        />

        <FormSaveDialog form={form} />
      </div>
    </>
  );
}
