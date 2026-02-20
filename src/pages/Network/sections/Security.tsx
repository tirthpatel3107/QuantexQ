import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonRadio } from "@/components/common/CommonRadio";
import { RadioGroup } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { HealthMonitoringPanel } from "../HealthMonitoringPanel";

export function Security() {
  const [modbusEnabled, setModbusEnabled] = useState(true);
  const [authMethod, setAuthMethod] = useState("certificate");
  const [pwdAuthMethod, setPwdAuthMethod] = useState("user-pass");
  const [rigPlcEnabled, setRigPlcEnabled] = useState(true);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 auto-rows-max">
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
          headerAction={
            <CommonToggle
              label="Modbus TCP"
              checked={rigPlcEnabled}
              onCheckedChange={setRigPlcEnabled}
            />
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground pb-3">
              Source Type: PRIMARY (PLC) Chokes | Flow Meter | PWD (optional)
            </p>

            <div className="grid grid-cols-1 gap-3">
              {/* Input Data */}
              <div>
                <span className="text-sm font-medium">EndPoint</span>
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
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>Authentication</span>
            </div>
          }
        >
          <RadioGroup value={authMethod} onValueChange={setAuthMethod}>
            <CommonRadio value="none" id="auth-none" label="None" />
            <CommonRadio
              value="user-pass"
              id="auth-user-pass"
              label="User / Pass"
            />
            <CommonRadio
              value="certificate"
              id="auth-certificate"
              label="Certificate (SSL)"
            />
          </RadioGroup>
        </PanelCard>
        {/* PWD Card */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <span>PWD</span>
            </div>
          }
        >
          <RadioGroup value={authMethod} onValueChange={setAuthMethod}>
            <CommonRadio value="none" id="auth-none" label="None" />
            <CommonRadio
              value="user-pass"
              id="auth-user-pass"
              label="User / Pass"
            />
            <CommonRadio
              value="certificate"
              id="auth-certificate"
              label="Certificate (SSL)"
            />
          </RadioGroup>
          {/* TQs / PQ aux */}
          <div className="mt-6">
            <CommonButton variant="outline" size="sm" icon={Plus}>
              TQs / PQ aux
            </CommonButton>
          </div>
        </PanelCard>
      </div>
      <div className="grid grid-cols-1 gap-3 auto-rows-max">
        <HealthMonitoringPanel />
      </div>
    </div>
  );
}
