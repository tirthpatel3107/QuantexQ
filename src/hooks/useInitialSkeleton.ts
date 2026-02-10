import { useEffect, useState } from "react";
import { SKELETON_DURATION_MS } from "@/constants/config";

/**
 * Shows skeleton UI for a short initial period (e.g. dashboard cards).
 * @param durationMs - How long to show skeleton (default from config).
 * @returns true while skeleton should be visible.
 */
export function useInitialSkeleton(durationMs = SKELETON_DURATION_MS): boolean {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  return showSkeleton;
}
