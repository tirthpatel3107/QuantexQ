// React & Hooks
import { useState, useEffect, useMemo } from "react";

// Third-party
import ReactECharts from "echarts-for-react";
import { RotateCcw } from "lucide-react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonFormInput,
  CommonFormCheckbox,
  CommonButton,
} from "@/components/common";

// Components - Local
import { PanelCard } from "@/components/dashboard/PanelCard";

// Services & API
import {
  useDensityData,
  useSaveDensityData,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import {
  densityFormSchema,
  type DensityFormValues,
} from "@/utils/schemas/density-schema";
import type { SaveDensityPayload } from "@/services/api/mudproperties/mudproperties.types";

// Contexts
import { useMudPropertiesContext } from "@/context/MudProperties";

/**
 * Density Component
 *
 * Manages the fluid density and solids content configuration.
 * Provides inputs for mud weight (In/Out), salinity, and various solids categories.
 *
 * @returns JSX.Element
 */
export function Density() {
  // ---- Data & State ----
  const { data: densityResponse, isLoading } = useDensityData();
  const { mutate: saveDensityData } = useSaveDensityData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<DensityFormValues>({
    resolver: zodResolver(densityFormSchema),
    defaultValues: {
      mudWeight: {
        mwIn: "",
        mwOut: "",
        useMwInOnly: false,
      },
      solids: {
        lgs: "",
        hgs: "",
      },
      oilWaterRatio: "",
      salinity: "",
    },
  });

  const { reset, control, handleSubmit, watch } = formMethods;

  // ---- Accordion State ----
  const [accordionValue, setAccordionValue] = useState<string[]>([
    "mud-weight",
    "solids",
    "oil-water",
    "salinity",
  ]);

  // Watch form values for calculated fields
  const mwIn = watch("mudWeight.mwIn");
  const mwOut = watch("mudWeight.mwOut");
  const lgs = watch("solids.lgs");
  const hgs = watch("solids.hgs");
  const oilWaterRatio = watch("oilWaterRatio");

  // ---- Calculated Values ----
  const calculatedDensity = useMemo(() => {
    const mwInNum = parseFloat(mwIn);
    const mwOutNum = parseFloat(mwOut);
    if (!isNaN(mwInNum) && !isNaN(mwOutNum)) {
      return ((mwInNum + mwOutNum) / 2).toFixed(1);
    }
    return mwInNum || mwOutNum || "0.0";
  }, [mwIn, mwOut]);

  const lotaPpg = useMemo(() => {
    return calculatedDensity;
  }, [calculatedDensity]);

  const bitShoePpg = useMemo(() => {
    const density = parseFloat(calculatedDensity.toString());
    if (!isNaN(density)) {
      return (density + 2.9).toFixed(1);
    }
    return "0.0";
  }, [calculatedDensity]);

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (densityResponse?.data && !hasSetInitial) {
      const {
        mudWeightIn,
        mudWeightOut,
        oilWaterRatio,
        salinity,
        lowGravitySolids,
        highGravitySolids,
      } = densityResponse.data;

      reset({
        mudWeight: {
          mwIn: mudWeightIn,
          mwOut: mudWeightOut,
          useMwInOnly: false,
        },
        solids: {
          lgs: lowGravitySolids,
          hgs: highGravitySolids,
        },
        oilWaterRatio: oilWaterRatio,
        salinity: salinity,
      });
      setHasSetInitial(true);
    }
  }, [densityResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveDensityPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveDensityData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Density settings saved successfully",
    errorMessage: "Failed to save density settings",
    confirmTitle: "Save Density Settings",
    confirmDescription: "Are you sure you want to save these density changes?",
  });

  /**
   * Register the save handler with the MudPropertiesContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      // Transform form data to API payload with sections array
      const payload: SaveDensityPayload = {
        sections: [
          {
            title: "Mud Weight",
            data: {
              "mw-in": validData.mudWeight.mwIn,
              "mw-out": validData.mudWeight.mwOut,
              "use-mw-in-only": validData.mudWeight.useMwInOnly,
            },
          },
          {
            title: "Solids",
            data: {
              "lgs": validData.solids.lgs,
              "hgs": validData.solids.hgs,
            },
          },
          {
            title: "Oil/Water Ratio",
            data: {
              "oil-water-ratio": validData.oilWaterRatio,
            },
          },
          {
            title: "Salinity",
            data: {
              "salinity": validData.salinity,
            },
          },
        ],
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

  // ---- Accordion Handlers ----
  const handleExpandAll = () => {
    setAccordionValue(["mud-weight", "solids", "oil-water", "salinity"]);
  };

  const handleCollapseAll = () => {
    setAccordionValue([]);
  };

  // ---- Copy Handler ----
  const handleCopyMwIn = () => {
    const mwInValue = watch("mudWeight.mwIn");
    formMethods.setValue("mudWeight.mwOut", mwInValue);
  };

  // ---- Restore Defaults Handler ----
  const handleRestoreDefaults = () => {
    reset({
      mudWeight: {
        mwIn: "12.4",
        mwOut: "12.4",
        useMwInOnly: false,
      },
      solids: {
        lgs: "8.3",
        hgs: "9.5",
      },
      oilWaterRatio: "70/30",
      salinity: "15.0",
    });
  };

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !densityResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-3 auto-rows-max">
          {/* ---- Density & Solids Panel ---- */}
          <PanelCard
            title="Density & Solids"
            headerAction={
              <div className="flex items-center gap-2">
                <CommonButton
                  variant="outline"
                  size="sm"
                  onClick={handleExpandAll}
                  type="button"
                >
                  Expand All
                </CommonButton>
                <CommonButton
                  variant="outline"
                  size="sm"
                  onClick={handleCollapseAll}
                  type="button"
                >
                  Collapse All
                </CommonButton>
                <CommonButton
                  variant="ghost"
                  size="sm"
                  onClick={handleRestoreDefaults}
                  type="button"
                  className="px-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </CommonButton>
              </div>
            }
          >
            <Accordion
              type="multiple"
              value={accordionValue}
              onValueChange={setAccordionValue}
              className="space-y-0"
            >
              {/* Mud Weight Section */}
              <AccordionItem value="mud-weight" className="border-b-0">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="text-sm font-medium">Mud Weight</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <CommonFormInput
                        name="mudWeight.mwIn"
                        control={control}
                        label="MW In"
                        placeholder="12.4"
                        type="number"
                        step="0.1"
                        suffix="ppg"
                      />
                      <CommonFormInput
                        name="mudWeight.mwOut"
                        control={control}
                        label="MW Out"
                        placeholder="12.4"
                        type="number"
                        step="0.1"
                        suffix="ppg"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <CommonButton
                        variant="outline"
                        size="sm"
                        onClick={handleCopyMwIn}
                        type="button"
                      >
                        Copy MW In → MW Out
                      </CommonButton>
                      <CommonFormCheckbox
                        name="mudWeight.useMwInOnly"
                        control={control}
                        label="Use MW In only"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <hr className="border-border/50" />

              {/* Solids Section */}
              <AccordionItem value="solids" className="border-b-0">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="text-sm font-medium">Solids</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CommonFormInput
                      name="solids.lgs"
                      control={control}
                      label="LGS (%)"
                      placeholder="8.3"
                      type="number"
                      step="0.1"
                      suffix="%"
                    />
                    <CommonFormInput
                      name="solids.hgs"
                      control={control}
                      label="HGS (%)"
                      placeholder="9.5"
                      type="number"
                      step="0.1"
                      suffix="%"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <hr className="border-border/50" />

              {/* Oil/Water Ratio Section */}
              <AccordionItem value="oil-water" className="border-b-0">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="text-sm font-medium">Oil/Water Ratio</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CommonFormInput
                      name="oilWaterRatio"
                      control={control}
                      label="Oil/Water Ratio"
                      placeholder="70/30"
                      type="text"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <hr className="border-border/50" />

              {/* Salinity Section */}
              <AccordionItem value="salinity" className="border-b-0">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="text-sm font-medium">Salinity</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CommonFormInput
                      name="salinity"
                      control={control}
                      label="Salinity"
                      placeholder="15.0"
                      type="number"
                      step="0.1"
                      suffix="Ppk"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </PanelCard>

          {/* ---- Density at Surface vs. Depth Chart ---- */}
          <DensityDepthChart mwOut={parseFloat(mwOut) || 12.4} />
        </div>

        {/* ---- Sidebar: Density Range ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <PanelCard title="Density Range">
            <div className="space-y-4">
              {/* Status Badges */}
              <div className="flex gap-2">
                <span className="px-2 py-1 text-sm rounded bg-green-500/10 text-green-500 border border-green-500/20">
                  OK
                </span>
                <span className="px-2 py-1 text-sm rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  WARN
                </span>
                <span className="px-2 py-1 text-sm rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  BAD
                </span>
              </div>

              {/* Calculated Values */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Low gravity solids
                  </span>
                  <span className="font-medium">{lgs || "0.0"}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    High gravity solids
                  </span>
                  <span className="font-medium">{hgs || "0.0"}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Oil-to-water ratio
                  </span>
                  <span className="font-medium">{oilWaterRatio || "0/0"}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    Calculated density
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lota ppg</span>
                  <span className="font-medium">{lotaPpg} ppg</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bit: Shoe</span>
                  <span className="font-medium">{bitShoePpg} ppg</span>
                </div>
              </div>

              {/* Copy Button */}
              <div className="pt-3 border-t">
                <CommonButton variant="outline" className="w-full">
                  Copy Rheology to Calibration
                </CommonButton>
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

/**
 * DensityDepthChart Component
 * Displays a chart showing density at surface vs. depth
 */
function DensityDepthChart({ mwOut }: { mwOut: number }) {
  const chartData = useMemo(() => {
    // Generate mock data for the chart based on MW Out
    const depths = [
      0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 610, 670, 730,
    ];
    return depths.map((depth) => ({
      depth,
      mwOut: mwOut,
      actualDepth: depth,
    }));
  }, [mwOut]);

  const option = useMemo(() => {
    return {
      grid: {
        top: 40,
        right: 60,
        bottom: 50,
        left: 60,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Depth (ft)",
        nameLocation: "middle",
        nameGap: 30,
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
        name: "Density (ppg)",
        nameLocation: "middle",
        nameGap: 45,
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
        min: 0,
        max: 300,
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
          const point = Array.isArray(params) ? params[0] : null;
          if (!point || !point.data) return "";
          return `Depth: ${point.data[0]} ft<br/>MW Out: ${point.data[1]} ppg<br/>Depth: ${point.data[0]} ft`;
        },
      },
      legend: {
        data: ["MW Out", "Depth"],
        top: 5,
        textStyle: {
          fontSize: 11,
          color: "hsl(var(--muted-foreground))",
        },
      },
      series: [
        {
          name: "MW Out",
          type: "line",
          data: chartData.map((d) => [d.depth, d.mwOut]),
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
        },
        {
          name: "Depth",
          type: "line",
          data: chartData.map((d) => [d.depth, d.actualDepth / 50]),
          smooth: false,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: "hsl(var(--chart-2))",
          },
          itemStyle: {
            color: "hsl(var(--chart-2))",
          },
        },
      ],
      animation: false,
    };
  }, [chartData]);

  return (
    <PanelCard
      title={
        <div className="flex items-center justify-between w-full">
          <span>Density at Surface vs. Depth</span>
          <CommonButton variant="ghost" size="sm">
            Export Data (CSV)
          </CommonButton>
        </div>
      }
    >
      <div className="h-[300px] w-full">
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </PanelCard>
  );
}
