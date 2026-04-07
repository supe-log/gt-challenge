import { describe, it, expect } from "vitest";
import { computeAppetiteComposite } from "../composite";
import { computeAllSignals } from "../compute-all";
import type { SignalResult, AppetiteInput } from "../types";

function makeSignal(value: number): SignalResult {
  return { signalType: "test", signalValue: value, rawData: {} };
}

describe("computeAppetiteComposite", () => {
  it("returns null tier for empty signals", () => {
    const result = computeAppetiteComposite([]);
    expect(result.compositeScore).toBe(0);
    expect(result.tier).toBeNull();
  });

  it("returns exceptional for high scores", () => {
    const signals = Array.from({ length: 6 }, () => makeSignal(0.8));
    const result = computeAppetiteComposite(signals);
    expect(result.tier).toBe("exceptional");
    expect(result.compositeScore).toBeCloseTo(0.8, 2);
  });

  it("returns very_high for moderate scores", () => {
    const signals = Array.from({ length: 6 }, () => makeSignal(0.5));
    const result = computeAppetiteComposite(signals);
    expect(result.tier).toBe("very_high");
  });

  it("returns high for lower scores", () => {
    const signals = Array.from({ length: 6 }, () => makeSignal(0.3));
    const result = computeAppetiteComposite(signals);
    expect(result.tier).toBe("high");
  });

  it("returns null tier for very low scores", () => {
    const signals = Array.from({ length: 6 }, () => makeSignal(0.1));
    const result = computeAppetiteComposite(signals);
    expect(result.tier).toBeNull();
  });
});

describe("computeAllSignals", () => {
  it("computes all 6 signals for a multi-session child", () => {
    const input: AppetiteInput = {
      sessions: [
        {
          sessionId: "s1",
          sessionNumber: 1,
          startedAt: new Date("2026-01-05"),
          endedAt: new Date("2026-01-05"),
          terminalTheta: 0.2,
          itemsAttempted: 20,
          itemsCorrect: 12,
          voluntaryBonusRounds: 1,
          durationSeconds: 1500,
        },
        {
          sessionId: "s2",
          sessionNumber: 2,
          startedAt: new Date("2026-01-12"),
          endedAt: new Date("2026-01-12"),
          terminalTheta: 0.6,
          itemsAttempted: 25,
          itemsCorrect: 16,
          voluntaryBonusRounds: 2,
          durationSeconds: 1800,
        },
      ],
      responsesBySession: {
        s1: Array.from({ length: 20 }, (_, i) => ({
          isCorrect: i < 12,
          timeOnItemMs: 5000,
          idleTimeMs: 0,
          presentedAt: new Date("2026-01-05"),
        })),
        s2: Array.from({ length: 25 }, (_, i) => ({
          isCorrect: i < 16,
          timeOnItemMs: 4000,
          idleTimeMs: 0,
          presentedAt: new Date("2026-01-12"),
        })),
      },
    };

    const result = computeAllSignals(input);

    expect(result.signals).toHaveLength(6);
    expect(result.signals.map((s) => s.signalType)).toEqual([
      "return_visit",
      "persistence",
      "voluntary_hard",
      "learning_velocity",
      "time_investment",
      "streak",
    ]);
    // All signals should be between 0 and 1
    for (const signal of result.signals) {
      expect(signal.signalValue).toBeGreaterThanOrEqual(0);
      expect(signal.signalValue).toBeLessThanOrEqual(1);
    }
    expect(result.compositeScore).toBeGreaterThan(0);
    expect(result.tier).not.toBeNull();
  });
});
