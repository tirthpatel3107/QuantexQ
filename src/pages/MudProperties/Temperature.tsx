// React & Hooks
import { useState, useEffect, useMemo } from "react";

// Components
import { SectionSkeleton, FormSaveDialog } from "@/components/shared";
import { TemperaturePanel } from "./fluidOverview/TemperaturePanel";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {

  CommonFormInput,
  CommonFormToggle,
  RestoreDefaultsButton,
  CommonButton,
} from "@/components/shared";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Chart
import ReactECharts from "echarts-for-react";
import { Download, Copy } from "lucide-react";

// Services & API
import {
  useTemperatureData,
  useSaveTemperatureData,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import {
  temperatureFormSchema,
  type TemperatureFormValues,
} from "@/utils/schemas/temperature-schema";
import type { SaveTemperaturePayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "@/context/mudProperties";

/**
 * Temperature Component
 *
 * Manages temperature configuration including surface/bottomhole temperatures,
 * gradients, densitometry settings, and viscosity correction models.
 * Integrates with MudPropertiesContext for centralized save management.
 *
 * @returns JSX.Element
 */
export function Temperature() {
  // ---- Data & State ----
  const { data: temperatureResponse, isLoading } = useTemperatureData();
  const { mutate: saveTemperatureData } = useSaveTemperatureData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<TemperatureFormValues>({
    resolver: zodResolver(temperatureFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (temperatureResponse?.data && !hasSetInitial) {
      const {
        surfaceTemp,
        bottomholeTemp,
        tempGradient,
        densitometryTempSett,
        applyTempCorrection,
        viscosityModel,
      } = temperatureResponse.data;
      reset({
        surfaceTemp,
        bottomholeTemp,
        tempGradient,
        densitometryTempSett,
        applyTempCorrection,
        viscosityModel,
      });
      setHasSetInitial(true);
    }
  }, [temperatureResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveTemperaturePayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveTemperatureData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Temperature settings saved successfully",
    errorMessage: "Failed to save temperature settings",
    confirmTitle: "Save Temperature Settings",
    confirmDescription:
      "Are you sure you want to save these temperature changes?",
  });

  /**
   * Register the save handler with the MudPropertiesContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveTemperaturePayload);
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

  /**
   * Restore defaults handler
   */
  const handleRestoreDefaults = () => {
    reset({
      surfaceTemp: "85",
      bottomholeTemp: "210",
      tempGradient: "+0.62",
      densitometryTempSett: "170",
      applyTempCorrection: true,
      viscosityModel: "Bingham",
    });
  };

  // Chart configuration for Temperature vs. Depth
  const chartOption = useMemo(() => {
    const chartData = temperatureResponse?.data?.chartData ?? [];
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 15, 20, 0.95)",
        borderColor: "rgba(255,255,255,0.1)",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: (params: { name: string; value: number }[]) => {
          const p = params[0];
          return `<div style="font-weight:600">Depth: ${p.name} ft</div><div>Temperature: <b>${p.value}</b> °F</div>`;
        },
      },
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      xAxis: {
        type: "value" as const,
        name: "Depth (ft)",
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { color: "#64748b", fontSize: 12 },
        axisLabel: { color: "#64748b", fontSize: 11 },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      },
      yAxis: {
        type: "value" as const,
        name: "Pressure (Gt)",
        nameLocation: "middle",
        nameGap: 45,
        nameTextStyle: { color: "#64748b", fontSize: 12 },
        axisLabel: { color: "#64748b", fontSize: 11 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
        inverse: true, // Invert Y-axis to show depth increasing downward
      },
      series: [
        {
          name: "MW Get",
          type: "line",
          data: chartData.map((d) => [d.depth, d.temperature]),
          smooth: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: "rgb(34, 197, 94)", width: 2 },
          itemStyle: { color: "rgb(34, 197, 94)" },
        },
        {
          name: "Depth",
          type: "line",
          data: chartData.map((d) => [d.depth, d.temperature]),
          smooth: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: "rgb(239, 68, 68)", width: 2 },
          itemStyle: { color: "rgb(239, 68, 68)" },
        },
      ],
      legend: {
        data: ["MW Get", "Depth"],
        top: 0,
        right: 20,
        textStyle: { color: "#94a3b8", fontSize: 11 },
      },
    };
  }, [temperatureResponse?.data?.chartData]);

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !temperatureResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  const tempRange = temperatureResponse.data.tempRange;

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 auto-rows-max">
          {/* ---- Temperature Section ---- */}
          <PanelCard
            title="Temperature"
            headerAction={
              <RestoreDefaultsButton onClick={handleRestoreDefaults} />
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <CommonFormInput
                  name="surfaceTemp"
                  control={control}
                  label="Surface temperature"
                  placeholder="85"
                  type="text"
                  suffix="°F"
                />

                <CommonFormInput
                  name="bottomholeTemp"
                  control={control}
                  label="Bottomhole temperature"
                  placeholder="210"
                  type="text"
                  suffix="°F"
                />

                <div className="text-sm text-muted-foreground">
                  Calculation gradient: {temperatureResponse.data.tempGradient}
                  °F/100 ft
                </div>

                <CommonFormInput
                  name="densitometryTempSett"
                  control={control}
                  label="Densitometry temperature set"
                  placeholder="170"
                  type="text"
                  suffix="RER"
                />

                <CommonFormToggle
                  name="applyTempCorrection"
                  control={control}
                  label="Apply temperature correction to rheology"
                  className="my-4"
                />

                <div className="text-sm text-muted-foreground">
                  Pressure/Temperature viscosity model:{" "}
                  {temperatureResponse.data.viscosityModel}
                </div>
              </div>
            </div>
          </PanelCard>

          {/* ---- Temperature vs. Depth Chart ---- */}
          <PanelCard
            title="Temperature vs. Depth"
            headerAction={
              <CommonButton variant="outline">Export CSV Data</CommonButton>
            }
          >
            <div className="space-y-4">
              {/* ECharts chart */}
              <div className="h-[450px]">
                <ReactECharts
                  option={chartOption}
                  style={{ height: "100%", width: "100%" }}
                  notMerge
                />
              </div>
            </div>
          </PanelCard>
        </div>

        {/* ---- Sidebar Content ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Temperature Range</span>
                <span
                  className={`text-sm px-2 py-0.5 rounded ${
                    tempRange.status === "OK"
                      ? "bg-green-500/20 text-green-600"
                      : tempRange.status === "WARN"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-red-500/20 text-red-600"
                  }`}
                >
                  {tempRange.status}
                </span>
              </div>
            }
          >
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Surface temperature
                  </span>
                  <span>{tempRange.surfaceTemp}°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Bottomhole temperature
                  </span>
                  <span>{tempRange.bottomholeTemp}°F</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Apply viscosity correction
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {tempRange.applyViscosityCorrection ? "ON" : "OFF"}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      tempRange.applyViscosityCorrection
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="font-medium">Temperature/surface Drop</div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wu cased</span>
                  <span>{tempRange.wuCased}°F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Bottomhole define
                  </span>
                  <span>{tempRange.bottomholeDefine}°F</span>
                </div>
              </div>

              <CommonButton
                variant="outline"
                icon={Copy}
                iconPosition="left"
                className="w-full mt-4"
              >
                Copy Rheology to Calibration
              </CommonButton>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
