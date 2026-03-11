import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme";
import { AccentColorProvider } from "@/context/accentColor";
import { AuthProvider } from "@/context/auth";
import { THEME_STORAGE_KEY } from "@/utils/constants/config.ts";

import AppRoutes from "@/app/routes/index.tsx";

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

            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AccentColorProvider>
  </ThemeProvider>
);

export default App;
