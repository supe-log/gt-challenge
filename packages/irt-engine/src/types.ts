/** An item from the item bank with IRT parameters */
export interface Item {
  id: string;
  domain: string;
  difficulty: number;      // b parameter, −3.0 to 3.0
  discrimination: number;  // a parameter, 0.5 to 2.5
  guessing: number;        // c parameter, 0.0 to 0.35
  exposureCount: number;
  maxExposureRate: number; // Sympson-Hetter control parameter, 0 to 1
}

/** A recorded response to an item */
export interface Response {
  itemId: string;
  isCorrect: boolean;
}

/** Configuration for a testing session */
export interface SessionConfig {
  minItems: number;        // 15
  maxItems: number;        // 40
  maxTimeMs: number;       // 35 * 60 * 1000
  sePrecisionTarget: number; // 0.25
  priorMean: number;       // starting theta
  priorSD: number;         // 1.0
}

/** Constraints for item selection */
export interface SelectionConstraints {
  administeredItemIds: Set<string>;
  previousSessionItemIds: Set<string>; // items from prior session to avoid
  domainCounts: Record<string, number>; // how many items per domain so far
  maxConsecutiveSameDomain: number;     // 3
  lastDomains: string[];                // last N domains administered
}

export interface TerminationResult {
  shouldTerminate: boolean;
  reason: string | null;
}
