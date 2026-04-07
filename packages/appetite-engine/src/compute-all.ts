import type { AppetiteInput, AppetiteResult } from "./types";
import { computeReturnVisit } from "./signals/return-visit";
import { computePersistence } from "./signals/persistence";
import { computeVoluntaryHard } from "./signals/voluntary-hard";
import { computeLearningVelocity } from "./signals/learning-velocity";
import { computeTimeInvestment } from "./signals/time-investment";
import { computeStreak } from "./signals/streak";
import { computeAppetiteComposite } from "./composite";

/**
 * Computes all 6 appetite signals and the composite score for a child.
 * This is the main entry point for appetite computation.
 */
export function computeAllSignals(input: AppetiteInput): AppetiteResult {
  const signals = [
    computeReturnVisit(input.sessions),
    computePersistence(input.responsesBySession),
    computeVoluntaryHard(input.sessions),
    computeLearningVelocity(input.sessions),
    computeTimeInvestment(input.sessions),
    computeStreak(input.sessions),
  ];

  return computeAppetiteComposite(signals);
}
