import { describe, it, expect } from "vitest";
import { estimateThetaEAP, computeSE } from "../estimation";
import { probability3PL } from "../model";
import type { Item, Response } from "../types";

function makeItem(overrides: Partial<Item> & { id: string }): Item {
  return {
    domain: "reasoning",
    difficulty: 0,
    discrimination: 1.0,
    guessing: 0.2,
    exposureCount: 0,
    maxExposureRate: 1.0,
    ...overrides,
  };
}

describe("estimateThetaEAP", () => {
  it("returns prior mean with no responses", () => {
    const theta = estimateThetaEAP([], new Map(), 0, 1);
    expect(theta).toBe(0);
  });

  it("shifts positive after correct answers on medium items", () => {
    const items = new Map<string, Item>();
    items.set("a", makeItem({ id: "a", difficulty: 0 }));
    items.set("b", makeItem({ id: "b", difficulty: 0.5 }));

    const responses: Response[] = [
      { itemId: "a", isCorrect: true },
      { itemId: "b", isCorrect: true },
    ];

    const theta = estimateThetaEAP(responses, items, 0, 1);
    expect(theta).toBeGreaterThan(0);
  });

  it("shifts negative after incorrect answers", () => {
    const items = new Map<string, Item>();
    items.set("a", makeItem({ id: "a", difficulty: 0 }));
    items.set("b", makeItem({ id: "b", difficulty: -0.5 }));

    const responses: Response[] = [
      { itemId: "a", isCorrect: false },
      { itemId: "b", isCorrect: false },
    ];

    const theta = estimateThetaEAP(responses, items, 0, 1);
    expect(theta).toBeLessThan(0);
  });

  it("converges to true ability with many responses", () => {
    // Simulate a child with true ability θ = 1.5
    const trueTheta = 1.5;
    const items = new Map<string, Item>();
    const responses: Response[] = [];

    // Create 30 items spread across difficulty range
    for (let i = 0; i < 30; i++) {
      const b = -2 + (i * 4) / 29; // -2 to 2
      const id = `item-${i}`;
      const item = makeItem({ id, difficulty: b, discrimination: 1.2, guessing: 0.2 });
      items.set(id, item);

      // Deterministic: correct if P > 0.5 (simplified simulation)
      const p = probability3PL(trueTheta, item.discrimination, item.difficulty, item.guessing);
      responses.push({ itemId: id, isCorrect: p > 0.5 });
    }

    const estimated = estimateThetaEAP(responses, items, 0, 1);
    // Should be within 1.0 of true theta (deterministic threshold simulation is coarse)
    expect(Math.abs(estimated - trueTheta)).toBeLessThan(1.0);
    // And should clearly be above 0 (true ability is positive)
    expect(estimated).toBeGreaterThan(0.5);
  });

  it("respects custom prior", () => {
    const items = new Map<string, Item>();
    items.set("a", makeItem({ id: "a", difficulty: 0 }));

    // One ambiguous response: with a high prior, theta should stay high-ish
    const responses: Response[] = [{ itemId: "a", isCorrect: true }];

    const thetaHighPrior = estimateThetaEAP(responses, items, 2.0, 0.5);
    const thetaLowPrior = estimateThetaEAP(responses, items, -2.0, 0.5);

    expect(thetaHighPrior).toBeGreaterThan(thetaLowPrior);
  });
});

describe("computeSE", () => {
  it("returns Infinity for no items", () => {
    expect(computeSE(0, [])).toBe(Infinity);
  });

  it("decreases as more items are administered", () => {
    const items5 = Array.from({ length: 5 }, (_, i) =>
      makeItem({ id: `${i}`, difficulty: 0, discrimination: 1.0 })
    );
    const items20 = Array.from({ length: 20 }, (_, i) =>
      makeItem({ id: `${i}`, difficulty: 0, discrimination: 1.0 })
    );

    const se5 = computeSE(0, items5);
    const se20 = computeSE(0, items20);

    expect(se20).toBeLessThan(se5);
  });

  it("is lower when items are well-targeted to theta", () => {
    // Items at θ = 0 should give more info when measuring θ = 0
    const wellTargeted = Array.from({ length: 10 }, (_, i) =>
      makeItem({ id: `good-${i}`, difficulty: 0, discrimination: 1.5 })
    );
    const poorlyTargeted = Array.from({ length: 10 }, (_, i) =>
      makeItem({ id: `bad-${i}`, difficulty: 3, discrimination: 1.5 })
    );

    const seGood = computeSE(0, wellTargeted);
    const seBad = computeSE(0, poorlyTargeted);

    expect(seGood).toBeLessThan(seBad);
  });
});
