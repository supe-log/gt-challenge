import { probability3PL, fisherInformation } from "./model";
import type { Item, Response } from "./types";

/**
 * Quadrature points for numerical integration.
 * We use a grid from -4 to 4 with step 0.1 (81 points).
 * This is standard for EAP estimation in CAT.
 */
const QUAD_MIN = -4;
const QUAD_MAX = 4;
const QUAD_STEP = 0.1;

function generateQuadPoints(): number[] {
  const points: number[] = [];
  for (let q = QUAD_MIN; q <= QUAD_MAX; q += QUAD_STEP) {
    points.push(Math.round(q * 100) / 100); // avoid floating point drift
  }
  return points;
}

const QUAD_POINTS = generateQuadPoints();

/**
 * Standard normal PDF for the prior distribution.
 */
function normalPDF(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

/**
 * Expected A Posteriori (EAP) estimation of ability θ.
 *
 * Uses Bayesian quadrature: integrates over a grid of θ values,
 * weighting each by the likelihood of the observed responses
 * and a normal prior.
 *
 * @param responses - Array of item responses
 * @param items - Map of item ID to Item (must include all responded items)
 * @param priorMean - Prior mean for θ (default 0)
 * @param priorSD - Prior SD for θ (default 1)
 * @returns Estimated θ
 */
export function estimateThetaEAP(
  responses: Response[],
  items: Map<string, Item>,
  priorMean: number = 0,
  priorSD: number = 1
): number {
  if (responses.length === 0) return priorMean;

  let numerator = 0;
  let denominator = 0;

  for (const q of QUAD_POINTS) {
    // Prior weight
    let logLikelihood = Math.log(normalPDF(q, priorMean, priorSD));

    // Likelihood of all responses at this θ
    for (const response of responses) {
      const item = items.get(response.itemId);
      if (!item) continue;

      const p = probability3PL(q, item.discrimination, item.difficulty, item.guessing);

      if (response.isCorrect) {
        logLikelihood += Math.log(Math.max(p, 1e-10));
      } else {
        logLikelihood += Math.log(Math.max(1 - p, 1e-10));
      }
    }

    const weight = Math.exp(logLikelihood);
    numerator += q * weight;
    denominator += weight;
  }

  if (denominator === 0) return priorMean;

  return numerator / denominator;
}

/**
 * Compute the standard error of the θ estimate.
 * SE = 1 / sqrt(sum of Fisher information across administered items)
 */
export function computeSE(
  theta: number,
  administeredItems: Item[]
): number {
  if (administeredItems.length === 0) return Infinity;

  let totalInfo = 0;
  for (const item of administeredItems) {
    totalInfo += fisherInformation(
      theta,
      item.discrimination,
      item.difficulty,
      item.guessing
    );
  }

  if (totalInfo <= 0) return Infinity;

  return 1 / Math.sqrt(totalInfo);
}
