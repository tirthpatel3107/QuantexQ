import { useContext } from "react";
import { SimulationStateContext, SimulationDataContext } from "../context/SimulationContext";

export function useSimulation() {
  const state = useContext(SimulationStateContext);
  const data = useContext(SimulationDataContext);

  if (!state || !data) {
    throw new Error("useSimulation must be used within SimulationProvider");
  }

  return { ...state, ...data };
}

export function useSimulationState() {
  const state = useContext(SimulationStateContext);
  if (!state) {
    throw new Error("useSimulationState must be used within SimulationProvider");
  }
  return state;
}

export function useSimulationData() {
  const data = useContext(SimulationDataContext);
  if (!data) {
    throw new Error("useSimulationData must be used within SimulationProvider");
  }
  return data;
}
