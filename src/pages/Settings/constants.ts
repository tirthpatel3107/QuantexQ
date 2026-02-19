import {
  Layers,
  Clock,
  Radio,
  AlertTriangle,
  Network,
  Gauge,
  Droplets,
  Monitor,
  Users,
  Info,
  Settings as SettingsIcon,
} from "lucide-react";

export const SETTINGS_NAV = [
  { id: "setting", label: "Settings", icon: SettingsIcon, isOverview: true },
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "units", label: "Units", icon: Layers },
  { id: "data-time", label: "Data & Time", icon: Clock },
  { id: "signals", label: "Signals / Tags", icon: Radio },
  { id: "alarms", label: "Alarms & Limits", icon: AlertTriangle },
  { id: "auto-control", label: "Auto Control", icon: Network },
  { id: "choke-pumps", label: "Choke & Pumps", icon: Gauge },
  { id: "hydraulics", label: "Hydraulics Model", icon: Droplets },
  { id: "ui", label: "UI & Display", icon: Monitor },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "about", label: "About / Diagnostics", icon: Info },
];

export const CATEGORY_CARDS = [
  {
    id: "units",
    title: "Units",
    description: "Unit system for depth, pressure, flow, density, temperature.",
    icon: Layers,
  },
  {
    id: "data-time",
    title: "Data & Time",
    description: "Timezone, format, sampling rate, data source.",
    icon: Clock,
  },
  {
    id: "ui",
    title: "UI & Display",
    description: "Themes, chart/animation style, density, layout options.",
    icon: Monitor,
  },
  {
    id: "signals",
    title: "Signals / Tags",
    description:
      "Tag mapping to WITS / EDR systems, scaling, validation status.",
    icon: Radio,
  },
  {
    id: "alarms",
    title: "Alarms & Limits",
    description:
      "Thresholds, alarm logic, notification options for kick/loss, SPP/SPP/etc.",
    icon: AlertTriangle,
  },
  {
    id: "auto-control",
    title: "Auto Display",
    description: "Choke configs, response profiles, main/aux pump logic.",
    icon: Network,
  },
  {
    id: "choke-pumps",
    title: "Chokes & Pumps",
    description: "Choke configs, response profiles.",
    icon: Gauge,
  },
];
