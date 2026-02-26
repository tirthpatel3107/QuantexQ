import { CommonAlertDialog } from "./CommonAlertDialog";

interface FormSaveDialogProps {
  form: {
    isConfirmOpen: boolean;
    setIsConfirmOpen: (open: boolean) => void;
    confirmTitle: string;
    confirmDescription: string;
    handleConfirmedSave: () => void;
    handleCancel: () => void;
  };
}

/**
 * A shorthand component for the common pattern of a save confirmation dialog
 * used with the useSectionForm hook.
 */
export function FormSaveDialog({ form }: FormSaveDialogProps) {
  return (
    <CommonAlertDialog
      open={form.isConfirmOpen}
      onOpenChange={form.setIsConfirmOpen}
      title={form.confirmTitle}
      description={form.confirmDescription}
      cancelText="Cancel"
      actionText="Save"
      onAction={form.handleConfirmedSave}
      onCancel={form.handleCancel}
    />
  );
}
