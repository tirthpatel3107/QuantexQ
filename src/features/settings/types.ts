// Settings feature types
export interface SettingsState {
  // Define your settings state here
}

export interface SettingsContextValue {
  settings: SettingsState;
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}
