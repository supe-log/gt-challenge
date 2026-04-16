/**
 * Normative percentile module for GT Challenge.
 *
 * Theta values from IRT are approximately N(0,1) in the general population.
 * We use the standard normal CDF to convert theta into a percentile rank,
 * giving parents a "higher than X% of peers" comparison.
 */

/**
 * Abramowitz and Stegun approximation of the standard normal CDF.
 * Accurate to ~1e-5, which is more than sufficient for display purposes.
 */
function standardNormalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/**
 * Convert a theta estimate to a percentile (0-100).
 * Theta is modeled as N(0,1) in the age-band population.
 */
export function thetaToPercentile(theta: number): number {
  const raw = standardNormalCDF(theta) * 100;
  // Clamp to [1, 99] so we never show "0th" or "100th"
  return Math.round(Math.min(99, Math.max(1, raw)));
}

/**
 * Return a human-readable label for the percentile.
 * e.g. "top 1%", "top 5%", "above average", "average"
 */
export function getPercentileLabel(percentile: number): string {
  if (percentile >= 99) return "top 1%";
  if (percentile >= 95) return "top 5%";
  if (percentile >= 90) return "top 10%";
  if (percentile >= 75) return "top 25%";
  if (percentile >= 60) return "above average";
  if (percentile >= 40) return "average";
  if (percentile >= 25) return "below average";
  return "developing";
}

/**
 * Return Tailwind color classes for a percentile badge.
 * Purple/indigo for high, blue for above-average, gray for lower.
 */
export function getPercentileColor(percentile: number): string {
  if (percentile >= 90) return "bg-purple-100 text-purple-700 border-purple-200";
  if (percentile >= 75) return "bg-indigo-100 text-indigo-700 border-indigo-200";
  if (percentile >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
  if (percentile >= 40) return "bg-gray-100 text-gray-700 border-gray-200";
  return "bg-gray-50 text-gray-500 border-gray-200";
}
