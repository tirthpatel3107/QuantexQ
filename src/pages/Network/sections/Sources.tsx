import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonInput, CommonAccordionItem } from "@/components/common";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";
import { Badge } from "@/components/ui/badge";
import { useSourcesData } from "@/services/api/network/network.api";

export function Sources() {
  const { data: sourcesResponse, isLoading, error } = useSourcesData();
  const sourcesData = sourcesResponse?.data;

  const [devicesExpanded, setDevicesExpanded] = useState(true);
  const [rigPlcEnabled, setRigPlcEnabled] = useState(sourcesData?.rigPlc?.enabled ?? true);
  const [pwdEnabled, setPwdEnabled] = useState(sourcesData?.pwdWits?.enabled ?? true);

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
    return <div className="p-4">Loading sources data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading sources data</div>;
  }

  if (!sourcesData) {
    return <div className="p-4">No sources data available</div>;
  }

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
                className={`text-xs ${getStatusBadgeColor(sourcesData.rigPlc.connectionStatus)}`}
              >
                {sourcesData.rigPlc.connectionStatus}
              </Badge>
            </div>
          }
          headerAction={
            <CommonToggle
              label="Modbus TCP"
              checked={rigPlcEnabled}
              onCheckedChange={setRigPlcEnabled}
            />
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-5">
              Source Type: {sourcesData.rigPlc.sourceType}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-2">
                <CommonInput
                  label="Endpoint"
                  value={sourcesData.rigPlc.endpoint}
                  onChange={() => {}}
                  placeholder="10.1.0.11"
                  type="text"
                  className="flex-1"
                />
                <CommonInput
                  label=" "
                  value={sourcesData.rigPlc.port}
                  onChange={() => {}}
                  placeholder="502"
                  type="text"
                />
              </div>
              <CommonSelect
                label="Tag Map"
                value={sourcesData.rigPlc.tagMap}
                onValueChange={() => {}}
                options={[
                  { value: "502", label: "502" },
                  { value: "100ms", label: "100 ms" },
                ]}
              />

              <CommonSelect
                label="Data rate"
                value={sourcesData.rigPlc.dataRate}
                onValueChange={() => {}}
                options={[
                  { value: "100ms", label: "100 ms" },
                  { value: "200ms", label: "200 ms" },
                ]}
              />

              <CommonSelect
                label="Tag Map"
                value={sourcesData.rigPlc.tagMap}
                onValueChange={() => {}}
                options={[
                  { value: "502", label: "502" },
                  { value: "100ms", label: "100 ms" },
                ]}
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
            {sourcesData.devices.map((device) => (
              <CommonAccordionItem
                key={device.id}
                title={device.name}
                tags={device.tags}
                healthStatus={device.healthStatus}
                healthCount={device.healthCount}
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
              checked={pwdEnabled}
              onCheckedChange={setPwdEnabled}
            />
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex gap-2">
              <CommonInput
                label="Endpoint"
                value={sourcesData.pwdWits.endpoint}
                onChange={() => {}}
                placeholder="10.1.0.11"
                type="text"
              />
              <CommonInput
                label=" "
                value={sourcesData.pwdWits.port}
                onChange={() => {}}
                placeholder="502"
                type="text"
              />
            </div>
            <CommonSelect
              label="Data rate"
              value={sourcesData.pwdWits.dataRate}
              onValueChange={() => {}}
              options={[
                { value: "none", label: "None" },
                { value: "502", label: "502" },
                { value: "100ms", label: "100 ms" },
              ]}
            />

            <CommonSelect
              label="Data rate"
              value={sourcesData.pwdWits.frequency}
              onValueChange={() => {}}
              options={[
                { value: "1x", label: "1x / sec" },
                { value: "2x", label: "2x / sec" },
              ]}
            />

            <CommonInput
              label="Tag Map"
              value={sourcesData.pwdWits.tagMap}
              onChange={() => {}}
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
