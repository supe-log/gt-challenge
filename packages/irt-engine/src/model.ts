/**
 * 3-Parameter Logistic (3PL) IRT Model
 *
 * P(θ) = c + (1 - c) / (1 + exp(-a(θ - b)))
 *
 * Where:
 *   θ = ability level
 *   a = discrimination (how sharply the item differentiates)
 *   b = difficulty (ability level for 50% correct, excluding guessing)
 *   c = guessing (probability of correct answer by chance)
 */

/**
 * Probability of a correct response given ability θ and item parameters.
 */
export function probability3PL(
  theta: number,
  a: number,
  b: number,
  c: number
): number {
  const exponent = -a * (theta - b);
  // Clamp to avoid overflow
  const expVal = Math.exp(Math.min(Math.max(exponent, -700), 700));
  return c + (1 - c) / (1 + expVal);
}

/**
 * Fisher information of an item at ability θ.
 * Higher information = the item is more useful for estimating ability at this level.
 *
 * I(θ) = a² * (P - c)² * (1 - P) / ((1 - c)² * P)
 */
export function fisherInformation(
  theta: number,
  a: number,
  b: number,
  c: number
): number {
  const P = probability3PL(theta, a, b, c);

  // Avoid division by zero
  if (P <= c || P >= 1) return 0;

  const numerator = a * a * (P - c) * (P - c) * (1 - P);
  const denominator = (1 - c) * (1 - c) * P;

  return numerator / denominator;
}
