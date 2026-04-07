import type { SessionSummary, SignalResult } from "../types";

/**
 * Measures rate of ability improvement across sessions.
 * Uses terminal theta from each session to compute a normalized improvement score.
 * 0.5 = no improvement, 1.0 = strong improvement (>=1 SD), 0.0 = regression (>=-1 SD)
 */
export function computeLearningVelocity(
  sessions: SessionSummary[]
): SignalResult {
  if (sessions.length < 2) {
    return {
      signalType: "learning_velocity",
      signalValue: 0,
      rawData: { sessionCount: sessions.length, thetaDelta: 0 },
    };
  }

  const sorted = [...sessions].sort(
    (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
  );
  const thetas = sorted.map((s) => s.terminalTheta);

  const firstTheta = thetas[0];
  const lastTheta = thetas[thetas.length - 1];
  const thetaDelta = lastTheta - firstTheta;

  // Normalize: delta of +1 SD → 1.0, delta of 0 → 0.5, delta of -1 SD → 0.0
  const signalValue = Math.min(1, Math.max(0, (thetaDelta + 1) / 2));

  return {
    signalType: "learning_velocity",
    signalValue,
    rawData: {
      sessionCount: sessions.length,
      firstTheta: Math.round(firstTheta * 100) / 100,
      lastTheta: Math.round(lastTheta * 100) / 100,
      thetaDelta: Math.round(thetaDelta * 100) / 100,
    },
  };
}
