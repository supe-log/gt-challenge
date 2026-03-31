import { fisherInformation } from "./model";
import type { Item, SelectionConstraints } from "./types";

/**
 * Select the next item to administer using Maximum Fisher Information
 * with exposure control and content balancing.
 *
 * Algorithm:
 * 1. Filter out already-administered items and previous-session items
 * 2. Apply content balancing (penalize over-represented domains)
 * 3. Apply Sympson-Hetter exposure control
 * 4. Select the item with highest adjusted information
 *
 * @returns The selected item, or null if no eligible items remain
 */
export function selectNextItem(
  theta: number,
  itemBank: Item[],
  constraints: SelectionConstraints
): Item | null {
  // Step 1: Filter to eligible items
  const eligible = itemBank.filter((item) => {
    if (constraints.administeredItemIds.has(item.id)) return false;
    if (constraints.previousSessionItemIds.has(item.id)) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  // Step 2: Score each item
  const scored = eligible.map((item) => {
    // Base score: Fisher information at current theta
    let score = fisherInformation(
      theta,
      item.discrimination,
      item.difficulty,
      item.guessing
    );

    // Content balancing penalty: if last N items were the same domain, penalize
    const consecutiveCount = countTrailingDomain(
      constraints.lastDomains,
      item.domain
    );
    if (consecutiveCount >= constraints.maxConsecutiveSameDomain) {
      score *= 0.1; // Heavy penalty — almost eliminates this domain
    } else if (consecutiveCount >= constraints.maxConsecutiveSameDomain - 1) {
      score *= 0.5; // Moderate penalty
    }

    // Domain balance: mildly penalize over-represented domains
    const totalItems = Object.values(constraints.domainCounts).reduce(
      (a, b) => a + b,
      0
    );
    if (totalItems > 0) {
      const domainCount = constraints.domainCounts[item.domain] ?? 0;
      const domainProportion = domainCount / totalItems;
      const targetProportion = 0.25; // equal across 4 domains
      if (domainProportion > targetProportion) {
        const overRepresentation = domainProportion - targetProportion;
        score *= 1 - overRepresentation; // gentle nudge toward balance
      }
    }

    // Sympson-Hetter exposure control: probabilistic gating
    // If the item has been over-exposed, randomly suppress it
    if (item.exposureCount > 0 && item.maxExposureRate < 1) {
      const roll = Math.random();
      if (roll > item.maxExposureRate) {
        score *= 0.01; // Nearly eliminate, but don't fully exclude
      }
    }

    return { item, score };
  });

  // Step 3: Select highest-scoring item
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.item ?? null;
}

/**
 * Count how many of the most recent domains match the given domain.
 */
function countTrailingDomain(
  lastDomains: string[],
  domain: string
): number {
  let count = 0;
  for (let i = lastDomains.length - 1; i >= 0; i--) {
    if (lastDomains[i] === domain) {
      count++;
    } else {
      break;
    }
  }
  return count;
}
