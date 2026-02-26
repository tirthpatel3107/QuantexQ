// React & Hooks
import { useState, useMemo } from "react";
import { useSectionForm } from "@/shared/hooks/useSectionForm";

// Components - UI & Icons
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "@/components/ui/radio-group";
import { PanelCard } from "@/pages/Dashboard/components/PanelCard";
import {
  CommonInput,
  CommonRadio,
  SectionSkeleton,
  FormSaveDialog,
} from "@/shared/components";

// Components - Local
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

// Services & Types
import {
  useProtocolsData,
  useSaveProtocolsData,
  useProtocolsOptions,
} from "@/services/api/network/network.api";
import type { SaveProtocolsPayload } from "@/services/api/network/network.types";

// Context
import { useNetworkContext } from "../../../context/NetworkContext";

export function Protocols() {
  const { data: protocolsResponse, isLoading } = useProtocolsData();
  const { data: optionsResponse } = useProtocolsOptions();
  const { mutate: saveProtocolsData } = useSaveProtocolsData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!protocolsResponse?.data) return undefined;
    const { protocols } = protocolsResponse.data;
    return { protocols };
  }, [protocolsResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveProtocolsPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveProtocolsData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Protocols settings saved successfully",
    errorMessage: "Failed to save protocols settings",
    confirmTitle: "Save Protocols Settings",
    confirmDescription:
      "Are you sure you want to save these protocols changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { protocols } = form.formData;

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

              <RadioGroup defaultValue="modbus-tcp" className="space-y-3">
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
                  <div className="ml-6 space-y-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      <CommonInput
                        placeholder="10.1.0.1:13:502"
                        onChange={(e) => form.updateLocalField({ protocols })}
                      />
                      <CommonInput
                        placeholder="10.1.0.113:502"
                        onChange={(e) => form.updateLocalField({ protocols })}
                      />
                    </div>
                  </div>
                </div>

                {/* OPC-UA */}
                <div className="space-y-3">
                  <CommonRadio
                    id="opc-ua"
                    value="opc-ua"
                    label="OPC-UA (UA-TCP)"
                  />
                  <div className="ml-6 grid grid-cols-1 lg:grid-cols-2">
                    <CommonInput
                      placeholder="opc.tcp 10.1.0.113:49320"
                      onChange={(e) => form.updateLocalField({ protocols })}
                    />
                  </div>
                </div>

                {/* Ethernet/IP */}
                <div className="space-y-3">
                  <CommonRadio
                    id="ethernet-ip"
                    value="ethernet-ip"
                    label="Ethernet/IP"
                  />
                  <div className="ml-6 grid grid-cols-1 lg:grid-cols-2">
                    <CommonInput
                      placeholder="100.10.1.14:10.13:40818"
                      onChange={(e) => form.updateLocalField({ protocols })}
                    />
                  </div>
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

              <RadioGroup defaultValue="direct-wits" className="space-y-3 pt-3">
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

      <FormSaveDialog form={form} />
    </>
  );
}
