import { useQuery } from "@tanstack/react-query";
import { 
  flowData, 
  densityData, 
  surfacePressureData, 
  standpipePressureData, 
  bottomHolePressureData, 
  chokeChartData,
  notifications,
  pumpStatus,
  operationalStatus
} from "@/data/mockData";

/**
 * Service hook to fetch dashboard chart data.
 * Currently uses mock data but follows the pattern for real API integration.
 */
export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        flow: flowData,
        density: densityData,
        surfacePressure: surfacePressureData,
        standpipePressure: standpipePressureData,
        bottomHolePressure: bottomHolePressureData,
        choke: chokeChartData,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Service hook to fetch notifications.
 */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return notifications;
    },
  });
}

/**
 * Service hook to fetch pump status.
 */
export function usePumpStatus() {
  return useQuery({
    queryKey: ["pumpStatus"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return pumpStatus;
    },
  });
}

/**
 * Service hook to fetch overall operational status.
 */
export function useOperationalStatus() {
  return useQuery({
    queryKey: ["operationalStatus"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return operationalStatus;
    },
  });
}
