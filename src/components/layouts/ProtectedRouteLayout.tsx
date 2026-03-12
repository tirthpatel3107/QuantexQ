// React & Hooks
import { Navigate, Outlet } from "react-router-dom";

// Hooks

// Components - Common
import { PageLoader } from "@/components/shared";

// Contexts
import { useAuth } from "@/context/auth";

// Utils & Constants
import { ROUTES } from "@/app/routes/routeEndpoints";

// Icons & Utils

/**
 * ProtectedRouteLayout
 *
 * Wraps any route that requires the user to be authenticated.
 * Redirects to /sign-in if there is no active session.
 * Shows a loading state while the auth context is initialising.
 *
 * Usage:
 *   <Route element={<ProtectedRouteLayout />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */
const ProtectedRouteLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to={ROUTES.SIGN_IN} replace />;

  return <Outlet />;
};

export default ProtectedRouteLayout;
