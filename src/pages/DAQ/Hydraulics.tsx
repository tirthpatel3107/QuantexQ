// React & Hooks
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSaveWithConfirmation } from "@/hooks/useSaveWithConfirmation";

// Schema & Types
import {
  hydraulicsFormSchema,
  type HydraulicsFormValues,
  type HydraulicsParameterItem,
} from "@/utils/schemas/hydraulics-schema";
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
} from "@/components/common";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Droplets,
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
  const { data: hydraulicsResponse, isLoading } = useHydraulicsData();
  const { mutate: saveHydraulicsData } = useSaveHydraulicsData();
  const { registerSaveHandler, unregisterSaveHandler } = useDAQContext();

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
          bbt: "0.683/2.5 s",
        },
        {
          id: "5",
          name: "BHP",
          mudOut: "800 Type",
          mudIn: "385 Spm",
          mudType: "80.5",
          temp: "Radius settings",
          bbt: "0.383/2.5 s",
        },
        {
          id: "6",
          name: "MPT",
          mudOut: "80.9 ppg",
          mudIn: "27.596 psi",
          mudType: "60.3",
          temp: "BBT",
          bbt: "0.103/63.5 i",
        },
        {
          id: "7",
          name: "DBT",
          mudOut: "35.0 pps",
          mudIn: "Y",
          mudType: "44.6",
          temp: "BBT",
          bbt: "0.185/8.5 s",
        },
        {
          id: "8",
          name: "B-1",
          mudOut: "17.5 pps",
          mudIn: "Y",
          mudType: "43.1",
          temp: "DBT",
          bbt: "0.585/10.5 s",
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
        header: "Names",
        size: 140,
        cell: (info) => (
          <div className="font-black text-white/90 bg-white/[0.02] -mx-4 px-4 py-3.5 shadow-inner group-hover:bg-white/[0.05] transition-colors h-full flex items-center">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("mudOut", {
        header: "Mud Out",
        cell: (info) => (
          <span className="font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("mudIn", {
        header: "85.01",
        cell: (info) => (
          <span className="font-mono font-bold text-muted-foreground group-hover:text-white/80 transition-colors uppercase tracking-tight">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("mudType", {
        header: "Wed Type",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-muted-foreground group-hover:text-white/70 uppercase tracking-widest">
              {info.getValue()}
            </span>
            {info.getValue() === "Radius settings" && (
              <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-sm font-black text-primary">Y</span>
              </div>
            )}
          </div>
        ),
      }),
      columnHelper.display({
        id: "tempr",
        header: "Tempr",
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <span className="font-black text-orange-500 group-hover:scale-110 transition-transform">
                {item.temp}
              </span>
              <div className="h-4 w-px bg-border/40" />
              <span className="font-mono text-sm font-bold text-muted-foreground/60 group-hover:text-muted-foreground transition-colors tracking-tighter">
                {item.bbt}
              </span>
            </div>
          );
        },
      }),
    ],
    [columnHelper],
  );

  const tableData = useMemo(() => watchedParameterLists.slice(3), [watchedParameterLists]);

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
        pageSize: 5,
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
          color: "#f59e0b",
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
                { offset: 0, color: "rgba(245, 158, 11, 0.25)" },
                { offset: 1, color: "rgba(245, 158, 11, 0)" },
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
    [],
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
          color: "#10b981",
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
                { offset: 0, color: "rgba(16, 185, 129, 0.25)" },
                { offset: 1, color: "rgba(16, 185, 129, 0)" },
              ],
            },
          },
        },
      ],
    }),
    [],
  );

  if (isLoading) {
    return <SectionSkeleton count={6} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_2fr] gap-3">
        <PanelCard title="Models Used" className="h-auto">
          <div className="space-y-5 p-1">
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-0 top-1 text-orange-500">
                <div className="w-4 h-4 rounded border border-orange-500/50 flex items-center justify-center bg-orange-500/10">
                  <Cpu className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="text-sm font-bold text-white/90 leading-tight">
                Active MW & Rheological Model :: Locke, Milhelm.
              </div>
              <div className="text-sm text-muted-foreground italic pl-1 border-l-2 border-primary/20">
                Currently selected, scaled profile 1 (Source on InWell & CT)
              </div>
            </div>

            <div className="relative pl-6 space-y-5">
              <div className="absolute left-0 top-1 text-orange-500">
                <div className="w-4 h-4 rounded border border-orange-500/50 flex items-center justify-center bg-orange-500/10">
                  <Wind className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="text-sm font-bold text-white/90 leading-tight">
                Active Friction Loss Model: Locke Friction Friction Sweep
              </div>
              <div className="text-sm text-muted-foreground italic pl-1 border-l-2 border-orange-500/20">
                Scan foring pressure losses :: Standing from Model.
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title={`Hydraulic Parameter Lists`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-between w-full">
              <div className="relative group w-full">
                <input
                  type="text"
                  placeholder="NFQ-2275-CM LISTS:"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-lg h-10 px-4 pr-10 text-sm font-bold uppercase tracking-widest text-white/60 focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-primary transition-colors cursor-pointer" />
              </div>
              <CommonButton variant="outline">Apply Parameters</CommonButton>
            </div>
            <div className="rounded-lg border border-white/5 bg-zinc-900/20 min-h-[180px]">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_2fr] gap-4 bg-zinc-900/40 border-b border-white/5 py-2.5 px-4">
                <div className="font-black text-white/30 uppercase tracking-[0.15em] text-[10px]">
                  Namer
                </div>
                <div className="font-black text-white/30 uppercase tracking-[0.15em] text-[10px]">
                  GoW
                </div>
                <div className="font-black text-white/30 uppercase tracking-[0.15em] text-[10px]">
                  Archive
                </div>
              </div>

              {/* Body */}
              <div className="divide-y divide-white/5">
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
                      className={`grid grid-cols-[1fr_auto_2fr] gap-4 py-3 px-4 hover:bg-white/[0.03] transition-colors cursor-pointer group ${idx === 2 ? "bg-white/[0.02]" : ""}`}
                    >
                      <div className="font-black text-white/80 group-hover:text-primary transition-colors">
                        {item.name}
                      </div>
                      <div className="text-zinc-400 font-medium">
                        {item.mudOut}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-500 font-medium text-sm">
                          {item.mudIn} {item.mudType}
                        </span>
                        {item.temp && (
                          <span className="text-sm font-mono text-zinc-600 uppercase mt-0.5">
                            {item.temp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                {watchedParameterLists.length === 0 && (
                  <div className="py-10 text-center text-zinc-600 text-sm font-bold uppercase tracking-widest">
                    No results found
                  </div>
                )}
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title={
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-white/90">
                Friction Losses
              </span>
              <Badge
                variant="secondary"
                className="bg-orange-600/20 text-orange-500 border-orange-500/40 h-7 px-4 flex items-center gap-2 cursor-pointer hover:bg-orange-500/30 transition-all shadow-lg shadow-orange-500/5"
              >
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                Calculated Ps
              </Badge>
            </div>
          }
          headerAction={
            <div className="flex gap-2">
              <CommonButton
                variant="outline"
                size="sm"
                className="h-9 text-sm font-black uppercase tracking-widest bg-muted/20 border-border/30 hover:border-primary/40 rounded-lg"
              >
                Nipple I.D.
              </CommonButton>
              <CommonFormSelect
                name="frictionLosses.outerDiameter"
                control={control}
                options={[{ label: "Outer Dia", value: "outer" }]}
                placeholder="Outer Dia"
                className="h-9 w-32 text-sm font-black uppercase tracking-widest bg-muted/20 border-border/30 rounded-lg"
              />
            </div>
          }
        >
          <div className="space-y-4">
            {/* Calculation List */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center bg-white/[0.03] rounded-xl p-3 border border-border/10 px-4 group hover:bg-white/[0.06] hover:border-primary/20 transition-all cursor-default">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70 transition-opacity">
                    Calculated By
                  </div>
                  <div className="text-sm font-black text-white/80 group-hover:text-primary transition-colors uppercase tracking-widest">
                    Manual RP
                  </div>
                </div>
                <div className="text-2xl font-mono font-black text-white/95 flex items-baseline gap-1.5 group-hover:scale-110 transition-transform origin-right">
                  492{" "}
                  <span className="text-sm text-muted-foreground uppercase font-black">
                    psi
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/[0.03] rounded-xl p-3 border border-border/10 px-4 group hover:bg-white/[0.06] hover:border-primary/20 transition-all cursor-default">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70 transition-opacity">
                    Circulated Flow
                  </div>
                  <div className="text-sm font-black text-white/80 group-hover:text-primary transition-colors uppercase tracking-widest">
                    Noniuatic Los
                  </div>
                </div>
                <div className="text-xl font-mono font-black text-white/90 group-hover:text-white transition-colors">
                  600 / 5m
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/[0.03] rounded-xl p-3 border border-border/10 px-4 group hover:bg-white/[0.06] hover:border-primary/20 transition-all cursor-default">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 group-hover:opacity-70 transition-opacity">
                    Flow In / Out
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                      492 psi
                    </span>
                    <div className="w-1.5 h-1.5 rotate-45 border-r border-b border-muted-foreground/30" />
                    <span className="text-sm font-black text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">
                      600s
                    </span>
                  </div>
                </div>
                <div className="text-xl font-mono font-black text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                  510 / 5m
                </div>
              </div>
            </div>

            {/* Highlight Box */}
            <div className="bg-primary/[0.03] border-2 border-primary/10 rounded-2xl p-4 space-y-4 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

              <div className="text-sm leading-relaxed text-muted-foreground font-bold px-4 border-l-4 border-primary/40 italic relative">
                Panel Numbering Count Des ={" "}
                <span className="text-white font-black">8000</span> TT gpmy.{" "}
                <br />
                <span className="opacity-60">Sampling: 55 AF MF 1-3 PF</span>
              </div>

              <div className="flex items-center gap-6 px-2 relative">
                <div className="flex items-center gap-2.5 cursor-pointer group/item">
                  <div className="w-4 h-4 rounded-md border border-orange-500/40 flex items-center justify-center bg-orange-500/10 group-hover/item:bg-orange-500/30 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                    <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,1)]" />
                  </div>
                  <span className="text-sm uppercase font-black tracking-widest text-muted-foreground/60 group-hover/item:text-orange-500 transition-colors">
                    Simulated
                  </span>
                </div>

                <div className="flex items-center gap-2.5 cursor-pointer group/item">
                  <div className="w-4 h-4 rounded-md border border-green-500/40 flex items-center justify-center bg-green-500/10 group-hover/item:bg-green-500/30 transition-all">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]" />
                  </div>
                  <span className="text-sm uppercase font-black tracking-widest text-muted-foreground/60 group-hover/item:text-green-500 transition-colors">
                    55 AF
                  </span>
                </div>

                <div className="flex items-center gap-2.5 cursor-pointer group/item opacity-40 hover:opacity-80 transition-opacity">
                  <div className="w-4 h-4 rounded-md border border-muted-foreground/30 flex items-center justify-center bg-white/5 transition-all">
                    <Droplets className="w-2 h-2 text-muted-foreground" />
                  </div>
                  <span className="text-sm uppercase font-black tracking-widest text-muted-foreground">
                    MP 1-3 PF
                  </span>
                </div>
              </div>
            </div>

            {/* Form Row */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/10">
              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 opacity-50">
                  Temp:
                </label>
                <CommonFormSelect
                  name="frictionLosses.temperature"
                  control={control}
                  options={[{ label: "Select", value: "select" }]}
                  placeholder="Select"
                  className="h-9 border-border/20 bg-white/[0.04] text-sm font-black rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 opacity-50">
                  Simplified:
                </label>
                <CommonFormSelect
                  name="frictionLosses.simplified"
                  control={control}
                  options={[{ label: "Select", value: "select" }]}
                  placeholder="Select"
                  className="h-9 border-border/20 bg-white/[0.04] text-sm font-black rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] pl-1 opacity-50">
                  Ved Puff:
                </label>
                <CommonFormSelect
                  name="frictionLosses.vedPuff"
                  control={control}
                  options={[{ label: "Select", value: "select" }]}
                  placeholder="Select"
                  className="h-9 border-border/20 bg-white/[0.04] text-sm font-black rounded-lg"
                />
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <PanelCard
          title="Hydraulics Analysis:"
          headerAction={
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-primary/40 h-7 px-4 text-sm font-black uppercase tracking-[0.2em]"
              >
                BBT ANALYTICS
              </Badge>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 border border-border/20 rounded-xl bg-card/40 overflow-hidden relative group shadow-inner">
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </div>
              <ReactECharts
                option={chartOption1}
                style={{ height: "100%", width: "100%" }}
                theme="dark"
              />
            </div>
            <div className="h-48 border border-border/20 rounded-xl bg-card/40 overflow-hidden relative group shadow-inner">
              <div className="absolute top-3 right-3 z-10 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="bg-green-500/10 p-1 rounded border border-green-500/20">
                  <AlertTriangle className="w-3 h-3 text-green-500" />
                </div>
              </div>
              <ReactECharts
                option={chartOption2}
                style={{ height: "100%", width: "100%" }}
                theme="dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-1">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground uppercase font-black tracking-widest opacity-40">
                  L. FB1
                </span>
                <span className="text-sm font-black text-white/80 group-hover:text-primary transition-colors">
                  3PP99 A
                </span>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span className="text-sm text-muted-foreground uppercase font-black tracking-widest opacity-40">
                  SPD Uses
                </span>
                <span className="text-sm font-mono font-black text-white/90">
                  000 pss
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground uppercase font-black tracking-widest opacity-40">
                  Manual/PV
                </span>
                <span className="text-sm font-mono font-black text-orange-500 tracking-tighter">
                  6079 pss
                </span>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <span className="text-sm text-muted-foreground uppercase font-black tracking-widest opacity-40">
                  SPK Elements
                </span>
                <span className="text-sm font-mono font-black text-white/90 uppercase tracking-tighter">
                  679 Size
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center border-l-2 border-border/10 pl-6 space-y-2">
              <div className="text-sm text-muted-foreground/70 font-bold leading-relaxed uppercase tracking-tighter italic">
                Real-time sync:{" "}
                <span className="text-primary font-black">
                  InWell & CT Live Feed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-card shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                  <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-card shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                </div>
                <span className="text-sm text-primary font-black uppercase tracking-[0.2em] animate-pulse">
                  Telemetry Online
                </span>
              </div>
            </div>
          </div>
        </PanelCard>
        <PanelCard
          className="h-auto"
          title={
            <>
              <span>Hydraulic Parameter Lists</span>
              <Badge
                variant="outline"
                className="h-7 px-3 text-sm font-black bg-primary/10 border-primary/25 text-primary uppercase cursor-pointer hover:bg-primary/20 transition-all shadow-sm"
              >
                Names Frictionless Model
              </Badge>
            </>
          }
        >
          <div className="overflow-hidden rounded-xl border border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl">
            <div className="p-4 border-b border-border/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CommonFormSelect
                  name="applyParameter"
                  control={control}
                  options={[{ label: "Apply Parameter:", value: "apply" }]}
                  placeholder="Apply Parameter:"
                  className="h-9 w-48 text-sm font-black uppercase tracking-widest bg-zinc-900/50 border-zinc-800/80 hover:border-primary/40 focus:border-primary/50 transition-all rounded-lg"
                />
              </div>
              <div className="relative group w-64">
                <input
                  type="text"
                  placeholder="SEARCH PARAMETERS..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-lg h-9 px-4 pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-hover:text-primary transition-colors cursor-pointer" />
              </div>
            </div>
            <CommonTable table={table} />
          </div>

          <div className="flex justify-between items-center mt-6 px-2">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-muted/10 border-border/20 text-muted-foreground/50 text-sm font-black uppercase tracking-[0.3em] px-3"
              >
                BATCH ACTION
              </Badge>
              <div className="text-sm text-muted-foreground font-black uppercase tracking-[0.25em] opacity-40">
                Apply Barammeter Dimens
              </div>
            </div>
            <div className="flex gap-4">
              <CommonFormSelect
                name="applyBatch"
                control={control}
                options={[{ label: "Batch Parameter", value: "apply" }]}
                placeholder="Batch Parameter"
                className="h-9 w-44 text-sm font-black uppercase tracking-widest bg-muted/20 border-border/30 rounded-lg"
              />
              <CommonButton
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-black uppercase tracking-widest border-2 border-dashed border-border/50 hover:border-primary/50 hover:text-primary transition-all group rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2 group-hover:rotate-180 transition-transform duration-700" />
                Revert Changes
              </CommonButton>
            </div>
          </div>
        </PanelCard>
      </div>

      <FormSaveDialog form={saveWithConfirmation} />
    </div>
  );
}
