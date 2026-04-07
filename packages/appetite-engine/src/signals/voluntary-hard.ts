import type { SessionSummary, SignalResult } from "../types";

/**
 * Measures willingness to take on optional harder challenges.
 * Bonus rounds are offered every 10 items (max ~4 per session of 40 items).
 * Tracks how many bonus rounds the child voluntarily chose across sessions.
 */
export function computeVoluntaryHard(
  sessions: SessionSummary[]
): SignalResult {
  if (sessions.length === 0) {
    return {
      signalType: "voluntary_hard",
      signalValue: 0,
      rawData: { totalBonusRounds: 0, totalOffered: 0 },
    };
  }

  let totalBonusRounds = 0;
  let totalOffered = 0;

  for (const session of sessions) {
    totalBonusRounds += session.voluntaryBonusRounds;
    // Bonus offered every 10 items
    const offeredInSession = Math.floor(session.itemsAttempted / 10);
    totalOffered += offeredInSession;
  }

  const signalValue =
    totalOffered === 0 ? 0 : Math.min(1, totalBonusRounds / totalOffered);

  return {
    signalType: "voluntary_hard",
    signalValue,
    rawData: {
      totalBonusRounds,
      totalOffered,
    },
  };
}
