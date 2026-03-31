import { describe, it, expect } from "vitest";
import { probability3PL, fisherInformation } from "../model";

describe("probability3PL", () => {
  it("returns guessing parameter when theta is far below difficulty", () => {
    // θ = -4, b = 2 → exponent is very large positive → P ≈ c
    const p = probability3PL(-4, 1.0, 2.0, 0.25);
    expect(p).toBeCloseTo(0.25, 2);
  });

  it("returns ~1 when theta is far above difficulty", () => {
    // θ = 4, b = -2 → exponent is very large negative → P ≈ 1
    const p = probability3PL(4, 1.0, -2.0, 0.25);
    expect(p).toBeCloseTo(1.0, 2);
  });

  it("returns (1+c)/2 when theta equals difficulty", () => {
    // At θ = b, exp(0) = 1, P = c + (1-c)/2 = (1+c)/2
    const c = 0.2;
    const p = probability3PL(0, 1.0, 0, c);
    expect(p).toBeCloseTo((1 + c) / 2, 5);
  });

  it("is monotonically increasing with theta", () => {
    const thetas = [-3, -2, -1, 0, 1, 2, 3];
    const probs = thetas.map((t) => probability3PL(t, 1.0, 0, 0.2));
    for (let i = 1; i < probs.length; i++) {
      expect(probs[i]).toBeGreaterThan(probs[i - 1]);
    }
  });

  it("higher discrimination gives steeper curve", () => {
    // At θ = b + 0.5, higher 'a' should give higher probability
    const pLowA = probability3PL(0.5, 0.5, 0, 0.2);
    const pHighA = probability3PL(0.5, 2.0, 0, 0.2);
    expect(pHighA).toBeGreaterThan(pLowA);
  });

  it("probability never exceeds 1 or goes below c", () => {
    for (let theta = -5; theta <= 5; theta += 0.5) {
      const p = probability3PL(theta, 2.0, 0, 0.25);
      expect(p).toBeGreaterThanOrEqual(0.25);
      expect(p).toBeLessThanOrEqual(1.0);
    }
  });
});

describe("fisherInformation", () => {
  it("peaks near the item difficulty", () => {
    const a = 1.5;
    const b = 0.5;
    const c = 0.2;
    const infoAtB = fisherInformation(b, a, b, c);
    const infoFarBelow = fisherInformation(b - 3, a, b, c);
    const infoFarAbove = fisherInformation(b + 3, a, b, c);
    expect(infoAtB).toBeGreaterThan(infoFarBelow);
    expect(infoAtB).toBeGreaterThan(infoFarAbove);
  });

  it("is always non-negative", () => {
    for (let theta = -4; theta <= 4; theta += 0.5) {
      const info = fisherInformation(theta, 1.0, 0, 0.2);
      expect(info).toBeGreaterThanOrEqual(0);
    }
  });

  it("higher discrimination gives higher information", () => {
    const infoLow = fisherInformation(0, 0.5, 0, 0.2);
    const infoHigh = fisherInformation(0, 2.5, 0, 0.2);
    expect(infoHigh).toBeGreaterThan(infoLow);
  });

  it("returns 0 when guessing equals probability (extreme case)", () => {
    // When theta is far below b, P → c, so (P - c) → 0, info → 0
    const info = fisherInformation(-10, 1.0, 5, 0.25);
    expect(info).toBeCloseTo(0, 5);
  });
});
