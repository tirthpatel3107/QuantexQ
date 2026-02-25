import { useDataTimeSettings } from "@/services/api/settings/settings.api";

export function DataTime() {
  const { data: dataTimeResponse, isLoading, error } = useDataTimeSettings();
  const dataTimeData = dataTimeResponse?.data;

  if (isLoading) {
    return <div className="p-4">Loading data & time settings...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading data & time settings</div>;
  }

  if (!dataTimeData) {
    return <div className="p-4">No data & time settings available</div>;
  }

  return (
    <div className="p-4 border border-dashed rounded-lg text-muted-foreground italic">
      Data & Time Settings Section - API Connected (NTP: {dataTimeData.ntpEnabled ? 'Enabled' : 'Disabled'})
    </div>
  );
}
