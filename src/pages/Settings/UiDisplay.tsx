// React & Hooks
import { useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import { useTheme } from "@/hooks/useTheme";
import { useAccentColor, type AccentColor } from "@/hooks/useAccentColor";
import { type Theme } from "@/context/Theme/ThemeContext";
import type { CommonSelectOption } from "@/components/common/CommonSelect";

// Components - UI & Icons
import {
  CommonButton,
  CommonSelect,
  CommonToggle,
  CommonSlider,
  SectionSkeleton,
  FormSaveDialog,
} from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RefreshCw, Download, ChevronRight } from "lucide-react";
import { cn } from "@/utils/lib/utils";
import { Separator } from "@/components/ui/separator";

// Services & Types
import {
  useUiDisplaySettings,
  useSaveUiDisplaySettings,
  useUiDisplayOptions,
} from "@/services/api/settings/settings.api";

// Context
import { useSettingsContext } from "../../context/Settings/SettingsContext";

const THEME_OPTIONS = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
];

const ACCENT_COLORS = [
  {
    name: "White",
    value: "white",
    darkModeColor: "#FFFFFF",
    lightModeColor: "#000000",
    hsl: "0 0% 98%",
  },
  {
    name: "Blue",
    value: "blue",
    darkModeColor: "#3B82F6",
    lightModeColor: "#3B82F6",
    hsl: "217 91% 60%",
  },
  {
    name: "Green",
    value: "green",
    darkModeColor: "#10B981",
    lightModeColor: "#10B981",
    hsl: "158 64% 52%",
  },
  {
    name: "Orange",
    value: "orange",
    darkModeColor: "#F59E0B",
    lightModeColor: "#F59E0B",
    hsl: "38 92% 50%",
  },
  {
    name: "Pink",
    value: "pink",
    darkModeColor: "#EC4899",
    lightModeColor: "#EC4899",
    hsl: "330 81% 60%",
  },
  {
    name: "Purple",
    value: "purple",
    darkModeColor: "#A855F7",
    lightModeColor: "#A855F7",
    hsl: "271 81% 66%",
  },
  {
    name: "Cyan",
    value: "cyan",
    darkModeColor: "#06B6D4",
    lightModeColor: "#06B6D4",
    hsl: "188 94% 43%",
  },
];

interface UiDisplayFormData {
  highlightAlerts: boolean;
  language: string;
  dateFormat: string;
  timeFormat: string;
  uiScale: number;
  theme: string;
  accentColor: string;
  [key: string]: unknown;
}

export function UiDisplay() {
  const { data: uiDisplayResponse, isLoading } = useUiDisplaySettings();
  const { data: optionsResponse } = useUiDisplayOptions();
  const { mutate: saveUiDisplayData } = useSaveUiDisplaySettings();
  const { registerSaveHandler, unregisterSaveHandler } = useSettingsContext();

  const options = (optionsResponse?.data || {}) as Record<string, CommonSelectOption[]>;
  const { theme, setTheme } = useTheme();
  const { accentColor, setAccentColor } = useAccentColor();

  // Memoize initial data
  const initialData = useMemo(() => {
    if (!uiDisplayResponse?.data) return undefined;
    const data = uiDisplayResponse.data;
    return {
      highlightAlerts: (data.highlightAlerts as boolean) ?? true,
      language: (data.language as string) || "en",
      dateFormat: (data.dateFormat as string) || "dd-mmm-yyyy",
      timeFormat: (data.timeFormat as string) || "24h",
      uiScale: (data.uiScale as number) || 100,
      theme: (data.theme as string) || theme,
      accentColor: (data.accentColor as string) || accentColor,
    } as UiDisplayFormData;
  }, [uiDisplayResponse?.data, theme, accentColor]);

  // Use the reusable form hook
  const form = useSectionForm<UiDisplayFormData>({
    initialData,
    onSave: (data) => {
      // Sync global theme/accent before saving if needed, or let API handle it
      return new Promise<void>((resolve, reject) => {
        saveUiDisplayData(data, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    registerSaveHandler,
    unregisterSaveHandler,
    successMessage: "UI Display settings saved successfully",
    errorMessage: "Failed to save UI display settings",
    confirmTitle: "Save UI Display Settings",
    confirmDescription:
      "Are you sure you want to save these UI display changes?",
  });

  if (isLoading || !form.formData) {
    return <SectionSkeleton count={6} />;
  }

  const { formData } = form;

  // Define the allowed UI scale values
  const uiScaleSteps = [90, 100, 110, 125];

  // Handler to snap to nearest allowed value
  const handleUiScaleChange = (value: number[]) => {
    const newValue = value[0];
    const closest = uiScaleSteps.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev,
    );
    form.updateLocalField({ uiScale: closest });
  };

  const currentTheme = formData.theme || theme;
  const currentAccent = formData.accentColor || accentColor;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        {/* Display Preferences Section */}
        <PanelCard title="Display Preferences">
          <div className="space-y-6">
            {/* UI Highlight Alerts */}
            <CommonToggle
              label="UI Highlight Alerts"
              checked={formData.highlightAlerts}
              onCheckedChange={(highlightAlerts) =>
                form.updateLocalField({ highlightAlerts })
              }
            />

            <div className="grid gap-3 grid-cols-2">
              <CommonSelect
                label="Language"
                options={options?.languageOptions || []}
                value={formData.language}
                onValueChange={(language) =>
                  form.updateLocalField({ language })
                }
                placeholder="Select language"
              />
              <CommonSelect
                label="Date Format"
                options={options?.dateFormatOptions || []}
                value={formData.dateFormat}
                onValueChange={(dateFormat) =>
                  form.updateLocalField({ dateFormat })
                }
                placeholder="Select date format"
              />

              <CommonSelect
                label="Time Format"
                options={options?.timeFormatOptions || []}
                value={formData.timeFormat}
                onValueChange={(timeFormat) =>
                  form.updateLocalField({ timeFormat })
                }
                placeholder="Select time format"
              />
            </div>

            {/* UI Scale */}
            <CommonSlider
              label="UI Scale"
              value={[formData.uiScale]}
              onValueChange={handleUiScaleChange}
              min={90}
              max={125}
              step={1}
              showValue={true}
              valueFormatter={(val) => `${val}%`}
              showRangeLabels={true}
              rangeLabels={["90%", "100%", "110%", "125%"]}
              rangeLabelPositions={[0, 28.57, 57.14, 100]}
            />
          </div>
        </PanelCard>

        {/* Theme & Appearance Section */}
        <PanelCard title="Theme & Appearance">
          <div className="mb-6">
            <p className="text-medium font-medium mb-3 block">Theme</p>
            <div className="grid grid-cols-2 gap-4">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value as Theme);
                    form.updateLocalField({ theme: option.value });
                  }}
                  className={cn(
                    "relative rounded-lg border-2 p-3 transition-all hover:border-primary/50",
                    currentTheme === option.value
                      ? "border-primary"
                      : "border-border/50",
                  )}
                >
                  <div
                    className={cn(
                      "aspect-video rounded border mb-2",
                      option.value === "dark"
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-300",
                    )}
                  >
                    <div className="p-2 space-y-1">
                      <div
                        className={cn(
                          "h-1.5 w-3/4 rounded",
                          option.value === "dark"
                            ? "bg-slate-700"
                            : "bg-slate-200",
                        )}
                      />
                      <div
                        className={cn(
                          "h-1 w-1/2 rounded",
                          option.value === "dark"
                            ? "bg-slate-800"
                            : "bg-slate-100",
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-medium font-medium pt-5 mb-3 block">
              Interface Accent Color
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Select the accent color for the UI highlights. Current:{" "}
              {ACCENT_COLORS.find((c) => c.value === currentAccent)?.name}
            </p>
            <div className="flex gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setAccentColor(color.value as AccentColor);
                    form.updateLocalField({ accentColor: color.value });
                  }}
                  style={{
                    backgroundColor:
                      currentTheme === "light"
                        ? color.lightModeColor
                        : color.darkModeColor,
                  }}
                  className={cn(
                    "relative w-5 h-5 rounded-full transition-all hover:scale-110 border-2",
                    currentAccent === color.value
                      ? "border-foreground shadow-lg"
                      : "border-border/30",
                  )}
                  title={color.name}
                >
                  {currentAccent === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border",
                          currentTheme === "light"
                            ? "bg-white/60 border-white"
                            : "bg-black/30 border-black/50",
                        )}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </PanelCard>

        {/* Display Preferences Info */}
        <PanelCard title="Display Preferences">
          <div className="space-y-4">
            <div className="flex items-start flex-col gap-2 mb-5">
              <p className="font-medium">Vision MPD Simulator Update v.3.2.7</p>
              <p className="text-sm text-muted-foreground">16 Apr 2026</p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-medium font-semibold mb-2">Enhancements:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      Improved the hydraulics model for better pressure control.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Updated DAQ engine for faster data acquisition.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      Enhanced network integration for more stable
                      communication.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      Improved alarm management for better event handling.
                    </span>
                  </li>
                </ul>
              </div>

              <Separator orientation="vertical" className="h-auto" />

              <div className="flex-1">
                <p className="text-medium font-semibold mb-2">Bug Fixes:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      Fixed an issue with auto control engine response times.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      Fixed a logging bug where log files were not rotating
                      properly.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Display Actions Section */}
        <PanelCard title="Display Actions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <CommonButton
              variant="outline"
              className="w-full justify-start"
              icon={RefreshCw}
            >
              Check for Updates
            </CommonButton>

            <CommonButton
              variant="outline"
              className="w-full justify-start"
              icon={Download}
            >
              Install Updates
            </CommonButton>
          </div>
          <button className="flex items-center justify-between px-4 py-2 text-sm border border-border/50 rounded-md hover:bg-accent transition-colors mt-5">
            <span className="text-muted-foreground mr-2">PREVIOUS UPDATES</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </PanelCard>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
