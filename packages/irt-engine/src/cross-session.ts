/**
 * Cross-session theta management.
 *
 * When a child returns for session N, starting θ = 90% of terminal θ from session N-1.
 * This mild regression-to-mean prevents ceiling effects and gives the adaptive
 * algorithm room to re-calibrate.
 *
 * Composite θ across sessions uses exponential decay weighting (λ = 0.7).
 */

const REGRESSION_FACTOR = 0.9;
const DECAY_LAMBDA = 0.7;

/**
 * Compute the starting θ for a new session based on the previous session's terminal θ.
 * Returns 0 (population mean) if no previous session.
 */
export function computeStartingTheta(
  previousTerminalTheta: number | null
): number {
  if (previousTerminalTheta === null) return 0;
  return REGRESSION_FACTOR * previousTerminalTheta;
}

/**
 * Compute a composite θ across multiple sessions using exponential decay weighting.
 * More recent sessions contribute more heavily.
 *
 * @param sessionThetas - Terminal θ values in chronological order (oldest first)
 * @returns Weighted composite θ
 */
export function computeCompositeTheta(sessionThetas: number[]): number {
  if (sessionThetas.length === 0) return 0;
  if (sessionThetas.length === 1) return sessionThetas[0];

  const n = sessionThetas.length;
  let weightedSum = 0;
  let totalWeight = 0;

  for (let i = 0; i < n; i++) {
    // Weight: λ^(n - 1 - i), so the most recent session (i = n-1) gets weight λ^0 = 1
    const weight = Math.pow(DECAY_LAMBDA, n - 1 - i);
    weightedSum += sessionThetas[i] * weight;
    totalWeight += weight;
  }

  return weightedSum / totalWeight;
}
