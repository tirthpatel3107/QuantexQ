import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { PageLoader } from "@/shared/components/Loader";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const MudProperties = lazy(() => import("@/features/mud-properties"));
const Settings = lazy(() => import("@/features/settings"));
const DAQ = lazy(() => import("@/features/daq"));
const Network = lazy(() => import("@/features/network"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Dashboard />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
