// React & Hooks
import { useState, useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";

// Components - UI & Icons
import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonToggle,
  CommonSelect,
  CommonInput,
  CommonAccordionItem,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";

// Components - Local
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

// Services & Types
import {
  useSourcesData,
  useSaveSourcesData,
  useSourcesOptions,
} from "@/services/api/network/network.api";
import type { SaveSourcesPayload } from "@/services/api/network/network.types";

// Context
import { useNetworkContext } from "../NetworkContext";

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "primary":
      return "bg-blue-500 text-white";
    case "connected":
      return "bg-green-500 text-white";
    case "disconnected":
      return "bg-red-500 text-white";
    default:
      return "";
  }
};

export function Sources() {
  const { data: sourcesResponse, isLoading } = useSourcesData();
  const { data: optionsResponse } = useSourcesOptions();
  const { mutate: saveSourcesData } = useSaveSourcesData();
  const { registerSaveHandler, unregisterSaveHandler } = useNetworkContext();

  const options = optionsResponse?.data;
  const [devicesExpanded, setDevicesExpanded] = useState(true);

  // Memoize initial data to prevent re-initialization on every render
  const initialData = useMemo(() => {
    if (!sourcesResponse?.data) return undefined;
    const { rigPlc, pwdWits, devices } = sourcesResponse.data;
    return { rigPlc, pwdWits, devices };
  }, [sourcesResponse?.data]);

  // Use the new reusable form hook
  const form = useSectionForm<SaveSourcesPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveSourcesData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Sources settings saved successfully",
    errorMessage: "Failed to save sources settings",
    confirmTitle: "Save Sources Settings",
    confirmDescription: "Are you sure you want to save these sources changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { rigPlc, pwdWits, devices } = form.formData;

  // Use connectionStatus from original data if available, or fall back to form state
  const connectionStatus =
    sourcesResponse?.data.rigPlc.connectionStatus || rigPlc.connectionStatus;
  const sourceType = sourcesResponse?.data.rigPlc.sourceType || "N/A";

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
          {/* Rig PLC Source */}
          <PanelCard
            title={
              <div className="flex items-center gap-2">
                <span>Rig PLC</span>
                <Badge
                  variant="default"
                  className={`text-xs ${getStatusBadgeColor(connectionStatus)}`}
                >
                  {connectionStatus}
                </Badge>
              </div>
            }
            headerAction={
              <CommonToggle
                label="Modbus TCP"
                checked={rigPlc.enabled}
                onCheckedChange={(enabled) =>
                  form.updateLocalField({ rigPlc: { ...rigPlc, enabled } })
                }
              />
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-5">
                Source Type: {sourceType}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-2">
                  <CommonInput
                    label="Endpoint"
                    value={rigPlc.endpoint}
                    onChange={(e) =>
                      form.updateLocalField({
                        rigPlc: { ...rigPlc, endpoint: e.target.value },
                      })
                    }
                    placeholder="10.1.0.11"
                    className="flex-1"
                    type="text"
                  />
                  <CommonInput
                    label=" "
                    value={rigPlc.port}
                    onChange={(e) =>
                      form.updateLocalField({
                        rigPlc: { ...rigPlc, port: e.target.value },
                      })
                    }
                    placeholder="502"
                    type="number"
                  />
                </div>
                <CommonSelect
                  label="Tag Map"
                  value={rigPlc.tagMap}
                  onValueChange={(tagMap) =>
                    form.updateLocalField({ rigPlc: { ...rigPlc, tagMap } })
                  }
                  options={options?.tagMapOptions || []}
                />

                <CommonSelect
                  label="Data rate"
                  value={rigPlc.dataRate}
                  onValueChange={(dataRate) =>
                    form.updateLocalField({ rigPlc: { ...rigPlc, dataRate } })
                  }
                  options={options?.dataRateOptions || []}
                />

                <CommonSelect
                  label="Tag Map"
                  value={rigPlc.tagMap}
                  onValueChange={(tagMap) =>
                    form.updateLocalField({ rigPlc: { ...rigPlc, tagMap } })
                  }
                  options={options?.tagMapOptions || []}
                />
              </div>
            </div>
          </PanelCard>

          {/* Devices (from PLC) */}
          <PanelCard
            title="Devices (from PLC)"
            headerAction={
              <CommonToggle
                label=""
                checked={devicesExpanded}
                onCheckedChange={setDevicesExpanded}
              />
            }
          >
            <div className="space-y-4">
              {devices.map(({ id, name, tags, healthStatus, healthCount }) => (
                <CommonAccordionItem
                  key={id}
                  title={name}
                  tags={tags}
                  healthStatus={healthStatus}
                  healthCount={healthCount}
                />
              ))}
            </div>
          </PanelCard>

          {/* PWD WITS */}
          <PanelCard
            title="PWD WITS (TCP)"
            headerAction={
              <CommonToggle
                label=""
                checked={pwdWits.enabled}
                onCheckedChange={(enabled) =>
                  form.updateLocalField({ pwdWits: { ...pwdWits, enabled } })
                }
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-2">
                <CommonInput
                  label="Endpoint"
                  value={pwdWits.endpoint}
                  onChange={(e) =>
                    form.updateLocalField({
                      pwdWits: { ...pwdWits, endpoint: e.target.value },
                    })
                  }
                  placeholder="10.1.0.11"
                  type="text"
                />
                <CommonInput
                  label=" "
                  value={pwdWits.port}
                  onChange={(e) =>
                    form.updateLocalField({
                      pwdWits: { ...pwdWits, port: e.target.value },
                    })
                  }
                  placeholder="502"
                  type="number"
                />
              </div>
              <CommonSelect
                label="Data rate"
                value={pwdWits.dataRate}
                onValueChange={(dataRate) =>
                  form.updateLocalField({ pwdWits: { ...pwdWits, dataRate } })
                }
                options={options?.dataRateOptions || []}
              />

              <CommonSelect
                label="Frequency"
                value={pwdWits.frequency}
                onValueChange={(frequency) =>
                  form.updateLocalField({ pwdWits: { ...pwdWits, frequency } })
                }
                options={options?.frequencyOptions || []}
              />

              <CommonInput
                label="Tag Map"
                value={pwdWits.tagMap}
                onChange={(e) =>
                  form.updateLocalField({
                    pwdWits: { ...pwdWits, tagMap: e.target.value },
                  })
                }
                placeholder="10.1.0.11"
                type="text"
              />
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
