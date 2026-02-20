import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonToggle } from "@/components/common/CommonToggle";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus } from "lucide-react";

export function Security() {
  const [modbusEnabled, setModbusEnabled] = useState(true);
  const [authMethod, setAuthMethod] = useState("certificate");
  const [pwdAuthMethod, setPwdAuthMethod] = useState("user-pass");
  const [failoverSimulation, setFailoverSimulation] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Security</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Profile: NFQ-21-6A
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        {/* Rig PLC Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>Rig PLC</span>
              <Badge variant="secondary" className="text-xs">
                Primaryu
              </Badge>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
            </p>

            {/* Endpoint */}
            <div className="space-y-2">
              <label className="text-sm font-medium">EndPoint:</label>
              <div className="flex items-center gap-2">
                <CommonInput value="10.1.0.113" className="flex-1" readOnly />
                <CommonInput value="0" className="w-20" readOnly />
                <CommonInput value="502" className="w-20" readOnly />
                <span className="text-sm text-muted-foreground">Port:</span>
                <CommonSelect
                  value="502"
                  options={[
                    { value: "502", label: "502" },
                    { value: "503", label: "503" },
                  ]}
                  className="w-24"
                />
              </div>
            </div>

            {/* Modbus TCP Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Modbus TCP</span>
              <CommonToggle
                checked={modbusEnabled}
                onCheckedChange={setModbusEnabled}
              />
            </div>

            {/* Authentication */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Authentication</h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="auth"
                    value="none"
                    checked={authMethod === "none"}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">None</span>
                  <input
                    type="checkbox"
                    className="ml-2 w-4 h-4"
                    defaultChecked
                  />
                  <span className="text-sm text-muted-foreground">None</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="auth"
                    value="user-pass"
                    checked={authMethod === "user-pass"}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">User / Pass</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="auth"
                    value="certificate"
                    checked={authMethod === "certificate"}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Certificate (SSL)</span>
                </label>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Live Health (PLC) Card */}
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
                    <span className="text-xs text-muted-foreground">99%</span>
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
                  23 Apr | 14:47 · Flow Meter: No coverage 05%
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

        {/* PWD Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>PWD</span>
              <Badge variant="secondary" className="text-xs">
                📥
              </Badge>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enri (Cp authentication (Pad):
            </p>

            {/* Authentication Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pwd-auth"
                  value="none"
                  checked={pwdAuthMethod === "none"}
                  onChange={(e) => setPwdAuthMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">None</span>
                <input
                  type="checkbox"
                  className="ml-2 w-4 h-4"
                  defaultChecked
                />
                <span className="text-sm text-muted-foreground">None</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pwd-auth"
                  value="user-pass"
                  checked={pwdAuthMethod === "user-pass"}
                  onChange={(e) => setPwdAuthMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">User / Pass</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pwd-auth"
                  value="certificate"
                  checked={pwdAuthMethod === "certificate"}
                  onChange={(e) => setPwdAuthMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Certificate (SSL)</span>
              </div>
            </div>

            {/* Action Buttons */}
            {pwdAuthMethod === "user-pass" && (
              <div className="flex gap-2 mt-4">
                <CommonButton variant="outline" size="sm" className="flex-1">
                  User / Pass
                </CommonButton>
                <CommonButton variant="outline" size="sm" className="flex-1">
                  Certificate (SSL)
                </CommonButton>
              </div>
            )}

            {pwdAuthMethod === "user-pass" && (
              <CommonButton variant="default" size="sm" className="w-full">
                Set up valid authentication for this source
              </CommonButton>
            )}

            {/* TQs / PQ aux */}
            <div className="mt-6">
              <CommonButton variant="outline" size="sm" icon={Plus}>
                TQs / PQ aux
              </CommonButton>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Add Source Button */}
      <div className="flex justify-start">
        <CommonButton variant="outline" icon={Plus} iconPosition="left">
          Add Source
        </CommonButton>
      </div>
    </div>
  );
}
