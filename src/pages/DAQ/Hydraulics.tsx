// React & Hooks
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "@/context/Theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Schema & Types
import {
  hydraulicsFormSchema,
  type HydraulicsFormValues,
  type HydraulicsParameterItem,
} from "@/utils/schemas/hydraulics";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

// Components
import { PanelCard } from "@/components/dashboard/PanelCard";
import {
  CommonButton,
  CommonFormSelect,
  SectionSkeleton,
  FormSaveDialog,
  CommonTable,
  StatCard,
} from "@/components/common";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RotateCcw,
  Cpu,
  Wind,
} from "lucide-react";

// Chart
import ReactECharts from "echarts-for-react";

// Services & Types
import {
  useHydraulicsData,
  useSaveHydraulicsData,
} from "@/services/api/daq/daq.api";
import type { SaveHydraulicsPayload } from "@/services/api/daq/daq.types";

// Context
import { useDAQContext } from "@/context/DAQ";

// ============================================
// Constants & Configuration
// ============================================
const columnHelper = createColumnHelper<HydraulicsParameterItem>();

export function Hydraulics() {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "midnight";
  const { data: hydraulicsResponse, isLoading } = useHydraulicsData();
  const { mutate: saveHydraulicsData } = useSaveHydraulicsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

  // Get accent color from CSS variable
  const [accentColor, setAccentColor] = useState("#10b981");

  useEffect(() => {
    const updateAccentColor = () => {
      const root = document.documentElement;
      const accentHsl = getComputedStyle(root)
        .getPropertyValue("--accent-color")
        .trim();
      if (accentHsl) {
        // Convert HSL to hex for ECharts
        const hslValues = accentHsl.split(" ");
        const h = parseFloat(hslValues[0]);
        const s = parseFloat(hslValues[1]) / 100;
        const l = parseFloat(hslValues[2]) / 100;

        // HSL to RGB conversion
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0,
          g = 0,
          b = 0;

        if (h >= 0 && h < 60) {
          r = c;
          g = x;
          b = 0;
        } else if (h >= 60 && h < 120) {
          r = x;
          g = c;
          b = 0;
        } else if (h >= 120 && h < 180) {
          r = 0;
          g = c;
          b = x;
        } else if (h >= 180 && h < 240) {
          r = 0;
          g = x;
          b = c;
        } else if (h >= 240 && h < 300) {
          r = x;
          g = 0;
          b = c;
        } else if (h >= 300 && h < 360) {
          r = c;
          g = 0;
          b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        setAccentColor(hex);
      }
    };

    updateAccentColor();

    // Listen for theme changes
    const observer = new MutationObserver(updateAccentColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  const form = useForm<HydraulicsFormValues>({
    resolver: zodResolver(hydraulicsFormSchema),
    defaultValues: {
      modelsUsed: [
        {
          id: "1",
          name: "Locke, Milhelm",
          type: "mw-rheological",
          active: true,
        },
      ],
      parameterLists: [
        {
          id: "1",
          name: "NFQ-11-61",
          mudOut: "Temp",
          mudIn: "55.01",
          mudType: "At Surface",
          temp: "18:06",
          bbt: "",
        },
        {
          id: "2",
          name: "NFQ-11-61",
          mudOut: "5000",
          mudIn: "8000",
          mudType: "OBM Inputs",
          temp: "18:06",
          bbt: "",
        },
        {
          id: "3",
          name: "NFQ-14-A",
          mudOut: "Mmp",
          mudIn: "8000",
          mudType: "OBM Inputs",
          temp: "18:06",
          bbt: "",
        },
        {
          id: "4",
          name: "MW In",
          mudOut: "12.4 ppg",
          mudIn: "12.4 ppg",
          mudType: "85.0",
          temp: "OBM Inputs",
          bbt: "0.685p/2.5 s",
        },
        {
          id: "5",
          name: "PD7",
          mudOut: "800 Type:",
          mudIn: "38.99 ppg",
          mudType: "80.5",
          temp: "Radius settings",
          bbt: "0.685p/2.5 s",
        },
        {
          id: "6",
          name: "MPT",
          mudOut: "80.9 ppg",
          mudIn: "27.596 psi",
          mudType: "60.3",
          temp: "BBT",
          bbt: "0.103f/59.5 s",
        },
        {
          id: "7",
          name: "DBT",
          mudOut: "35.0 pps",
          mudIn: "Y",
          mudType: "44.6",
          temp: "BBT",
          bbt: "0.185p/8.95",
        },
        {
          id: "8",
          name: "BIT",
          mudOut: "17.5 pps",
          mudIn: "Y",
          mudType: "43.1",
          temp: "DBT",
          bbt: "0.685p/10.55",
        },
      ],
      frictionLosses: {
        calculatedBy: "Manual RP",
        circulatedFlow: "Noniuatic Los",
        circulatingFlowIn: 492,
        circulatingFlowOut: 600,
        psValue: "492 psi",
        flowValue: "600 / 5m",
        outFlowValue: "510 / 5m",
        temperature: "Select",
        simplified: "Select",
        vedPuff: "Select",
        nippleInnerDiameter: "Nipple Inner Diameter",
        outerDiameter: "Outer Diameter",
        panelCostInfo:
          "Panel Numbering Count Des = 8000 TT gpmy. Sampling: 55 AF MF 1-3 PF",
        simulated: true,
        ssAf: true,
        mp73Pf: false,
      },
    },
  });

  const { reset, control, handleSubmit, watch } = form;
  const [searchTerm, setSearchTerm] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  // Initialize form with API data
  useEffect(() => {
    if (hydraulicsResponse?.data) {
      reset(hydraulicsResponse.data);
    }
  }, [hydraulicsResponse, reset]);

  const saveWithConfirmation = useSaveWithConfirmation<HydraulicsFormValues>({
    onSave: (data) => {
      return new Promise((resolve, reject) => {
        saveHydraulicsData(data as SaveHydraulicsPayload, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    successMessage: "Hydraulics settings saved successfully",
    errorMessage: "Failed to save hydraulics settings",
    confirmTitle: "Save Hydraulics Settings",
    confirmDescription:
      "Are you sure you want to save these hydraulics changes?",
  });
  // Register save handler
  useEffect(() => {
    const handleSave = handleSubmit((data) => {
      saveWithConfirmation.requestSave(data);
    });

    registerSaveHandler(handleSave);
    return () => unregisterSaveHandler();
  }, [
    registerSaveHandler,
    unregisterSaveHandler,
    handleSubmit,
    saveWithConfirmation,
  ]);

  const watchedParameterLists = watch("parameterLists") || [];

  // ============================================
  // Table Configuration
  // ============================================

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "MDC ID",
        size: 200,
        cell: (info) => (
          <div className="font-black text-foreground/90 -mx-4 px-4 transition-colors h-full flex items-center gap-2 uppercase tracking-tight">
            {info.getValue()}
            {info.row.index === 0 && (
              <Badge variant="default" className="text-sm">
                Primary
              </Badge>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("mudOut", {
        header: "Nemee",
        cell: (info) => (
          <span className="font-mono font-bold text-foreground/70 group-hover:text-primary transition-colors uppercase tracking-tight">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("mudIn", {
        header: "Mad Out",
        cell: (info) => (
          <span className="font-mono font-bold text-foreground/70 group-hover:text-foreground transition-colors uppercase tracking-tight">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("mudType", {
        header: "B5.01",
        cell: (info) => (
          <span className="font-mono font-bold text-foreground/80 group-hover:text-foreground transition-colors uppercase tracking-tight">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("temp", {
        header: "Wed Type:",
        cell: (info) => {
          const value = info.getValue();
          const item = info.row.original;
          const isSpecial = value === "BBT" || value === "DBT";
          if (isSpecial) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground/60 uppercase tracking-widest">
                  {value}
                </span>
                <span className="text-sm font-black text-orange-500/80">
                  234 rr:
                </span>
              </div>
            );
          }
          if (value === "Radius settings") {
            return (
              <div className="flex items-center justify-between bg-[#313b4e] border border-[#4a5568] px-2 py-1 rounded text-[11px] font-bold text-white/90 cursor-pointer hover:bg-[#3d485c] transition-colors w-32">
                <span>{value}</span>
                <div className="w-1.5 h-1.5 border-r border-b border-white/60 rotate-45 mb-1" />
              </div>
            );
          }
          return (
            <span className="text-sm font-bold text-foreground/60 uppercase tracking-widest">
              {value}
            </span>
          );
        },
      }),
      columnHelper.accessor("bbt", {
        header: "Tempr",
        cell: (info) => {
          const item = info.row.original;
          const isSpecial = item.temp === "BBT" || item.temp === "DBT";
          return (
            <div className="flex items-center justify-end">
              <span className="font-mono text-[13px] font-bold text-foreground/80">
                {info.getValue().replace("p/", " P/").replace("f/", " F/")}
              </span>
              {isSpecial && (
                <span className="font-mono text-[13px] font-black text-orange-500 ml-4">
                  {item.id === "6"
                    ? "6522s"
                    : item.id === "7"
                      ? "0.509s"
                      : "2.412s"}
                </span>
              )}
            </div>
          );
        },
      }),
    ],
    [columnHelper],
  );

  const tableData = useMemo(
    () => watchedParameterLists,
    [watchedParameterLists],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter: tableSearch,
    },
    onGlobalFilterChange: setTableSearch,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  // Chart Options for Hydraulics Analysis
  const chartOption1 = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 40, right: 10, top: 10, bottom: 25 },
      xAxis: {
        type: "category",
        data: ["11600", "15000", "16000", "18000", "20000", "25000"],
        axisLabel: { color: "#64748b", fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      },
      series: [
        {
          name: "Pressure",
          data: [10, 35, 38, 37, 36, 35],
          type: "line",
          smooth: true,
          color: accentColor,
          lineStyle: { width: 2 },
          symbol: "none",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${accentColor}40` },
                { offset: 1, color: `${accentColor}00` },
              ],
            },
          },
        },
        {
          name: "Reference",
          data: [8, 32, 34, 34, 33, 32],
          type: "line",
          smooth: true,
          color: "#3b82f6",
          lineStyle: { width: 1.5, type: "dashed" },
          symbol: "none",
        },
      ],
    }),
    [accentColor],
  );

  const chartOption2 = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 40, right: 10, top: 10, bottom: 25 },
      xAxis: {
        type: "category",
        data: ["11600", "15000", "16000", "18000", "20000", "25000"],
        axisLabel: { color: "#64748b", fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      },
      series: [
        {
          name: "Flow",
          data: [35, 10, 5, 2, 1, 0.5],
          type: "line",
          smooth: true,
          color: accentColor,
          lineStyle: { width: 2.5 },
          symbol: "none",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${accentColor}40` },
                { offset: 1, color: `${accentColor}00` },
              ],
            },
          },
        },
      ],
    }),
    [accentColor],
  );

  const analysisChart1 = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 10, right: 10, top: 10, bottom: 10 },
      xAxis: {
        type: "category",
        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        show: false,
      },
      yAxis: { type: "value", show: false },
      series: [
        {
          data: [15, 20, 15, 30, 25, 40, 35, 50, 45, 60],
          type: "line",
          smooth: true,
          color: accentColor,
          lineStyle: { width: 2 },
          symbol: "none",
        },
        {
          data: [10, 15, 10, 25, 20, 35, 30, 45, 40, 55],
          type: "line",
          smooth: true,
          color: "#94a3b8",
          lineStyle: { width: 1.5, type: "dashed" },
          symbol: "none",
        },
      ],
    }),
    [accentColor],
  );

  const analysisChart2 = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 10, right: 10, top: 10, bottom: 10 },
      xAxis: {
        type: "category",
        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        show: false,
      },
      yAxis: { type: "value", show: false },
      series: [
        {
          data: [5, 10, 5, 60, 5, 10, 5, 80, 5, 10],
          type: "line",
          smooth: true,
          color: accentColor,
          lineStyle: { width: 2.5 },
          symbol: "none",
          areaStyle: {
            color: `${accentColor}1A`,
          },
        },
      ],
    }),
    [accentColor],
  );

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Top Section: Models Used and Parameter Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3">
        {/* Left Column: Models */}
        <PanelCard title={<span>Models Used</span>} className="h-auto">
          <div className="space-y-5 p-1">
            <div className="relative pl-8 space-y-4">
              <div className="absolute left-0 top-0 text-orange-500">
                <div className="w-5 h-5 rounded border border-orange-500/50 flex items-center justify-center bg-orange-500/10">
                  <Cpu className="w-3 h-3" />
                </div>
              </div>
              <div className="text-base font-bold text-foreground/90 leading-tight">
                Active MW & Rheological Model :: Locke, Milhelm.
              </div>
              <div className="text-sm text-muted-foreground italic pl-1 border-l-2 border-primary/20">
                Currently selected, scaled profile 1 (Source on InWell & CT)
              </div>
            </div>

            <div className="relative pl-8 space-y-5">
              <div className="absolute left-0 top-0 text-orange-500">
                <div className="w-5 h-5 rounded border border-orange-500/50 flex items-center justify-center bg-orange-500/10">
                  <Wind className="w-3 h-3" />
                </div>
              </div>
              <div className="text-base font-bold text-foreground/90 leading-tight">
                Active Friction Loss Model: Locke Friction Friction Sweep
              </div>
              <div className="text-sm text-muted-foreground italic pl-1 border-l-2 border-orange-500/20">
                Scan foring pressure losses :: Standing from Model.
              </div>
            </div>

            <div className="pt-4 border-t border-border/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-between w-full">
                  <div className="relative group w-full">
                    <input
                      type="text"
                      placeholder="NFQ-2275-CM LISTS:"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-foreground/[0.03] dark:bg-muted/30 border border-border/60 rounded-lg h-10 px-4 pr-10 text-sm font-bold uppercase tracking-widest text-foreground/60 focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/40 shadow-sm"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors cursor-pointer" />
                  </div>
                  <CommonButton
                    variant="outline"
                    className="bg-background dark:bg-transparent shadow-sm"
                  >
                    Apply Parameters
                  </CommonButton>
                </div>
                <div className="border border-border/20 bg-foreground/[0.02] dark:bg-card/40">
                  <div className="grid grid-cols-[120px_100px_1fr] gap-4 bg-foreground/[0.04] dark:bg-muted/30 border-b border-border/10 py-3 px-4 shadow-sm">
                    <div className="font-black text-foreground/50 dark:text-muted-foreground/60 uppercase tracking-[0.15em] text-[10px]">
                      MDC ID
                    </div>
                    <div className="font-black text-foreground/50 dark:text-muted-foreground/60 uppercase tracking-[0.15em] text-[10px]">
                      Nemee
                    </div>
                    <div className="font-black text-foreground/50 dark:text-muted-foreground/60 uppercase tracking-[0.15em] text-[10px]">
                      Mad Out
                    </div>
                  </div>

                  <div className="divide-y divide-border/5">
                    {watchedParameterLists
                      .slice(0, 3)
                      .filter(
                        (item) =>
                          item.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          item.mudOut
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          item.mudType
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      )
                      .map((item, idx) => (
                        <div
                          key={item.id}
                          className={`grid grid-cols-[120px_100px_1fr] items-center gap-4 py-3 px-4 hover:bg-foreground/[0.05] dark:hover:bg-accent/50 transition-colors cursor-pointer group ${idx % 2 === 1 ? "bg-foreground/[0.03] dark:bg-white/[0.02]" : ""}`}
                        >
                          <div className="font-black text-foreground/80 group-hover:text-primary transition-colors">
                            {item.name}
                          </div>
                          <div className="text-muted-foreground font-mono font-bold">
                            {item.mudOut}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground/80 font-bold text-sm">
                              {item.mudIn} {item.bbt}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-0.5">
                              {item.mudType}
                            </span>
                          </div>
                        </div>
                      ))}
                    {watchedParameterLists.length === 0 && (
                      <div className="py-10 text-center text-muted-foreground/60 text-sm font-bold uppercase tracking-widest">
                        No results found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>

        {/* Right Column: Table and Depth Charts */}
        <div className="flex flex-col gap-3">
          <PanelCard
            className="h-auto"
            title={<span>Hydraulic Parameter Lists</span>}
            headerAction={
              <Badge variant="default" className="text-sm">
                Names Frictionless Model
              </Badge>
            }
          >
            <div className="space-y-4">
              <div className="border-b border-border/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CommonFormSelect
                    name="applyParameter"
                    control={control}
                    options={[{ label: "Apply Parameter:", value: "apply" }]}
                    placeholder="Apply Params"
                    className="text-sm font-black uppercase tracking-widest bg-muted/40 border-border/40"
                  />
                </div>
                <div className="relative group w-64">
                  <input
                    type="text"
                    placeholder="SEARCH PARAMETERS..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full bg-muted/40 border border-border/40 rounded-lg h-9 px-4 pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
              </div>

              <CommonTable
                table={table}
                showPagination={false}
                isLightTheme={!isDark}
              />

              <div className="flex justify-between items-center mt-6 px-2">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="text-sm font-black uppercase tracking-[0.1em]"
                  >
                    BATCH ACTION
                  </Badge>
                  <div className="text-sm text-muted-foreground/50 font-black uppercase tracking-[0.1em]">
                    Apply Barammeter Dimens
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <CommonFormSelect
                    name="applyBatch"
                    control={control}
                    options={[{ label: "Batch Parameter", value: "apply" }]}
                    placeholder="Batch Parameter"
                    className="w-44 text-sm font-black uppercase"
                  />
                  <CommonButton
                    variant="outline"
                    size="sm"
                    className="px-4 text-sm font-black uppercase"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Revert Changes
                  </CommonButton>
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Depth Charts (Graph 1 & 2) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-56 p-4">
              <ReactECharts
                option={chartOption1}
                style={{ height: "100%", width: "100%" }}
                theme={isDark ? "dark" : "light"}
              />
            </div>
            <div className="h-56 p-4">
              <ReactECharts
                option={chartOption2}
                style={{ height: "100%", width: "100%" }}
                theme={isDark ? "dark" : "light"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Analysis and Friction Losses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Analytics Charts (Graph 3 & 4) */}
        <PanelCard
          title="Hydraulics Analysis"
          headerAction={
            <Badge variant="default" className="text-sm">
              BBT ANALYTICS
            </Badge>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="h-56 bg-card/40">
              <ReactECharts
                option={analysisChart1}
                style={{ height: "100%", width: "100%" }}
                theme={isDark ? "dark" : "light"}
              />
            </div>
            <div className="h-56 bg-card/40">
              <ReactECharts
                option={analysisChart2}
                style={{ height: "100%", width: "100%" }}
                theme={isDark ? "dark" : "light"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-5">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase">L FB1:</span>
                <span className="text-sm uppercase">3PP99 A</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm uppercase">Manual/PV:</span>
                <span className="text-sm uppercase">6079 pss</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase">SPD Uses:</span>
                <span className="text-sm uppercase">000 pss</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm uppercase"> SPK Elements:</span>
                <span className="text-sm uppercase">679 Size</span>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col justify-center border-l-2 border-border/10 pl-6 space-y-2">
            <div className="text-sm text-muted-foreground/70 font-bold uppercase italic">
              Real-time sync:{" "}
              <span className="text-primary font-black">
                InWell & CT Live Feed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-card" />
                <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
              </div>
              <span className="text-sm text-primary font-black uppercase tracking-[0.2em] animate-pulse">
                Telemetry Online
              </span>
            </div>
          </div> */}
        </PanelCard>

        <PanelCard
          title={
            <div className="flex items-center gap-3">
              <span>Friction Losses</span>
              <Badge variant="default" className="text-sm">
                Calculated Ps
              </Badge>
            </div>
          }
          headerAction={
            <div className="flex items-center gap-2">
              <CommonButton variant="outline">Nipple I.D.</CommonButton>
              <CommonFormSelect
                name="frictionLosses.outerDiameter"
                control={control}
                options={[{ label: "Outer Dia", value: "outer" }]}
                placeholder="Outer Dia"
              />
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <StatCard
                label="Calculated By"
                subtitle="Manual RP"
                value={
                  <>
                    492{" "}
                    <span className="text-sm text-muted-foreground uppercase font-black">
                      psi
                    </span>
                  </>
                }
              />
              <StatCard
                label="Circulated Flow"
                subtitle="Noniuatic Los"
                value="600/5m"
                valueClassName="text-xl"
              />
              <StatCard
                label="Flow In / Out"
                subtitle={
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-orange-500">
                      492 psi
                    </span>
                    <span className="text-sm font-black text-orange-400">
                      600s
                    </span>
                  </div>
                }
                value="510/5m"
                valueClassName="text-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/10">
              <CommonFormSelect
                label="Temp"
                name="frictionLosses.temperature"
                control={control}
                options={[{ label: "Select", value: "select" }]}
                placeholder="Select"
              />
              <CommonFormSelect
                label="Simplified"
                name="frictionLosses.simplified"
                control={control}
                options={[{ label: "Select", value: "select" }]}
                placeholder="Select"
              />
              <CommonFormSelect
                label="Ved Puff"
                name="frictionLosses.vedPuff"
                control={control}
                options={[{ label: "Select", value: "select" }]}
                placeholder="Select"
              />
            </div>

            <div className="bg-primary/[0.03] border-2 border-primary/10 p-4 space-y-4 relative">
              <div className="text-sm leading-relaxed text-muted-foreground font-bold px-4 border-l-4 border-primary/40 italic">
                Panel Numbering Count Des ={" "}
                <span className="text-foreground font-black">8000</span> TT
                gpmy. <br />
                <span className="opacity-60">Sampling: 55 AF MF 1-3 PF</span>
              </div>

              <div className="flex items-center gap-6 px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-md border border-orange-500/40 flex items-center justify-center bg-orange-500/10">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  </div>
                  <span className="text-sm uppercase font-black tracking-widest text-muted-foreground/60">
                    Simulated
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-md border border-green-500/40 flex items-center justify-center bg-green-500/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm uppercase font-black tracking-widest text-muted-foreground/60">
                    55 AF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={saveWithConfirmation} />
    </div>
  );
}
