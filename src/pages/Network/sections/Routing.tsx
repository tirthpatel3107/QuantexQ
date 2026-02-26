// React & Hooks
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - UI & Icons
import { Plus } from "lucide-react";
import { PanelCard } from "@/components/dashboard/PanelCard";
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
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

// Services & Types
import {
  useRoutingData,
  useSaveRoutingData,
  useRoutingOptions,
} from "@/services/api/network/network.api";
import type { SaveRoutingPayload } from "@/services/api/network/network.types";

// Context
import { useNetworkContext } from "../../../context/Network/NetworkContext";

// --- Validation Schema ---
const routingFormSchema = z.object({
  rigPlc: z.object({
    enabled: z.boolean(),
    endpoint: z.string().min(1, "Endpoint is required"),
    subnet: z.string().min(1, "Subnet is required"),
    port: z.string().min(1, "Port is required"),
    portConfig: z.string().min(1, "Port config is required"),
  }),
  pwd: z.object({
    protocol: z.string().min(1, "Protocol is required"),
    tag: z.string().min(1, "Tag is required"),
  }),
  outputChannels: z.object({
    enabled: z.boolean(),
    chokeA: z.string().min(1, "Choke A is required"),
    mpdSbp: z.string().min(1, "MPD SBP is required"),
    chokeOutputs: z.string().min(1, "Choke outputs is required"),
    sbInCoop: z.string().min(1, "SB In Coop is required"),
    sbpSsp: z.string().min(1, "SBP SSP is required"),
    sbpSspOutput: z.string().min(1, "SBP SSP output is required"),
  }),
  dualQControl: z.object({
    enabled: z.boolean(),
    mpdQIn: z.string().min(1, "MPD Q In is required"),
    chokeQOut: z.string().min(1, "Choke Q Out is required"),
    flowQIn: z.string().min(1, "Flow Q In is required"),
    mpdQInAlt: z.string().min(1, "MPD Q In Alt is required"),
    flowOutputs: z.string().min(1, "Flow outputs is required"),
    mpdQAux: z.string().min(1, "MPD Q Aux is required"),
    mpdQSet: z.string().min(1, "MPD Q Set is required"),
    mpdQAex: z.string().min(1, "MPD Q Aex is required"),
  }),
});

type RoutingFormValues = z.infer<typeof routingFormSchema>;

const initialData: RoutingFormValues = {
  rigPlc: {
    enabled: true,
    endpoint: "",
    subnet: "",
    port: "",
    portConfig: "",
  },
  pwd: {
    protocol: "",
    tag: "",
  },
  outputChannels: {
    enabled: true,
    chokeA: "",
    mpdSbp: "",
    chokeOutputs: "",
    sbInCoop: "",
    sbpSsp: "",
    sbpSspOutput: "",
  },
  dualQControl: {
    enabled: true,
    mpdQIn: "",
    chokeQOut: "",
    flowQIn: "",
    mpdQInAlt: "",
    flowOutputs: "",
    mpdQAux: "",
    mpdQSet: "",
    mpdQAex: "",
  },
};

export function Routing() {
  const { data: routingResponse, isLoading } = useRoutingData();
  const { data: optionsResponse } = useRoutingOptions();
  const { mutate: saveRoutingData } = useSaveRoutingData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Initialize form
  const formMethods = useForm<RoutingFormValues>({
    resolver: zodResolver(routingFormSchema),
  });

  const { reset, control, handleSubmit } = formMethods;

  // Track if we have set initial data
  const [hasSetInitial, setHasSetInitial] = useState(false);

  useEffect(() => {
    if (routingResponse?.data && !hasSetInitial) {
      // Initialize form with API data

      reset(initialData);
      setHasSetInitial(true);
    }
  }, [routingResponse, hasSetInitial, reset]);

  // Handle save and confirmation using the same UI flow as Sources
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

  // Attach context's save to RHF handleSubmit
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

  if (isLoading || !hasSetInitial) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-max">
            {/* Rig PLC Primary Card */}
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

                {/* Input Data */}
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

            {/* PWD Secondary Card */}
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
            {/* Routing Card */}
            <PanelCard title="Routing">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-8">
                  Input Data: Rig PLC (Tags)
                </p>

                {/* Output Channels */}
                <div className="space-y-3">
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

                    {/* First row */}
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

                    {/* Second row */}
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

                  {/* DualQ Control */}
                  <div className="pt-5">
                    <span className="text-sm font-medium">DualQ Control</span>

                    {/* First row */}
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

                    {/* Second row */}
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

                    {/* Third row */}
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

        {/* Health Monitoring Panel */}
        <div className="grid grid-cols-1 gap-3 auto-rows-max">
          <HealthMonitoringPanel />
        </div>
      </div>

      {/* FormSaveDialog needs the shape returned by useSaveWithConfirmation */}
      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
