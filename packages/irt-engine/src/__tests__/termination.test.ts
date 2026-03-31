import { describe, it, expect } from "vitest";
import { shouldTerminate, TerminationReason } from "../termination";

const defaultConfig = {
  minItems: 15,
  maxItems: 40,
  maxTimeMs: 35 * 60 * 1000,
  sePrecisionTarget: 0.25,
};

describe("shouldTerminate", () => {
  it("does not terminate early in a session", () => {
    const result = shouldTerminate(5, 0.8, 60000, true, defaultConfig);
    expect(result.shouldTerminate).toBe(false);
  });

  it("terminates at max items", () => {
    const result = shouldTerminate(40, 0.5, 1200000, true, defaultConfig);
    expect(result.shouldTerminate).toBe(true);
    expect(result.reason).toBe(TerminationReason.MAX_ITEMS);
  });

  it("terminates at time limit", () => {
    const result = shouldTerminate(20, 0.3, 35 * 60 * 1000, true, defaultConfig);
    expect(result.shouldTerminate).toBe(true);
    expect(result.reason).toBe(TerminationReason.TIME_LIMIT);
  });

  it("terminates when precision reached and min items met", () => {
    const result = shouldTerminate(15, 0.2, 600000, true, defaultConfig);
    expect(result.shouldTerminate).toBe(true);
    expect(result.reason).toBe(TerminationReason.PRECISION_REACHED);
  });

  it("does NOT terminate for precision if min items not met", () => {
    const result = shouldTerminate(10, 0.2, 600000, true, defaultConfig);
    expect(result.shouldTerminate).toBe(false);
  });

  it("terminates when no items remaining", () => {
    const result = shouldTerminate(12, 0.5, 300000, false, defaultConfig);
    expect(result.shouldTerminate).toBe(true);
    expect(result.reason).toBe(TerminationReason.NO_ITEMS_REMAINING);
  });

  it("time limit takes priority over max items", () => {
    const result = shouldTerminate(40, 0.5, 35 * 60 * 1000, true, defaultConfig);
    expect(result.shouldTerminate).toBe(true);
    expect(result.reason).toBe(TerminationReason.TIME_LIMIT);
  });
});
