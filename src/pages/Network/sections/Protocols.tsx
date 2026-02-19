import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonCheckbox } from "@/components/common/CommonCheckbox";
import { CommonSelect } from "@/components/common/CommonSelect";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus } from "lucide-react";
import { CommonToggle } from "@/components/common";

export function Protocols() {
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  const [selectedProtocol, setSelectedProtocol] = useState("modbus-tcp");
  const [selectedWitsmlProtocol, setSelectedWitsmlProtocol] =
    useState("direct-wits");

  return (
    <div className="space-y-3">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Rig PLC Card */}
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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
            </p>

            {/* Modbus TCP */}
            <div className="space-y-3">
              <CommonCheckbox
                id="modbus-tcp"
                checked={selectedProtocol === "modbus-tcp"}
                onCheckedChange={(checked) =>
                  checked && setSelectedProtocol("modbus-tcp")
                }
                label={
                  <div className="flex items-center gap-2">
                    <span>Modbus TCP</span>
                    <Badge variant="default" className="text-xs">
                      16.9.20
                    </Badge>
                  </div>
                }
              />
              {selectedProtocol === "modbus-tcp" && (
                <div className="ml-6 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <CommonInput placeholder="10.1.0.1:13:502" />
                    <CommonInput placeholder="10.1.0.113:502" />
                  </div>
                </div>
              )}
            </div>

            {/* OPC-UA */}
            <div className="space-y-3">
              <CommonCheckbox
                id="opc-ua"
                checked={selectedProtocol === "opc-ua"}
                onCheckedChange={(checked) =>
                  checked && setSelectedProtocol("opc-ua")
                }
                label="OPC-UA (UA-TCP)"
              />
              {selectedProtocol === "opc-ua" && (
                <div className="ml-6">
                  <CommonInput placeholder="opc.tcp 10.1.0.113:49320" />
                </div>
              )}
            </div>

            {/* Ethernet/IP */}
            <div className="space-y-3">
              <CommonCheckbox
                id="ethernet-ip"
                checked={selectedProtocol === "ethernet-ip"}
                onCheckedChange={(checked) =>
                  checked && setSelectedProtocol("ethernet-ip")
                }
                label="Ethernet/IP"
              />
              {selectedProtocol === "ethernet-ip" && (
                <div className="ml-6">
                  <CommonInput placeholder="100.10.1.14:10.13:40818" />
                </div>
              )}
            </div>
          </div>
        </PanelCard>

        {/* PWD Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>PWD</span>
              <Badge variant="secondary" className="text-xs">
                Encerate-MW9
              </Badge>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Source Type: SECONDARY (PWD)
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">IP:</span>
              <span className="font-mono">1.0.1:250.49155</span>
            </div>

            {/* Direct WITS */}
            <div className="space-y-3">
              <CommonCheckbox
                id="direct-wits"
                checked={selectedWitsmlProtocol === "direct-wits"}
                onCheckedChange={(checked) =>
                  checked && setSelectedWitsmlProtocol("direct-wits")
                }
                label="Direct WITS (0.0.09155)"
              />
            </div>

            {/* WITSML */}
            <div className="space-y-3">
              <CommonCheckbox
                id="witsml-left"
                checked={selectedWitsmlProtocol === "witsml-left"}
                onCheckedChange={(checked) =>
                  checked && setSelectedWitsmlProtocol("witsml-left")
                }
                label="WITSML (3.0)"
              />
            </div>

            {/* WITSML Right */}
            <div className="space-y-3">
              <CommonCheckbox
                id="witsml-right"
                checked={selectedWitsmlProtocol === "witsml-right"}
                onCheckedChange={(checked) =>
                  checked && setSelectedWitsmlProtocol("witsml-right")
                }
                label="WITSML (3.0)"
              />
            </div>

            {/* MQTT */}
            <div className="space-y-3">
              <CommonCheckbox
                id="mqtt"
                checked={selectedWitsmlProtocol === "mqtt"}
                onCheckedChange={(checked) =>
                  checked && setSelectedWitsmlProtocol("mqtt")
                }
                label="MQTT (Password, CA)"
              />
            </div>

            {/* TCP/UDP */}
            <div className="space-y-3">
              <CommonCheckbox
                id="tcp-udp-left"
                checked={selectedWitsmlProtocol === "tcp-udp-left"}
                onCheckedChange={(checked) =>
                  checked && setSelectedWitsmlProtocol("tcp-udp-left")
                }
                label="TCP / UDP 10.2.4.35000"
              />
            </div>

            {/* TCP/UDP Right */}
            <div className="space-y-3">
              <CommonCheckbox
                id="tcp-udp-right"
                checked={selectedWitsmlProtocol === "tcp-udp-right"}
                onCheckedChange={(checked) =>
                  checked && setSelectedWitsmlProtocol("tcp-udp-right")
                }
                label="TCP / UDP 10.2.4.35000"
              />
            </div>
          </div>
        </PanelCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
              <span className="text-sm font-medium">2 seconds ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Latency:</span>
              <span className="text-sm font-medium">19 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Drop rate:</span>
              <span className="text-sm font-medium">0 %</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Messages/sec:
              </span>
              <span className="text-sm font-medium">74 / sec</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Clock drift:
              </span>
              <span className="text-sm font-medium">+10 ms ahead</span>
            </div>
          </div>
        </PanelCard>

        {/* Device Health */}
        <PanelCard
          title="Device Health"
          headerAction={
            <CommonButton variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </CommonButton>
          }
        >
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="">Chokes</span>
              <span className="text-xs text-muted-foreground">OK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className=" font-medium">100%</span>
              <Badge variant="secondary" className="text-xs">
                ≤ 3
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="">Flow_Meter</span>
              <span className="text-xs text-muted-foreground">95%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className=" font-medium">95%</span>
              <Badge variant="secondary" className="text-xs">
                ≤ 3
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="">PWD</span>
              <span className="text-xs text-muted-foreground">WARN</span>
            </div>
            <div className="flex items-center gap-2">
              <span className=" font-medium">PWD_BHP</span>
              <Badge variant="secondary" className="text-xs">
                ≤ 1
              </Badge>
            </div>
          </div>
        </PanelCard>

        {/* Connection Log */}
        <PanelCard title="Connection Log">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              23 Apr | 14:56 · Chokes connected via Modbus TCP
            </div>
            <div className="text-sm text-muted-foreground">
              23 Apr | 14:47 · Flow Meter: Tag coverage 95%
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>23 Apr | 14:41 · Tag coverage 96% (1 missing):</span>
              <Badge variant="secondary">PWD</Badge>
            </div>

            <hr className="my-4 border-border" />

            {/* Failover Simulation */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Failover Simulation</span>

              <CommonToggle
                label={failoverSimulation ? "ON" : "OFF"}
                checked={failoverSimulation}
                onCheckedChange={setFailoverSimulation}
              />
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Add Source Button */}
      {/* <div className="flex justify-start">
        <CommonButton variant="outline" icon={Plus} iconPosition="left">
          Add Source
        </CommonButton>
      </div> */}
    </div>
  );
}
