import { useState, useEffect, useCallback } from "react";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

interface UseSectionFormOptions<T> {
  initialData?: T;
  registerSaveHandler: (handler: () => void) => void;
  unregisterSaveHandler: () => void;
  onSave: (data: T) => void | Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  confirmTitle?: string;
  confirmDescription?: string;
}

/**
 * Hook to manage form state, save registration, and confirmation across page sections
 */
export function useSectionForm<T>({
  initialData,
  registerSaveHandler,
  unregisterSaveHandler,
  ...confirmationOptions
}: UseSectionFormOptions<T>) {
  const [formData, setFormData] = useState<T | null>(null);

  // Initialize form data once when initialData becomes available
  useEffect(() => {
    if (initialData && !formData) {
      // Use a timeout to avoid direct setState in effect
      const timeoutId = setTimeout(() => {
        setFormData(initialData);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [initialData, formData]);

  const saveWithConfirmation = useSaveWithConfirmation<T>(confirmationOptions);

  // Define the save handler that will be called by the header button
  const handleSave = useCallback(() => {
    if (formData) {
      saveWithConfirmation.requestSave(formData);
    }
  }, [formData, saveWithConfirmation]);

  // Register with Context (NetworkContext, SettingsContext, etc.)
  useEffect(() => {
    registerSaveHandler(handleSave);
    return () => {
      unregisterSaveHandler();
    };
  }, [handleSave, registerSaveHandler, unregisterSaveHandler]);

  /**
   * Updates state immediately in the UI.
   * This is used for input changes. The data is only saved to the API
   * when the header "Save" button is clicked.
   */
  const updateLocalField = useCallback((updates: Partial<T>) => {
    setFormData((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  /**
   * Helper to update a single field in the form data
   */
  const updateField = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      updateLocalField({ [key]: value } as unknown as Partial<T>);
    },
    [updateLocalField],
  );

  return {
    formData,
    setFormData,
    updateLocalField,
    updateField,
    ...saveWithConfirmation,
  };
}
