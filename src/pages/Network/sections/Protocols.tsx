import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonRadio } from "@/components/common/CommonRadio";
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "@/components/ui/radio-group";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

export function Protocols() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 auto-rows-max">
        {/* Rig PLC Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>Rig PLC</span>
              <Badge variant="secondary" className="text-sm">
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
                    <CommonInput placeholder="10.1.0.1:13:502" />
                    <CommonInput placeholder="10.1.0.113:502" />
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
                  <CommonInput placeholder="opc.tcp 10.1.0.113:49320" />
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
                  <CommonInput placeholder="100.10.1.14:10.13:40818" />
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
              <Badge variant="secondary" className="text-sm">
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
              <span className="text-muted-foreground">IP:</span>
              <span className="font-mono">1.0.1:250.49155</span>
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
              <CommonRadio id="mqtt" value="mqtt" label="MQTT (Password, CA)" />

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

      <div className="grid grid-cols-1 gap-4 auto-rows-max">
        <HealthMonitoringPanel />
      </div>
    </div>
  );
}
