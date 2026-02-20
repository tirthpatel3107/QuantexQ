import { useState } from "react";
import {
  CommonButton,
  CommonSelect,
  CommonToggle,
  CommonSlider,
} from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { RefreshCw, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";

const THEME_OPTIONS = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
];

const ACCENT_COLORS = [
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Teal", value: "teal", color: "bg-teal-500" },
  { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Pink", value: "pink", color: "bg-pink-500" },
];

const LANGUAGE_OPTIONS = [
  { label: "English (EN)", value: "en" },
  { label: "Spanish (ES)", value: "es" },
  { label: "French (FR)", value: "fr" },
];

const DATE_FORMAT_OPTIONS = [
  { label: "DD MMM YYYY", value: "dd-mmm-yyyy" },
  { label: "MM/DD/YYYY", value: "mm-dd-yyyy" },
  { label: "YYYY-MM-DD", value: "yyyy-mm-dd" },
];

const TIME_FORMAT_OPTIONS = [
  { label: "24-Hour Clock (HH:mm)", value: "24h" },
  { label: "12-Hour Clock (hh:mm AM/PM)", value: "12h" },
];

export function UiDisplay() {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState("blue");
  const [highlightAlerts, setHighlightAlerts] = useState(true);
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("dd-mmm-yyyy");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [uiScale, setUiScale] = useState([100]);

  // Define the allowed UI scale values
  const uiScaleSteps = [90, 100, 110, 125];

  // Handler to snap to nearest allowed value
  const handleUiScaleChange = (value: number[]) => {
    const newValue = value[0];
    // Find the closest allowed step
    const closest = uiScaleSteps.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev,
    );
    setUiScale([closest]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
      {/* Display Preferences Section */}
      <PanelCard title="Display Preferences">
        <div>
          <div className="space-y-6">
            {/* UI Highlight Alerts */}
            <CommonToggle
              label="UI Highlight Alerts"
              checked={highlightAlerts}
              onCheckedChange={setHighlightAlerts}
            />

            <div className="grid gap-3 grid-cols-2">
              {/* Language */}
              <CommonSelect
                label="Language"
                options={LANGUAGE_OPTIONS}
                value={language}
                onValueChange={setLanguage}
                placeholder="Select language"
              />
              {/* Date Format */}
              <CommonSelect
                label="Date Format"
                options={DATE_FORMAT_OPTIONS}
                value={dateFormat}
                onValueChange={setDateFormat}
                placeholder="Select date format"
              />

              {/* Time Format */}
              <CommonSelect
                label="Time Format"
                options={TIME_FORMAT_OPTIONS}
                value={timeFormat}
                onValueChange={setTimeFormat}
                placeholder="Select time format"
              />
            </div>

            {/* UI Scale */}
            <CommonSlider
              label="UI Scale"
              value={uiScale}
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
        </div>
      </PanelCard>

      {/* Theme & Appearance Section */}
      <PanelCard title="Theme & Appearance">
        {/* Theme Selection */}
        <div className="mb-6">
          <p className="text-medium font-medium mb-3 block">Theme</p>
          <div className="grid grid-cols-2 gap-4">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value as Theme)}
                className={cn(
                  "relative rounded-lg border-2 p-3 transition-all hover:border-primary/50",
                  theme === option.value
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
                  {/* Theme preview mockup */}
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

        {/* Interface Accent Color */}
        <div>
          <p className="text-medium font-medium pt-5 mb-3 block">
            Interface Accent Color
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Select the accent color for the UI highlights.
          </p>
          <div className="flex gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={cn(
                  "relative w-4 h-4 rounded-full transition-all hover:scale-110",
                  color.color,
                  accentColor === color.value &&
                    "ring-2 ring-offset-2 ring-primary ring-offset-background",
                )}
                title={color.name}
              >
                {accentColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white/30 border border-white/50" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </PanelCard>

      {/* Display Preferences Info */}
      <PanelCard title="Display Preferences">
        <div>
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
  );
}
