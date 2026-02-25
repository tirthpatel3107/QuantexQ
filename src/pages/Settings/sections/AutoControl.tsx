import { useAutoControlSettings } from "@/services/api/settings/settings.api";

export function AutoControl() {
  const { data, isLoading, error } = useAutoControlSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Loading auto control settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg text-destructive">
        Error loading settings: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
        Auto Control Settings Section - Implementation Pending
        <div className="mt-2 text-xs">
          API Connected: {data ? "✓" : "✗"}
        </div>
      </div>
    </div>
  );
}
