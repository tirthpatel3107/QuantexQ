// React & Hooks
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import {
  sourcesFormSchema,
  type SourcesFormValues,
} from "@/utils/schemas/sources-schema";

// Components - UI & Icons
import { PanelCard } from "@/components/dashboard/PanelCard";
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

// Services & Types
import {
  useSourcesData,
  useSaveSourcesData,
  useSourcesOptions,
} from "@/services/api/network/network.api";
import type { SaveSourcesPayload } from "@/services/api/network/network.types";

// Context
import { useNetworkContext } from "@/context/Network";

export function Sources() {
  const { data: sourcesResponse, isLoading } = useSourcesData();
  const { data: optionsResponse } = useSourcesOptions();
  const { mutate: saveSourcesData } = useSaveSourcesData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Initialize form
  const formMethods = useForm<SourcesFormValues>({
    resolver: zodResolver(sourcesFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // Track if we have set initial data
  const [hasSetInitial, setHasSetInitial] = useState(false);

  useEffect(() => {
    if (sourcesResponse?.data && !hasSetInitial) {
      const { rigPlc, pwdWits, devices } = sourcesResponse.data;
      reset({ rigPlc, pwdWits, devices });
      setHasSetInitial(true);
    }
  }, [sourcesResponse, hasSetInitial, reset]);

  // Handle save and confirmation using the same UI flow as useSectionForm
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

  // Attach context's save to RHF handleSubmit
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

  if (isLoading || !hasSetInitial || !sourcesResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  const connectionStatus = sourcesResponse.data.rigPlc.connectionStatus;
  const sourceType = sourcesResponse.data.rigPlc.sourceType || "N/A";
  const devicesItems = sourcesResponse.data.devices.items || [];

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
          {/* Rig PLC Source */}
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

          {/* Devices (from PLC) */}
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

          {/* PWD WITS */}
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
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <HealthMonitoringPanel />
        </div>
      </div>

      {/* FormSaveDialog needs the shape returned by useSaveWithConfirmation */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
