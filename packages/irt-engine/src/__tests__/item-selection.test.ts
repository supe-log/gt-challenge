import { describe, it, expect, vi, afterEach } from "vitest";
import { selectNextItem } from "../item-selection";
import type { Item, SelectionConstraints } from "../types";

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

function makeConstraints(
  overrides: Partial<SelectionConstraints> = {}
): SelectionConstraints {
  return {
    administeredItemIds: new Set<string>(),
    previousSessionItemIds: new Set<string>(),
    domainCounts: {},
    maxConsecutiveSameDomain: 3,
    lastDomains: [],
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("selectNextItem", () => {
  it("returns null for empty item bank", () => {
    const result = selectNextItem(0, [], makeConstraints());
    expect(result).toBeNull();
  });

  it("selects item with maximum Fisher information when no constraints", () => {
    // Item matched to theta=0 should have highest info
    const items = [
      makeItem({ id: "far-easy", difficulty: -3, discrimination: 1.0 }),
      makeItem({ id: "matched", difficulty: 0, discrimination: 1.5 }),
      makeItem({ id: "far-hard", difficulty: 3, discrimination: 1.0 }),
    ];

    const result = selectNextItem(0, items, makeConstraints());
    expect(result).not.toBeNull();
    expect(result!.id).toBe("matched");
  });

  it("selects item closest to theta for ability estimation", () => {
    // At theta=2, an item with difficulty near 2 should have most info
    const items = [
      makeItem({ id: "easy", difficulty: -1, discrimination: 1.0 }),
      makeItem({ id: "medium", difficulty: 0, discrimination: 1.0 }),
      makeItem({ id: "near-theta", difficulty: 1.8, discrimination: 1.0 }),
    ];

    const result = selectNextItem(2, items, makeConstraints());
    expect(result).not.toBeNull();
    expect(result!.id).toBe("near-theta");
  });

  it("prefers higher discrimination items when difficulty is similar", () => {
    const items = [
      makeItem({ id: "low-a", difficulty: 0, discrimination: 0.5 }),
      makeItem({ id: "high-a", difficulty: 0, discrimination: 2.5 }),
    ];

    const result = selectNextItem(0, items, makeConstraints());
    expect(result).not.toBeNull();
    expect(result!.id).toBe("high-a");
  });

  describe("filtering administered items", () => {
    it("filters out already-administered items", () => {
      const items = [
        makeItem({ id: "used", difficulty: 0, discrimination: 2.0 }),
        makeItem({ id: "unused", difficulty: 0, discrimination: 1.0 }),
      ];

      const constraints = makeConstraints({
        administeredItemIds: new Set(["used"]),
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("unused");
    });

    it("filters out previous-session items", () => {
      const items = [
        makeItem({ id: "prior", difficulty: 0, discrimination: 2.0 }),
        makeItem({ id: "fresh", difficulty: 0, discrimination: 1.0 }),
      ];

      const constraints = makeConstraints({
        previousSessionItemIds: new Set(["prior"]),
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("fresh");
    });

    it("filters out both administered and previous-session items", () => {
      const items = [
        makeItem({ id: "administered", difficulty: 0, discrimination: 2.0 }),
        makeItem({ id: "prior-session", difficulty: 0, discrimination: 1.8 }),
        makeItem({ id: "eligible", difficulty: 0, discrimination: 1.0 }),
      ];

      const constraints = makeConstraints({
        administeredItemIds: new Set(["administered"]),
        previousSessionItemIds: new Set(["prior-session"]),
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("eligible");
    });
  });

  describe("returns null when all items are filtered out", () => {
    it("all items administered", () => {
      const items = [
        makeItem({ id: "a", difficulty: 0 }),
        makeItem({ id: "b", difficulty: 1 }),
      ];

      const constraints = makeConstraints({
        administeredItemIds: new Set(["a", "b"]),
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).toBeNull();
    });

    it("all items from previous session", () => {
      const items = [makeItem({ id: "a" }), makeItem({ id: "b" })];

      const constraints = makeConstraints({
        previousSessionItemIds: new Set(["a", "b"]),
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).toBeNull();
    });

    it("items split between administered and previous session", () => {
      const items = [makeItem({ id: "a" }), makeItem({ id: "b" })];

      const constraints = makeConstraints({
        administeredItemIds: new Set(["a"]),
        previousSessionItemIds: new Set(["b"]),
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).toBeNull();
    });
  });

  describe("domain balancing: penalizes overrepresented domains", () => {
    it("penalizes a domain that exceeds 25% proportion (soft penalty)", () => {
      // Domain "reasoning" has 5 of 10 items = 50% (over 25% target)
      // Domain "verbal" has 0 items
      // Both items have same info, but "reasoning" should be penalized
      const items = [
        makeItem({
          id: "reasoning-item",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 1.0,
        }),
        makeItem({
          id: "verbal-item",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      const constraints = makeConstraints({
        domainCounts: {
          reasoning: 5,
          verbal: 2,
          spatial: 2,
          quantitative: 1,
        },
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // "verbal" at 20% is below target, so no penalty; "reasoning" at 50% gets penalized
      expect(result!.id).toBe("verbal-item");
    });

    it("does not penalize domains at or below 25%", () => {
      const items = [
        makeItem({
          id: "a",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 1.5,
        }),
        makeItem({
          id: "b",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      const constraints = makeConstraints({
        domainCounts: {
          reasoning: 2,
          verbal: 3,
          spatial: 2,
          quantitative: 3,
        },
        // reasoning is 2/10 = 20% which is <= 25%, no penalty
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // "reasoning" has higher discrimination and no penalty, should be selected
      expect(result!.id).toBe("a");
    });

    it("applies stronger penalty for more overrepresented domains", () => {
      // Both items have same discrimination so we can isolate the penalty effect
      const items = [
        makeItem({
          id: "very-over",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 1.0,
        }),
        makeItem({
          id: "slightly-over",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      // reasoning at 70%, verbal at 30%
      const constraints = makeConstraints({
        domainCounts: { reasoning: 7, verbal: 3 },
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // "reasoning" at 70%: penalty = 1 - (0.70 - 0.25) = 0.55
      // "verbal" at 30%: penalty = 1 - (0.30 - 0.25) = 0.95
      // Same base info, so "slightly-over" wins
      expect(result!.id).toBe("slightly-over");
    });

    it("does not apply domain penalty when no items have been administered", () => {
      const items = [
        makeItem({
          id: "a",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 2.0,
        }),
        makeItem({
          id: "b",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      // totalItems = 0, so no penalty applied
      const constraints = makeConstraints({ domainCounts: {} });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("a"); // pure Fisher info selection
    });
  });

  describe("consecutive domain penalty", () => {
    it("applies heavy penalty (0.1x) when consecutive count >= maxConsecutiveSameDomain", () => {
      // maxConsecutiveSameDomain = 3, last 3 domains are all "reasoning"
      const items = [
        makeItem({
          id: "same-domain",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 2.0,
        }),
        makeItem({
          id: "diff-domain",
          domain: "verbal",
          difficulty: 0,
          discrimination: 0.8,
        }),
      ];

      const constraints = makeConstraints({
        lastDomains: ["reasoning", "reasoning", "reasoning"],
        maxConsecutiveSameDomain: 3,
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // "reasoning" gets 0.1x penalty, so "verbal" wins despite lower discrimination
      expect(result!.id).toBe("diff-domain");
    });

    it("applies moderate penalty (0.5x) when consecutive count = maxConsecutiveSameDomain - 1", () => {
      // maxConsecutiveSameDomain = 3, last 2 domains are "reasoning"
      // Use equal discrimination so the 0.5x penalty is decisive
      const items = [
        makeItem({
          id: "same-domain",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 1.0,
        }),
        makeItem({
          id: "diff-domain",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      const constraints = makeConstraints({
        lastDomains: ["spatial", "reasoning", "reasoning"],
        maxConsecutiveSameDomain: 3,
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // "reasoning" gets 0.5x penalty on equal base info -> "verbal" wins
      expect(result!.id).toBe("diff-domain");
    });

    it("applies no penalty when consecutive count is below threshold", () => {
      const items = [
        makeItem({
          id: "same-domain",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 2.0,
        }),
        makeItem({
          id: "diff-domain",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      const constraints = makeConstraints({
        lastDomains: ["verbal", "reasoning"],
        maxConsecutiveSameDomain: 3,
        // trailing "reasoning" count = 1, which is < 3-1=2
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // No consecutive penalty, so pure info wins: "same-domain" with a=2.0
      expect(result!.id).toBe("same-domain");
    });

    it("counts only trailing consecutive domains", () => {
      const items = [
        makeItem({
          id: "reasoning-item",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 2.0,
        }),
        makeItem({
          id: "verbal-item",
          domain: "verbal",
          difficulty: 0,
          discrimination: 1.0,
        }),
      ];

      // "reasoning" appears early but not at the end
      const constraints = makeConstraints({
        lastDomains: ["reasoning", "reasoning", "reasoning", "verbal"],
        maxConsecutiveSameDomain: 3,
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      // Trailing domain is "verbal" (count=1), "reasoning" trailing count = 0
      // No penalty for "reasoning", so higher discrimination wins
      expect(result!.id).toBe("reasoning-item");
    });

    it("handles empty lastDomains array", () => {
      const items = [
        makeItem({ id: "a", difficulty: 0, discrimination: 2.0 }),
      ];

      const constraints = makeConstraints({
        lastDomains: [],
        maxConsecutiveSameDomain: 3,
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("a");
    });
  });

  describe("Sympson-Hetter exposure control", () => {
    it("does not penalize items with no exposure history", () => {
      const items = [
        makeItem({
          id: "unexposed",
          difficulty: 0,
          discrimination: 1.0,
          exposureCount: 0,
          maxExposureRate: 0.5,
        }),
      ];

      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      expect(result!.id).toBe("unexposed");
    });

    it("does not penalize items with maxExposureRate = 1", () => {
      const items = [
        makeItem({
          id: "no-cap",
          difficulty: 0,
          discrimination: 1.0,
          exposureCount: 100,
          maxExposureRate: 1.0,
        }),
      ];

      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      expect(result!.id).toBe("no-cap");
    });

    it("probabilistically suppresses over-exposed items", () => {
      // With maxExposureRate = 0.0, Math.random() > 0.0 is always true
      // so the item always gets the 0.01 penalty
      vi.spyOn(Math, "random").mockReturnValue(0.5);

      const items = [
        makeItem({
          id: "over-exposed",
          difficulty: 0,
          discrimination: 2.0,
          exposureCount: 50,
          maxExposureRate: 0.0,
        }),
        makeItem({
          id: "normal",
          difficulty: 0,
          discrimination: 1.0,
          exposureCount: 0,
          maxExposureRate: 1.0,
        }),
      ];

      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      // "over-exposed" gets 0.01x penalty, so "normal" should win
      expect(result!.id).toBe("normal");
    });

    it("allows exposed item when random roll is below maxExposureRate", () => {
      // Mock random to return a value below maxExposureRate
      vi.spyOn(Math, "random").mockReturnValue(0.3);

      const items = [
        makeItem({
          id: "exposed-but-ok",
          difficulty: 0,
          discrimination: 2.0,
          exposureCount: 10,
          maxExposureRate: 0.5, // roll 0.3 < 0.5, so no penalty
        }),
        makeItem({
          id: "alternative",
          difficulty: 0,
          discrimination: 1.0,
          exposureCount: 0,
          maxExposureRate: 1.0,
        }),
      ];

      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      // No exposure penalty applied, so higher discrimination wins
      expect(result!.id).toBe("exposed-but-ok");
    });

    it("suppresses exposed item when random roll exceeds maxExposureRate", () => {
      // Mock random to return a value above maxExposureRate
      vi.spyOn(Math, "random").mockReturnValue(0.8);

      const items = [
        makeItem({
          id: "suppressed",
          difficulty: 0,
          discrimination: 2.0,
          exposureCount: 10,
          maxExposureRate: 0.5, // roll 0.8 > 0.5, penalty applies
        }),
        makeItem({
          id: "alternative",
          difficulty: 0,
          discrimination: 1.0,
          exposureCount: 0,
          maxExposureRate: 1.0,
        }),
      ];

      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      // "suppressed" gets 0.01x penalty, "alternative" wins
      expect(result!.id).toBe("alternative");
    });
  });

  describe("combined constraints", () => {
    it("applies all constraints together", () => {
      const items = [
        // Best info but already administered
        makeItem({ id: "used", difficulty: 0, discrimination: 3.0 }),
        // Good info but over-exposed and same domain streak
        makeItem({
          id: "exposed-streak",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 2.0,
          exposureCount: 50,
          maxExposureRate: 0.0,
        }),
        // Moderate info, different domain, no issues
        makeItem({
          id: "clean",
          domain: "verbal",
          difficulty: 0.5,
          discrimination: 1.0,
        }),
      ];

      vi.spyOn(Math, "random").mockReturnValue(0.5);

      const constraints = makeConstraints({
        administeredItemIds: new Set(["used"]),
        lastDomains: ["reasoning", "reasoning", "reasoning"],
        maxConsecutiveSameDomain: 3,
      });

      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("clean");
    });

    it("still returns the best available when all remaining items have some penalty", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9);

      const items = [
        makeItem({
          id: "penalized-a",
          domain: "reasoning",
          difficulty: 0,
          discrimination: 2.0,
          exposureCount: 10,
          maxExposureRate: 0.5,
        }),
        makeItem({
          id: "penalized-b",
          domain: "reasoning",
          difficulty: 0.5,
          discrimination: 1.5,
          exposureCount: 5,
          maxExposureRate: 0.5,
        }),
      ];

      const constraints = makeConstraints({
        lastDomains: ["reasoning", "reasoning"],
        maxConsecutiveSameDomain: 3,
        domainCounts: { reasoning: 8, verbal: 1, spatial: 1 },
      });

      // Should still return one of the items (not null)
      const result = selectNextItem(0, items, constraints);
      expect(result).not.toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles single item bank", () => {
      const items = [makeItem({ id: "only", difficulty: 0 })];
      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      expect(result!.id).toBe("only");
    });

    it("handles extreme theta values", () => {
      const items = [
        makeItem({ id: "a", difficulty: -3, discrimination: 1.0 }),
        makeItem({ id: "b", difficulty: 0, discrimination: 1.0 }),
        makeItem({ id: "c", difficulty: 3, discrimination: 1.0 }),
      ];

      const resultHigh = selectNextItem(5, items, makeConstraints());
      expect(resultHigh).not.toBeNull();
      // At extreme positive theta, item "c" (difficulty=3) should have most info
      expect(resultHigh!.id).toBe("c");

      const resultLow = selectNextItem(-5, items, makeConstraints());
      expect(resultLow).not.toBeNull();
      // At extreme negative theta, item "a" (difficulty=-3) should have most info
      expect(resultLow!.id).toBe("a");
    });

    it("handles items with zero guessing parameter", () => {
      const items = [
        makeItem({ id: "no-guess", difficulty: 0, guessing: 0.0 }),
      ];
      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
      expect(result!.id).toBe("no-guess");
    });

    it("handles large item bank", () => {
      const items = Array.from({ length: 500 }, (_, i) =>
        makeItem({
          id: `item-${i}`,
          difficulty: -3 + (i * 6) / 499,
          discrimination: 0.5 + Math.random() * 2,
        })
      );

      const result = selectNextItem(0, items, makeConstraints());
      expect(result).not.toBeNull();
    });
  });
});
