import { useEffect } from 'react';

/**
 * Performance monitoring hook for development
 * Logs performance metrics and warnings
 */
export function usePerformanceMonitor(componentName: string, enabled = import.meta.env.DEV) {
  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(
          `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`
        );
      }
    };
  });
}

/**
 * Measure and log the execution time of a function
 */
export function measurePerformance<T extends (...args: never[]) => unknown>(
  fn: T,
  label: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV && end - start > 10) {
      console.warn(`[Performance] ${label} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}
