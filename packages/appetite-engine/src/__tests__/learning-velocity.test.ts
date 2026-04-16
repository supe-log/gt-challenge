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

  // --- Boundary condition tests ---

  it("returns 0.5 boundary: exactly 0 delta maps to 0.5", () => {
    const result = computeLearningVelocity([
      makeSession(1, 1.0, 1),
      makeSession(2, 1.0, 2),
    ]);
    // thetaDelta = 0, signalValue = (0 + 1) / 2 = 0.5
    expect(result.signalValue).toBeCloseTo(0.5, 5);
  });

  it("returns exactly 1.0 at +1 SD boundary", () => {
    const result = computeLearningVelocity([
      makeSession(1, 0.0, 1),
      makeSession(2, 1.0, 2),
    ]);
    // thetaDelta = 1.0, signalValue = min(1, (1+1)/2) = 1.0
    expect(result.signalValue).toBe(1);
  });

  it("returns exactly 0.0 at -1 SD boundary", () => {
    const result = computeLearningVelocity([
      makeSession(1, 1.0, 1),
      makeSession(2, 0.0, 2),
    ]);
    // thetaDelta = -1.0, signalValue = max(0, (-1+1)/2) = 0.0
    expect(result.signalValue).toBe(0);
  });

  it("clamps to 1.0 for very large improvement (>1 SD)", () => {
    const result = computeLearningVelocity([
      makeSession(1, -2.0, 1),
      makeSession(2, 3.0, 2),
    ]);
    // thetaDelta = 5.0, signalValue = min(1, (5+1)/2) = min(1, 3.0) = 1.0
    expect(result.signalValue).toBe(1);
  });

  it("clamps to 0 for very large regression (< -1 SD)", () => {
    const result = computeLearningVelocity([
      makeSession(1, 3.0, 1),
      makeSession(2, -2.0, 2),
    ]);
    // thetaDelta = -5.0, signalValue = max(0, (-5+1)/2) = max(0, -2.0) = 0
    expect(result.signalValue).toBe(0);
  });

  it("handles many sessions (uses first and last by date)", () => {
    const result = computeLearningVelocity([
      makeSession(1, 0.0, 1),
      makeSession(2, 0.3, 5),
      makeSession(3, 0.5, 10),
      makeSession(4, 0.7, 15),
      makeSession(5, 1.0, 20),
    ]);
    // Sorted by date: first theta=0.0, last theta=1.0, delta=1.0
    expect(result.signalValue).toBe(1);
  });

  it("uses first and last chronologically, ignoring middle dips", () => {
    const result = computeLearningVelocity([
      makeSession(1, 0.0, 1),
      makeSession(2, -1.0, 5), // dip in the middle
      makeSession(3, 0.5, 10), // recovery
    ]);
    // delta = 0.5 - 0.0 = 0.5, signalValue = (0.5 + 1) / 2 = 0.75
    expect(result.signalValue).toBeCloseTo(0.75, 2);
  });

  it("handles negative theta values", () => {
    const result = computeLearningVelocity([
      makeSession(1, -2.0, 1),
      makeSession(2, -1.5, 2),
    ]);
    // delta = -1.5 - (-2.0) = 0.5, signalValue = (0.5+1)/2 = 0.75
    expect(result.signalValue).toBeCloseTo(0.75, 2);
  });

  it("returns correct rawData", () => {
    const result = computeLearningVelocity([
      makeSession(1, 0.5, 1),
      makeSession(2, 1.2, 2),
    ]);
    expect(result.rawData.sessionCount).toBe(2);
    expect(result.rawData.firstTheta).toBeCloseTo(0.5, 2);
    expect(result.rawData.lastTheta).toBeCloseTo(1.2, 2);
    expect(result.rawData.thetaDelta).toBeCloseTo(0.7, 2);
  });

  it("returns 0 signalValue and thetaDelta for single session", () => {
    const result = computeLearningVelocity([makeSession(1, 2.5, 1)]);
    expect(result.signalValue).toBe(0);
    expect(result.rawData.thetaDelta).toBe(0);
    expect(result.rawData.sessionCount).toBe(1);
  });
});
