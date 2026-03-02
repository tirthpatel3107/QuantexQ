// React & Hooks
import { useState, useEffect } from "react";

// Form & Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Hooks
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - UI
import { PanelCard } from "@/components/dashboard/PanelCard";

// Components - Common
import {
  CommonButton,
  SectionSkeleton,
  FormSaveDialog,
  StatusBadge,
  CommonFormToggle,
  CommonFormInput,
  CommonFormSelect,
} from "@/components/common";

// Components - Local
import { HealthMonitoringPanel } from "./common/HealthMonitoringPanel";

// Services & API
import {
  useRoutingData,
  useSaveRoutingData,
  useRoutingOptions,
} from "@/services/api/network/network.api";

// Types & Schemas
import {
  routingFormSchema,
  ROUTING_INITIAL_DATA,
  type RoutingFormValues,
} from "@/utils/schemas/routing-schema";
import type { SaveRoutingPayload } from "@/services/api/network/network.types";

// Contexts
import { useNetworkContext } from "@/context/Network";

// Icons
import { Plus } from "lucide-react";

/**
 * Routing Component
 *
 * Manages the data routing rules between inputs (Rig PLC, PWD) and output channels.
 * Configures single loop control, dualQ control, and custom routing rules.
 *
 * @returns JSX.Element
 */
export function Routing() {
  // ---- Data & State ----
  const { data: routingResponse, isLoading } = useRoutingData();
  const { data: optionsResponse } = useRoutingOptions();
  const { mutate: saveRoutingData } = useSaveRoutingData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Track if we have set initial data from API to prevent unnecessary form resets
  const [hasSetInitial, setHasSetInitial] = useState(false);

  // ---- Form Management ----
  const formMethods = useForm<RoutingFormValues>({
    resolver: zodResolver(routingFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // ---- Effects & Side Effects ----

  /**
   * Sync form with fetched data
   * Only runs once when data is initially loaded.
   */
  useEffect(() => {
    if (routingResponse?.data && !hasSetInitial) {
      // NOTE: Using initial data constant for now as per previous implementation logic
      reset(ROUTING_INITIAL_DATA);
      setHasSetInitial(true);
    }
  }, [routingResponse, hasSetInitial, reset]);

  /**
   * Handle save and confirmation using the unified confirmation hook.
   * Transforms the flat form structure back into the API-expected format.
   */
  const saveWithConfirmation = useSaveWithConfirmation<SaveRoutingPayload>({
    onSave: () => {
      // Transform form data back to API format
      const payload: SaveRoutingPayload = {
        routes: routingResponse?.data?.routes || [],
      };

      return new Promise<void>((resolve, reject) => {
        saveRoutingData(payload, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Routing settings saved successfully",
    errorMessage: "Failed to save routing settings",
    confirmTitle: "Save Routing Settings",
    confirmDescription: "Are you sure you want to save these routing changes?",
  });

  /**
   * Register the save handler with the NetworkContext.
   * This allows the global 'Save' button in the layout to trigger this form's submission.
   */
  useEffect(() => {
    const handleSave = handleSubmit(() => {
      saveWithConfirmation.requestSave({} as SaveRoutingPayload);
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
  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-max">
            {/* ---- Rig PLC Source Section ---- */}
            <PanelCard
              title={
                <div className="flex items-center gap-2">
                  <span>Rig PLC</span>
                  <StatusBadge status="Primary" className="text-xs" />
                </div>
              }
              headerAction={
                <div className="flex items-center gap-2">
                  <span className="text-sm">Modbus TCP</span>
                  <CommonFormToggle
                    name="rigPlc.enabled"
                    control={control}
                    label=""
                  />
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-8">
                  Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD
                  (optional)
                </p>

                {/* Network Connectivity Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 text-sm">
                  <div className="flex gap-2">
                    <CommonFormInput
                      name="rigPlc.endpoint"
                      control={control}
                      label="Input Data"
                      placeholder="10.1.0.11"
                      type="text"
                      containerClassName="flex-1"
                    />
                    <CommonFormInput
                      name="rigPlc.subnet"
                      control={control}
                      label=" "
                      placeholder="0"
                      type="text"
                      containerClassName="w-20"
                    />
                    <CommonFormInput
                      name="rigPlc.port"
                      control={control}
                      label=" "
                      placeholder="502"
                      type="text"
                      containerClassName="w-20"
                    />
                  </div>
                  <CommonFormSelect
                    name="rigPlc.portConfig"
                    control={control}
                    label="Port"
                    options={options?.portOptions || []}
                  />
                </div>
              </div>
            </PanelCard>

            {/* ---- PWD Secondary Source Section ---- */}
            <PanelCard
              title={
                <div className="flex items-center gap-2">
                  <span>PWD</span>
                  <StatusBadge status="Secondary" className="text-xs" />
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <CommonFormInput
                    name="pwd.protocol"
                    control={control}
                    label="Protocol"
                    placeholder="WITS (TCP)"
                    containerClassName="text-sm"
                  />
                  <CommonFormInput
                    name="pwd.tag"
                    control={control}
                    label="Tag"
                    placeholder="1.0.335"
                    containerClassName="text-sm"
                  />
                  <CommonButton variant="outline" className="text-sm px-3 mt-8">
                    BROWSE
                  </CommonButton>
                </div>

                <CommonButton variant="outline" icon={Plus} iconPosition="left">
                  Add Routing Rule...
                </CommonButton>
              </div>
            </PanelCard>
          </div>

          <div className="grid grid-cols-1 gap-3 auto-rows-max">
            {/* ---- Detailed Routing Rules Section ---- */}
            <PanelCard title="Routing">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-8">
                  Input Data: Rig PLC (Tags)
                </p>

                <div className="space-y-3">
                  {/* Output Channels Group */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium">
                        Output Channels
                      </span>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium">
                          Single Loop Control
                        </span>
                        <span className="text-sm text-muted-foreground">|</span>
                        <CommonFormToggle
                          name="outputChannels.enabled"
                          control={control}
                          label="Tag Map"
                        />
                      </div>
                    </div>

                    {/* Primary Channel Configuration */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonFormInput
                        name="outputChannels.chokeA"
                        control={control}
                        placeholder="ChokeA_Pos"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="outputChannels.mpdSbp"
                        control={control}
                        placeholder="MPD SBP"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="outputChannels.chokeOutputs"
                        control={control}
                        placeholder="ChokeB_PS | ChokeB_Pos | Choke_SP"
                        containerClassName="text-sm"
                      />
                    </div>

                    {/* Supplementary Channel Configuration */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonFormInput
                        name="outputChannels.sbInCoop"
                        control={control}
                        placeholder="SBIn Coop (Enbl)"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="outputChannels.sbpSsp"
                        control={control}
                        placeholder="SBP_SSP"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="outputChannels.sbpSspOutput"
                        control={control}
                        placeholder="SBP_SSP"
                        containerClassName="text-sm"
                      />
                    </div>
                  </div>

                  {/* DualQ Control Group */}
                  <div className="pt-5">
                    <span className="text-sm font-medium">DualQ Control</span>

                    {/* Primary DualQ Inputs */}
                    <div className="grid grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonFormInput
                        name="dualQControl.mpdQIn"
                        control={control}
                        placeholder="MPD Q 0 in"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="dualQControl.chokeQOut"
                        control={control}
                        placeholder="(Choke 0.0 0a)"
                        containerClassName="text-sm"
                      />
                      <div className="flex gap-2 justify-end">
                        <CommonFormToggle
                          name="dualQControl.enabled"
                          control={control}
                          label="EqmptEmacer"
                        />
                      </div>
                    </div>

                    {/* Flow and Alternate Inputs */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2">
                      <CommonFormInput
                        name="dualQControl.flowQIn"
                        control={control}
                        placeholder="Flow_Q-In"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="dualQControl.mpdQInAlt"
                        control={control}
                        placeholder="MPD Q in"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="dualQControl.flowOutputs"
                        control={control}
                        placeholder="Flow Q Out | Aux Flow"
                        containerClassName="text-sm"
                      />
                    </div>

                    {/* Auxiliary and Setpoint Inputs */}
                    <div className="grid grid-cols-3 xl:grid-cols-[1fr_1fr_2fr] gap-2">
                      <CommonFormInput
                        name="dualQControl.mpdQAux"
                        control={control}
                        placeholder="MPD Q ux"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="dualQControl.mpdQSet"
                        control={control}
                        placeholder="MPD Q Set"
                        containerClassName="text-sm"
                      />
                      <CommonFormInput
                        name="dualQControl.mpdQAex"
                        control={control}
                        placeholder="MPD Q aex"
                        containerClassName="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PanelCard>
          </div>
        </div>

        {/* Sidebar Sidebar Content */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <HealthMonitoringPanel />
        </div>
      </div>

      {/* Confirmation Dialog for form submission */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
