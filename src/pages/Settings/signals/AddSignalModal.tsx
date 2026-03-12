import {
  CommonDialog,
  CommonButton,
  CommonInput,
  CommonSelect,
  CommonCheckbox,
  type CommonSelectOption,
} from "@/components/shared";
import { Checkbox } from "@/components/ui/checkbox";

interface AddSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subsystemOptions: CommonSelectOption[];
  onAdd: () => void;
}

export function AddSignalModal({
  open,
  onOpenChange,
  subsystemOptions,
  onAdd,
}: AddSignalModalProps) {
  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Signal"
      description="Configure a new signal for monitoring and control."
      footer={
        <>
          <CommonButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </CommonButton>
          <CommonButton onClick={onAdd}>Add Signal</CommonButton>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CommonInput
          label="Signal Name"
          id="signal-name"
          placeholder="Enter signal name"
        />
        <CommonSelect
          label="Subsystem"
          options={subsystemOptions}
          value=""
          onValueChange={() => {}}
          placeholder="Select subsystem"
        />
        <CommonInput label="Unit" id="unit" placeholder="e.g., RPM, psi, %" />
        <CommonInput
          label="Value Range"
          id="value-range"
          placeholder="e.g., 0-2400"
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="add-in-use" defaultChecked={true} />
          <label
            htmlFor="add-in-use"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            In Use
          </label>
        </div>
      </div>
    </CommonDialog>
  );
}
