import { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { CommonButton } from "@/components/common/CommonButton";

export interface FileItem {
  name: string;
  size: string;
  icon?: "file" | "xml" | "patch";
}

const downloadPresetFiles: FileItem[] = [
  {
    name: "Downloads_Preset_Master_deGas_preset_name.xml",
    size: "138 B",
    icon: "xml",
  },
  {
    name: "Downloads_Patch_file.patchwaf.patch",
    size: "24.9 MB",
    icon: "patch",
  },
];

const recklerPoolFiles: FileItem[] = [
  { name: "Downloads_MasterGas_preset_name.csv", size: "4.6 MB", icon: "file" },
  { name: "Downloads_FTLogfile_review.csv", size: "9.7 MB", icon: "file" },
  { name: "Downloads_DAQSummary.csv", size: "9.7 MB", icon: "file" },
  { name: "Downloads_IntegratedWells.csv", size: "1.4 MB", icon: "file" },
];

const quickFilterFiles: FileItem[] = [
  {
    name: "Export to Preset",
    size: "4.6 MB - 7.5 MB",
    icon: "file",
  },
  {
    name: "Export Logfile Port Reviewing",
    size: "4.6 MB - 5.00 MB",
    icon: "file",
  },
  {
    name: "Export DAQ Summary",
    size: "3.5 MB - 1.7 MB",
    icon: "file",
  },
];

export function FileRow({
  file,
  compact = false,
}: {
  file: FileItem;
  compact?: boolean;
}) {
  const handleDownload = () => {
    // Create a mock download - in production, this would fetch the actual file
    const blob = new Blob(["Mock file content"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={handleDownload}
      className={cn(
        "flex items-center justify-between p-3 rounded bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40 cursor-pointer",
        compact && "p-2",
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <FileText className="h-4 w-4 text-primary" />
        <span
          className={cn(
            "text-sm text-foreground truncate",
            compact && "text-sm",
          )}
        >
          {file.name}
        </span>
      </div>
      <span
        className={cn(
          "text-sm text-muted-foreground ml-2",
          compact && "text-sm",
        )}
      >
        {file.size}
      </span>
    </div>
  );
}

export function Download() {
  const [activeLogFilter, setActiveLogFilter] = useState("all");

  return (
    <>
      {/* Download DAQ Preset Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Download DAQ Preset
        </h3>
        <div className="space-y-2">
          {downloadPresetFiles.map((file, index) => (
            <FileRow key={index} file={file} />
          ))}
        </div>
      </div>

      {/* View Logs Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">View Logs</h3>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap pb-5">
          {[
            "Last Hour",
            "Last Day",
            "Last Week",
            "Custom",
            "All",
            "Narrow",
            "HPE",
            "CSV narrow",
            "WITSML",
          ].map((filter) => (
            <CommonButton
              key={filter}
              variant={
                activeLogFilter === filter.toLowerCase().replace(" ", "-")
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setActiveLogFilter(filter.toLowerCase().replace(" ", "-"))
              }
              className="text-sm"
            >
              {filter}
            </CommonButton>
          ))}
        </div>

        {/* Quick Filter and Reckler Pool */}
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Filter to Pres Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Quick Filter to Pres Master deGas:
            </h4>
            <div className="space-y-2">
              {quickFilterFiles.map((file, index) => (
                <FileRow key={index} file={file} compact />
              ))}
            </div>
          </div>

          {/* Reckler Pool Preset Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Reckler Pool Preset palice:
            </h4>
            <div className="space-y-2">
              {recklerPoolFiles.map((file, index) => (
                <FileRow key={index} file={file} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
