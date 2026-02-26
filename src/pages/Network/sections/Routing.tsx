// React & Hooks
import { useState, useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonButton,
  CommonInput,
  CommonSelect,
  CommonToggle,
  SectionSkeleton,
  FormSaveDialog,
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
import { useNetworkContext } from "../NetworkContext";

export function Routing() {
  const { data: routingResponse, isLoading } = useRoutingData();
  const { data: optionsResponse } = useRoutingOptions();
  const { mutate: saveRoutingData } = useSaveRoutingData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;
  const [modbusEnabled, setModbusEnabled] = useState(true);
  const [eqmptEmacerEnabled, setEqmptEmacerEnabled] = useState(true);

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!routingResponse?.data) return undefined;
    const { routes } = routingResponse.data;
    return { routes };
  }, [routingResponse?.data]);

  // Use the reusable form hook
  const form = useSectionForm<SaveRoutingPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveRoutingData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Routing settings saved successfully",
    errorMessage: "Failed to save routing settings",
    confirmTitle: "Save Routing Settings",
    confirmDescription: "Are you sure you want to save these routing changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { routes } = form.formData;

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
                  <Badge variant="secondary" className="text-sm">
                    Primary
                  </Badge>
                </div>
              }
              headerAction={
                <div className="flex items-center gap-2">
                  <span className="text-sm">Modbus TCP</span>
                  <CommonToggle
                    label=""
                    checked={modbusEnabled}
                    onCheckedChange={(checked) => {
                      setModbusEnabled(checked);
                      form.updateLocalField({ routes });
                    }}
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
                    <CommonInput
                      label="Input Data"
                      value="10.1.0.113"
                      onChange={(e) => form.updateLocalField({ routes })}
                      placeholder="10.1.0.11"
                      type="text"
                      className="flex-1"
                    />
                    <CommonInput
                      label=" "
                      value="0"
                      onChange={(e) => form.updateLocalField({ routes })}
                      placeholder="0"
                      type="text"
                    />
                    <CommonInput
                      label=" "
                      value="502"
                      onChange={(e) => form.updateLocalField({ routes })}
                      placeholder="502"
                      type="text"
                    />
                  </div>
                  <CommonSelect
                    label="Port"
                    value="502"
                    onValueChange={(value) => form.updateLocalField({ routes })}
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
                  <Badge variant="secondary" className="text-sm">
                    SECONDARY (PWD)
                  </Badge>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <CommonInput
                    label="Snecron (Dy"
                    value="WITS (TCP)"
                    onChange={(e) => form.updateLocalField({ routes })}
                    className="text-sm"
                  />
                  <CommonInput
                    label="Tag"
                    value="1.0.335"
                    onChange={(e) => form.updateLocalField({ routes })}
                    className="text-sm"
                  />
                  <CommonButton variant="outline" className="text-sm px-3 mt-8">
                    AFINSE
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
                        <CommonToggle
                          label="Tag Mac"
                          checked={true}
                          onCheckedChange={(checked) =>
                            form.updateLocalField({ routes })
                          }
                        />
                      </div>
                    </div>

                    {/* First row: input : input */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonInput
                        value="ChokeA_Pos"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD SBP"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="ChokeB_PS | ChokeB_Pos | Choke_SP"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                    </div>

                    {/* Second row: input : input */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonInput
                        value="SBIn Coop (Enbl)"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="SBP_SSP"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="SBP_SSP"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* DualQ Control */}
                  <div className="pt-5">
                    <span className="text-sm font-medium">DualQ Control</span>

                    {/* First row: input input toggle */}
                    <div className="grid grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonInput
                        value="MPD Q 0 in"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="(Choke 0.0 0a)"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonToggle
                        label="EqmptEmacer"
                        checked={eqmptEmacerEnabled}
                        onCheckedChange={(checked) => {
                          setEqmptEmacerEnabled(checked);
                          form.updateLocalField({ routes });
                        }}
                      />
                    </div>

                    {/* Second row: input input input */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2">
                      <CommonInput
                        value="Flow_Q-In"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD Q in"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="Flow Q Out | Aux Flow"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                    </div>

                    {/* Third row: input input input */}
                    <div className="grid grid-cols-3 xl:grid-cols-[1fr_1fr_2fr] gap-2">
                      <CommonInput
                        value="MPD Q ux"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD Q Set"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD Q aex"
                        onChange={(e) => form.updateLocalField({ routes })}
                        className="text-sm"
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

      <FormSaveDialog form={form} />
    </>
  );
}
