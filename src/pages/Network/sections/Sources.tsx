import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonInput, CommonAccordionItem } from "@/components/common";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";
import { Badge } from "@/components/ui/badge";

export function Sources() {
  const [devicesExpanded, setDevicesExpanded] = useState(true);
  const [rigPlcEnabled, setRigPlcEnabled] = useState(true);
  const [pwdEnabled, setPwdEnabled] = useState(true);
  const [connectionStatus] = useState("Primary");

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
              checked={rigPlcEnabled}
              onCheckedChange={setRigPlcEnabled}
            />
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-5">
              Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-2">
                <CommonInput
                  label="Endpoint"
                  value="10.1.0.113"
                  onChange={() => {}}
                  placeholder="10.1.0.11"
                  type="text"
                  className="flex-1"
                />
                <CommonInput
                  label=" "
                  value="502"
                  onChange={() => {}}
                  placeholder="502"
                  type="text"
                />
              </div>
              <CommonSelect
                label="Tag Map"
                value="502"
                onValueChange={() => {}}
                options={[
                  { value: "502", label: "502" },
                  { value: "100ms", label: "100 ms" },
                ]}
              />

              <CommonSelect
                label="Data rate"
                value="100ms"
                onValueChange={() => {}}
                options={[
                  { value: "100ms", label: "100 ms" },
                  { value: "200ms", label: "200 ms" },
                ]}
              />

              <CommonSelect
                label="Tag Map"
                value="502"
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
            <CommonAccordionItem
              title="Chokes (A/B)"
              tags="ChokeA_Pos, ChokeB_Pos, Choke_SP"
              healthStatus="OK"
              healthCount="3/3"
            />

            <CommonAccordionItem
              title="Flow Meter"
              tags="Flow_In, Flow_Out, Aux_Flow"
              healthStatus="OK"
              healthCount="3/3"
            />
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
                value="10.1.0.113"
                onChange={() => {}}
                placeholder="10.1.0.11"
                type="text"
              />
              <CommonInput
                label=" "
                value="502"
                onChange={() => {}}
                placeholder="502"
                type="text"
              />
            </div>
            <CommonSelect
              label="Data rate"
              value="none"
              onValueChange={() => {}}
              options={[
                { value: "none", label: "None" },
                { value: "502", label: "502" },
                { value: "100ms", label: "100 ms" },
              ]}
            />

            <CommonSelect
              label="Data rate"
              value="1x"
              onValueChange={() => {}}
              options={[
                { value: "1x", label: "1x / sec" },
                { value: "2x", label: "2x / sec" },
              ]}
            />

            <CommonInput
              label="Tag Map"
              value="10.1.0.113"
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
