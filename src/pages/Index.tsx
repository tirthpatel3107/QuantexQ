// React & Hooks
import React from "react";

// Form & Validation

// Hooks

// Services & API

// Types & Schemas

// Components - Common

// Components - Local
import { Header } from "@/components/features/dashboard/Header";

// Pages - Local
import Dashboard from "@/pages/dashboard";

// Contexts

// Icons & Utils

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
