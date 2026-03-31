export enum TerminationReason {
  PRECISION_REACHED = "precision_reached",
  MAX_ITEMS = "max_items",
  TIME_LIMIT = "time_limit",
  NO_ITEMS_REMAINING = "no_items_remaining",
}

export interface TerminationCheck {
  shouldTerminate: boolean;
  reason: TerminationReason | null;
}

/**
 * Check whether a session should terminate.
 *
 * Rules (from PRD):
 * 1. SE < 0.25 AND at least 15 items → precision reached
 * 2. 40 items attempted → max items
 * 3. 35 minutes elapsed → time limit
 * 4. Item bank exhausted → no items remaining
 */
export function shouldTerminate(
  itemCount: number,
  standardError: number,
  elapsedMs: number,
  hasItemsRemaining: boolean,
  config: {
    minItems: number;
    maxItems: number;
    maxTimeMs: number;
    sePrecisionTarget: number;
  }
): TerminationCheck {
  // Time limit — hard stop
  if (elapsedMs >= config.maxTimeMs) {
    return { shouldTerminate: true, reason: TerminationReason.TIME_LIMIT };
  }

  // Max items — hard stop
  if (itemCount >= config.maxItems) {
    return { shouldTerminate: true, reason: TerminationReason.MAX_ITEMS };
  }

  // No items left in the bank
  if (!hasItemsRemaining) {
    return { shouldTerminate: true, reason: TerminationReason.NO_ITEMS_REMAINING };
  }

  // Precision reached — only if minimum items met
  if (
    itemCount >= config.minItems &&
    standardError <= config.sePrecisionTarget
  ) {
    return { shouldTerminate: true, reason: TerminationReason.PRECISION_REACHED };
  }

  return { shouldTerminate: false, reason: null };
}
