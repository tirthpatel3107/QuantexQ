import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Switch } from "@/components/ui/switch";
import { RestoreDefaultsButton, LabeledInputWithUnit, CommonInput } from "@/components/common";

interface RheologyPanelProps {
  fluid: any;
  setFluid: (updater: (prev: any) => any) => void;
}

export function RheologyPanel({ fluid, setFluid }: RheologyPanelProps) {
  return (
    <PanelCard title="Rheology" headerAction={<RestoreDefaultsButton />}>
      <div className="flex flex-row items-center justify-between gap-2 mb-5">
        <Label
          htmlFor="rheo-derive-viscometer"
          className="font-semibold text-sm tracking-tight shrink-0"
        >
          Rheology model. Derive from viscometer
        </Label>
        <Switch
          id="rheo-derive-viscometer"
          checked={fluid.rheologySource === "viscometer"}
          onCheckedChange={(checked) =>
            setFluid((f: any) => ({
              ...f,
              rheologySource: checked ? "viscometer" : "manual",
            }))
          }
        />
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 items-start">
        <LabeledInputWithUnit
          label="PV"
          value={fluid.pv}
          onChange={(v) => setFluid((f: any) => ({ ...f, pv: v }))}
          unit="cP"
        />
        <LabeledInputWithUnit
          label="YP"
          value={fluid.yp}
          onChange={(v) => setFluid((f: any) => ({ ...f, yp: v }))}
          unit="lb/100ft²"
        />
        <LabeledInputWithUnit
          label="Gel 10s"
          value={fluid.gel10s}
          onChange={(v) => setFluid((f: any) => ({ ...f, gel10s: v }))}
          unit="lb/100ft²"
        />
        <div className="space-y-2 min-w-0">
          <Label className="h-5 flex items-center text-sm">Gel 10m</Label>
          <CommonInput
            value={fluid.gel10m}
            onChange={(e) =>
              setFluid((f: any) => ({
                ...f,
                gel10m: e.target.value,
              }))
            }
            suffix="lb/100ft²"
          />
        </div>
      </div>
    </PanelCard>
  );
}
