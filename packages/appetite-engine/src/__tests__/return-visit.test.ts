import { describe, it, expect } from "vitest";
import { computeReturnVisit } from "../signals/return-visit";
import type { SessionSummary } from "../types";

function makeSession(
  overrides: Partial<SessionSummary> & { startedAt: Date; endedAt: Date }
): SessionSummary {
  return {
    sessionId: "s1",
    sessionNumber: 1,
    terminalTheta: 0,
    itemsAttempted: 20,
    itemsCorrect: 10,
    voluntaryBonusRounds: 0,
    durationSeconds: 1200,
    ...overrides,
  };
}

describe("computeReturnVisit", () => {
  it("returns 0 for a single session", () => {
    const result = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
    ]);
    expect(result.signalValue).toBe(0);
    expect(result.signalType).toBe("return_visit");
  });

  it("returns 0 for no sessions", () => {
    const result = computeReturnVisit([]);
    expect(result.signalValue).toBe(0);
  });

  it("increases with more sessions", () => {
    const twoSessions = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-01-02"),
        endedAt: new Date("2026-01-02"),
      }),
    ]);
    const fiveSessions = computeReturnVisit(
      Array.from({ length: 5 }, (_, i) =>
        makeSession({
          sessionId: `s${i}`,
          startedAt: new Date(`2026-01-0${i + 1}`),
          endedAt: new Date(`2026-01-0${i + 1}`),
        })
      )
    );
    expect(fiveSessions.signalValue).toBeGreaterThan(twoSessions.signalValue);
  });

  it("rewards sessions close together (recency bonus)", () => {
    const close = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-01-02"),
        endedAt: new Date("2026-01-02"),
      }),
    ]);
    const far = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-02-01"),
        endedAt: new Date("2026-02-01"),
      }),
    ]);
    expect(close.signalValue).toBeGreaterThan(far.signalValue);
  });

  it("caps at 1.0", () => {
    const manySessions = Array.from({ length: 10 }, (_, i) =>
      makeSession({
        sessionId: `s${i}`,
        startedAt: new Date(`2026-01-${String(i + 1).padStart(2, "0")}`),
        endedAt: new Date(`2026-01-${String(i + 1).padStart(2, "0")}`),
      })
    );
    const result = computeReturnVisit(manySessions);
    expect(result.signalValue).toBeLessThanOrEqual(1);
  });

  // --- Boundary condition tests ---

  it("returns 0 for exactly 0 sessions", () => {
    const result = computeReturnVisit([]);
    expect(result.signalValue).toBe(0);
    expect(result.rawData.sessionCount).toBe(0);
    expect(result.rawData.recencyBonus).toBe(0);
  });

  it("returns 0 for exactly 1 session", () => {
    const result = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
    ]);
    expect(result.signalValue).toBe(0);
    expect(result.rawData.sessionCount).toBe(1);
  });

  it("handles exactly 5 sessions at the target boundary", () => {
    const sessions = Array.from({ length: 5 }, (_, i) =>
      makeSession({
        sessionId: `s${i}`,
        startedAt: new Date(`2026-01-${String(i + 1).padStart(2, "0")}`),
        endedAt: new Date(`2026-01-${String(i + 1).padStart(2, "0")}`),
      })
    );
    const result = computeReturnVisit(sessions);
    // baseScore = 5/5 = 1.0
    // Gaps: all 1 day, avg = 1 day, recencyBonus = (14-1)/13 = 1.0
    // signalValue = min(1, 1.0 * 0.7 + 1.0 * 0.3) = 1.0
    expect(result.signalValue).toBe(1);
  });

  it("handles sessions exactly 14 days apart (recency bonus = 0)", () => {
    const result = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-01-15"),
        endedAt: new Date("2026-01-15"),
      }),
    ]);
    // baseScore = 2/5 = 0.4
    // avgGapDays = 14, recencyBonus = max(0, (14-14)/13) = 0
    // signalValue = 0.4 * 0.7 + 0 * 0.3 = 0.28
    expect(result.signalValue).toBeCloseTo(0.28, 2);
  });

  it("handles sessions exactly 1 day apart (max recency bonus)", () => {
    const result = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-01-02"),
        endedAt: new Date("2026-01-02"),
      }),
    ]);
    // baseScore = 2/5 = 0.4
    // avgGapDays = 1, recencyBonus = (14-1)/13 = 1.0
    // signalValue = 0.4 * 0.7 + 1.0 * 0.3 = 0.58
    expect(result.signalValue).toBeCloseTo(0.58, 2);
  });

  it("handles sessions more than 14 days apart (recency bonus clamped to 0)", () => {
    const result = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-03-01"),
        endedAt: new Date("2026-03-01"),
      }),
    ]);
    // avgGapDays >> 14, recencyBonus = 0
    expect(result.rawData.recencyBonus).toBe(0);
  });

  it("handles same-day sessions (gap = 0)", () => {
    const result = computeReturnVisit([
      makeSession({
        startedAt: new Date("2026-01-01T10:00:00Z"),
        endedAt: new Date("2026-01-01T10:30:00Z"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-01-01T14:00:00Z"),
        endedAt: new Date("2026-01-01T14:30:00Z"),
      }),
    ]);
    // Gap is very small (fraction of a day)
    expect(result.signalValue).toBeGreaterThan(0);
    expect(result.rawData.recencyBonus).toBeCloseTo(1, 1);
  });

  it("handles large number of sessions", () => {
    const sessions = Array.from({ length: 50 }, (_, i) =>
      makeSession({
        sessionId: `s${i}`,
        startedAt: new Date(`2026-01-${String((i % 28) + 1).padStart(2, "0")}`),
        endedAt: new Date(`2026-01-${String((i % 28) + 1).padStart(2, "0")}`),
      })
    );
    const result = computeReturnVisit(sessions);
    expect(result.signalValue).toBeGreaterThan(0);
    expect(result.signalValue).toBeLessThanOrEqual(1);
    expect(result.rawData.sessionCount).toBe(50);
  });

  it("sessions out of order are sorted correctly", () => {
    const result = computeReturnVisit([
      makeSession({
        sessionId: "s3",
        startedAt: new Date("2026-01-10"),
        endedAt: new Date("2026-01-10"),
      }),
      makeSession({
        sessionId: "s1",
        startedAt: new Date("2026-01-01"),
        endedAt: new Date("2026-01-01"),
      }),
      makeSession({
        sessionId: "s2",
        startedAt: new Date("2026-01-05"),
        endedAt: new Date("2026-01-05"),
      }),
    ]);
    // After sorting: Jan 1 -> Jan 5 (4d gap) -> Jan 10 (5d gap), avg = 4.5d
    expect(result.rawData.avgGapDays).toBeCloseTo(4.5, 1);
  });
});
