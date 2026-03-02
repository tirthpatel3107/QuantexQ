// React & Hooks
import { useState, useEffect, useMemo, Fragment } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonButton,
  CommonFormCheckbox,
  CommonFormSelect,
  CommonFormInput,
  CommonCheckbox,
} from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/lib/utils";

// Icons
import { Search, Settings } from "lucide-react";

// Chart
import ReactECharts from "echarts-for-react";

// Services & Types
import {
  useCalibrationData,
  useSaveCalibrationData,
} from "@/services/api/daq/daq.api";
import type { SaveCalibrationPayload } from "@/services/api/daq/daq.types";

// Context
import { useDAQContext } from "@/context/DAQ/DAQContext";

// ============================================
// Zod Schema
// ============================================

export const calibrationFormSchema = z.object({
  onPermissions: z.string().min(1, "Permission type is required"),
  applyType: z.enum(["auto", "manual", "acmPerms"]),
  weightOnBit: z.enum(["auto", "manual", "own"]),
  permissions: z.array(
    z.object({
      sensor: z.string(),
      depth: z.boolean(),
      primary: z.boolean(),
      secondary: z.boolean(),
      validation: z.string(),
      comments: z.string(),
    }),
  ),
  defaultPermissions: z.array(
    z.object({
      name: z.string(),
      auto: z.boolean(),
    }),
  ),
  senectoPermissions: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      enabled: z.boolean(),
      hydrations: z.boolean(),
      edits: z.coerce.number().min(0, "Must be at least 0").max(1, "Must be at most 1"),
      hasSelectType: z.boolean(),
    }),
  ).refine((items) => items.every((item) => item.edits !== null && item.edits !== undefined), {
    message: "All edits fields are required",
  }),
  sensorPermissionsOk: z.boolean(),
  validateAll: z.boolean(),
});

type CalibrationFormValues = z.infer<typeof calibrationFormSchema>;

// ============================================
// Dropdown options (static, can be fetched from API later)
// ============================================

const ON_PERMISSIONS_OPTIONS = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
  { label: "Both", value: "Both" },
];

const APPLY_TYPE_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Manual", value: "manual" },
  { label: "Acm Perms", value: "acmPerms" },
];

const WEIGHT_ON_BIT_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Manual", value: "manual" },
  { label: "Own", value: "own" },
];

// ============================================
// Component
// ============================================

export function Calibration() {
  const [searchQuery, setSearchQuery] = useState("");

  // API Hooks
  const { data: calibrationResponse, isLoading } = useCalibrationData();
  const { mutate: saveCalibrationData } = useSaveCalibrationData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  // Initialize form (no defaultValues — populated from API via reset)
  const formMethods = useForm<CalibrationFormValues>({
    resolver: zodResolver(calibrationFormSchema),
  });

  const { reset, control, handleSubmit, watch } = formMethods;

  // Track initial data hydration (prevents re-reset on re-renders)
  const [hasSetInitial, setHasSetInitial] = useState(false);

  useEffect(() => {
    if (calibrationResponse?.data && !hasSetInitial) {
      const {
        onPermissions,
        applyType,
        weightOnBit,
        permissions,
        defaultPermissions,
        senectoPermissions,
        sensorPermissionsOk,
        validateAll,
      } = calibrationResponse.data;

      reset({
        onPermissions,
        applyType: applyType as CalibrationFormValues["applyType"],
        weightOnBit: weightOnBit as CalibrationFormValues["weightOnBit"],
        permissions,
        defaultPermissions,
        senectoPermissions,
        sensorPermissionsOk,
        validateAll,
      });
      setHasSetInitial(true);
    }
  }, [calibrationResponse, hasSetInitial, reset]);

  // Save flow with confirmation dialog
  const saveWithConfirmation = useSaveWithConfirmation<SaveCalibrationPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveCalibrationData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Sensor permissions saved successfully",
    errorMessage: "Failed to save sensor permissions",
    confirmTitle: "Save Sensor Permissions",
    confirmDescription:
      "Are you sure you want to save these permission changes?",
  });

  // Register save handler with DAQ context so the top-bar Save button works
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveCalibrationPayload);
    });

    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [handleSubmit, registerSaveHandler, unregisterSaveHandler, saveWithConfirmation]);

  // Filtered permission rows for the sensor table
  const permissions = watch("permissions");
  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    if (!searchQuery) return permissions;
    return permissions.filter((p) =>
      p.sensor.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [permissions, searchQuery]);

  // Chart data from API response (read-only, not in form)
  const chartData = calibrationResponse?.data?.chartData ?? [];

  const chartOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 15, 20, 0.95)",
        borderColor: "rgba(255,255,255,0.1)",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: (params: { name: string; value: number }[]) => {
          const p = params[0];
          return `<div style="font-weight:600">${p.name}</div><div>AAVM PREM REF (%): <b>${p.value}</b> psi</div>`;
        },
      },
      grid: { left: 50, right: 16, top: 16, bottom: 40 },
      xAxis: {
        type: "category" as const,
        data: chartData.map((d) => d.label),
        axisLabel: { color: "#64748b", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value" as const,
        axisLabel: { color: "#64748b", fontSize: 11 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      },
      series: [
        {
          type: "line",
          data: chartData.map((d) => d.value),
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { color: "rgb(59,130,246)", width: 2 },
          itemStyle: { color: "rgb(59,130,246)" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(59,130,246,0.25)" },
                { offset: 1, color: "rgba(59,130,246,0)" },
              ],
            },
          },
        },
      ],
    }),
    [chartData],
  );

  // ── Loading guard ─────────────────────────────────────────────────────────
  if (isLoading || !hasSetInitial || !calibrationResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {/* ── Top Section: Permissions Assignment + Sensor Permissions Table ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3">
          {/* Left Panel – Permissions Assignment */}
          <PanelCard title="Permissions Assignment">
            <div className="space-y-6">
              {/* Search & Assign */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Settings"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <CommonButton variant="outline">
                  Assign Permissions
                </CommonButton>
              </div>

              {/* ON PERMISSIONS dropdown */}
              <CommonFormSelect
                name="onPermissions"
                control={control}
                label="ON PERMISSIONS"
                options={ON_PERMISSIONS_OPTIONS}
                placeholder="Select permission type"
              />

              {/* APPLY TYPE + WEIGHT ON BIT */}
              <div className="grid grid-cols-2 gap-3">
                <CommonFormSelect
                  name="applyType"
                  control={control}
                  label="APPLY TYPE"
                  options={APPLY_TYPE_OPTIONS}
                  placeholder="Select apply type"
                />
                <CommonFormSelect
                  name="weightOnBit"
                  control={control}
                  label="WEIGHT ON BIT"
                  options={WEIGHT_ON_BIT_OPTIONS}
                  placeholder="Select weight on bit"
                />
              </div>

              {/* Add Sensor */}
              <CommonButton variant="outline" className="w-full">
                Add Sensor
              </CommonButton>

              {/* Default Permissions Lists */}
              <div className="space-y-2">
                <Label className="ml-[3px]">Default Permissions Lists</Label>
                <div className="space-y-2">
                  {(watch("defaultPermissions") ?? []).map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded"
                    >
                      <span className="text-sm">{item.name}</span>
                      <CommonFormCheckbox
                        name={`defaultPermissions.${index}.auto`}
                        control={control}
                        label="Auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Right Panel – Sensor Permissions Table */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Sensor Permissions</span>
              </div>
            }
            headerAction={
              <CommonButton variant="ghost" size="sm">
                Filter Glint
              </CommonButton>
            }
          >
            <div className="space-y-4">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Depth", "Primary", "Secondary", "Validation", "Comments"].map(
                        (col) => (
                          <th
                            key={col}
                            className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermissions.map((permission, idx) => {
                      // Find real index in the full permissions array for correct form path
                      const realIndex = (permissions ?? []).findIndex(
                        (p) => p.sensor === permission.sensor,
                      );
                      const i = realIndex >= 0 ? realIndex : idx;

                      // Watch the depth checkbox value for this row
                      const isDepthChecked = watch(`permissions.${i}.depth`);

                      return (
                        <tr
                          key={permission.sensor}
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                        >
                          {/* Depth column – also shows sensor name */}
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <Controller
                                name={`permissions.${i}.depth`}
                                control={control}
                                render={({ field }) => (
                                  <CommonCheckbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked);
                                      // If depth is unchecked, also uncheck primary and secondary
                                      if (!checked) {
                                        formMethods.setValue(`permissions.${i}.primary`, false);
                                        formMethods.setValue(`permissions.${i}.secondary`, false);
                                      }
                                    }}
                                  />
                                )}
                              />
                              <span className="text-sm">{permission.sensor}</span>
                            </div>
                          </td>

                          {/* Primary */}
                          <td className="py-3 px-2">
                            <CommonFormCheckbox
                              name={`permissions.${i}.primary`}
                              control={control}
                              disabled={!isDepthChecked}
                            />
                          </td>

                          {/* Secondary */}
                          <td className="py-3 px-2">
                            <CommonFormCheckbox
                              name={`permissions.${i}.secondary`}
                              control={control}
                              disabled={!isDepthChecked}
                            />
                          </td>

                          {/* Validation badge */}
                          <td className="py-3 px-2">
                            {permission.validation && (
                              <Badge
                                variant={
                                  permission.validation === "OK"
                                    ? "default"
                                    : "destructive"
                                }
                                className={cn(
                                  "text-sm",
                                  permission.validation === "OK" &&
                                    "bg-green-600/20 text-green-400 border-green-600/30",
                                  permission.validation === "HP Alarm" &&
                                    "bg-orange-600/20 text-orange-400 border-orange-600/30",
                                )}
                              >
                                {permission.validation}
                              </Badge>
                            )}
                          </td>

                          {/* Comments */}
                          <td className="py-3 px-2">
                            <span className="text-sm text-muted-foreground">
                              {permission.comments}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Sensor permissions OK status line */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Label className="ml-[3px]">Sensor permissions are OK</Label>
              </div>
            </div>
          </PanelCard>
        </div>

        {/* ── Bottom Section: Chart + Default Settings Permissions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Perm Permissions Chart */}
          <PanelCard title="Perm Permissions">
            <div className="space-y-4">
              {/* Chart header */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total = 0.05</span>
                <span className="text-muted-foreground">Expor Timeline (C.W)</span>
              </div>

              {/* ECharts line chart */}
              <div className="h-56">
                <ReactECharts
                  option={chartOption}
                  style={{ height: "100%", width: "100%" }}
                  theme="dark"
                  notMerge
                />
              </div>

              {/* Bottom checkboxes + action buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                <CommonFormCheckbox
                  id="sensor-perms-ok"
                  name="sensorPermissionsOk"
                  control={control}
                  label="Sensor permissions are OK"
                />
                <CommonFormCheckbox
                  id="validate-all"
                  name="validateAll"
                  control={control}
                  label="Validate all"
                />
                <CommonButton variant="outline">Emassy Perms</CommonButton>
                <CommonButton variant="outline">Revert</CommonButton>
              </div>
            </div>
          </PanelCard>

          {/* Default Settings Permissions table */}
          <PanelCard title="Default Settings Permissions">
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-5 gap-y-3 text-sm">
                {/* Header row */}
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Permissions
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center">
                  Hydrations
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center">
                  Edits
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide text-center">
                  Sacnesions
                </div>

                {/* Data rows */}
                {(watch("senectoPermissions") ?? []).map((item, index) => (
                  <Fragment key={item.key}>
                    {/* Permissions label + enabled checkbox */}
                    <div key={`${item.key}-label`} className="flex items-center gap-2 py-2">
                      <CommonFormCheckbox
                        name={`senectoPermissions.${index}.enabled`}
                        control={control}
                      />
                      <span>{item.label}</span>
                    </div>

                    {/* Hydrations checkbox */}
                    <div key={`${item.key}-hydrations`} className="flex justify-center items-center">
                      <CommonFormCheckbox
                        name={`senectoPermissions.${index}.hydrations`}
                        control={control}
                      />
                    </div>

                    {/* Edits input field */}
                    <div key={`${item.key}-edits`} className="flex items-center justify-center">
                      <CommonFormInput
                        name={`senectoPermissions.${index}.edits`}
                        control={control}
                        type="number"
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        max="1"
                        required
                        className="h-8 text-center w-20"
                        containerClassName="w-20"
                      />
                    </div>

                    {/* Sacnesions – "Select Type" button for applicable rows */}
                    <div key={`${item.key}-sac`} className="flex justify-center items-center">
                      {item.hasSelectType ? (
                        <CommonButton variant="ghost" size="sm" className="h-7 px-2">
                          Select Type
                        </CommonButton>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Save confirmation dialog */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
