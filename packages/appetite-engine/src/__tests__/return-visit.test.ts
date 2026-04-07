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
});
