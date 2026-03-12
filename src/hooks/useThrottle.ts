// React & Hooks
import { useCallback, useRef } from "react";

/**
 * Creates a throttled version of a callback function
 * Ensures the function is called at most once per specified interval
 *
 * @param callback - The function to throttle
 * @param delay - Minimum time between calls in milliseconds (default: 300ms)
 * @returns A throttled version of the callback
 */
export function useThrottle<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      } else {
        // Schedule for the end of the throttle period
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRan.current = Date.now();
          },
          delay - (now - lastRan.current),
        );
      }
    },
    [callback, delay],
  );
}
