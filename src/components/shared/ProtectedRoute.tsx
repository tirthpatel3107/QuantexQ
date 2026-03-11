/**
 * ProtectedRoute
 *
 * Wraps any route that requires the user to be authenticated.
 * Redirects to /sign-in if there is no active session.
 * Shows a loading state while the auth context is initialising.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { PageLoader } from "@/components/shared";
import { ROUTES } from "@/services/routes/clientRoutes";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to={ROUTES.SIGN_IN} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
