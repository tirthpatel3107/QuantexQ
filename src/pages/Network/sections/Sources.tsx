import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonSelect } from "@/components/common/CommonSelect";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { CommonInput } from "@/components/common";

export function Sources() {
  const [devicesExpanded, setDevicesExpanded] = useState(true);
  const [chokesExpanded, setChokesExpanded] = useState(true);
  const [flowMeterExpanded, setFlowMeterExpanded] = useState(true);
  const [rigPlcEnabled, setRigPlcEnabled] = useState(true);
  const [pwdEnabled, setPwdEnabled] = useState(true);
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max">
      {/* Rig PLC Source */}
      <PanelCard
        title="Rig PLC (Primary)"
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
            <CommonInput
              label="Endpoint"
              value="10.1.0.113"
              onChange={() => {}}
              placeholder="10.1.0.11"
              type="text"
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
          <div>
            <button
              onClick={() => setChokesExpanded(!chokesExpanded)}
              className="flex items-center justify-between w-full hover:text-foreground/80 transition-colors mb-2"
            >
              <span className="text-sm font-medium">Chokes (A/B)</span>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Health:</span>
                <span className="font-medium text-green-600">OK</span>
                <span>3/3</span>
              </div>
            </button>

            <div className="text-xs text-muted-foreground">
              Tags: ChokeA_Pos, ChokeB_Pos, Choke_SP
            </div>
          </div>

          {/* Flow Meter */}
          <div>
            <button
              onClick={() => setFlowMeterExpanded(!flowMeterExpanded)}
              className="flex items-center justify-between w-full hover:text-foreground/80 transition-colors mb-2"
            >
              <span className="text-sm font-medium">Flow Meter</span>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Health:</span>
                <span className="font-medium text-green-600">OK</span>
                <span>3/3</span>
              </div>
            </button>

            <div className="text-xs text-muted-foreground">
              Tags: Flow_In, Flow_Out, Aux_Flow
            </div>
          </div>
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
          <CommonInput
            label="Endpoint"
            value="10.1.0.113"
            onChange={() => {}}
            placeholder="10.1.0.11"
            type="text"
          />
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
            <span className="text-sm text-muted-foreground">Messages/sec:</span>
            <span className="text-sm font-medium">74 / sec</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Clock drift:</span>
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
  );
}
