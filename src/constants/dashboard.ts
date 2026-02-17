/**
 * Dashboard constants for ranges, thresholds, and limits.
 */
export const DASHBOARD_LIMITS = {
  FLOW_DIFF: {
    MIN: -100,
    MAX: 100,
    SAFE_THRESHOLD: 20,
    WARNING_THRESHOLD: 50,
  },
  GAUGE: {
    MIN: 0,
    MAX: 100,
  },
  ANIMATION: {
    DURATION: 500,
  },
};

export const AUTO_CONTROL_SEGMENTS = 25;
export const AUTO_DETECTION_SEGMENTS = 25;
