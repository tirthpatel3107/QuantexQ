import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  RestoreDefaultsButton,
  LabeledInputWithUnit,
  CommonInput,
  CommonToggle,
} from "@/components/common";
import { FluidData } from "@/types/mud";

interface RheologyPanelProps {
  fluid: FluidData;
  setFluid: React.Dispatch<React.SetStateAction<FluidData>>;
}

export function RheologyPanel({ fluid, setFluid }: RheologyPanelProps) {
  return (
    <PanelCard title="Rheology" headerAction={<RestoreDefaultsButton />}>
      <div className="mb-5">
        <CommonToggle
          id="rheo-derive-viscometer"
          label="Rheology model. Derive from viscometer"
          checked={fluid.rheologySource === "viscometer"}
          onCheckedChange={(checked) =>
            setFluid((f) => ({
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
          onChange={(v) => setFluid((f) => ({ ...f, pv: v }))}
          unit="cP"
        />
        <LabeledInputWithUnit
          label="YP"
          value={fluid.yp}
          onChange={(v) => setFluid((f) => ({ ...f, yp: v }))}
          unit="lb/100ft²"
        />
        <LabeledInputWithUnit
          label="Gel 10s"
          value={fluid.gel10s}
          onChange={(v) => setFluid((f) => ({ ...f, gel10s: v }))}
          unit="lb/100ft²"
        />
        <div className="space-y-2 min-w-0">
          <CommonInput
            label="Gel 10m"
            value={fluid.gel10m}
            onChange={(e) =>
              setFluid((f) => ({
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
