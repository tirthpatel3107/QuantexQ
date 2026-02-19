import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonToggle } from "@/components/common/CommonToggle";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus } from "lucide-react";

export function Routing() {
  const [modbusEnabled, setModbusEnabled] = useState(true);
  const [eqmptEmacerEnabled, setEqmptEmacerEnabled] = useState(true);
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Routing</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Profile: NFQ-21-6A
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">MPD: Silator</span>
          <CommonButton variant="outline">Save</CommonButton>
          <CommonButton variant="outline">Discard</CommonButton>
          <CommonButton>Test Connections</CommonButton>
          <CommonButton variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </CommonButton>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routing Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>Rig PLC</span>
              <Badge variant="secondary" className="text-xs">
                Primary
              </Badge>
            </div>
          }
        >
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
            </p>

            {/* Input Data */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Input Data:</span>
                <div className="flex items-center gap-2">
                  <CommonInput
                    placeholder="10.1.0.113"
                    className="w-32 h-8 text-sm"
                  />
                  <CommonInput placeholder="0" className="w-16 h-8 text-sm" />
                  <CommonInput placeholder="502" className="w-16 h-8 text-sm" />
                </div>
                <span className="text-sm text-muted-foreground">Port:</span>
                <CommonSelect
                  value="502"
                  onValueChange={() => {}}
                  options={[
                    { value: "502", label: "502" },
                    { value: "503", label: "503" },
                  ]}
                  className="w-24 h-8"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm">Modbus TCP</span>
                  <CommonToggle
                    label="Modbus TCP"
                    checked={modbusEnabled}
                    onCheckedChange={setModbusEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Routing Section */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-3">Routing</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Input Data: Rig PLC (Tags)
                </p>
              </div>

              {/* Output Channels */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-sm font-medium">Output Channels</span>
                  <span className="text-sm font-medium">
                    Single Loop Control
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-sm">ChokeA_Pos</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">MPD.SBP.SS</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">
                      ChokeB_PS | ChokeB_Pos | Choke_SP
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-sm">SBin Coop (Fmd)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">SBP_SSP</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">SBP_SSP</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-sm">DualQ Control</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">MPD Q 0 in</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">(Choke 0.0 0a)</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">EqmptEmacer</span>
                    <CommonToggle
                      label="EqmptEmacer"
                      checked={eqmptEmacerEnabled}
                      onCheckedChange={setEqmptEmacerEnabled}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-sm">Flow_Q_In</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">MPD Q in</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">Flow Q Out | Aux Flow</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-sm">MPD Q ux</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">MPD Q Set</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm">MPD Q aex</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PWD Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">PWD</span>
                <Badge variant="secondary" className="text-xs">
                  SECONDARY (PWD)
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Snecron (0Y</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm">WITS (TCP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Taj 1.0.335</span>
                  <span className="text-sm">AFINSE</span>
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
          </div>
        </PanelCard>

        {/* Live Health Card */}
        <PanelCard
          title="Live Health (PLC)"
          headerAction={
            <Badge variant="default" className="text-xs bg-green-600">
              CONNECTED
            </Badge>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Last packet time:
              </span>
              <span className="text-sm font-medium">3 seconds ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Latency:</span>
              <span className="text-sm font-medium">20 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Drop rate:</span>
              <span className="text-sm font-medium">1 %</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Messages/sec:
              </span>
              <span className="text-sm font-medium">75 / sec</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Clock drift:
              </span>
              <span className="text-sm font-medium">+11 ms ahead</span>
            </div>

            <hr className="my-4" />

            {/* Device Health */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                Device Health
                <CommonButton variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-3 w-3" />
                </CommonButton>
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm">Chokes</span>
                    <span className="text-xs text-muted-foreground">OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">100%</span>
                    <Badge variant="secondary" className="text-xs">
                      ≤ 85
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-sm">Flow Meter</span>
                    <span className="text-xs text-muted-foreground">95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">95%</span>
                    <Badge variant="secondary" className="text-xs">
                      ≤ 9
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm">PWD</span>
                    <span className="text-xs text-muted-foreground">WARN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">PWD_BHP</span>
                    <Badge variant="secondary" className="text-xs">
                      ≤ 17
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Connection Log */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Connection Log</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-muted-foreground">
                  23 Apr | 14:31 · Chokes connected via Modbus TCP
                </div>
                <div className="text-muted-foreground">
                  23 Apr | 14:47 · Flow Meter: Tag coverage 69%
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  23 Apr | 14:41 · Tag coverage 90% (1 missing)
                  <Badge variant="secondary" className="text-xs">
                    PWD
                  </Badge>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Failover Simulation */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Failover Simulation:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {failoverSimulation ? "ON" : "OFF"}
                </span>
                <CommonToggle
                  checked={failoverSimulation}
                  onCheckedChange={setFailoverSimulation}
                />
                <CommonButton variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-3 w-3" />
                </CommonButton>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
