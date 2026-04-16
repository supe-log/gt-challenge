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

  // --- Boundary condition tests ---

  it("handles 0-second session", () => {
    const result = computeTimeInvestment([makeSession(0)]);
    expect(result.signalValue).toBe(0);
    expect(result.rawData.totalMinutes).toBe(0);
  });

  it("handles exactly at 150-minute boundary", () => {
    const result = computeTimeInvestment([makeSession(150 * 60)]); // exactly 9000 seconds
    expect(result.signalValue).toBe(1);
  });

  it("handles just below 150-minute boundary", () => {
    const result = computeTimeInvestment([makeSession(149 * 60 + 59)]); // 149 min 59 sec
    expect(result.signalValue).toBeLessThan(1);
    expect(result.signalValue).toBeGreaterThan(0.99);
  });

  it("handles just above 150-minute boundary (caps at 1)", () => {
    const result = computeTimeInvestment([makeSession(150 * 60 + 1)]);
    expect(result.signalValue).toBe(1);
  });

  it("handles very short session (1 second)", () => {
    const result = computeTimeInvestment([makeSession(1)]);
    // 1/60 minutes / 150 = very small
    expect(result.signalValue).toBeGreaterThan(0);
    expect(result.signalValue).toBeLessThan(0.001);
  });

  it("handles large number of short sessions", () => {
    // 150 sessions of 1 minute each = 150 minutes = 1.0
    const sessions = Array.from({ length: 150 }, () => makeSession(60));
    const result = computeTimeInvestment(sessions);
    expect(result.signalValue).toBe(1);
    expect(result.rawData.sessionCount).toBe(150);
  });

  it("handles very long single session", () => {
    // 10 hours = 600 minutes >> 150 target
    const result = computeTimeInvestment([makeSession(36000)]);
    expect(result.signalValue).toBe(1);
  });

  it("returns correct totalMinutes in rawData", () => {
    const result = computeTimeInvestment([makeSession(3600)]); // 60 minutes
    expect(result.rawData.totalMinutes).toBeCloseTo(60, 1);
    expect(result.signalType).toBe("time_investment");
  });

  it("returns correct sessionCount in rawData", () => {
    const result = computeTimeInvestment([
      makeSession(600),
      makeSession(600),
      makeSession(600),
    ]);
    expect(result.rawData.sessionCount).toBe(3);
  });
});
