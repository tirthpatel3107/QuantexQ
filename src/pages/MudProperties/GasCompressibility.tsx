// React & Hooks
import { useState, useEffect, useMemo } from "react";

// Components
import { Label } from "@/components/ui/label";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Chart
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

// Components - Common
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonFormToggle,
  CommonFormInput,
  RestoreDefaultsButton,
  CommonButton,
} from "@/components/shared";


// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Services & API
import {
  useGasCompressibilityData,
  useSaveGasCompressibilityData,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import {
  gasCompressibilityFormSchema,
  type GasCompressibilityFormValues,
} from "@/utils/schemas/gas-compressibility-schema";
import type { SaveGasCompressibilityPayload } from "@/services/api/mudproperties/mudproperties.types";

// Context
import { useMudPropertiesContext } from "@/context/mudProperties";

/**
 * Gas Compressibility Component
 *
 * Manages the configuration for gas compressibility settings including
 * mud compressibility, gas-cut, and gas density parameters.
 * Integrates with MudPropertiesContext for centralized save management.
 *
 * @returns JSX.Element
 */
export function GasCompressibility() {
  // ---- Data & State ----
  const { data: gasResponse, isLoading } = useGasCompressibilityData();
  const { mutate: saveGasCompressibilityData } =
    useSaveGasCompressibilityData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<GasCompressibilityFormValues>({
    resolver: zodResolver(gasCompressibilityFormSchema),
  });

  const { reset, control, handleSubmit, watch } = formMethods;

  // Watch the enable toggle
  const enableCompressibility = watch("enableCompressibility");

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (gasResponse?.data && !hasSetInitial) {
      const { enableCompressibility, mudCompressibility, gasCut, gasDensity } =
        gasResponse.data;
      reset({
        enableCompressibility,
        mudCompressibility,
        gasCut,
        gasDensity,
      });
      setHasSetInitial(true);
    }
  }, [gasResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation =
    useSaveWithConfirmation<SaveGasCompressibilityPayload>({
      onSave: (data) => {
        return new Promise<void>((resolve, reject) => {
          saveGasCompressibilityData(data, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      },
      successMessage: "Gas compressibility settings saved successfully",
      errorMessage: "Failed to save gas compressibility settings",
      confirmTitle: "Save Gas Compressibility Settings",
      confirmDescription:
        "Are you sure you want to save these gas compressibility changes?",
    });

  /**
   * Register the save handler with the MudPropertiesContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(
        validData as SaveGasCompressibilityPayload,
      );
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

  // ---- Chart Configuration ----
  const chartOption = useMemo(() => {
    if (!gasResponse?.data) return {};

    const { chartData } = gasResponse.data;

    const option: EChartsOption = {
      grid: {
        top: 40,
        right: 180,
        bottom: 60,
        left: 80,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Depth (ft)",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: {
          fontSize: 12,
          color: "hsl(var(--muted-foreground))",
        },
        axisLine: {
          show: true,
          lineStyle: { color: "hsl(var(--border))" },
        },
        axisTick: { show: true },
        axisLabel: {
          fontSize: 11,
          color: "hsl(var(--muted-foreground))",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "hsl(var(--border))",
            opacity: 0.3,
          },
        },
      },
      yAxis: {
        type: "value",
        name: "Annular Pressure (psi)",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: {
          fontSize: 12,
          color: "hsl(var(--muted-foreground))",
        },
        axisLine: {
          show: true,
          lineStyle: { color: "hsl(var(--border))" },
        },
        axisTick: { show: true },
        axisLabel: {
          fontSize: 11,
          color: "hsl(var(--muted-foreground))",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "hsl(var(--border))",
            opacity: 0.3,
          },
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        borderRadius: 6,
        textStyle: {
          fontSize: 12,
          color: "hsl(var(--foreground))",
        },
        formatter: (params: unknown) => {
          if (!Array.isArray(params)) return "";
          const firstParam = params[0] as { value: number[] };
          let result = `<div style="font-weight: 600; margin-bottom: 4px;">Depth: ${firstParam.value[0]} ft</div>`;
          params.forEach((param: unknown) => {
            const p = param as {
              color: string;
              seriesName: string;
              value: number[];
            };
            result += `<div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${p.color};"></span>
              <span>${p.seriesName}: ${p.value[1]} psi</span>
            </div>`;
          });
          return result;
        },
      },
      legend: {
        data: ["Mud compressible", "Mud incompressible"],
        top: 10,
        right: 20,
        textStyle: {
          fontSize: 12,
          color: "hsl(var(--foreground))",
        },
        itemWidth: 20,
        itemHeight: 10,
      },
      series: [
        {
          name: "Mud compressible",
          type: "line",
          data: chartData.depth.map((depth, index) => [
            depth,
            chartData.annularPressure[index] ||
              chartData.annularPressure[chartData.annularPressure.length - 1],
          ]),
          smooth: false,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: "hsl(var(--primary))",
          },
          itemStyle: {
            color: "hsl(var(--primary))",
          },
          markPoint: {
            data: [
              {
                name: "Compressible Point",
                coord: [chartData.mudCompressibleDepth, 5000],
                value: `${chartData.mudCompressibleDepth}°ft`,
                itemStyle: {
                  color: "hsl(var(--primary))",
                },
                label: {
                  show: true,
                  position: "top",
                  fontSize: 11,
                  color: "hsl(var(--foreground))",
                  formatter: "{c}",
                },
              },
            ],
          },
        },
        {
          name: "Mud incompressible",
          type: "line",
          data: chartData.depth.map((depth) => [depth, 3000]),
          smooth: false,
          symbol: "none",
          lineStyle: {
            width: 2,
            color: "hsl(var(--muted-foreground))",
          },
          itemStyle: {
            color: "hsl(var(--muted-foreground))",
          },
        },
      ],
      animation: true,
      animationDuration: 800,
    };

    return option;
  }, [gasResponse?.data]);

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !gasResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  const { annularCompressibility, ecdAtBit, requiredInputs } = gasResponse.data;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 auto-rows-max">
          {/* ---- Gas / Compressibility Section ---- */}
          <PanelCard
            title="Gas / Compressibility"
            headerAction={
              <div className="flex items-center gap-3">
                <RestoreDefaultsButton />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-3">
              <CommonFormToggle
                name="enableCompressibility"
                control={control}
                label="Enable compressibility"
                className="my-4"
              />
              <CommonFormInput
                name="mudCompressibility"
                control={control}
                label="Mud compressibility"
                placeholder="0.00030"
                type="text"
                unit="1/psi"
                disabled={!enableCompressibility}
              />

              <CommonFormInput
                name="gasCut"
                control={control}
                label="Gas-cut"
                placeholder="0"
                type="text"
                unit="%"
                disabled={!enableCompressibility}
              />

              <CommonFormInput
                name="gasDensity"
                control={control}
                label="Gas density"
                placeholder="0.69"
                type="text"
                unit="—"
                disabled={!enableCompressibility}
              />
            </div>
          </PanelCard>

          {/* ---- Annular Pressure vs Depth Chart ---- */}
          <PanelCard
            title="Annular Pressure vs Depth"
            headerAction={
              <CommonButton variant="outline">Export CSV Data</CommonButton>
            }
          >
            {/* Chart Area */}
            <div className="h-[400px]">
              <ReactECharts
                option={chartOption}
                style={{ width: "100%", height: "100%" }}
                opts={{ renderer: "svg" }}
              />
            </div>
          </PanelCard>
        </div>

        {/* ---- Sidebar Content ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          {/* Compressibility Effects / Data Validation */}
          <PanelCard title="Compressibility Effects / Data Validation:">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Annular compressibility:
                </span>
                <span className="font-medium">
                  {annularCompressibility} (1/bar)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ECD @ Bit</span>
                <span className="font-medium">{ecdAtBit} ppg</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <p className="text-muted-foreground mb-2">Required inputs:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        requiredInputs.componentLoad
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm">
                      {requiredInputs.componentLoad ? "✓" : "✗"} OK
                    </span>
                    <span className="text-sm text-muted-foreground">
                      100% component load
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        requiredInputs.depthCompressionLoad
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm">
                      {requiredInputs.depthCompressionLoad ? "✓" : "✗"} OK
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Depth compression load
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        requiredInputs.annularPressureVato
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm">
                      {requiredInputs.annularPressureVato ? "✓" : "✗"} OK
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Annular pressure∆ Vato
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        requiredInputs.signalConsistency
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm">
                      {requiredInputs.signalConsistency ? "✓" : "✗"} OK
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Signal consistency
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <button className="w-full text-sm text-primary hover:underline text-left">
                  Copy Trams and Temperature to Calibration
                </button>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
