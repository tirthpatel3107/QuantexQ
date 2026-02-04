import { useEffect, useState } from "react";

export function useInitialSkeleton(durationMs = 1500) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), durationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [durationMs]);

  return showSkeleton;
}
