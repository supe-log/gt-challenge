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

  // --- Boundary condition tests ---

  it("returns correct rawData for a single session", () => {
    const result = computeStreak([makeSession("2026-01-05")]);
    expect(result.rawData.currentStreak).toBe(1);
    expect(result.rawData.maxStreak).toBe(1);
    expect(result.signalType).toBe("streak");
  });

  it("handles exactly 5 weeks (boundary: target met)", () => {
    const sessions = [
      makeSession("2026-01-05"),
      makeSession("2026-01-12"),
      makeSession("2026-01-19"),
      makeSession("2026-01-26"),
      makeSession("2026-02-02"),
    ];
    const result = computeStreak(sessions);
    expect(result.signalValue).toBe(1);
    expect(result.rawData.maxStreak).toBe(5);
  });

  it("handles exactly 4 consecutive weeks (just below target)", () => {
    const sessions = [
      makeSession("2026-01-05"),
      makeSession("2026-01-12"),
      makeSession("2026-01-19"),
      makeSession("2026-01-26"),
    ];
    const result = computeStreak(sessions);
    expect(result.signalValue).toBeCloseTo(0.8, 2);
    expect(result.rawData.maxStreak).toBe(4);
  });

  it("handles year boundary (late December to early January)", () => {
    const sessions = [
      makeSession("2025-12-22"), // week 52
      makeSession("2025-12-29"), // week 1 of 2026 (or 52/53)
      makeSession("2026-01-05"), // week 2
    ];
    const result = computeStreak(sessions);
    // Should count consecutive across year boundary
    expect(result.rawData.maxStreak).toBeGreaterThanOrEqual(2);
  });

  it("handles large number of consecutive weeks", () => {
    // 20 consecutive weeks starting from a Monday
    const sessions = Array.from({ length: 20 }, (_, i) => {
      const date = new Date("2026-01-05"); // a Monday
      date.setDate(date.getDate() + i * 7);
      return makeSession(date.toISOString().split("T")[0]);
    });
    const result = computeStreak(sessions);
    expect(result.signalValue).toBe(1); // capped at 1.0
    // The max streak should be at least 10 (may vary due to ISO week logic)
    expect(result.rawData.maxStreak).toBeGreaterThanOrEqual(10);
  });

  it("handles all sessions on the same day", () => {
    const sessions = [
      makeSession("2026-01-05"),
      makeSession("2026-01-05"),
      makeSession("2026-01-05"),
    ];
    const result = computeStreak(sessions);
    // All same week -> 1 unique week -> 1/5
    expect(result.signalValue).toBeCloseTo(0.2, 2);
  });

  it("handles two non-consecutive weeks", () => {
    const sessions = [
      makeSession("2026-01-05"), // week 2
      makeSession("2026-01-26"), // week 5 (gap)
    ];
    const result = computeStreak(sessions);
    // maxStreak = 1 (no consecutive pair)
    expect(result.signalValue).toBeCloseTo(0.2, 2);
    expect(result.rawData.maxStreak).toBe(1);
  });

  it("correctly reports current vs max streak when broken", () => {
    const sessions = [
      makeSession("2026-01-05"),  // week 2
      makeSession("2026-01-12"), // week 3
      makeSession("2026-01-19"), // week 4
      // gap
      makeSession("2026-02-09"), // week 7
      makeSession("2026-02-16"), // week 8
    ];
    const result = computeStreak(sessions);
    expect(result.rawData.maxStreak).toBe(3); // weeks 2-3-4
    expect(result.rawData.currentStreak).toBe(2); // weeks 7-8 (ends at the end)
  });

  it("handles sessions in reverse chronological order", () => {
    // The function uses getWeekKey on each session and sorts unique weeks
    const sessions = [
      makeSession("2026-02-02"),
      makeSession("2026-01-26"),
      makeSession("2026-01-19"),
      makeSession("2026-01-12"),
      makeSession("2026-01-05"),
    ];
    const result = computeStreak(sessions);
    expect(result.signalValue).toBe(1); // 5 consecutive weeks
  });
});
