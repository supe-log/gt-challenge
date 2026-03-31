import { describe, it, expect } from "vitest";
import { computeStartingTheta, computeCompositeTheta } from "../cross-session";

describe("computeStartingTheta", () => {
  it("returns 0 for first session (no previous theta)", () => {
    expect(computeStartingTheta(null)).toBe(0);
  });

  it("returns 90% of previous terminal theta", () => {
    expect(computeStartingTheta(2.0)).toBeCloseTo(1.8);
    expect(computeStartingTheta(-1.0)).toBeCloseTo(-0.9);
  });

  it("returns 0 when previous theta was 0", () => {
    expect(computeStartingTheta(0)).toBe(0);
  });
});

describe("computeCompositeTheta", () => {
  it("returns 0 for no sessions", () => {
    expect(computeCompositeTheta([])).toBe(0);
  });

  it("returns the single theta for one session", () => {
    expect(computeCompositeTheta([1.5])).toBe(1.5);
  });

  it("weights recent sessions more heavily", () => {
    // Two sessions: old = 0, recent = 2.0
    // With λ = 0.7: weights are [0.7, 1.0]
    // Composite = (0 * 0.7 + 2.0 * 1.0) / (0.7 + 1.0) = 2.0 / 1.7 ≈ 1.176
    const composite = computeCompositeTheta([0, 2.0]);
    expect(composite).toBeCloseTo(2.0 / 1.7, 3);
    // Should be closer to 2.0 than to 0
    expect(composite).toBeGreaterThan(1.0);
  });

  it("handles multiple sessions with increasing ability", () => {
    const thetas = [0.5, 1.0, 1.5, 2.0];
    const composite = computeCompositeTheta(thetas);
    // Should be between the min and max, biased toward recent
    expect(composite).toBeGreaterThan(1.0);
    expect(composite).toBeLessThan(2.0);
    // And closer to 2.0 than to 0.5 (midpoint of range is 1.25)
    expect(composite).toBeGreaterThan(1.25);
  });
});
