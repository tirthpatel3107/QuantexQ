import { useState, useEffect } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonToggle } from "@/components/common/CommonToggle";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";
import { SectionSkeleton, CommonAlertDialog } from "@/components/common";
import {
  useRoutingData,
  useSaveRoutingData,
  useRoutingOptions,
} from "@/services/api/network/network.api";
import type { SaveRoutingPayload } from "@/services/api/network/network.types";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";
import { useNetworkContext } from "../NetworkContext";

export function Routing() {
  const { data: routingResponse, isLoading, error } = useRoutingData();
  const { data: optionsResponse } = useRoutingOptions();
  const { mutate: saveRoutingData } = useSaveRoutingData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const routingData = routingResponse?.data;
  const options = optionsResponse?.data;

  const [modbusEnabled, setModbusEnabled] = useState(true);
  const [eqmptEmacerEnabled, setEqmptEmacerEnabled] = useState(true);
  const [formData, setFormData] = useState<SaveRoutingPayload | null>(null);

  // Initialize form data when routingData loads
  useEffect(() => {
    if (routingData) {
      const { routes } = routingData;
      setFormData({ routes });
    }
  }, [routingData]);

  // Setup save with confirmation
  const {
    isConfirmOpen,
    setIsConfirmOpen,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  } = useSaveWithConfirmation<SaveRoutingPayload>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveRoutingData(data, {
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

  // Save data to API with confirmation
  const handleSaveData = (updatedData: Partial<SaveRoutingPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
  };

  const handleSave = () => {
    if (formData) {
      requestSave(formData);
    }
  };

  // Register save handler with parent context
  useEffect(() => {
    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-3 auto-rows-max">
        <div className="hidden">
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
                      handleSaveData({ routes: formData.routes });
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
                      onChange={(e) =>
                        handleSaveData({ routes: formData.routes })
                      }
                      placeholder="10.1.0.11"
                      type="text"
                      className="flex-1"
                    />
                    <CommonInput
                      label=" "
                      value="0"
                      onChange={(e) =>
                        handleSaveData({ routes: formData.routes })
                      }
                      placeholder="0"
                      type="text"
                    />
                    <CommonInput
                      label=" "
                      value="502"
                      onChange={(e) =>
                        handleSaveData({ routes: formData.routes })
                      }
                      placeholder="502"
                      type="text"
                    />
                  </div>
                  <CommonSelect
                    label="Port"
                    value="502"
                    onValueChange={(value) =>
                      handleSaveData({ routes: formData.routes })
                    }
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
                    onChange={(e) =>
                      handleSaveData({ routes: formData.routes })
                    }
                    className="text-sm"
                  />
                  <CommonInput
                    label="Tag"
                    value="1.0.335"
                    onChange={(e) =>
                      handleSaveData({ routes: formData.routes })
                    }
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
                            handleSaveData({ routes: formData.routes })
                          }
                        />
                      </div>
                    </div>

                    {/* First row: input : input */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonInput
                        value="ChokeA_Pos"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD SBP"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="ChokeB_PS | ChokeB_Pos | Choke_SP"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                    </div>

                    {/* Second row: input : input */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2 items-center">
                      <CommonInput
                        value="SBIn Coop (Enbl)"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="SBP_SSP"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="SBP_SSP"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
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
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="(Choke 0.0 0a)"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonToggle
                        label="EqmptEmacer"
                        checked={eqmptEmacerEnabled}
                        onCheckedChange={(checked) => {
                          setEqmptEmacerEnabled(checked);
                          handleSaveData({ routes: formData.routes });
                        }}
                      />
                    </div>

                    {/* Second row: input input input */}
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_2fr] gap-2">
                      <CommonInput
                        value="Flow_Q-In"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD Q in"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="Flow Q Out | Aux Flow"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                    </div>

                    {/* Third row: input input input */}
                    <div className="grid grid-cols-3 xl:grid-cols-[1fr_1fr_2fr] gap-2">
                      <CommonInput
                        value="MPD Q ux"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD Q Set"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                      <CommonInput
                        value="MPD Q aex"
                        onChange={(e) =>
                          handleSaveData({ routes: formData.routes })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PanelCard>
          </div>
        </div>
      </div>

      {/* Health Monitoring Panel */}
      <div className="grid grid-cols-1 gap-3 auto-rows-max">
        <HealthMonitoringPanel />
      </div>
    </div>

    <CommonAlertDialog
      open={isConfirmOpen}
      onOpenChange={setIsConfirmOpen}
      title={confirmTitle}
      description={confirmDescription}
      cancelText="Cancel"
      actionText="Save"
      onAction={handleConfirmedSave}
      onCancel={handleCancel}
    />
  </>
  );
}
