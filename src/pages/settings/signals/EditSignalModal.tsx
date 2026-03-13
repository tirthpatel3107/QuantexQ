import {
  CommonDialog,
  CommonButton,
  CommonInput,
  CommonSelect,
  type CommonSelectOption,
} from "@/components/shared";
import { Checkbox } from "@/components/ui/checkbox";

interface Signal {
  id: number;
  name: string;
  subsystem: string;
  inUse: boolean;
  unit: string;
  valueRange: string;
  isFavorite: boolean;
}

interface EditSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSignal: Signal | null;
  subsystemOptions: CommonSelectOption[];
  onSave: () => void;
}

export function EditSignalModal({
  open,
  onOpenChange,
  selectedSignal,
  subsystemOptions,
  onSave,
}: EditSignalModalProps) {
  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Signal"
      description={`Modify details for ${selectedSignal?.name}.`}
      footer={
        <>
          <CommonButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </CommonButton>
          <CommonButton onClick={onSave}>Save Changes</CommonButton>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CommonInput
          label="Signal Name"
          id="edit-signal-name"
          defaultValue={selectedSignal?.name}
          placeholder="Enter signal name"
        />
        <CommonSelect
          label="Subsystem"
          options={subsystemOptions}
          value={selectedSignal?.subsystem || ""}
          onValueChange={() => {}}
          placeholder="Select subsystem"
        />
        <CommonInput
          label="Unit"
          id="edit-unit"
          defaultValue={selectedSignal?.unit}
          placeholder="e.g., RPM, psi, %"
        />
        <CommonInput
          label="Value Range"
          id="edit-value-range"
          defaultValue={selectedSignal?.valueRange}
          placeholder="e.g., 0-2400"
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="edit-in-use" defaultChecked={selectedSignal?.inUse} />
          <label
            htmlFor="edit-in-use"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            In Use
          </label>
        </div>
      </div>
    </CommonDialog>
  );
}
