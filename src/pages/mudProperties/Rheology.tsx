// React & Hooks
import { useMemo, useCallback } from "react";

// Form & Validation

// Hooks
import { useSectionForm } from "@/hooks/useSectionForm";

// Third-party

// Components - UI

// Components - Common
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonFormInput,
  CommonFormCheckbox,
  RestoreDefaultsButton,
} from "@/components/shared";

// Components - Local
import { RheologyPanel } from "./fluidOverview/RheologyPanel";
import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";
import { Button } from "@/components/ui/button";

// Services & API
import {
  useRheologyData,
  useSaveRheologyData,
  useRheologyOptions,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import type { SaveRheologyPayload } from "@/services/api/mudproperties/mudproperties.types";

// Contexts
import { useMudPropertiesContext } from "@/context/mudProperties";

// Icons & Utils

import {
  rheologyFormSchema,
  type RheologyFormValues,
} from "@/utils/schemas/rheology-schema";

/**
 * Rheology Component
 *
 * Manages the configuration for rheology model, PV/YP values,
 * viscometer calibration data, and rheology outputs.
 * Integrates with MudPropertiesContext for centralized save management.
 *
 * @returns JSX.Element
 */
export function Rheology() {
  // ---- Data & State ----
  const { data: rheologyResponse, isLoading } = useRheologyData();
  useRheologyOptions(); // Load options for future use
  const { mutate: saveRheologyData } = useSaveRheologyData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);
  const [selectedModel, setSelectedModel] = useState("bingham-plastic");

  // ---- Form Management ----
  const formMethods = useForm<RheologyFormValues>({
    resolver: zodResolver(rheologyFormSchema),
  });

  const { reset, control, handleSubmit, setValue } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (rheologyResponse?.data && !hasSetInitial) {
      reset(rheologyResponse.data);
      setSelectedModel(rheologyResponse.data.rheologyModel.model);
      setHasSetInitial(true);
    }
  }, [rheologyResponse, hasSetInitial, reset]);

  /**
   * Update formula when model changes
   */
  useEffect(() => {
    let formula = "";
    switch (selectedModel) {
      case "bingham-plastic":
        formula = "τ = PV × γ + YP";
        break;
      case "power-law":
        formula = "τ = K × γⁿ";
        break;
      case "herschel-bulkley":
        formula = "τ = τ₀ + K × γⁿ";
        break;
    }
    setValue("rheologyModel.model", selectedModel);
    setValue("rheologyModel.formula", formula);
  }, [selectedModel, setValue]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveRheologyPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveRheologyData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Rheology settings saved successfully",
    errorMessage: "Failed to save rheology settings",
    confirmTitle: "Save Rheology Settings",
    confirmDescription: "Are you sure you want to save these rheology changes?",
  });

  /**
   * Register the save handler with the MudPropertiesContext.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      const payload: SaveRheologyPayload = {
        rheologyModel: {
          model: validData.rheologyModel.model,
          formula: validData.rheologyModel.formula,
        },
        pv: {
          value: validData.pv.value,
          unit: validData.pv.unit,
        },
        yp: {
          value: validData.yp.value,
          unit: validData.yp.unit,
        },
        deriveFromViscometer: validData.deriveFromViscometer,
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

  /**
   * Handle restore defaults
   */
  const handleRestoreDefaults = () => {
    if (rheologyResponse?.data) {
      reset(rheologyResponse.data);
      setSelectedModel(rheologyResponse.data.rheologyModel.model);
    }
  };

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !rheologyResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  const data = rheologyResponse.data;

  const getModelLabel = (model: string) => {
    switch (model) {
      case "bingham-plastic":
        return "Bingham Plastic";
      case "power-law":
        return "Power Law";
      case "herschel-bulkley":
        return "Herschel-Bulkley";
      default:
        return model;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          {/* ---- Rheology Model Section ---- */}
          <PanelCard
            title="Rheology Model"
            headerAction={
              <RestoreDefaultsButton onClick={handleRestoreDefaults} />
            }
          >
            <div className="space-y-4">
              {/* Model Tabs */}
              <div className="flex gap-2">
                {["bingham-plastic", "power-law", "herschel-bulkley"].map(
                  (model) => (
                    <Button
                      key={model}
                      variant={selectedModel === model ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedModel(model)}
                      className="flex-1"
                    >
                      {getModelLabel(model)}
                    </Button>
                  ),
                )}
              </div>

              {/* Formula Display */}
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Formula:</p>
                <p className="text-sm font-mono">
                  {selectedModel === "bingham-plastic"
                    ? "τ = PV × γ + YP"
                    : selectedModel === "power-law"
                      ? "τ = K × γⁿ"
                      : "τ = τ₀ + K × γⁿ"}
                </p>
              </div>
            </div>
          </PanelCard>

          <div className="grid grid-cols-2 gap-3">
            {/* ---- Calibration Section ---- */}
            <PanelCard title="Calibration">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Viscosity vs. Shear Rate
                  </h4>
                  <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center relative border border-border/50">
                    <svg
                      className="w-full h-full p-4"
                      viewBox="0 0 600 200"
                      preserveAspectRatio="none"
                    >
                      {/* Grid lines */}
                      <defs>
                        <pattern
                          id="grid"
                          width="60"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 60 0 L 0 0 0 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-muted-foreground/10"
                          />
                        </pattern>
                      </defs>
                      <rect width="600" height="200" fill="url(#grid)" />

                      {/* Axes */}
                      <line
                        x1="50"
                        y1="20"
                        x2="50"
                        y2="170"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-muted-foreground/30"
                      />
                      <line
                        x1="50"
                        y1="170"
                        x2="580"
                        y2="170"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-muted-foreground/30"
                      />

                      {/* Viscometer Readings line */}
                      <polyline
                        points="50,150 150,110 300,70 400,50 500,40 580,35"
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2.5"
                      />

                      {/* Model Curve line */}
                      <polyline
                        points="50,155 150,115 300,75 400,55 500,45 580,40"
                        fill="none"
                        stroke="rgb(234, 179, 8)"
                        strokeWidth="2.5"
                        strokeDasharray="6,4"
                      />

                      {/* Data points */}
                      {[
                        [50, 150],
                        [150, 110],
                        [300, 70],
                        [400, 50],
                        [580, 35],
                      ].map(([x, y], i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="rgb(59, 130, 246)"
                        />
                      ))}

                      {/* Axis labels */}
                      <text
                        x="315"
                        y="195"
                        textAnchor="middle"
                        className="text-[11px] fill-muted-foreground"
                      >
                        Shear Rate (1/s)
                      </text>
                      <text
                        x="25"
                        y="95"
                        textAnchor="middle"
                        className="text-[11px] fill-muted-foreground"
                        transform="rotate(-90 25 95)"
                      >
                        Viscosity (cP)
                      </text>
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm p-2.5 rounded border border-border/50 text-[11px] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-blue-500"></div>
                        <span className="text-muted-foreground">
                          Viscometer Readings
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="2">
                          <line
                            x1="0"
                            y1="1"
                            x2="16"
                            y2="1"
                            stroke="rgb(234, 179, 8)"
                            strokeWidth="2"
                            strokeDasharray="3,2"
                          />
                        </svg>
                        <span className="text-muted-foreground">
                          Model Curve
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PanelCard>

            {/* ---- Temperature Section ---- */}
            <PanelCard title="Temperature">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Shear Stress vs. Shear Rate
                  </h4>
                  <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center relative border border-border/50">
                    <svg
                      className="w-full h-full p-4"
                      viewBox="0 0 600 200"
                      preserveAspectRatio="none"
                    >
                      {/* Grid */}
                      <rect width="600" height="200" fill="url(#grid)" />

                      {/* Axes */}
                      <line
                        x1="50"
                        y1="20"
                        x2="50"
                        y2="170"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-muted-foreground/30"
                      />
                      <line
                        x1="50"
                        y1="170"
                        x2="580"
                        y2="170"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-muted-foreground/30"
                      />

                      {/* Viscometer Readings line */}
                      <polyline
                        points="50,155 200,120 350,90 450,70 580,55"
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2.5"
                      />

                      {/* Model Curve line */}
                      <polyline
                        points="50,160 200,125 350,95 450,75 580,60"
                        fill="none"
                        stroke="rgb(234, 179, 8)"
                        strokeWidth="2.5"
                        strokeDasharray="6,4"
                      />

                      {/* Data points */}
                      {[
                        [50, 155],
                        [200, 120],
                        [350, 90],
                        [450, 70],
                        [580, 55],
                      ].map(([x, y], i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="rgb(59, 130, 246)"
                        />
                      ))}

                      {/* Axis labels */}
                      <text
                        x="315"
                        y="195"
                        textAnchor="middle"
                        className="text-[11px] fill-muted-foreground"
                      >
                        Shear Rate (1/s)
                      </text>
                      <text
                        x="25"
                        y="95"
                        textAnchor="middle"
                        className="text-[11px] fill-muted-foreground"
                        transform="rotate(-90 25 95)"
                      >
                        Shear Stress (Pa)
                      </text>
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm p-2.5 rounded border border-border/50 text-[11px] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-blue-500"></div>
                        <span className="text-muted-foreground">
                          Viscometer Readings
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="2">
                          <line
                            x1="0"
                            y1="1"
                            x2="16"
                            y2="1"
                            stroke="rgb(234, 179, 8)"
                            strokeWidth="2"
                            strokeDasharray="3,2"
                          />
                        </svg>
                        <span className="text-muted-foreground">
                          Model Curve
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PanelCard>
          </div>
        </div>

        {/* ---- Sidebar Content ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          {/* ---- Rheology Outputs Section ---- */}
          <PanelCard title="Rheology Outputs">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Flowline temperature
                </span>
                <span className="font-medium">
                  {data.rheologyOutputs.flowlineTemperature.value}
                  {data.rheologyOutputs.flowlineTemperature.unit}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Annular velocity</span>
                <span className="font-medium">
                  {data.rheologyOutputs.annularVelocity.value}{" "}
                  {data.rheologyOutputs.annularVelocity.unit}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shear rate</span>
                <span className="font-medium">
                  {data.rheologyOutputs.shearRate.value}{" "}
                  {data.rheologyOutputs.shearRate.unit}
                </span>
              </div>

              <hr className="my-3 border-border/50" />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">PV (cP)</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {data.rheologyOutputs.pvOutput.value}{" "}
                    {data.rheologyOutputs.pvOutput.unit}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      data.rheologyOutputs.pvOutput.status === "OK"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {data.rheologyOutputs.pvOutput.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  YP (lb/100ft<sup>2</sup>)
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {data.rheologyOutputs.ypOutput.value}{" "}
                    {data.rheologyOutputs.ypOutput.unit}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      data.rheologyOutputs.ypOutput.status === "OK"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {data.rheologyOutputs.ypOutput.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Gel 10s (lb/100ft<sup>2</sup>)
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {data.rheologyOutputs.gel10s.value}{" "}
                    {data.rheologyOutputs.gel10s.unit}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      data.rheologyOutputs.gel10s.status === "OK"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {data.rheologyOutputs.gel10s.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Gel 10m (lb/100ft<sup>2</sup>)
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {data.rheologyOutputs.gel10m.value}{" "}
                    {data.rheologyOutputs.gel10m.unit}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      data.rheologyOutputs.gel10m.status === "OK"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {data.rheologyOutputs.gel10m.status}
                  </span>
                </div>
              </div>

              <hr className="my-3 border-border/50" />

              <button className="w-full text-sm text-primary hover:underline text-left">
                Copy Rheology to Calibration
              </button>
            </div>
          </PanelCard>

          {/* ---- Pressure Drop Section ---- */}
          <PanelCard title="Pressure Drop">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">PSL</span>
                <span className="font-medium">
                  {data.pressureDrop.psl.value} {data.pressureDrop.psl.unit}
                </span>
              </div>

              <ul className="space-y-2 pl-4">
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pressure Drop:</span>
                  <span className="font-medium">
                    {data.pressureDrop.psl.value} {data.pressureDrop.psl.unit}
                  </span>
                </li>

                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Flow:</span>
                  <span className="font-medium">
                    {data.pressureDrop.flow.value} {data.pressureDrop.flow.unit}
                  </span>
                </li>

                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Drillpipe:</span>
                  <span className="font-medium">
                    {data.pressureDrop.drillpipe.value}{" "}
                    {data.pressureDrop.drillpipe.unit}
                  </span>
                </li>

                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bit:</span>
                  <span className="font-medium">
                    {data.pressureDrop.bit.value} {data.pressureDrop.bit.unit}
                  </span>
                </li>
              </ul>

              <hr className="my-3 border-border/50" />

              <button className="w-full text-sm text-primary hover:underline text-left">
                Copy Rhology to Calibration
              </button>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
