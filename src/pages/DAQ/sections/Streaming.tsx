import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { SectionSkeleton, FormSaveDialog } from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { CommonToggle } from "@/components/common/CommonToggle";
import { CommonSelect } from "@/components/common/CommonSelect";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonButton } from "@/components/common/CommonButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus } from "lucide-react";
import {
  useStreamingData,
  useSaveStreamingData,
  useStreamingOptions,
} from "@/services/api/daq/daq.api";
import type { SaveStreamingPayload, StreamingOptionsData } from "@/services/api/daq/daq.types";
import { useDAQContext } from "../../../context/DAQ/DAQContext";
import type { ApiResponse } from "@/services/api/types";

export function Streaming() {
  const { data: streamingResponse, isLoading } = useStreamingData();
  const { data: optionsResponse } = useStreamingOptions();
  const { mutate: saveStreamingData } = useSaveStreamingData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = (optionsResponse as ApiResponse<StreamingOptionsData> | undefined)?.data;

  const initialData = useMemo(() => {
    if (!streamingResponse?.data) return undefined;
    const { witsStream, edrLogging, dataRate, liveExport } =
      streamingResponse.data;
    return { witsStream, edrLogging, dataRate, liveExport };
  }, [streamingResponse?.data]);

  const form = useSectionForm<SaveStreamingPayload>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveStreamingData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "Streaming settings saved successfully",
    errorMessage: "Failed to save streaming settings",
    confirmTitle: "Save Streaming Settings",
    confirmDescription:
      "Are you sure you want to save these streaming changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { witsStream, edrLogging } = form.formData;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streaming Panel */}
        <PanelCard title="Streaming">
          <div className="space-y-6">
            <CommonToggle
              label="Enable streaming"
              checked={witsStream.enabled}
              onCheckedChange={(checked) =>
                form.updateLocalField({ witsStream: { ...witsStream, enabled: checked } })
              }
            />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Real-time Streaming</h4>
              <div className="grid grid-cols-2 gap-4">
                <CommonSelect
                  label="Level"
                  options={
                    options?.witsLevelOptions || [
                      { label: "All", value: "all" },
                      { label: "Critical", value: "critical" },
                    ]
                  }
                  value={witsStream.level}
                  onValueChange={(value) =>
                    form.updateLocalField({
                      witsStream: { ...witsStream, level: value as "0" | "1" },
                    })
                  }
                />
                <CommonInput
                  label="Endpoint"
                  value={witsStream.endpoint}
                  onChange={(e) =>
                    form.updateLocalField({
                      witsStream: { ...witsStream, endpoint: e.target.value },
                    })
                  }
                  placeholder="Enter endpoint"
                />
              </div>

              <h4 className="text-sm font-medium mt-6">Streaming Destinations</h4>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  All
                </Badge>
                <span className="text-xs text-muted-foreground">monitor</span>
                <Badge variant="secondary" className="text-xs">
                  1
                </Badge>
                <span className="text-xs text-muted-foreground">share</span>
              </div>
              <CommonButton
                variant="outline"
                size="sm"
                icon={Plus}
                className="w-full"
              >
                Add Destination
              </CommonButton>
            </div>
          </div>
        </PanelCard>

        {/* Logging Panel */}
        <PanelCard title="Logging">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={edrLogging.enabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {edrLogging.enabled ? "ON" : "OFF"}
                  </Badge>
                  <span className="text-sm font-medium">Logging Status</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Managed by: User-controlled
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Logging Frequency:</span>
                <span className="font-medium">1 second</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Auto-cache:</span>
                <Badge variant="default" className="text-xs">
                  ON
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Disk cache active
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" className="rounded" />
                <span>Start logging upon system ready</span>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" className="rounded" />
                <span>Append on log stop</span>
              </label>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium">Disk usage:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trip usage:</span>
                  <span className="font-medium">6.2% of 250 GB</span>
                </div>
                <Progress value={6.2} className="h-2" />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Log usage</span>
                  <span className="font-medium">-2.50 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Log storage available:</span>
                  <span className="font-medium">244 GB</span>
                </div>
              </div>

              <div className="pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Log storage:</span>
                  <span className="text-xs text-muted-foreground">OA%</span>
                </div>
                <Progress value={0} className="h-2" />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">5.2MB/1TH</span>
                  <span className="text-muted-foreground">only</span>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Export and FTP Server Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Export Log Files */}
        <PanelCard title="Export Log Files">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Destination Logs to: Desktop
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Another Directory:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  ~/Desktop/QuantexQLogfile *.csv
                </code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Disk cache directory:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  ~/Desktop/QuantexQ_DAQCache
                </code>
                <span className="text-muted-foreground">~</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium">Another Directory or Network</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Network Location:</span>
                  <span className="font-mono">QuantexQLogs on \\qtserver\common</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Directory:</span>
                  <span className="font-mono">/mnt/arcsherefdn02164</span>
                </div>
              </div>
              <CommonButton
                variant="outline"
                size="sm"
                icon={FolderOpen}
                className="w-full"
              >
                Open Directory
              </CommonButton>
            </div>
          </div>
        </PanelCard>

        {/* FTP Server */}
        <PanelCard title="FTP Server">
          <div className="space-y-4">
            <div className="space-y-3">
              <CommonInput
                label="FTP URL"
                value="ftp://ftpsite.com:21[nfq27B]"
                placeholder="Enter FTP URL"
              />
              <CommonInput
                label="FTP URL"
                value="https"
                placeholder="Enter protocol"
              />
              <CommonInput
                label="FTP PAS"
                type="password"
                value="••••••••/••••••••••••••••"
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Limitless-on.daq.mnt[file]/[allocation]
              </p>
              <p className="text-xs text-muted-foreground">
                connected on count[#=z1isa
              </p>
              <div className="text-xs text-muted-foreground">%</div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="space-y-1">
                <p className="text-xs font-medium">M/V Range</p>
                <Badge variant="secondary" className="text-xs w-full justify-center">
                  192x
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium">Photology Range</p>
                <Badge variant="secondary" className="text-xs w-full justify-center">
                  192x
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium">Flow Sync (avg)</p>
                <Badge variant="secondary" className="text-xs w-full justify-center">
                  0.5x
                </Badge>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Gas Cut Status</span>
                <Badge variant="secondary" className="text-xs">
                  0.5%
                </Badge>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
