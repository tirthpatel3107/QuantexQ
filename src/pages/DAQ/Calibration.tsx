import { useState, useMemo } from "react";
import { useSectionForm } from "@/hooks/useSectionForm";
import {
  SectionSkeleton,
  FormSaveDialog,
  CommonButton,
  CommonCheckbox,
} from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/lib/utils";
import { Search, Settings } from "lucide-react";

// Mock data types - replace with actual API types
interface SensorPermission {
  sensor: string;
  depth: boolean;
  primary: boolean;
  secondary: boolean;
  validation: string;
  comments: string;
}

interface CalibrationData {
  permissions: SensorPermission[];
  applyType: "auto" | "manual" | "acmPerms";
  weightOnBit: "auto" | "manual" | "own";
  defaultPermissions: {
    hydraulic: boolean;
    wildLife: boolean;
    depth: boolean;
  };
  senectoPermissions: {
    opti: { enabled: boolean; value: number };
    gasDetectorHP: { enabled: boolean; value: number };
    spp: { enabled: boolean; value: number };
    flowlineTemp: { enabled: boolean; value: number };
    applyPerms: { enabled: boolean; value: number };
    lgs: { enabled: boolean; value: number };
  };
}

export function Calibration() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock initial data - replace with actual API call
  const initialData: CalibrationData = {
    permissions: [
      {
        sensor: "Depth",
        depth: true,
        primary: true,
        secondary: false,
        validation: "OK",
        comments: "Comments",
      },
      {
        sensor: "Gas Detector HP",
        depth: false,
        primary: false,
        secondary: true,
        validation: "",
        comments: "",
      },
      {
        sensor: "SPP",
        depth: true,
        primary: true,
        secondary: false,
        validation: "OK",
        comments: "",
      },
      {
        sensor: "Flowline Temp",
        depth: true,
        primary: true,
        secondary: false,
        validation: "HP Alarm",
        comments: "",
      },
      {
        sensor: "Surface Temp",
        depth: true,
        primary: true,
        secondary: false,
        validation: "HP Alarm",
        comments: "",
      },
      {
        sensor: "LGS",
        depth: true,
        primary: true,
        secondary: false,
        validation: "OK",
        comments: "",
      },
      {
        sensor: "MW In Out Density",
        depth: false,
        primary: true,
        secondary: false,
        validation: "OK",
        comments: "Drill Variants",
      },
    ],
    applyType: "auto",
    weightOnBit: "manual",
    defaultPermissions: {
      hydraulic: true,
      wildLife: true,
      depth: true,
    },
    senectoPermissions: {
      opti: { enabled: true, value: 0.5 },
      gasDetectorHP: { enabled: true, value: 0.3 },
      spp: { enabled: true, value: 0.3 },
      flowlineTemp: { enabled: true, value: 0.3 },
      applyPerms: { enabled: true, value: 0.3 },
      lgs: { enabled: true, value: 0.3 },
    },
  };

  const form = useSectionForm<CalibrationData>({
    initialData,
    onSave: (data) => {
      return new Promise((resolve) => {
        console.log("Saving calibration data:", data);
        setTimeout(resolve, 1000);
      });
    },
    registerSaveHandler: () => {},
    unregisterSaveHandler: () => {},
    successMessage: "Sensor permissions saved successfully",
    errorMessage: "Failed to save sensor permissions",
    confirmTitle: "Save Sensor Permissions",
    confirmDescription:
      "Are you sure you want to save these permission changes?",
  });

  const filteredPermissions = useMemo(() => {
    if (!form.formData) return [];
    if (!searchQuery) return form.formData.permissions;
    return form.formData.permissions.filter((p) =>
      p.sensor.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [form.formData, searchQuery]);

  if (!form.formData) {
    return <SectionSkeleton count={3} />;
  }

  return (
    <>
      {/* Top Section - Permissions Assignment & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-3">
        {/* Left Panel - Permissions Assignment */}
        <PanelCard title="Permissions Assignment">
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Settings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Assign Permissions Button */}
            <CommonButton variant="secondary" className="w-full">
              Assign Permissions
            </CommonButton>

            {/* On Permissions Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                On Permissions:
              </label>
              <select className="w-full h-9 px-3 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Primary</option>
                <option>Primary</option>
                <option>Primary</option>
              </select>
            </div>

            {/* Apply Type */}
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Apply Type:
              </label>
              <div className="flex gap-3">
                <CommonButton
                  variant={
                    form.formData.applyType === "auto" ? "default" : "outline"
                  }
                  size="sm"
                  className="flex-1"
                  onClick={() => form.updateField("applyType", "auto")}
                >
                  Auto
                </CommonButton>
                <CommonButton
                  variant={
                    form.formData.applyType === "manual" ? "default" : "outline"
                  }
                  size="sm"
                  className="flex-1"
                  onClick={() => form.updateField("applyType", "manual")}
                >
                  Manual
                </CommonButton>
                <CommonButton
                  variant={
                    form.formData.applyType === "acmPerms"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="flex-1"
                  onClick={() => form.updateField("applyType", "acmPerms")}
                >
                  Acm Perms
                </CommonButton>
              </div>
            </div>

            {/* Weight on Bit */}
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Weight on Bit:
              </label>
              <div className="flex gap-3">
                <CommonCheckbox
                  id="weight-auto"
                  checked={form.formData.weightOnBit === "auto"}
                  onCheckedChange={() =>
                    form.updateField("weightOnBit", "auto")
                  }
                  label="Auto"
                  containerClassName="flex-1 justify-center py-2 px-3 border border-border rounded hover:bg-muted/30"
                />
                <CommonCheckbox
                  id="weight-manual"
                  checked={form.formData.weightOnBit === "manual"}
                  onCheckedChange={() =>
                    form.updateField("weightOnBit", "manual")
                  }
                  label="Manual"
                  containerClassName="flex-1 justify-center py-2 px-3 border border-border rounded hover:bg-muted/30"
                />
                <CommonCheckbox
                  id="weight-own"
                  checked={form.formData.weightOnBit === "own"}
                  onCheckedChange={() => form.updateField("weightOnBit", "own")}
                  label="Own"
                  containerClassName="flex-1 justify-center py-2 px-3 border border-border rounded hover:bg-muted/30"
                />
              </div>
            </div>

            {/* Add Sensor Button */}
            <CommonButton variant="outline" className="w-full">
              Add Sensor
            </CommonButton>

            {/* Default Permissions List */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Default Permissions List:
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded">
                  <span className="text-sm">Hydraulic</span>
                  <CommonCheckbox
                    checked={form.formData.defaultPermissions.hydraulic}
                    onCheckedChange={(checked) =>
                      form.updateField("defaultPermissions", {
                        ...form.formData.defaultPermissions,
                        hydraulic: checked as boolean,
                      })
                    }
                    label="Auto"
                  />
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded">
                  <span className="text-sm">WildLife</span>
                  <CommonCheckbox
                    checked={form.formData.defaultPermissions.wildLife}
                    onCheckedChange={(checked) =>
                      form.updateField("defaultPermissions", {
                        ...form.formData.defaultPermissions,
                        wildLife: checked as boolean,
                      })
                    }
                    label="Auto"
                  />
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded">
                  <span className="text-sm">Depth</span>
                  <CommonCheckbox
                    checked={form.formData.defaultPermissions.depth}
                    onCheckedChange={(checked) =>
                      form.updateField("defaultPermissions", {
                        ...form.formData.defaultPermissions,
                        depth: checked as boolean,
                      })
                    }
                    label="Auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Right Panel - Sensor Permissions Table */}
        <PanelCard
          title={
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Sensor Permissions</span>
            </div>
          }
          headerAction={
            <CommonButton variant="ghost" size="sm">
              Filter Glint
            </CommonButton>
          }
        >
          <div className="space-y-4">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Depth
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Primary
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Secondary
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Validation
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermissions.map((permission, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <CommonCheckbox checked={permission.depth} />
                          <span className="text-sm">{permission.sensor}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <CommonCheckbox checked={permission.primary} />
                      </td>
                      <td className="py-3 px-2">
                        <CommonCheckbox checked={permission.secondary} />
                      </td>
                      <td className="py-3 px-2">
                        {permission.validation && (
                          <Badge
                            variant={
                              permission.validation === "OK"
                                ? "default"
                                : "destructive"
                            }
                            className={cn(
                              "text-xs",
                              permission.validation === "OK" &&
                                "bg-green-600/20 text-green-400 border-green-600/30",
                              permission.validation === "HP Alarm" &&
                                "bg-orange-600/20 text-orange-400 border-orange-600/30",
                            )}
                          >
                            {permission.validation}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm text-muted-foreground">
                          {permission.comments}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Validate & Assign Section */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <CommonCheckbox
                id="sensor-perms-ok"
                checked={true}
                label="Sensor permissions are OK"
              />
              <CommonButton variant="default" size="sm">
                Auto
              </CommonButton>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Bottom Section - Perm Permissions Chart & Senecto Default Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Perm Permissions Chart */}
        <PanelCard title="Perm Permissions">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total = 0.05</span>
              <span className="text-muted-foreground">
                Expor Timeline (C.W)
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-64 bg-muted/10 rounded border border-border relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-muted-foreground py-2">
                <span>by 7</span>
                <span>0</span>
                <span>-11</span>
                <span>-22</span>
                <span>-33</span>
              </div>

              {/* Chart content */}
              <div className="ml-8 h-full flex items-end justify-center p-4">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="none"
                >
                  {/* Curved line */}
                  <path
                    d="M 0,180 Q 100,160 200,120 T 400,60"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                    className="opacity-70"
                  />
                  {/* Tooltip indicator */}
                  <circle cx="200" cy="120" r="4" fill="rgb(59, 130, 246)" />
                  <line
                    x1="200"
                    y1="0"
                    x2="200"
                    y2="200"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                </svg>

                {/* Tooltip */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-background/95 border border-border rounded px-3 py-2 text-xs shadow-lg">
                  <div className="text-muted-foreground">
                    AAVM PREM REF (%) psi 7
                  </div>
                  <div className="text-muted-foreground">
                    Pas B Permissions Open
                  </div>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-muted-foreground px-4 pb-1">
                <span>Gallery</span>
                <span>Set Perms</span>
                <span>Summary</span>
                <span>Summary 00</span>
              </div>
            </div>

            {/* Bottom checkboxes */}
            <div className="flex items-center gap-6">
              <CommonCheckbox
                id="sensor-perms-ok-2"
                checked={true}
                label="Sensor permissions are OK"
              />
              <CommonCheckbox
                id="validate-all"
                checked={false}
                label="Validate all"
              />
              <CommonButton variant="outline" size="sm">
                Emassy Perms
              </CommonButton>
              <CommonButton variant="outline" size="sm">
                Revert
              </CommonButton>
            </div>
          </div>
        </PanelCard>

        {/* Senecto Default Settings */}
        <PanelCard title="Senecto Dfault Esttings:">
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 text-sm">
              {/* Header */}
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Permissions
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide text-center">
                Hydrations
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide text-center">
                Edits
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide text-center">
                Sacnesions
              </div>

              {/* OPTI */}
              <div className="flex items-center gap-2">
                <CommonCheckbox
                  checked={form.formData.senectoPermissions.opti.enabled}
                />
                <span>OPTI:</span>
              </div>
              <div className="text-center">
                <CommonCheckbox checked={true} />
              </div>
              <div className="text-center text-muted-foreground">0.5</div>
              <div></div>

              {/* Gas Detector HP */}
              <div className="flex items-center gap-2">
                <CommonCheckbox
                  checked={
                    form.formData.senectoPermissions.gasDetectorHP.enabled
                  }
                />
                <span>Gas Detector HP</span>
              </div>
              <div className="text-center">
                <CommonCheckbox checked={true} />
              </div>
              <div className="text-center text-muted-foreground">0.3</div>
              <div></div>

              {/* SPP */}
              <div className="flex items-center gap-2">
                <CommonCheckbox
                  checked={form.formData.senectoPermissions.spp.enabled}
                />
                <span>SPP</span>
              </div>
              <div className="text-center">
                <CommonCheckbox checked={true} />
              </div>
              <div className="text-center text-muted-foreground">0.3</div>
              <div></div>

              {/* Flowline Temp */}
              <div className="flex items-center gap-2">
                <CommonCheckbox
                  checked={
                    form.formData.senectoPermissions.flowlineTemp.enabled
                  }
                />
                <span>Flowline Temp</span>
              </div>
              <div className="text-center">
                <CommonCheckbox checked={true} />
              </div>
              <div className="text-center text-muted-foreground">0.3</div>
              <div></div>

              {/* Apply Perms */}
              <div className="flex items-center gap-2">
                <CommonCheckbox
                  checked={form.formData.senectoPermissions.applyPerms.enabled}
                />
                <span>Apply Perms</span>
              </div>
              <div className="text-center">
                <CommonCheckbox checked={true} />
              </div>
              <div className="text-center text-muted-foreground">0.3</div>
              <div className="text-center">
                <CommonButton variant="ghost" size="sm" className="h-7 px-2">
                  Select Type
                </CommonButton>
              </div>

              {/* LGS */}
              <div className="flex items-center gap-2">
                <CommonCheckbox
                  checked={form.formData.senectoPermissions.lgs.enabled}
                />
                <span>LGS</span>
              </div>
              <div className="text-center">
                <CommonCheckbox checked={true} />
              </div>
              <div className="text-center text-muted-foreground">0.3</div>
              <div className="text-center">
                <CommonButton variant="ghost" size="sm" className="h-7 px-2">
                  Select Type
                </CommonButton>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={form} />
    </>
  );
}
