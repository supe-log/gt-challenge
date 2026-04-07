import { describe, it, expect } from "vitest";
import { computeTimeInvestment } from "../signals/time-investment";
import type { SessionSummary } from "../types";

function makeSession(durationSeconds: number): SessionSummary {
  return {
    sessionId: "s1",
    sessionNumber: 1,
    startedAt: new Date("2026-01-01"),
    endedAt: new Date("2026-01-01"),
    terminalTheta: 0,
    itemsAttempted: 20,
    itemsCorrect: 10,
    voluntaryBonusRounds: 0,
    durationSeconds,
  };
}

describe("computeTimeInvestment", () => {
  it("returns 0 for no sessions", () => {
    expect(computeTimeInvestment([]).signalValue).toBe(0);
  });

  it("returns proportional value for partial investment", () => {
    // 30 minutes = 1800 seconds → 30/150 = 0.2
    const result = computeTimeInvestment([makeSession(1800)]);
    expect(result.signalValue).toBeCloseTo(0.2, 2);
  });

  it("returns 1.0 for 150 minutes", () => {
    const result = computeTimeInvestment([makeSession(9000)]); // 150 min
    expect(result.signalValue).toBe(1);
  });

  it("caps at 1.0 for more than 150 minutes", () => {
    const result = computeTimeInvestment([makeSession(18000)]); // 300 min
    expect(result.signalValue).toBe(1);
  });

  it("sums across sessions", () => {
    const result = computeTimeInvestment([
      makeSession(1800), // 30 min
      makeSession(1800), // 30 min
      makeSession(1800), // 30 min
    ]);
    // 90 min / 150 = 0.6
    expect(result.signalValue).toBeCloseTo(0.6, 2);
  });
});
