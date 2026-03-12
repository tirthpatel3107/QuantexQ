// React & Hooks
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Schema & Types
import {
  streamingFormSchema,
  type StreamingFormValues,
} from "@/utils/schemas/streaming";

// Components
import { PanelCard } from "@/components/features/dashboard/PanelCard";
import {
  CommonButton,
  CommonFormInput,
  CommonFormSelect,
  CommonFormCheckbox,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/shared";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FolderOpen } from "lucide-react";

// Services & Types
import {
  useStreamingData,
  useSaveStreamingData,
  useStreamingOptions,
} from "@/services/api/daq/daq.api";
import type {
  SaveStreamingPayload,
  StreamingOptionsData,
} from "@/services/api/daq/daq.types";
import type { ApiResponse } from "@/services/api/types";

// Context
import { useDAQContext } from "@/context/daq";

// ============================================
// Component
// ============================================

export function Streaming() {
  const { data: streamingResponse, isLoading } = useStreamingData();
  const { data: optionsResponse } = useStreamingOptions();
  const { mutate: saveStreamingData } = useSaveStreamingData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  const options = (
    optionsResponse as ApiResponse<StreamingOptionsData> | undefined
  )?.data;

  const form = useForm<StreamingFormValues>({
    resolver: zodResolver(streamingFormSchema),
    defaultValues: {
      streaming: {
        enabled: true,
        realTimeLevel: "",
        destination: "",
      },
      loggingStatus: {
        enabled: true,
        frequency: "",
        autoCache: false,
        startLoggingUponSystemReady: false,
        appendOnLogStop: false,
      },
      loggingDestinations: {
        exportLogFiles: {
          destinationLogsTo: "",
          anotherDirectory: "",
          diskCacheDirectory: "",
        },
        network: {
          networkLocation: "",
          directory: "",
        },
      },
      ftpServer: {
        ftpUrl1: "",
        ftpUrl2: "",
        ftpPas: "",
      },
    },
  });

  // Initialize form with API data
  useEffect(() => {
    if (streamingResponse?.data) {
      form.reset(streamingResponse.data);
    }
  }, [streamingResponse, form]);

  const saveWithConfirmation = useSaveWithConfirmation<StreamingFormValues>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveStreamingData(data as SaveStreamingPayload, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Streaming settings saved successfully",
    errorMessage: "Failed to save streaming settings",
    confirmTitle: "Save Streaming Settings",
    confirmDescription:
      "Are you sure you want to save these streaming changes?",
  });

  // Register save handler
  useEffect(() => {
    const handleSave = () => {
      form.handleSubmit((data) => {
        saveWithConfirmation.requestSave(data);
      })();
    };

    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
  }, [registerSaveHandler, unregisterSaveHandler, form, saveWithConfirmation]);

  // Move all useWatch hooks before any conditional returns
  const streamingEnabled = useWatch({
    control: form.control,
    name: "streaming.enabled",
  });
  const loggingEnabled = useWatch({
    control: form.control,
    name: "loggingStatus.enabled",
  });
  const loggingFrequency = useWatch({
    control: form.control,
    name: "loggingStatus.frequency",
  });
  const autoCache = useWatch({
    control: form.control,
    name: "loggingStatus.autoCache",
  });
  const destinationLogsTo = useWatch({
    control: form.control,
    name: "loggingDestinations.exportLogFiles.destinationLogsTo",
  });
  const anotherDirectory = useWatch({
    control: form.control,
    name: "loggingDestinations.exportLogFiles.anotherDirectory",
  });
  const diskCacheDirectory = useWatch({
    control: form.control,
    name: "loggingDestinations.exportLogFiles.diskCacheDirectory",
  });
  const networkLocation = useWatch({
    control: form.control,
    name: "loggingDestinations.network.networkLocation",
  });
  const networkDirectory = useWatch({
    control: form.control,
    name: "loggingDestinations.network.directory",
  });

  if (isLoading) {
    return <SectionSkeleton count={3} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Card 1: Streaming */}
        <PanelCard
          title="Streaming"
          headerAction={
            <Switch
              checked={streamingEnabled}
              onCheckedChange={(checked) =>
                form.setValue("streaming.enabled", checked)
              }
            />
          }
        >
          <div className="space-y-6">
            {/* Real-time Streaming Section */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <CommonFormSelect
                  control={form.control}
                  name="streaming.realTimeLevel"
                  label=" Real-time streaming"
                  disabled={!streamingEnabled}
                  options={
                    options?.witsLevelOptions || [
                      { label: "Level 0", value: "Level 0" },
                      { label: "Level 1", value: "Level 1" },
                    ]
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CommonFormSelect
                  control={form.control}
                  name="streaming.destination"
                  label="Streaming Destinations"
                  disabled={!streamingEnabled}
                  options={
                    options?.destinationOptions || [
                      { label: "All", value: "all" },
                    ]
                  }
                />
                <div className="flex items-start gap-1">
                  <CommonButton variant="outline" className="mt-10">
                    monitor
                  </CommonButton>
                  <CommonButton variant="outline" className="mt-10">
                    1 share
                  </CommonButton>
                </div>
              </div>

              <div className="flex items-center gap-2"></div>
            </div>

            {/* Add Destination Button */}
            <CommonButton
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!streamingEnabled}
            >
              Add Destination
            </CommonButton>
          </div>
        </PanelCard>

        {/* Card 2: Logging Status */}
        <PanelCard
          title="Logging Status"
          headerAction={
            <div className="flex items-center gap-2">
              <Badge
                variant={loggingEnabled ? "default" : "secondary"}
                className="text-xs px-2 py-1"
              >
                {loggingEnabled ? "ON" : "OFF"}
              </Badge>
              <Switch
                checked={loggingEnabled}
                onCheckedChange={(checked) =>
                  form.setValue("loggingStatus.enabled", checked)
                }
              />
            </div>
          }
        >
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Managed by: User-controlled
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Logging Frequency:
                </span>
                <span className="font-medium">{loggingFrequency}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Auto-cache:
                </span>
                <Badge
                  variant={autoCache ? "default" : "secondary"}
                  className="text-sm"
                >
                  {autoCache ? "ON" : "OFF"}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Disk cache active
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <CommonFormCheckbox
                control={form.control}
                name="loggingStatus.startLoggingUponSystemReady"
                label="Start logging upon system ready"
                disabled={!loggingEnabled}
              />
              <CommonFormCheckbox
                control={form.control}
                name="loggingStatus.appendOnLogStop"
                label="Append on log stop"
                disabled={!loggingEnabled}
              />
            </div>
          </div>
        </PanelCard>

        {/* Card 3: Disk Usage */}
        <PanelCard title="Disk Usage">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-sm font-medium">Trip usage</span>
                <span className="font-medium">6.2% of 250 GB</span>
              </div>
              <Progress value={6.2} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Log usage</span>
                <span className="font-medium">-2.50 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Log storage available:
                </span>
                <span className="font-medium">244 GB</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Log storage</span>
                <span className="text-sm font-medium">0A%</span>
              </div>
              <Progress value={0} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5.2MB/1TH</span>
                <span>only</span>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-3">
        {/* Card 4: Logging Destination */}
        <PanelCard title="Logging Destinations">
          <div className="grid grid-cols-[1fr_2fr] gap-6">
            {/* Left Section: Export Log Files & Network */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-sm font-medium">Export Log Files</span>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Destination Logs to:
                    </span>
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {destinationLogsTo}
                    </code>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Another Directory:
                    </span>
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {anotherDirectory}
                    </code>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Disk cache directory:
                    </span>
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {diskCacheDirectory}
                    </code>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-4 border-t">
                <h4 className="text-sm font-medium">
                  Another Directory or Network
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Network Location:
                    </span>
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {networkLocation}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Directory:
                    </span>
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {networkDirectory}
                    </code>
                  </div>
                </div>

                <div className="flex gap-2">
                  <CommonButton
                    variant="outline"
                    size="sm"
                    icon={FolderOpen}
                    className="flex-1"
                  >
                    Open Directory
                  </CommonButton>
                  <CommonButton variant="outline" size="sm" className="flex-1">
                    Open Log Viewer
                  </CommonButton>
                </div>
              </div>
            </div>

            {/* Right Section: FTP Server */}
            <div className="space-y-4 border-l pl-6">
              <h4 className="text-sm font-medium">FTP Server</h4>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <CommonFormInput
                  control={form.control}
                  name="ftpServer.ftpUrl1"
                  label="FTP URL 1"
                  placeholder="tcp://192.168.1.100:5000"
                />
                <CommonFormInput
                  control={form.control}
                  name="ftpServer.ftpUrl2"
                  label="FTP URL 2"
                  placeholder="tcp://192.168.1.100:5000"
                />

                <CommonFormInput
                  control={form.control}
                  name="ftpServer.ftpPas"
                  label="FTP PAS"
                  type="password"
                  placeholder="••••••••/••••••••••••••••"
                />
              </div>

              <div className="space-y-2 pt-2 text-sm text-muted-foreground">
                <p>Limitless-on.daq.mnt[file]/[allocation]</p>
                <p>connected on count[#=z1isa</p>
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 pt-2">
                {/* Left Side: M/V Range & Photology Range */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      M/V Range
                    </span>
                    <Badge variant="secondary" className="text-sm px-3">
                      182%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Photology Range
                    </span>
                    <Badge variant="secondary" className="text-sm px-3">
                      182%
                    </Badge>
                  </div>
                </div>

                {/* Vertical Separator */}
                <div className="w-px bg-border" />

                {/* Right Side: Flow Sync & Gas Cut Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Flow Sync (avg)
                    </span>
                    <Badge variant="secondary" className="text-sm px-3">
                      0.5%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Gas Cut Status
                    </span>
                    <Badge variant="secondary" className="text-sm px-3">
                      0.5%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={saveWithConfirmation} />
    </>
  );
}
