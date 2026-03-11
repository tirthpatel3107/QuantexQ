import { useContext } from "react";
import { SimulationStateContext, SimulationDataContext } from "./context";

/**
 * Combined hook to access both simulation state and real-time data.
 * @returns Object containing isRunning, setRunning, chartData, etc.
 * @throws Error if used outside of SimulationProvider
 */
export function useSimulation() {
  const state = useContext(SimulationStateContext);
  const data = useContext(SimulationDataContext);

  if (!state || !data) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }

  return { ...state, ...data };
}

/**
 * Hook to access only the simulation control state (isRunning, setRunning).
 * Use this to avoid unnecessary re-renders when only controls are needed.
 * @returns SimulationStateContext value
 */
export function useSimulationState() {
  const state = useContext(SimulationStateContext);
  if (!state) {
    throw new Error(
      "useSimulationState must be used within SimulationProvider",
    );
  }
  return state;
}

/**
 * Hook to access only the real-time simulation data (chartData, elapsedSeconds).
 * @returns SimulationDataContext value
 */
export function useSimulationData() {
  const data = useContext(SimulationDataContext);
  if (!data) {
    throw new Error("useSimulationData must be used within SimulationProvider");
  }
  return data;
}