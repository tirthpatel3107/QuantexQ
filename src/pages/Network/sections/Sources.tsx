import { useState, useEffect } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonInput, CommonAccordionItem } from "@/components/common";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";
import { Badge } from "@/components/ui/badge";
import { SectionSkeleton } from "@/components/common";
import {
  useSourcesData,
  useSaveSourcesData,
  useSourcesOptions,
} from "@/services/api/network/network.api";
import type { SaveSourcesPayload } from "@/services/api/network/network.types";

export function Sources() {
  const { data: sourcesResponse, isLoading, error } = useSourcesData();
  const { data: optionsResponse } = useSourcesOptions();
  const { mutate: saveSourcesData } = useSaveSourcesData();

  const sourcesData = sourcesResponse?.data;
  const options = optionsResponse?.data;

  const [devicesExpanded, setDevicesExpanded] = useState(true);
  const [formData, setFormData] = useState<SaveSourcesPayload | null>(null);

  // Initialize form data when sourcesData loads
  useEffect(() => {
    if (sourcesData) {
      const { rigPlc, pwdWits, devices } = sourcesData;
      setFormData({ rigPlc, pwdWits, devices });
    }
  }, [sourcesData]);

  // Save data to API
  const handleSaveData = (updatedData: Partial<SaveSourcesPayload>) => {
    if (!formData) return;

    const newFormData = { ...formData, ...updatedData };
    setFormData(newFormData);
    saveSourcesData(newFormData);
  };

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

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading sources data</div>;
  }

  if (!sourcesData || !formData) {
    return <div className="p-4">No sources data available</div>;
  }

  const { rigPlc, pwdWits, devices } = formData;
  const { connectionStatus, sourceType } = sourcesData.rigPlc;

  return (
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
                handleSaveData({ rigPlc: { ...rigPlc, enabled } })
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
                    handleSaveData({
                      rigPlc: { ...rigPlc, endpoint: e.target.value },
                    })
                  }
                  placeholder="10.1.0.11"
                  type="text"
                  className="flex-1"
                />
                <CommonInput
                  label=" "
                  value={rigPlc.port}
                  onChange={(e) =>
                    handleSaveData({
                      rigPlc: { ...rigPlc, port: e.target.value },
                    })
                  }
                  placeholder="502"
                  type="text"
                />
              </div>
              <CommonSelect
                label="Tag Map"
                value={rigPlc.tagMap}
                onValueChange={(tagMap) =>
                  handleSaveData({ rigPlc: { ...rigPlc, tagMap } })
                }
                options={options?.tagMapOptions || []}
              />

              <CommonSelect
                label="Data rate"
                value={rigPlc.dataRate}
                onValueChange={(dataRate) =>
                  handleSaveData({ rigPlc: { ...rigPlc, dataRate } })
                }
                options={options?.dataRateOptions || []}
              />

              <CommonSelect
                label="Tag Map"
                value={rigPlc.tagMap}
                onValueChange={(tagMap) =>
                  handleSaveData({ rigPlc: { ...rigPlc, tagMap } })
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
                handleSaveData({ pwdWits: { ...pwdWits, enabled } })
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
                  handleSaveData({
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
                  handleSaveData({
                    pwdWits: { ...pwdWits, port: e.target.value },
                  })
                }
                placeholder="502"
                type="text"
              />
            </div>
            <CommonSelect
              label="Data rate"
              value={pwdWits.dataRate}
              onValueChange={(dataRate) =>
                handleSaveData({ pwdWits: { ...pwdWits, dataRate } })
              }
              options={options?.dataRateOptions || []}
            />

            <CommonSelect
              label="Frequency"
              value={pwdWits.frequency}
              onValueChange={(frequency) =>
                handleSaveData({ pwdWits: { ...pwdWits, frequency } })
              }
              options={options?.frequencyOptions || []}
            />

            <CommonInput
              label="Tag Map"
              value={pwdWits.tagMap}
              onChange={(e) =>
                handleSaveData({
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
  );
}
