import { createContext, useContext, useEffect, useState } from "react";

export type AccentColor =
  | "white"
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "cyan";

type AccentColorProviderProps = {
  children: React.ReactNode;
  defaultAccentColor?: AccentColor;
  storageKey?: string;
};

type AccentColorProviderState = {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
};

const initialState: AccentColorProviderState = {
  accentColor: "white",
  setAccentColor: () => null,
};

const AccentColorProviderContext =
  createContext<AccentColorProviderState>(initialState);

// Dark mode HSL values
const ACCENT_COLOR_MAP_DARK: Record<AccentColor, string> = {
  white: "0 0% 98%",
  blue: "217 91% 60%",
  green: "158 64% 52%",
  orange: "38 92% 50%",
  pink: "330 81% 60%",
  purple: "271 81% 66%",
  cyan: "188 94% 43%",
};

// Light mode HSL values (adjusted for better visibility on light backgrounds)
const ACCENT_COLOR_MAP_LIGHT: Record<AccentColor, string> = {
  white: "0 0% 10%", // Black for light mode
  blue: "217 91% 50%", // Slightly darker blue
  green: "158 64% 42%", // Slightly darker green
  orange: "38 92% 45%", // Slightly darker orange
  pink: "330 81% 50%", // Slightly darker pink
  purple: "271 81% 56%", // Slightly darker purple
  cyan: "188 94% 38%", // Slightly darker cyan
};

export function AccentColorProvider({
  children,
  defaultAccentColor = "white",
  storageKey = "accent-color",
  ...props
}: AccentColorProviderProps) {
  const [accentColor, setAccentColorState] = useState<AccentColor>(
    () =>
      (localStorage.getItem(storageKey) as AccentColor) || defaultAccentColor,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const isLightMode = root.classList.contains("light");
    const hslValue = isLightMode
      ? ACCENT_COLOR_MAP_LIGHT[accentColor]
      : ACCENT_COLOR_MAP_DARK[accentColor];

    if (hslValue) {
      // Update primary color (used for buttons, links, active states)
      root.style.setProperty("--primary", hslValue);

      // Update ring color (used for focus states)
      root.style.setProperty("--ring", hslValue);

      // Update sidebar primary (used for active nav items)
      root.style.setProperty("--sidebar-primary", hslValue);
      root.style.setProperty("--sidebar-ring", hslValue);

      // Update chart-1 (primary chart color)
      root.style.setProperty("--chart-1", hslValue);

      // Store the accent color variable for custom usage
      root.style.setProperty("--accent-color", hslValue);
    }

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isLight = root.classList.contains("light");
      const newHslValue = isLight
        ? ACCENT_COLOR_MAP_LIGHT[accentColor]
        : ACCENT_COLOR_MAP_DARK[accentColor];

      if (newHslValue) {
        root.style.setProperty("--primary", newHslValue);
        root.style.setProperty("--ring", newHslValue);
        root.style.setProperty("--sidebar-primary", newHslValue);
        root.style.setProperty("--sidebar-ring", newHslValue);
        root.style.setProperty("--chart-1", newHslValue);
        root.style.setProperty("--accent-color", newHslValue);
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [accentColor]);

  const value = {
    accentColor,
    setAccentColor: (color: AccentColor) => {
      localStorage.setItem(storageKey, color);
      setAccentColorState(color);
    },
  };

  return (
    <AccentColorProviderContext.Provider {...props} value={value}>
      {children}
    </AccentColorProviderContext.Provider>
  );
}

export const useAccentColor = () => {
  const context = useContext(AccentColorProviderContext);

  if (context === undefined)
    throw new Error(
      "useAccentColor must be used within an AccentColorProvider",
    );

  return context;
};
