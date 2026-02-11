import { Suspense, lazy } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

const Fallback = () => (
  <div className="p-4 text-sm text-muted-foreground">Loading…</div>
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
                <Route path={ROUTES.MUD_PROPERTIES} element={<MudProperties />} />
                <Route path={ROUTES.MPD_SIMULATOR} element={<MpdSimulator />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
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
