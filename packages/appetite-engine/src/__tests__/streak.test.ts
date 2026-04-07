import { describe, it, expect } from "vitest";
import { computeStreak } from "../signals/streak";
import type { SessionSummary } from "../types";

function makeSession(dateStr: string): SessionSummary {
  return {
    sessionId: `s-${dateStr}`,
    sessionNumber: 1,
    startedAt: new Date(dateStr),
    endedAt: new Date(dateStr),
    terminalTheta: 0,
    itemsAttempted: 20,
    itemsCorrect: 10,
    voluntaryBonusRounds: 0,
    durationSeconds: 1200,
  };
}

describe("computeStreak", () => {
  it("returns 0 for no sessions", () => {
    expect(computeStreak([]).signalValue).toBe(0);
  });

  it("returns 1/5 for a single session", () => {
    const result = computeStreak([makeSession("2026-01-05")]);
    expect(result.signalValue).toBeCloseTo(0.2, 2);
  });

  it("returns 1.0 for 5 consecutive weeks", () => {
    const sessions = [
      makeSession("2026-01-05"), // week 2
      makeSession("2026-01-12"), // week 3
      makeSession("2026-01-19"), // week 4
      makeSession("2026-01-26"), // week 5
      makeSession("2026-02-02"), // week 6
    ];
    const result = computeStreak(sessions);
    expect(result.signalValue).toBe(1);
  });

  it("handles gaps (broken streak)", () => {
    const sessions = [
      makeSession("2026-01-05"), // week 2
      makeSession("2026-01-12"), // week 3
      // gap: week 4 skipped
      makeSession("2026-01-26"), // week 5
      makeSession("2026-02-02"), // week 6
    ];
    const result = computeStreak(sessions);
    // Max streak = 2 (weeks 2-3 or weeks 5-6)
    expect(result.signalValue).toBeCloseTo(0.4, 2);
  });

  it("counts multiple sessions in one week as one week", () => {
    const sessions = [
      makeSession("2026-01-05"),
      makeSession("2026-01-06"), // same week
      makeSession("2026-01-07"), // same week
    ];
    const result = computeStreak(sessions);
    // 1 unique week → 1/5
    expect(result.signalValue).toBeCloseTo(0.2, 2);
  });

  it("is capped at 1.0", () => {
    const sessions = Array.from({ length: 10 }, (_, i) =>
      makeSession(
        `2026-01-${String(5 + i * 7).padStart(2, "0")}`
      )
    );
    const result = computeStreak(sessions);
    expect(result.signalValue).toBeLessThanOrEqual(1);
  });
});
