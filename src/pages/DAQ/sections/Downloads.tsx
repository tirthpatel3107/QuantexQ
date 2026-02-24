import { useState } from "react";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonButton } from "@/components/common/CommonButton";
import {
  CommonTabs,
  CommonTabsContent,
  CommonTabsList,
  CommonTabsTrigger,
} from "@/components/common/CommonTabs";
import { Download, FolderOpen, FileText, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItem {
  name: string;
  size: string;
  icon?: "file" | "xml" | "patch";
}

interface DownloadHistoryItem {
  timestamp: string;
  filename: string;
  size: string;
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

const downloadHistory: DownloadHistoryItem[] = [
  {
    timestamp: "06 Feb 2026 | 16:18",
    filename: "Downloads_FTLogfile_review.csv",
    size: "9.7 MB",
  },
  {
    timestamp: "06 Feb 2026 | 15:37",
    filename: "Downloads_Master_deGas_preset_name.csv",
    size: "4.6 GB",
  },
  {
    timestamp: "06 Feb 2026 | 15:42",
    filename: "Downloads_DAQSummary.csv",
    size: "9.1 MB",
  },
  {
    timestamp: "06 Feb 2026 | 13:28",
    filename: "Downloads_IntegratedWells.csv",
    size: "34.3 MB",
  },
];

export function Downloads() {
  const [activeTab, setActiveTab] = useState("downloads");
  const [activeLogFilter, setActiveLogFilter] = useState("all");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-3">
      <PanelCard
        title={
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Downloads</span>
          </div>
        }
        headerAction={
          <CommonButton variant="outline" size="sm" icon={FolderOpen}>
            Open Downloads Folder
          </CommonButton>
        }
      >
        <CommonTabs value={activeTab} onValueChange={setActiveTab}>
          <CommonTabsList>
            <CommonTabsTrigger value="downloads">Downloads</CommonTabsTrigger>
            <CommonTabsTrigger value="dcs-sets">DCS Sets</CommonTabsTrigger>
            <CommonTabsTrigger value="download-patch">
              Download Patch
            </CommonTabsTrigger>
          </CommonTabsList>

          <CommonTabsContent value="downloads" className="space-y-6">
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
              <h3 className="text-sm font-semibold text-foreground">
                View Logs
              </h3>

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
          </CommonTabsContent>

          <CommonTabsContent value="dcs-sets">
            <div className="p-8 text-center text-muted-foreground">
              DCS Sets content
            </div>
          </CommonTabsContent>

          <CommonTabsContent value="download-patch">
            <div className="p-8 text-center text-muted-foreground">
              Download Patch content
            </div>
          </CommonTabsContent>
        </CommonTabs>
      </PanelCard>

      {/* Download History Section */}
      <PanelCard title="Download History">
        <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-[140px_1fr_80px] gap-3 pb-2 border-b border-border px-2">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Timestamp
            </div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Filename
            </div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-right">
              Size
            </div>
          </div>

          {/* Table Rows */}
          {downloadHistory.map((item, index) => {
            const handleDownload = () => {
              // Create a mock download - in production, this would fetch the actual file
              const blob = new Blob(["Mock file content"], {
                type: "text/plain",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = item.filename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            };

            return (
              <div
                key={index}
                onClick={handleDownload}
                className="grid grid-cols-[140px_1fr_80px] gap-3 py-2.5 px-2 border-b border-border/40 hover:bg-muted/30 transition-colors rounded group cursor-pointer"
              >
                <div className="text-sm text-muted-foreground flex items-center">
                  {item.timestamp}
                </div>
                <div className="text-sm text-foreground flex items-center gap-2 min-w-0">
                  <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="truncate" title={item.filename}>
                    {item.filename}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-end">
                  {item.size}
                </div>
              </div>
            );
          })}
        </div>
      </PanelCard>
    </div>
  );
}

function FileRow({
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
          compact && "text-[10px]",
        )}
      >
        {file.size}
      </span>
    </div>
  );
}
