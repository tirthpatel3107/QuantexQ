// React & Hooks

// Form & Validation

// Hooks

// Third-party

// Components - UI

// Components - Common
import { SectionSkeleton } from "@/components/shared";

// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Services & API
import {
  useSummaryData,
  useSaveSummaryData,
  useSummaryOptions,
} from "@/services/api/mudproperties/mudproperties.api";

// Types & Schemas
import type { FluidData } from "@/utils/types/mud";

// Contexts
import { useMudPropertiesContext } from "@/context/mudProperties";

// Icons & Utils

interface SummaryProps {
  fluid: FluidData;
}
import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  FormSaveDialog,
  StatusBadge,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
  RestoreDefaultsButton,
  CommonButton,
} from "@/components/shared";

// Types & Schemas
import {
  summaryFormSchema,
  type SummaryFormValues,
} from "@/utils/schemas/summary-schema";
import type { SaveSummaryPayload } from "@/services/api/mudproperties/mudproperties.types";

/**
 * Summary Component
 *
 * Displays and manages the summary view of mud properties including
 * mud system overview, rheology, density & solids, temperature, and gas compressibility.
 * Integrates with MudPropertiesContext for centralized save management.
 *
 * @returns JSX.Element
 */
export function Summary() {
  // ---- Data & State ----
  const { data: summaryResponse, isLoading } = useSummaryData();
  const { data: optionsResponse } = useSummaryOptions();
  const { mutate: saveSummaryData } = useSaveSummaryData();
  const { registerSaveHandler, unregisterSaveHandler } =
    useMudPropertiesContext();

  const options = optionsResponse?.data;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryFormSchema),
  });

  const { reset, control, handleSubmit, watch } = formMethods;

  // Watch compressibility toggle
  const compressibilityEnabled = watch("gasCompressibility.compressibility");

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (summaryResponse?.data && !hasSetInitial) {
      reset(summaryResponse.data);
      setHasSetInitial(true);
    }
  }, [summaryResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveSummaryPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveSummaryData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Summary settings saved successfully",
    errorMessage: "Failed to save summary settings",
    confirmTitle: "Save Summary Settings",
    confirmDescription: "Are you sure you want to save these summary changes?",
  });

  /**
   * Register the save handler with the MudPropertiesContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveSummaryPayload);
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

  // ---- Loading State ----
  if (isLoading || !hasSetInitial || !summaryResponse?.data) {
    return <SectionSkeleton count={3} />;
  }

  const gasStatus = summaryResponse.data.gasCompressibility.gasStatus || "OK";
  const gasDetected =
    summaryResponse.data.gasCompressibility.gasDetected || false;

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
          {/* ---- Mud System Overview Section ---- */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Mud System Overview</span>
              </div>
            }
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 text-sm">
              <CommonFormSelect
                name="mudSystemOverview.mudSystem"
                control={control}
                label="Mud system"
                options={options?.mudSystemOptions || []}
              />

              <CommonFormSelect
                name="mudSystemOverview.baseFluid"
                control={control}
                label="Base fluid"
                options={options?.baseFluidOptions || []}
              />

              <CommonFormInput
                name="activePitsVolume.volume"
                control={control}
                label="Active pits Volume"
                placeholder="600"
                type="text"
                suffix="bbl"
              />

              <CommonFormInput
                name="flowlineTemperature.temperature"
                control={control}
                label="Flowline temperature"
                placeholder="85"
                type="text"
                suffix="°F"
              />

              <CommonFormInput
                name="oilWaterRatio.ratio"
                control={control}
                label="Oil/Water ratio"
                placeholder="70/30"
                type="text"
              />
            </div>

            <div className="text-sm text-muted-foreground pt-2">
              7/7 key inputs complete
            </div>
          </PanelCard>

          {/* ---- Rheology Section ---- */}
          <PanelCard title="Rheology" headerAction={<RestoreDefaultsButton />}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <CommonFormSelect
                    name="rheology.model"
                    control={control}
                    label="Model"
                    options={options?.rheologyModelOptions || []}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <CommonFormInput
                    name="rheology.pv"
                    control={control}
                    label="PV"
                    placeholder="20"
                    type="text"
                    suffix="cP"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <CommonFormInput
                    name="rheology.yp"
                    control={control}
                    label="YP"
                    placeholder="15"
                    type="text"
                    suffix="lb/100ft²"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <CommonFormInput
                    name="rheology.gels"
                    control={control}
                    label="Gels (10s/10m)"
                    placeholder="12 / 20"
                    type="text"
                    suffix="lb/100ft²"
                  />
                </div>
              </div>

              {summaryResponse.data.rheology.derivedWarning && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-2 rounded">
                  <span className="font-medium">⚠ WARN</span>
                  <span>Derived from 6-speed viscometer</span>
                </div>
              )}
            </div>
          </PanelCard>

          {/* ---- Density & Solids Section ---- */}
          <PanelCard
            title="Density & Solids"
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="densitySolids.mudWeightIn"
                  control={control}
                  label="MW In"
                  placeholder="12.4"
                  type="text"
                  suffix="ppg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="densitySolids.mudWeightOut"
                  control={control}
                  label="MW Out"
                  placeholder="12.4"
                  type="text"
                  suffix="ppg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="densitySolids.lgs"
                  control={control}
                  label="LGS (%)"
                  placeholder="8.3"
                  type="text"
                  suffix="%"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="densitySolids.hgs"
                  control={control}
                  label="HGS (%)"
                  placeholder="9.5"
                  type="text"
                  suffix="%"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="densitySolids.salinity"
                  control={control}
                  label="Salinity"
                  placeholder="15.0"
                  type="text"
                  suffix="ppk"
                />
              </div>
            </div>
          </PanelCard>

          {/* ---- Temperature Section ---- */}
          <PanelCard
            title="Temperature"
            headerAction={<RestoreDefaultsButton />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="temperature.surfaceTemp"
                  control={control}
                  label="Surface Temp"
                  placeholder="85"
                  type="text"
                  suffix="°F"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="temperature.bottomholeTemp"
                  control={control}
                  label="Bottomhole"
                  placeholder="210"
                  type="text"
                  suffix="°F"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="temperature.calculation"
                  control={control}
                  label="Calculation"
                  placeholder="+ 0.62"
                  type="text"
                  suffix="°F/100ft"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="temperature.densitometryTemp"
                  control={control}
                  label="Densitometry Temperature"
                  placeholder="170"
                  type="text"
                  suffix="°F"
                />
              </div>
            </div>
          </PanelCard>

          {/* ---- Gas / Compressibility Section ---- */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Gas / Compressibility</span>
                {compressibilityEnabled && (
                  <StatusBadge status={gasStatus} className="text-sm" />
                )}
              </div>
            }
            headerAction={
              <CommonFormToggle
                name="gasCompressibility.compressibility"
                control={control}
                label="Compressibility"
              />
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <CommonFormInput
                    name="gasCompressibility.gasCut"
                    control={control}
                    label="Gas-cut"
                    placeholder="0"
                    type="text"
                    suffix="%"
                    disabled={!compressibilityEnabled}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <CommonFormInput
                    name="gasCompressibility.compressibilityFactor"
                    control={control}
                    label="Compressibility factor"
                    placeholder="0.00030"
                    type="text"
                    suffix="1/psi"
                    disabled={!compressibilityEnabled}
                  />
                </div>
              </div>

              {compressibilityEnabled && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Gas status:</span>
                  <StatusBadge status={gasStatus} className="text-sm" />
                  <span className="text-muted-foreground ml-4">
                    {gasDetected ? "Gas detected" : "No gas detected"}
                  </span>
                </div>
              )}
            </div>
          </PanelCard>
        </div>

        {/* ---- Sidebar Content ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          {/* ---- Mud Profile Overview ---- */}
          <PanelCard title="Mud Profile Overview">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Calculated ECD @ BH:
                </span>
                <span className="font-medium">12.91 ppg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated BHP:</span>
                <span className="font-medium">6187 psi</span>
              </div>
            </div>
          </PanelCard>

          {/* ---- Validation Status ---- */}
          <PanelCard title="Validation Status">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">MW range</span>
                <StatusBadge status="OK" className="text-sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rheology range</span>
                <StatusBadge status="OK" className="text-sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Temp correction</span>
                <StatusBadge status="OK" className="text-sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Compressibility</span>
                <StatusBadge status="Disconnected" className="text-sm" />
              </div>
            </div>
          </PanelCard>

          {/* ---- Preset Management ---- */}
          <PanelCard title="Preset Management">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <CommonButton variant="outline" size="sm" className="w-full">
                  Load Preset
                </CommonButton>
                <CommonButton variant="outline" size="sm" className="w-full">
                  Save Preset
                </CommonButton>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <CommonButton variant="outline" size="sm" className="w-full">
                  Export
                </CommonButton>
                <CommonButton variant="outline" size="sm" className="w-full">
                  Import
                </CommonButton>
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                NFQ-21-6A OBM 70/30
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• MW 12.4 ppg</div>
                <div>• PV 20 cP</div>
                <div>• YP 10 lb/100ft²</div>
                <div>• Gels 12 / 20 lb/100ft²</div>
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
