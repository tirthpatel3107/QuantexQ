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
              <KpiCard
                title="Flow In"
                value="318.0"
                unit="gpm"
                icon={Droplets}
                trend="up"
                trendValue="+3%"
                subValues={[
                  { label: "OUT", value: "320.0 gpm", status: "warning" },
                  { label: "MUD", value: "50.6 ppg" },
                ]}
              />
              <KpiCard
                title="Density"
                value="8.6"
                unit="ppg"
                icon={Gauge}
                trend="stable"
                subValues={[
                  { label: "IN", value: "8.6 ppg" },
                  { label: "OUT", value: "8.4 ppg" },
                  { label: "SBP", value: "227.0 psi" },
                ]}
              />
              <KpiCard
                title="Surface Pressure"
                value="1247.9"
                unit="psi"
                icon={Activity}
                status="normal"
                subValues={[
                  { label: "SP", value: "1247.9 psi" },
                  { label: "SPP", value: "3947.9 psi" },
                ]}
              />
              <KpiCard
                title="Standpipe"
                value="3483.0"
                unit="psi"
                icon={CircleDot}
                trend="down"
                trendValue="-2%"
              />
              <KpiCard
                title="Bottom Hole"
                value="9627.0"
                unit="psi"
                icon={Thermometer}
                subValues={[
                  { label: "SP", value: "9627.0 psi" },
                  { label: "BHP", value: "9718.4 psi" },
                ]}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              <ChartPanel
                title="Flow Rate"
                data={flowData}
                currentValue="318.0"
                unit="gpm"
                color="hsl(var(--primary))"
                status="warning"
                threshold={{ value: 350, label: "Max" }}
              />
              <ChartPanel
                title="Density"
                data={densityData}
                currentValue="8.6"
                unit="ppg"
                color="hsl(var(--success))"
              />
              <ChartPanel
                title="Surface Back Pressure"
                data={surfacePressureData}
                currentValue="1247.9"
                unit="psi"
                color="hsl(var(--warning))"
              />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <ChartPanel
                title="Standpipe Pressure"
                data={standpipePressureData}
                currentValue="3483.0"
                unit="psi"
                color="hsl(var(--chart-4))"
              />
              <ChartPanel
                title="Bottom Hole Pressure"
                data={bottomHolePressureData}
                currentValue="9627.0"
                unit="psi"
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
