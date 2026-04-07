import type { SessionSummary, SignalResult } from "../types";

/**
 * Measures willingness to come back for multiple sessions.
 * Normalized to [0, 1] based on session count (target: 5 sessions)
 * with a recency bonus when sessions are close together.
 */
export function computeReturnVisit(sessions: SessionSummary[]): SignalResult {
  if (sessions.length <= 1) {
    return {
      signalType: "return_visit",
      signalValue: 0,
      rawData: { sessionCount: sessions.length, recencyBonus: 0 },
    };
  }

  // Base score: how many sessions completed out of the target 5
  const baseScore = Math.min(1, sessions.length / 5);

  // Recency bonus: reward returning quickly (within 7 days)
  const sorted = [...sessions].sort(
    (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
  );
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const daysBetween =
      (sorted[i].startedAt.getTime() - sorted[i - 1].endedAt.getTime()) /
      (1000 * 60 * 60 * 24);
    gaps.push(daysBetween);
  }
  const avgGapDays = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  // Recency bonus: 1.0 if avg gap <= 1 day, 0.0 if avg gap >= 14 days
  const recencyBonus = Math.max(0, Math.min(1, (14 - avgGapDays) / 13));

  const signalValue = Math.min(1, baseScore * 0.7 + recencyBonus * 0.3);

  return {
    signalType: "return_visit",
    signalValue,
    rawData: {
      sessionCount: sessions.length,
      avgGapDays: Math.round(avgGapDays * 10) / 10,
      recencyBonus: Math.round(recencyBonus * 100) / 100,
    },
  };
}
