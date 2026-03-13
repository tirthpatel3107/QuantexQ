// Components - Local
import { PanelCard } from "@/components/features/dashboard/PanelCard";

// Icons & Utils
import { FileText } from "lucide-react";

interface DownloadHistoryItem {
  timestamp: string;
  filename: string;
  size: string;
}

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

export function DownloadHistory() {
  return (
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
  );
}
