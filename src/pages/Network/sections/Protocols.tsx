// React & Hooks
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Components - UI & Icons
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "@/components/ui/radio-group";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonInput,
  CommonRadio,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";

// Components - Local
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

// Services & Types
import {
  useProtocolsData,
  useSaveProtocolsData,
} from "@/services/api/network/network.api";
import type { SaveProtocolsPayload } from "@/services/api/network/network.types";

// Context
import { useNetworkContext } from "../../../context/Network/NetworkContext";

export const protocolsFormSchema = z.object({
  rigPlc: z.object({
    type: z.enum(["modbus-tcp", "opc-ua", "ethernet-ip"]),
    modbusEndpoints: z.array(z.string()).optional(),
    opcEndpoint: z.string().optional(),
    ethernetEndpoint: z.string().optional(),
  }),
  pwd: z.object({
    type: z.enum(["direct-wits", "witsml-left", "mqtt", "tcp-udp-left", "witsml-right", "tcp-udp-right"]),
    endpoint: z.string().optional(),
  }),
}).superRefine((data, ctx) => {
  if (data.rigPlc.type === "modbus-tcp") {
    if (!data.rigPlc.modbusEndpoints || data.rigPlc.modbusEndpoints.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one Modbus endpoint is required",
        path: ["rigPlc", "modbusEndpoints"],
      });
    } else {
      data.rigPlc.modbusEndpoints.forEach((endpoint, index) => {
        if (!endpoint || endpoint.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Endpoint cannot be empty",
            path: ["rigPlc", "modbusEndpoints", index],
          });
        }
      });
    }
  } else if (data.rigPlc.type === "opc-ua") {
    if (!data.rigPlc.opcEndpoint || data.rigPlc.opcEndpoint.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "OPC-UA endpoint is required",
        path: ["rigPlc", "opcEndpoint"],
      });
    }
  } else if (data.rigPlc.type === "ethernet-ip") {
    if (!data.rigPlc.ethernetEndpoint || data.rigPlc.ethernetEndpoint.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ethernet/IP endpoint is required",
        path: ["rigPlc", "ethernetEndpoint"],
      });
    }
  }
});

type ProtocolsFormValues = z.infer<typeof protocolsFormSchema>;

export function Protocols() {
  const { data: protocolsResponse, isLoading } = useProtocolsData();
  const { mutate: saveProtocolsData } = useSaveProtocolsData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  // Initialize form
  const formMethods = useForm<ProtocolsFormValues>({
    resolver: zodResolver(protocolsFormSchema),
  });

  const { reset, handleSubmit, watch, setValue, formState: { errors } } = formMethods;

  // Track if we have set initial data
  const [hasSetInitial, setHasSetInitial] = useState(false);

  useEffect(() => {
    if (protocolsResponse?.data && !hasSetInitial) {
      const { rigPlc, pwd } = protocolsResponse.data;
      reset({ rigPlc, pwd });
      setHasSetInitial(true);
    }
  }, [protocolsResponse, hasSetInitial, reset]);

  // Handle save and confirmation using the same UI flow as Sources
  const saveWithConfirmation = useSaveWithConfirmation<SaveProtocolsPayload>({
    onSave: (data) => {
      return new Promise<void>((resolve, reject) => {
        saveProtocolsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Protocols settings saved successfully",
    errorMessage: "Failed to save protocols settings",
    confirmTitle: "Save Protocols Settings",
    confirmDescription: "Are you sure you want to save these protocols changes?",
  });

  // Attach context's save to RHF handleSubmit
  useEffect(() => {
    const handleSave = handleSubmit((validData) => {
      saveWithConfirmation.requestSave(validData as SaveProtocolsPayload);
    });

    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [handleSubmit, registerSaveHandler, unregisterSaveHandler, saveWithConfirmation]);

  if (isLoading || !hasSetInitial || !protocolsResponse?.data) {
    return <SectionSkeleton count={6} />;
  }

  const rigPlcType = watch("rigPlc.type");
  const pwdType = watch("pwd.type");

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 auto-rows-max">
          {/* Rig PLC Card */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Rig PLC</span>
                <Badge variant="default" className="text-sm">
                  Primary
                </Badge>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-8">
                Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
              </p>

              <RadioGroup 
                value={rigPlcType}
                onValueChange={(value) => setValue("rigPlc.type", value as "modbus-tcp" | "opc-ua" | "ethernet-ip")}
                className="space-y-3"
              >
                {/* Modbus TCP */}
                <div className="space-y-3">
                  <CommonRadio
                    id="modbus-tcp"
                    value="modbus-tcp"
                    label={
                      <div className="flex items-center gap-2">
                        <span>Modbus TCP</span>
                        <Badge variant="default" className="text-sm">
                          16.9.20
                        </Badge>
                      </div>
                    }
                  />
                  {rigPlcType === "modbus-tcp" && (
                    <div className="ml-6 space-y-2">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        <div>
                          <CommonInput
                            placeholder="10.1.0.1:13:502"
                            value={watch("rigPlc.modbusEndpoints.0") || ""}
                            onChange={(e) => {
                              const endpoints = watch("rigPlc.modbusEndpoints") || [];
                              const newEndpoints = [...endpoints];
                              newEndpoints[0] = e.target.value;
                              setValue("rigPlc.modbusEndpoints", newEndpoints);
                            }}
                          />
                          {errors.rigPlc?.modbusEndpoints?.[0] && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.rigPlc.modbusEndpoints[0].message}
                            </p>
                          )}
                        </div>
                        <div>
                          <CommonInput
                            placeholder="10.1.0.113:502"
                            value={watch("rigPlc.modbusEndpoints.1") || ""}
                            onChange={(e) => {
                              const endpoints = watch("rigPlc.modbusEndpoints") || [];
                              const newEndpoints = [...endpoints];
                              newEndpoints[1] = e.target.value;
                              setValue("rigPlc.modbusEndpoints", newEndpoints);
                            }}
                          />
                          {errors.rigPlc?.modbusEndpoints?.[1] && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.rigPlc.modbusEndpoints[1].message}
                            </p>
                          )}
                        </div>
                      </div>
                      {errors.rigPlc?.modbusEndpoints && typeof errors.rigPlc.modbusEndpoints === 'object' && 'message' in errors.rigPlc.modbusEndpoints && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.rigPlc.modbusEndpoints.message as string}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* OPC-UA */}
                <div className="space-y-3">
                  <CommonRadio
                    id="opc-ua"
                    value="opc-ua"
                    label="OPC-UA (UA-TCP)"
                  />
                  {rigPlcType === "opc-ua" && (
                    <div className="ml-6 grid grid-cols-1 lg:grid-cols-2">
                      <div>
                        <CommonInput
                          placeholder="opc.tcp 10.1.0.113:49320"
                          value={watch("rigPlc.opcEndpoint") || ""}
                          onChange={(e) => setValue("rigPlc.opcEndpoint", e.target.value)}
                        />
                        {errors.rigPlc?.opcEndpoint && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.rigPlc.opcEndpoint.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ethernet/IP */}
                <div className="space-y-3">
                  <CommonRadio
                    id="ethernet-ip"
                    value="ethernet-ip"
                    label="Ethernet/IP"
                  />
                  {rigPlcType === "ethernet-ip" && (
                    <div className="ml-6 grid grid-cols-1 lg:grid-cols-2">
                      <div>
                        <CommonInput
                          placeholder="100.10.1.14:10.13:40818"
                          value={watch("rigPlc.ethernetEndpoint") || ""}
                          onChange={(e) => setValue("rigPlc.ethernetEndpoint", e.target.value)}
                        />
                        {errors.rigPlc?.ethernetEndpoint && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.rigPlc.ethernetEndpoint.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          </PanelCard>

          {/* PWD Card */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>PWD</span>
                <Badge variant="default" className="text-sm">
                  Encerate-MW9
                </Badge>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-5">
                Source Type: SECONDARY (PWD)
              </p>
              <div className="flex items-center justify-between text-sm">
                <Badge variant="default" className="text-sm font-mono">
                  1.0.1:250.49155
                </Badge>
              </div>

              <RadioGroup 
                value={pwdType}
                onValueChange={(value) => setValue("pwd.type", value as "direct-wits" | "witsml-left" | "mqtt" | "tcp-udp-left" | "witsml-right" | "tcp-udp-right")}
                className="space-y-3 pt-3"
              >
                {/* Direct WITS */}
                <CommonRadio
                  id="direct-wits"
                  value="direct-wits"
                  label="Direct WITS (0.0.09155)"
                />

                {/* WITSML Left */}
                <CommonRadio
                  id="witsml-left"
                  value="witsml-left"
                  label="WITSML (3.0)"
                />

                {/* MQTT */}
                <CommonRadio
                  id="mqtt"
                  value="mqtt"
                  label="MQTT (Password, CA)"
                />

                {/* TCP/UDP Left */}
                <CommonRadio
                  id="tcp-udp-left"
                  value="tcp-udp-left"
                  label="TCP / UDP 10.2.4.35000"
                />

                {/* WITSML Right */}
                <CommonRadio
                  id="witsml-right"
                  value="witsml-right"
                  label="WITSML (3.0)"
                />

                {/* TCP/UDP Right */}
                <CommonRadio
                  id="tcp-udp-right"
                  value="tcp-udp-right"
                  label="TCP / UDP 10.2.4.35000"
                />
              </RadioGroup>
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
