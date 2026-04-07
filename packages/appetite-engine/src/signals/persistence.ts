import type { ResponseSummary, SignalResult } from "../types";

/**
 * Measures persistence after encountering difficulty.
 * Ratio of items attempted after first incorrect answer vs. remaining items available.
 * A child who keeps going after getting things wrong shows high persistence.
 */
export function computePersistence(
  responsesBySession: Record<string, ResponseSummary[]>
): SignalResult {
  const sessionIds = Object.keys(responsesBySession);
  if (sessionIds.length === 0) {
    return {
      signalType: "persistence",
      signalValue: 0,
      rawData: { sessionCount: 0 },
    };
  }

  let totalPersistenceScore = 0;
  let sessionsWithErrors = 0;

  for (const sessionId of sessionIds) {
    const responses = responsesBySession[sessionId];
    if (responses.length === 0) continue;

    const firstWrongIndex = responses.findIndex((r) => !r.isCorrect);

    if (firstWrongIndex === -1) {
      // All correct — count as full persistence (they never had reason to quit)
      totalPersistenceScore += 1;
      continue;
    }

    sessionsWithErrors++;
    const itemsAfterFirstWrong = responses.length - firstWrongIndex - 1;
    // How many items could they have attempted after first wrong?
    // Use a reference of 25 remaining items (midpoint between min 15 and max 40)
    const maxRemainingItems = Math.max(1, 25 - firstWrongIndex);
    const sessionPersistence = Math.min(
      1,
      itemsAfterFirstWrong / maxRemainingItems
    );
    totalPersistenceScore += sessionPersistence;
  }

  const signalValue = totalPersistenceScore / sessionIds.length;

  return {
    signalType: "persistence",
    signalValue: Math.min(1, Math.max(0, signalValue)),
    rawData: {
      sessionCount: sessionIds.length,
      sessionsWithErrors,
    },
  };
}
