import React from "react";
import { Header } from "@/components/dashboard/Header";
import Dashboard from "@/pages/dashboard";

/**
 * Main Dashboard Landing Page
 *
 * This page assembles the primary monitoring interface including:
 * - Real-time vertical charts for various drilling metrics
 * - Flow difference control and monitoring bar
 * - Depth and ROP gauges
 * - Pump status management
 */
export default function Index() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation and Branding */}
      <Header />

      <Dashboard />

      {/* Overlays and Dialogs */}
    </div>
  );
}
