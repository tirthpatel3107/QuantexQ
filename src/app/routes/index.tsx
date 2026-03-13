// React & Hooks
import { Suspense, lazy } from "react";

// Third-party
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

// Components - Common
import { PageLoader } from "@/components/shared";

// Constants
import { ROUTES } from "@/app/routes/routeEndpoints";

// Contexts
import { SimulationProvider } from "@/context/simulation";
import { SidebarProvider } from "@/context/sidebar";

// Pages (lazy-loaded for code-splitting)
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/notFound"));
const Profile = lazy(() => import("@/pages/profile"));
const MudProperties = lazy(() => import("@/pages/mudProperties"));
const Settings = lazy(() => import("@/pages/settings"));
const DAQ = lazy(() => import("@/pages/daq"));
const Network = lazy(() => import("@/pages/network"));

// Auth Pages (lazy) ─────────────────────────────────────────────────────────
// NOTE: Auth routes & ProtectedRouteLayout are wired up but commented out below.
// Uncomment the relevant sections when authentication flow is ready.
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));

/**
 * Inner layout outlet that keeps Sidebar & Simulation scoped to app pages only.
 * Replace this with <ProtectedRouteLayout /> when auth is enabled:
 *   element={<ProtectedRouteLayout />} instead of element={<ProtectedRouteLayout />}
 */
const ProtectedRouteLayout = () => <Outlet />;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Auth Routes ──────────────────────────────────── */}
          {/* NOTE: Uncomment these routes when auth flow is ready */}
          <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />

          {/* ── Protected App Routes ────────────────────────────────── */}
          {/* NOTE: Wrap with <ProtectedRouteLayout /> when auth is enabled   */}
          {/* <Route element={<ProtectedRouteLayout />}> */}
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
            <Route path={`${ROUTES.NETWORK}/:section?`} element={<Network />} />
          </Route>
          {/* </Route> */}

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
