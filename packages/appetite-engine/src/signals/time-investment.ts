import type { SessionSummary, SignalResult } from "../types";

/**
 * Measures total time invested across all sessions.
 * Target: 150 minutes total (5 sessions x 30 min each).
 * Normalized to [0, 1].
 */
export function computeTimeInvestment(
  sessions: SessionSummary[]
): SignalResult {
  if (sessions.length === 0) {
    return {
      signalType: "time_investment",
      signalValue: 0,
      rawData: { totalMinutes: 0, sessionCount: 0 },
    };
  }

  const TARGET_MINUTES = 150;
  const totalSeconds = sessions.reduce(
    (sum, s) => sum + s.durationSeconds,
    0
  );
  const totalMinutes = totalSeconds / 60;
  const signalValue = Math.min(1, totalMinutes / TARGET_MINUTES);

  return {
    signalType: "time_investment",
    signalValue,
    rawData: {
      totalMinutes: Math.round(totalMinutes * 10) / 10,
      sessionCount: sessions.length,
    },
  };
}
