import { useState } from "react";
import { CommonToast } from "@/components/common/CommonToast";

interface UseSaveWithConfirmationOptions<T> {
  onSave: (data: T) => void | Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  confirmTitle?: string;
  confirmDescription?: string;
}

/**
 * Hook to handle save operations with confirmation dialog and toast notifications
 */
export function useSaveWithConfirmation<T>({
  onSave,
  successMessage = "Changes saved successfully",
  errorMessage = "Failed to save changes",
  confirmTitle = "Save Changes",
  confirmDescription = "Are you sure you want to save these changes?",
}: UseSaveWithConfirmationOptions<T>) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Trigger the confirmation dialog
   */
  const requestSave = (data: T) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  /**
   * Handle the actual save after confirmation
   */
  const handleConfirmedSave = async () => {
    if (!pendingData) return;

    setIsConfirmOpen(false);
    setIsSaving(true);

    try {
      await onSave(pendingData);
      CommonToast.success(successMessage);
    } catch (error) {
      console.error("Save error:", error);
      CommonToast.error(
        errorMessage,
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setIsSaving(false);
      setPendingData(null);
    }
  };

  /**
   * Handle cancellation
   */
  const handleCancel = () => {
    setIsConfirmOpen(false);
    setPendingData(null);
  };

  return {
    isConfirmOpen,
    setIsConfirmOpen,
    isSaving,
    requestSave,
    handleConfirmedSave,
    handleCancel,
    confirmTitle,
    confirmDescription,
  };
}
