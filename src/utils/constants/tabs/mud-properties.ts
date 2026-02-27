import {
  Timer,
  Beaker,
  Layers,
  Thermometer,
  FlaskConical,
  Ruler,
  BarChart3,
  Droplets,
} from "lucide-react";

export const MUD_NAV = [
  {
    id: "mud-properties",
    label: "Mud Properties",
    icon: Droplets,
    isOverview: true,
  },
  { id: "overview", label: "Fluid Overview", icon: Timer },
  { id: "rheology", label: "Rheology", icon: Beaker },
  { id: "density", label: "Density & Solids", icon: Layers },
  { id: "temperature", label: "Temperature", icon: Thermometer },
  { id: "gas", label: "Gas / Compressibility", icon: FlaskConical },
  { id: "calibration", label: "Calibration", icon: Ruler },
  { id: "summary", label: "Summary", icon: BarChart3 },
];

export const MUD_OVERVIEW_CARDS = [
  {
    id: "overview",
    title: "Fluid Overview",
    description:
      "Fluid system type, base fluid, active pits volume, flowline temperature, and rheology source.",
    icon: Timer,
  },
  {
    id: "rheology",
    title: "Rheology",
    description:
      "PV, YP, Gel 10s/10m — derive from viscometer or enter manually.",
    icon: Beaker,
  },
  {
    id: "density",
    title: "Density & Solids",
    description:
      "Oil/Water ratio, salinity, solids content, and density inputs.",
    icon: Layers,
  },
  {
    id: "temperature",
    title: "Temperature",
    description: "Surface temp, bottomhole temp, and temperature gradient.",
    icon: Thermometer,
  },
  {
    id: "gas",
    title: "Gas / Compressibility",
    description: "Gas solubility, compressibility factor, and gas/oil ratio.",
    icon: FlaskConical,
  },
  {
    id: "calibration",
    title: "Calibration",
    description:
      "Viscometer cal. date, density cal. date, and temperature sensor offset.",
    icon: Ruler,
  },
  {
    id: "summary",
    title: "Summary",
    description:
      "Read-only overview of all mud properties — mud system, PV/YP, gel, oil/water, surface/BHT.",
    icon: BarChart3,
  },
];

export const TYPE_OPTIONS = [
  { label: "OBM", value: "OBM" },
  { label: "WBM", value: "WBM" },
];

export const BASE_FLUID_OPTIONS = [
  { label: "Diesel", value: "Diesel" },
  { label: "Synthetic", value: "Synthetic" },
];

export const TEMP_OPTIONS = [
  { label: "85 °F", value: "85" },
  { label: "90 °F", value: "90" },
];
