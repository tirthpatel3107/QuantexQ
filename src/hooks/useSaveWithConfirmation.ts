// React & Hooks
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

// Components - Common
import { CommonToast } from "@/components/shared/CommonToast";

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
  const requestSave = useCallback((data: T) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  }, []);

  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  /**
   * Handle the actual save after confirmation
   */
  const handleConfirmedSave = useCallback(async () => {
    if (!pendingData) return;

    setIsConfirmOpen(false);
    setIsSaving(true);

    try {
      await onSaveRef.current(pendingData);
      CommonToast.success(successMessage);
    } catch (error) {
      console.error("Save error:", error);
      CommonToast.error(
        errorMessage,
        error instanceof Error ? error.message : undefined,
      );
    } finally {
      setIsSaving(false);
      setPendingData(null);
    }
  }, [pendingData, successMessage, errorMessage]);

  /**
   * Handle cancellation
   */
  const handleCancel = useCallback(() => {
    setIsConfirmOpen(false);
    setPendingData(null);
  }, []);

  return useMemo(
    () => ({
      isConfirmOpen,
      setIsConfirmOpen,
      isSaving,
      requestSave,
      handleConfirmedSave,
      handleCancel,
      confirmTitle,
      confirmDescription,
    }),
    [
      isConfirmOpen,
      isSaving,
      requestSave,
      handleConfirmedSave,
      handleCancel,
      confirmTitle,
      confirmDescription,
    ],
  );
}
