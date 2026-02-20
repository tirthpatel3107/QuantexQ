import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonToggle } from "@/components/common/CommonToggle";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

export function Routing() {
  const [modbusEnabled, setModbusEnabled] = useState(true);
  const [eqmptEmacerEnabled, setEqmptEmacerEnabled] = useState(true);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
        {/* Rig PLC Primary Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>Rig PLC</span>
              <Badge variant="secondary" className="text-xs">
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
                onCheckedChange={setModbusEnabled}
              />
            </div>
          }
        >
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
            </p>

            <div className="grid grid-cols-1 gap-3">
              {/* Input Data */}
              <div>
                <span className="text-sm font-medium">Input Data</span>
                <div className="grid grid-cols-2 gap-[1px]">
                  <div>
                    <CommonInput value="10.1.0.113" onChange={() => {}} />
                  </div>
                  <div className="grid grid-cols-2 gap-[1px]">
                    <CommonInput value="0" onChange={() => {}} />
                    <CommonInput value="502" onChange={() => {}} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <CommonSelect
                  label="Port"
                  value="502"
                  onValueChange={() => {}}
                  options={[
                    { value: "502", label: "502" },
                    { value: "503", label: "503" },
                  ]}
                />
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Routing Card */}
        <PanelCard title="Routing">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure routing rules and data flow between sources and
              destinations.
            </p>

            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Active Routes:</span>
                <span className="ml-2 text-muted-foreground">5</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Rig PLC → Dashboard</span>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>PWD → Data Logger</span>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            <CommonButton
              variant="outline"
              icon={Plus}
              iconPosition="left"
              className="w-full"
            >
              Add Routing Rule...
            </CommonButton>
          </div>
        </PanelCard>

        {/* PWD Secondary Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>PWD</span>
              <Badge variant="secondary" className="text-xs">
                SECONDARY (PWD)
              </Badge>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Secondary PWD data source configuration via WITS protocol.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CommonInput
                label="Snecron By"
                value="WITS (TCP)"
                onChange={() => {}}
                className="text-sm"
              />
              <CommonInput
                label="Taj"
                value="1.0.335"
                onChange={() => {}}
                className="text-sm"
              />
            </div>

            <CommonButton variant="outline" icon={Plus} iconPosition="left">
              Add Routing Rule...
            </CommonButton>
          </div>
        </PanelCard>
      </div>

      {/* Health Monitoring Panel */}
      <div className="grid grid-cols-1 gap-3 auto-rows-max">
        <HealthMonitoringPanel />
      </div>
    </div>
  );
}
