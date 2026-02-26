import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/shared/components/Toast/toaster";
import { Toaster as Sonner } from "@/shared/components/Toast/sonner";
import { TooltipProvider } from "@/shared/components/Tooltip/tooltip";
import { THEME_STORAGE_KEY } from "@/shared/constants/config";
import {
  ThemeProvider,
  QueryProvider,
  SimulationProvider,
  SidebarProvider,
  AccentColorProvider,
} from "@/app/providers";
import { AppRoutes } from "@/app/routes";

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey={THEME_STORAGE_KEY}>
    <AccentColorProvider defaultAccentColor="white">
      <QueryProvider>
        <TooltipProvider delayDuration={100}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <SimulationProvider>
                <AppRoutes />
              </SimulationProvider>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryProvider>
    </AccentColorProvider>
  </ThemeProvider>
);

export default App;
