import { Suspense, lazy } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SimulationProvider } from "@/context/simulation/index.ts";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme/index.ts";
import { SidebarProvider } from "./context/sidebar/index.ts";
import { AccentColorProvider } from "@/context/accentColor/index.ts";
import { AuthProvider } from "@/context/auth/index.ts";
import { ROUTES } from "@/services/routes/clientRoutes.ts";
import { THEME_STORAGE_KEY } from "@/utils/constants/config.ts";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/notFound/index.tsx"));
const Profile = lazy(() => import("./pages/profile/index.tsx"));
const MudProperties = lazy(() => import("./pages/mudProperties/index"));
const Settings = lazy(() => import("./pages/settings/index"));
const DAQ = lazy(() => import("./pages/daq/index"));
const Network = lazy(() => import("./pages/network/index"));

// ─── Auth Pages (lazy) ───────────────────────────────────────────────────────
// NOTE: Auth routes & ProtectedRoute are wired up but commented out below.
// Uncomment the relevant sections when authentication flow is ready.
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));

import { PageLoader } from "@/components/common";
// import { ProtectedRoute } from "@/components/common"; // Uncomment when auth enforcement is enabled

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

/**
 * Root Application Component
 *
 * Provider order:
 * 1. Theme and Accent Color (Styling)
 * 2. Query Client (Data Fetching)
 * 3. Auth (Session Management)
 * 4. Tooltip and Toast (UI Utilities)
 * 5. Router (Navigation)
 * 6. Sidebar and Simulation (Application State)
 */
const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey={THEME_STORAGE_KEY}>
    <AccentColorProvider defaultAccentColor="white">
      <QueryClientProvider client={queryClient}>
        {/* Auth provider wraps everything so any component can access auth state */}
        <AuthProvider>
          <TooltipProvider delayDuration={100}>
            {/* Global UI feedback components */}
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Public Auth Routes ──────────────────────────────────── */}
                  {/* NOTE: Uncomment these routes when auth flow is ready */}
                  <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
                  <Route path={ROUTES.SIGN_UP} element={<SignUp />} />

                  {/* ── Protected App Routes ────────────────────────────────── */}
                  {/* NOTE: Wrap with <ProtectedRoute /> when auth is enabled   */}
                  {/* <Route element={<ProtectedRoute />}> */}
                  <Route
                    element={
                      <SidebarProvider>
                        <SimulationProvider>
                          {/* Nested outlet so Sidebar/Simulation only wrap app pages */}
                          <ProtectedRouteLayout />
                        </SimulationProvider>
                      </SidebarProvider>
                    }
                  >
                    <Route path={ROUTES.HOME} element={<Index />} />
                    <Route path={ROUTES.PROFILE} element={<Profile />} />
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
                  </Route>
                  {/* </Route> */}

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AccentColorProvider>
  </ThemeProvider>
);

/**
 * Inner layout outlet that keeps Sidebar & Simulation scoped to app pages only.
 * Replace this with <ProtectedRoute /> when auth is enabled:
 *   element={<ProtectedRoute />} instead of element={<ProtectedRouteLayout />}
 */
const ProtectedRouteLayout = () => <Outlet />;

export default App;
