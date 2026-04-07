import type { SignalResult, AppetiteResult } from "./types";

/**
 * Aggregates 6 appetite signals into a composite score and tier.
 *
 * Composite = weighted average of all signal values.
 * Tier thresholds align with the aptitude tier thresholds:
 *   >= 0.7 → exceptional
 *   >= 0.4 → very_high
 *   >= 0.2 → high
 *   <  0.2 → null (insufficient data or engagement)
 */
export function computeAppetiteComposite(
  signals: SignalResult[]
): AppetiteResult {
  if (signals.length === 0) {
    return { signals, compositeScore: 0, tier: null };
  }

  const compositeScore =
    signals.reduce((sum, s) => sum + s.signalValue, 0) / signals.length;

  let tier: AppetiteResult["tier"];
  if (compositeScore >= 0.7) {
    tier = "exceptional";
  } else if (compositeScore >= 0.4) {
    tier = "very_high";
  } else if (compositeScore >= 0.2) {
    tier = "high";
  } else {
    tier = null;
  }

  return { signals, compositeScore, tier };
}
