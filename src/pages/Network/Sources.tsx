// React & Hooks
import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - Common
import {
  CommonAccordionItem,
  SectionSkeleton,
  FormSaveDialog,
  StatusBadge,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
} from "@/components/common";

// Components - Local
import { HealthMonitoringPanel } from "./common/HealthMonitoringPanel";
import { PanelCard } from "@/components/dashboard/PanelCard";

// Services & API
import {
  useSourcesData,
  useSaveSourcesData,
  useSourcesOptions,
} from "@/services/api/network/network.api";

// Types & Schemas
import {
  sourcesFormSchema,
  type SourcesFormValues,
} from "@/utils/schemas/sources";
import type { SaveSourcesPayload } from "@/services/api/network/network.types";

// Contexts
import { useNetworkContext } from "@/context/network";

/**
 * Sources Component
 *
 * Manages the configuration for data sources including Rig PLC settings,
 * Device lists from the PLC, and PWD WITS configuration.
 * Integrates with NetworkContext for centralized save management.
 *
 * @returns JSX.Element
 */
export function Sources() {
  // ---- Data & State ----
  const { data: sourcesResponse, isLoading } = useSourcesData();
  const { data: optionsResponse } = useSourcesOptions();
  const { mutate: saveSourcesData } = useSaveSourcesData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<SourcesFormValues>({
    resolver: zodResolver(sourcesFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded
   */
  useEffect(() => {
    if (sourcesResponse?.data && !hasSetInitial) {
      const { rigPlc, pwdWits, devices } = sourcesResponse.data;
      reset({ rigPlc, pwdWits, devices });
      // Use timeout to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setHasSetInitial(true);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [sourcesResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   * This logic is shared across network pages for a consistent experience.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveSourcesPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveSourcesData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Sources settings saved successfully",
    errorMessage: "Failed to save sources settings",
    confirmTitle: "Save Sources Settings",
    confirmDescription: "Are you sure you want to save these sources changes?",
  });

  /**
   * Register the save handler with the NetworkContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveSourcesPayload);
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
  if (isLoading || !hasSetInitial || !sourcesResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  const connectionStatus = sourcesResponse.data.rigPlc.connectionStatus;
  const sourceType = sourcesResponse.data.rigPlc.sourceType || "N/A";
  const devicesItems = sourcesResponse.data.devices.items || [];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-max">
          {/* ---- Rig PLC Source Section ---- */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Rig PLC</span>
                <StatusBadge status={connectionStatus} className="text-xs" />
              </div>
            }
            headerAction={
              <CommonFormToggle
                name="rigPlc.enabled"
                control={control}
                label="Modbus TCP"
              />
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-5">
                Source Type: {sourceType}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-2">
                  <CommonFormInput
                    name="rigPlc.endpoint"
                    control={control}
                    label="Endpoint"
                    placeholder="10.1.0.11"
                    type="text"
                    containerClassName="flex-1"
                  />
                  <CommonFormInput
                    name="rigPlc.port"
                    control={control}
                    label="Port"
                    placeholder="502"
                    type="number"
                    containerClassName="w-[100px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <CommonFormSelect
                    name="rigPlc.tagMap"
                    control={control}
                    label="Tag Map"
                    options={options?.tagMapOptions || []}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <CommonFormSelect
                    name="rigPlc.dataRate"
                    control={control}
                    label="Data rate"
                    options={options?.dataRateOptions || []}
                  />
                </div>
              </div>
            </div>
          </PanelCard>

          {/* ---- Devices List (from PLC) ---- */}
          <PanelCard
            title="Devices (from PLC)"
            headerAction={
              <CommonFormToggle
                name="devices.enabled"
                control={control}
                label=""
              />
            }
          >
            <div className="space-y-4">
              {devicesItems.map(
                ({ id, name, tags, healthStatus, healthCount }) => (
                  <CommonAccordionItem
                    key={id}
                    title={name}
                    tags={tags}
                    healthStatus={healthStatus}
                    healthCount={healthCount}
                  />
                ),
              )}
            </div>
          </PanelCard>

          {/* ---- PWD WITS Configuration ---- */}
          <PanelCard
            title="PWD WITS (TCP)"
            headerAction={
              <CommonFormToggle
                name="pwdWits.enabled"
                control={control}
                label=""
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-2">
                <CommonFormInput
                  name="pwdWits.endpoint"
                  control={control}
                  label="Endpoint"
                  placeholder="10.1.0.11"
                  type="text"
                  containerClassName="flex-1"
                />
                <CommonFormInput
                  name="pwdWits.port"
                  control={control}
                  label="Port"
                  placeholder="502"
                  type="number"
                  containerClassName="w-[100px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormSelect
                  name="pwdWits.dataRate"
                  control={control}
                  label="Data rate"
                  options={options?.dataRateOptions || []}
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormSelect
                  name="pwdWits.frequency"
                  control={control}
                  label="Frequency"
                  options={options?.frequencyOptions || []}
                />
              </div>

              <div className="flex flex-col gap-1">
                <CommonFormInput
                  name="pwdWits.tagMap"
                  control={control}
                  label="Tag Map"
                  placeholder="10.1.0.11"
                  type="text"
                />
              </div>
            </div>
          </PanelCard>
        </div>

        {/* ---- Sidebar Content ---- */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <HealthMonitoringPanel />
        </div>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
