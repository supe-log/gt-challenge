import { describe, it, expect } from "vitest";
import { computeVoluntaryHard } from "../signals/voluntary-hard";
import type { SessionSummary } from "../types";

function makeSession(
  itemsAttempted: number,
  voluntaryBonusRounds: number
): SessionSummary {
  return {
    sessionId: "s1",
    sessionNumber: 1,
    startedAt: new Date("2026-01-01"),
    endedAt: new Date("2026-01-01"),
    terminalTheta: 0,
    itemsAttempted,
    itemsCorrect: Math.floor(itemsAttempted * 0.6),
    voluntaryBonusRounds,
    durationSeconds: 1200,
  };
}

describe("computeVoluntaryHard", () => {
  it("returns 0 for no sessions", () => {
    expect(computeVoluntaryHard([]).signalValue).toBe(0);
  });

  it("returns 0 when no bonus rounds taken", () => {
    const result = computeVoluntaryHard([makeSession(20, 0)]);
    expect(result.signalValue).toBe(0);
  });

  it("returns 1.0 when all bonus rounds taken", () => {
    // 20 items → 2 bonus offers, took both
    const result = computeVoluntaryHard([makeSession(20, 2)]);
    expect(result.signalValue).toBe(1);
  });

  it("returns 0.5 when half the bonus rounds taken", () => {
    // 40 items → 4 bonus offers, took 2
    const result = computeVoluntaryHard([makeSession(40, 2)]);
    expect(result.signalValue).toBe(0.5);
  });

  it("aggregates across sessions", () => {
    const result = computeVoluntaryHard([
      makeSession(20, 1), // 2 offered, 1 taken
      makeSession(30, 2), // 3 offered, 2 taken
    ]);
    // 3 out of 5 = 0.6
    expect(result.signalValue).toBeCloseTo(0.6, 1);
  });
});
