import { useEffect, useState } from "react";
import {
  AccentColorProviderContext,
  ACCENT_COLOR_MAP_DARK,
  ACCENT_COLOR_MAP_LIGHT,
  type AccentColor,
} from "./accent-color-context";

export type { AccentColor };

type AccentColorProviderProps = {
  children: React.ReactNode;
  defaultAccentColor?: AccentColor;
  storageKey?: string;
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
