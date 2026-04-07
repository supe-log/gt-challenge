import { describe, it, expect } from "vitest";
import { computeLearningVelocity } from "../signals/learning-velocity";
import type { SessionSummary } from "../types";

function makeSession(
  sessionNumber: number,
  terminalTheta: number,
  day: number
): SessionSummary {
  return {
    sessionId: `s${sessionNumber}`,
    sessionNumber,
    startedAt: new Date(`2026-01-${String(day).padStart(2, "0")}`),
    endedAt: new Date(`2026-01-${String(day).padStart(2, "0")}`),
    terminalTheta,
    itemsAttempted: 20,
    itemsCorrect: 10,
    voluntaryBonusRounds: 0,
    durationSeconds: 1200,
  };
}

describe("computeLearningVelocity", () => {
  it("returns 0 for a single session", () => {
    const result = computeLearningVelocity([makeSession(1, 0.5, 1)]);
    expect(result.signalValue).toBe(0);
  });

  it("returns 0 for no sessions", () => {
    expect(computeLearningVelocity([]).signalValue).toBe(0);
  });

  it("returns 0.5 for no improvement", () => {
    const result = computeLearningVelocity([
      makeSession(1, 0.5, 1),
      makeSession(2, 0.5, 2),
    ]);
    expect(result.signalValue).toBeCloseTo(0.5, 1);
  });

  it("returns ~1.0 for strong improvement (+1 SD)", () => {
    const result = computeLearningVelocity([
      makeSession(1, 0.0, 1),
      makeSession(2, 1.0, 2),
    ]);
    expect(result.signalValue).toBe(1);
  });

  it("returns ~0 for strong regression (-1 SD)", () => {
    const result = computeLearningVelocity([
      makeSession(1, 1.0, 1),
      makeSession(2, 0.0, 2),
    ]);
    expect(result.signalValue).toBe(0);
  });

  it("handles out-of-order sessions (sorts by date)", () => {
    const result = computeLearningVelocity([
      makeSession(2, 0.8, 5), // later date, higher theta
      makeSession(1, 0.0, 1), // earlier date, lower theta
    ]);
    expect(result.signalValue).toBeGreaterThan(0.5);
  });

  it("is clamped between 0 and 1", () => {
    const result = computeLearningVelocity([
      makeSession(1, -2.0, 1),
      makeSession(2, 2.0, 2),
    ]);
    expect(result.signalValue).toBeLessThanOrEqual(1);
    expect(result.signalValue).toBeGreaterThanOrEqual(0);
  });
});
