import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonCheckbox } from "@/components/common/CommonCheckbox";
import { CommonSelect } from "@/components/common/CommonSelect";
import { Volume2, Play, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationLogEntry {
  id: string;
  type: "high" | "medium" | "low";
  timestamp: string;
  message: string;
  severity: string;
  status: "OK" | "DIAG" | "NEEDED";
}

export function Notifications() {
  // Settings & Summary state
  const [alarmSound, setAlarmSound] = useState("factory_alert.mp3");
  const [acceptableWrns, setAcceptableWrns] = useState(true);
  const [acceptableCmpncs, setAcceptableCmpncs] = useState(true);
  const [validityCompletion, setValidityCompletion] = useState(true);

  // Notificating Store state
  const [remindOnReset, setRemindOnReset] = useState(true);
  const [selfDismissing, setSelfDismissing] = useState(true);
  const [unusetComplessible, setUnusetComplessible] = useState(false);
  const [enableNewAlarm, setEnableNewAlarm] = useState(true);
  const [alarmClearDiagnostics, setAlarmClearDiagnostics] = useState(true);
  const [inboundRate, setInboundRate] = useState(false);

  // Notification Log state
  const [logEntries] = useState<NotificationLogEntry[]>([
    {
      id: "1",
      type: "high",
      timestamp: "SBP HIGH: RLHea...09j",
      message: "SBP LIMIT RECOMMENDED: (Cushioning) or pit-monitoring clear",
      severity: "SBP HIGH Hea...",
      status: "OK",
    },
    {
      id: "2",
      type: "medium",
      timestamp: "Enable OF: Alarms...ON",
      message: "Friction Losses within thresholds again",
      severity: "Slow DIAG...",
      status: "OK",
    },
    {
      id: "3",
      type: "medium",
      timestamp: "Cause OF Alarms...ON",
      message: "SPP LIMIT EXCEEDED: ACTION NEEDED",
      severity: "SLEF NEEDED...",
      status: "OK",
    },
    {
      id: "4",
      type: "high",
      timestamp: "Alert MMI: Alarms...ON",
      message: "LGS Analysis complete: 8.3% (set:) 5.0%",
      severity: "SWS NEEDED...",
      status: "OK",
    },
  ]);

  const alarmSoundOptions = [
    { label: "factory_alert.mp3", value: "factory_alert.mp3" },
    { label: "chime.mp3", value: "chime.mp3" },
    { label: "beep.mp3", value: "beep.mp3" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "high":
        return "!!";
      case "medium":
        return "!!";
      case "low":
        return "i";
      default:
        return "i";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    if (severity.includes("HIGH")) return "bg-red-900/40 text-red-300";
    if (severity.includes("DIAG")) return "bg-amber-900/40 text-amber-300";
    if (severity.includes("NEEDED")) return "bg-red-900/40 text-red-300";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Settings & Summary Panel */}
        <PanelCard title="Settings & Summary">
          <div className="space-y-4">
            {/* Alarm Sound */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Alarm sound</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <CommonSelect
                    options={alarmSoundOptions}
                    value={alarmSound}
                    onValueChange={setAlarmSound}
                    placeholder="Select alarm sound"
                    className="mb-0"
                    triggerClassName="h-10"
                  />
                </div>
                <CommonButton
                  variant="outline"
                  className="h-10 px-4 mt-2"
                  icon={Play}
                >
                  Test
                </CommonButton>
              </div>
            </div>

            {/* Alarm Notifications */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-medium">Alarm Notifications</h4>
              <CommonToggle
                id="acceptable-wrns"
                label="Acceptable Wrns"
                checked={acceptableWrns}
                onCheckedChange={setAcceptableWrns}
              />

              <CommonToggle
                id="acceptable-cmpncs"
                label="Acceptable Cmpncs"
                checked={acceptableCmpncs}
                onCheckedChange={setAcceptableCmpncs}
              />

              <CommonToggle
                id="validity-completion"
                label="Validity Completion"
                checked={validityCompletion}
                onCheckedChange={setValidityCompletion}
              />
            </div>
          </div>
        </PanelCard>

        {/* Notificating Store Panel */}
        <PanelCard title="Notificating Store">
          <div className="space-y-3">
            <CommonCheckbox
              id="remind-reset"
              label="Remind on reset"
              checked={remindOnReset}
              onCheckedChange={(checked) => setRemindOnReset(checked === true)}
            />

            <CommonCheckbox
              id="self-dismissing"
              label="Self-dismissing alarms"
              checked={selfDismissing}
              onCheckedChange={(checked) => setSelfDismissing(checked === true)}
            />

            <CommonCheckbox
              id="unuset-complessible"
              label="Unusetcomplessible"
              checked={unusetComplessible}
              onCheckedChange={(checked) =>
                setUnusetComplessible(checked === true)
              }
            />

            <CommonToggle
              id="enable-new-alarm"
              label="Enable (new alarm principle)"
              checked={enableNewAlarm}
              onCheckedChange={setEnableNewAlarm}
              className="pt-3"
            />

            <CommonToggle
              id="alarm-clear"
              label="Alarm clear diagnostics"
              checked={alarmClearDiagnostics}
              onCheckedChange={setAlarmClearDiagnostics}
            />

            <CommonToggle
              id="inbound-rate"
              label="inbound rate"
              checked={inboundRate}
              onCheckedChange={setInboundRate}
            />
          </div>
        </PanelCard>
      </div>

      {/* Notification Log Panel */}
      <PanelCard
        title={
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notification Log
          </div>
        }
        headerAction={
          <div className="flex items-center gap-2">
            <CommonButton variant="outline" size="sm">
              Edit Severity & Filter
            </CommonButton>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Past 15 minutes:</span>
            <CommonButton
              variant="link"
              size="sm"
              className="h-auto p-0 text-sm"
            >
              Cleared History
            </CommonButton>
          </div>

          {/* Log Table Header */}
          <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground pb-2 border-b border-border/50">
            <div className="col-span-3">Mention/Email</div>
            <div className="col-span-5">Message</div>
            <div className="col-span-3">Severity</div>
            <div className="col-span-1"></div>
          </div>

          {/* Log Entries */}
          <div className="space-y-2">
            {logEntries.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-12 gap-3 items-center py-2 hover:bg-accent/50 rounded transition-colors"
              >
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center text-sm font-bold border",
                      getTypeColor(entry.type),
                    )}
                  >
                    {getTypeIcon(entry.type)}
                  </div>
                  <span className="text-sm truncate">{entry.timestamp}</span>
                </div>
                <div className="col-span-5">
                  <span className="text-sm">{entry.message}</span>
                </div>
                <div className="col-span-3">
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded text-sm font-medium",
                      getSeverityColor(entry.severity),
                    )}
                  >
                    {entry.severity}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="text-sm text-emerald-400 font-medium">
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <CommonButton variant="outline" size="sm">
              Clear Alerts History
            </CommonButton>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
