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

  // --- Boundary condition tests ---

  it("returns 0 when fewer than 10 items attempted (no bonus offered)", () => {
    const result = computeVoluntaryHard([makeSession(9, 0)]);
    // Math.floor(9/10) = 0 offered, so signalValue = 0/0 = 0
    expect(result.signalValue).toBe(0);
    expect(result.rawData.totalOffered).toBe(0);
  });

  it("handles exactly 10 items (boundary: first bonus offered)", () => {
    const result = computeVoluntaryHard([makeSession(10, 1)]);
    // Math.floor(10/10) = 1 offered, 1 taken
    expect(result.signalValue).toBe(1);
    expect(result.rawData.totalOffered).toBe(1);
  });

  it("caps signal at 1.0 when more bonus rounds taken than offered", () => {
    // Edge case: voluntaryBonusRounds > offered (shouldn't happen in practice)
    const result = computeVoluntaryHard([makeSession(10, 5)]);
    // 1 offered, 5 taken -> min(1, 5/1) = 1
    expect(result.signalValue).toBe(1);
  });

  it("handles large number of sessions", () => {
    const sessions = Array.from({ length: 50 }, () => makeSession(40, 2));
    const result = computeVoluntaryHard(sessions);
    // Each: 4 offered, 2 taken. Total: 200 offered, 100 taken = 0.5
    expect(result.signalValue).toBeCloseTo(0.5, 2);
    expect(result.rawData.totalBonusRounds).toBe(100);
    expect(result.rawData.totalOffered).toBe(200);
  });

  it("handles session with 0 items attempted", () => {
    const result = computeVoluntaryHard([makeSession(0, 0)]);
    // Math.floor(0/10) = 0 offered
    expect(result.signalValue).toBe(0);
  });

  it("returns correct rawData", () => {
    const result = computeVoluntaryHard([
      makeSession(20, 1),
      makeSession(30, 3),
    ]);
    expect(result.rawData.totalBonusRounds).toBe(4);
    expect(result.rawData.totalOffered).toBe(5);
    expect(result.signalType).toBe("voluntary_hard");
  });

  it("handles mix of sessions with and without bonus opportunities", () => {
    const result = computeVoluntaryHard([
      makeSession(5, 0),  // 0 offered
      makeSession(20, 2), // 2 offered, 2 taken
    ]);
    // Total: 2 offered, 2 taken = 1.0
    expect(result.signalValue).toBe(1);
  });
});
