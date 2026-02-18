import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SimulationProvider } from "@/hooks/useSimulation";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ROUTES } from "@/constants/routes";
import { THEME_STORAGE_KEY } from "@/constants/config";
import MpdSimulator from "./pages/MpdSimulator";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const MudProperties = lazy(() => import("./pages/MudProperties"));
const Settings = lazy(() => import("./pages/Settings"));
const DAQ = lazy(() => import("./pages/DAQ"));
const Network = lazy(() => import("./pages/Network"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

const Fallback = () => (
  <div className="h-screen bg-background flex flex-col overflow-hidden">
    {/* Header Skeleton */}
    <div className="h-16 border-b border-border/30 flex items-center px-6 justify-between bg-card/20 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>

    <main className="flex-1 p-3 flex flex-col overflow-hidden gap-3">
      <div className="grid flex-1 min-h-0 gap-3 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,12%)]">
        <div className="min-w-0 flex flex-col gap-3 overflow-x-hidden">
          <div className="flex gap-2 items-stretch w-full flex-1 min-h-0">
            {/* Time Axis Skeleton */}
            <Skeleton className="w-[80px] h-full rounded-lg" />
            
            {/* Main Charts Skeletons */}
            <Skeleton className="flex-1 h-full rounded-lg" />
            <Skeleton className="flex-1 h-full rounded-lg" />
            <Skeleton className="flex-1 h-full rounded-lg" />
            <Skeleton className="flex-1 h-full rounded-lg" />
            <Skeleton className="flex-1 h-full rounded-lg" />
          </div>

          {/* Bottom Bar Skeleton */}
          <Skeleton className="h-[95px] w-full rounded-lg" />
        </div>

        {/* Right Panel Skeleton */}
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    </main>
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey={THEME_STORAGE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SimulationProvider>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<Index />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route
                  path={`${ROUTES.MUD_PROPERTIES}/:section?`}
                  element={<MudProperties />}
                />
                <Route path={ROUTES.MPD_SIMULATOR} element={<MpdSimulator />} />
                <Route
                  path={`${ROUTES.SETTINGS}/:section?`}
                  element={<Settings />}
                />
                <Route path={`${ROUTES.DAQ}/:section?`} element={<DAQ />} />
                <Route
                  path={`${ROUTES.NETWORK}/:section?`}
                  element={<Network />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SimulationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
