import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SimulationProvider } from "@/context/Simulation/SimulationProvider.tsx";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "./context/Sidebar/SidebarContext.tsx";
import { AccentColorProvider } from "@/hooks/useAccentColor";
import { ROUTES } from "@/utils/constants/routes.ts";
import { THEME_STORAGE_KEY } from "@/utils/constants/config.ts";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const MudProperties = lazy(() => import("./pages/MudProperties/index"));
const Settings = lazy(() => import("./pages/Settings/index"));
const DAQ = lazy(() => import("./pages/DAQ/index"));
const Network = lazy(() => import("./pages/Network/index"));

import { PageLoader } from "@/components/common";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

/**
 * Root Application Component
 * 
 * This component sets up the global provider stack and routing infrastructure.
 * The provider order is significant:
 * 1. Theme and Accent Color (Styling)
 * 2. Query Client (Data Fetching)
 * 3. Tooltip and Toast (UI Utilities)
 * 4. Router (Navigation)
 * 5. Sidebar and Simulation (Application State)
 */
const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey={THEME_STORAGE_KEY}>
    <AccentColorProvider defaultAccentColor="white">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={100}>
          {/* Global UI feedback components */}
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <SidebarProvider>
              <SimulationProvider>
                {/* Lazy loading transition UI */}
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Main Entry Points */}
                    <Route path={ROUTES.HOME} element={<Index />} />
                    <Route path={ROUTES.PROFILE} element={<Profile />} />
                    
                    {/* Feature Modules with optional sub-sections */}
                    <Route
                      path={`${ROUTES.MUD_PROPERTIES}/:section?`}
                      element={<MudProperties />}
                    />
                    <Route
                      path={`${ROUTES.SETTINGS}/:section?`}
                      element={<Settings />}
                    />
                    <Route path={`${ROUTES.DAQ}/:section?`} element={<DAQ />} />
                    <Route
                      path={`${ROUTES.NETWORK}/:section?`}
                      element={<Network />}
                    />
                    
                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </SimulationProvider>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AccentColorProvider>
  </ThemeProvider>
);

export default App;
