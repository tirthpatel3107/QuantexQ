import { useState } from "react";
import {
  Droplets,
  Gauge,
  Thermometer,
  Activity,
  CircleDot,
  Waves,
  Cylinder,
  Fan,
  Cog,
  Snowflake,
  Shield,
} from "lucide-react";

import { Header } from "@/components/dashboard/Header";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartPanel } from "@/components/dashboard/ChartPanel";
import { DepthGauge } from "@/components/dashboard/DepthGauge";
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { StatusPanel } from "@/components/dashboard/StatusPanel";
import { ActionToolbar } from "@/components/dashboard/ActionToolbar";

import {
  flowData,
  densityData,
  surfacePressureData,
  standpipePressureData,
  bottomHolePressureData,
  notifications,
  pumpStatus,
  operationalStatus,
  chokeData,
} from "@/data/mockData";

const pumpIcons = [Cylinder, Cylinder, Waves, Cog, Snowflake, Shield];

const Index = () => {
  const [kpiCards, setKpiCards] = useState([
    {
      id: "flow-in",
      props: {
        title: "Flow In",
        value: "318.0",
        unit: "gpm",
        icon: Droplets,
        trend: "up" as const,
        trendValue: "+3%",
        subValues: [
          { label: "OUT", value: "320.0 gpm", status: "warning" as const },
          { label: "MUD", value: "50.6 ppg" },
        ],
      },
    },
    {
      id: "density",
      props: {
        title: "Density",
        value: "8.6",
        unit: "ppg",
        icon: Gauge,
        trend: "stable" as const,
        subValues: [
          { label: "IN", value: "8.6 ppg" },
          { label: "OUT", value: "8.4 ppg" },
          { label: "SBP", value: "227.0 psi" },
        ],
      },
    },
    {
      id: "surface-pressure",
      props: {
        title: "Surface Pressure",
        value: "1247.9",
        unit: "psi",
        icon: Activity,
        status: "normal" as const,
        subValues: [
          { label: "SP", value: "1247.9 psi" },
          { label: "SPP", value: "3947.9 psi" },
        ],
      },
    },
    {
      id: "standpipe",
      props: {
        title: "Standpipe",
        value: "3483.0",
        unit: "psi",
        icon: CircleDot,
        trend: "down" as const,
        trendValue: "-2%",
      },
    },
    {
      id: "bottom-hole",
      props: {
        title: "Bottom Hole",
        value: "9627.0",
        unit: "psi",
        icon: Thermometer,
        subValues: [
          { label: "SP", value: "9627.0 psi" },
          { label: "BHP", value: "9718.4 psi" },
        ],
      },
    },
  ]);

  const handleKpiDragStart = (id: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const handleKpiDrop = (targetId: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;

    setKpiCards((cards) => {
      const fromIndex = cards.findIndex((c) => c.id === draggedId);
      const toIndex = cards.findIndex((c) => c.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return cards;
      const next = [...cards];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleKpiDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 pt-28 sm:pt-24 md:pt-20 overflow-auto custom-scrollbar">
        <div className="grid h-full gap-4 grid-cols-1 lg:grid-cols-12">
          {/* Left Column - Depth Gauge */}
          <div className="min-h-[320px] min-w-0 lg:col-span-3 xl:col-span-2">
            <DepthGauge
              currentDepth={14978}
              targetDepth={20000}
              bitDepth={14950}
              rateOfPenetration={2.4}
            />
          </div>

          {/* Center Column - Main Dashboard */}
          <div className="flex flex-col gap-4 min-w-0 lg:col-span-6 xl:col-span-7">
            {/* KPI Cards Row */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {kpiCards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={handleKpiDragStart(card.id)}
                  onDragOver={handleKpiDragOver}
                  onDrop={handleKpiDrop(card.id)}
                  className="cursor-move"
                >
                  <KpiCard {...card.props} />
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              <ChartPanel
                title="Flow Rate"
                data={flowData}
                color="hsl(var(--primary))"
                status="warning"
                threshold={{ value: 350, label: "Max" }}
              />
              <ChartPanel
                title="Density"
                data={densityData}
                color="hsl(var(--success))"
              />
              <ChartPanel
                title="Surface Back Pressure"
                data={surfacePressureData}
                color="hsl(var(--warning))"
              />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <ChartPanel
                title="Standpipe Pressure"
                data={standpipePressureData}
                color="hsl(var(--chart-4))"
              />
              <ChartPanel
                title="Bottom Hole Pressure"
                data={bottomHolePressureData}
                color="hsl(var(--chart-5))"
              />
            </div>

            {/* Bottom Row - Status & Pump Grid */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {/* Operational Status */}
              <StatusPanel
                title="Status"
                items={operationalStatus}
                statusIndicator="normal"
              />

              {/* Pump Status Grid */}
              <div className="dashboard-panel lg:col-span-1 xl:col-span-2">
                <div className="panel-header">
                  <h3 className="panel-title">Pump Status</h3>
                </div>
                <div className="p-3 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {pumpStatus.map((pump, i) => (
                    <PumpStatusCard
                      key={i}
                      name={pump.name}
                      icon={pumpIcons[i]}
                      status={pump.status}
                      efficiency={pump.efficiency}
                      statusMessage={pump.statusMessage}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Choke */}
          <div className="flex flex-col gap-4 min-h-0 min-w-0 lg:col-span-3 xl:col-span-3">
            {/* Choke Status */}
            <StatusPanel
              title="Choke"
              items={chokeData}
              pieData={chokeData.map((item) => ({
                label: item.label,
                value: Math.max(0, Number(item.value)),
                unit: item.unit,
                status: item.status,
              }))}
              statusIndicator="warning"
            />

            {/* Notifications */}
            <div className="flex-1 min-h-0">
              <NotificationsPanel notifications={notifications} />
            </div>
          </div>
        </div>
      </main>

      {/* Action Toolbar */}
      <ActionToolbar />
    </div>
  );
};

export default Index;
