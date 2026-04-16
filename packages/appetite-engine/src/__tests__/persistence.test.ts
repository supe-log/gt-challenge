import { describe, it, expect } from "vitest";
import { computePersistence } from "../signals/persistence";
import type { ResponseSummary } from "../types";

function makeResponse(isCorrect: boolean): ResponseSummary {
  return {
    isCorrect,
    timeOnItemMs: 5000,
    idleTimeMs: 0,
    presentedAt: new Date("2026-01-01"),
  };
}

describe("computePersistence", () => {
  it("returns 0 for no sessions", () => {
    const result = computePersistence({});
    expect(result.signalValue).toBe(0);
  });

  it("returns 1.0 for all-correct session", () => {
    const result = computePersistence({
      s1: Array.from({ length: 20 }, () => makeResponse(true)),
    });
    expect(result.signalValue).toBe(1);
  });

  it("returns high value when child keeps going after wrong answers", () => {
    const responses = [
      makeResponse(true),
      makeResponse(true),
      makeResponse(false), // first wrong at index 2
      ...Array.from({ length: 17 }, () => makeResponse(true)), // 17 more items
    ];
    const result = computePersistence({ s1: responses });
    expect(result.signalValue).toBeGreaterThan(0.5);
  });

  it("returns lower value when child quits early after wrong answer", () => {
    const quitter = computePersistence({
      s1: [makeResponse(true), makeResponse(false), makeResponse(true)],
    });
    const persister = computePersistence({
      s1: [
        makeResponse(true),
        makeResponse(false),
        ...Array.from({ length: 18 }, () => makeResponse(true)),
      ],
    });
    expect(persister.signalValue).toBeGreaterThan(quitter.signalValue);
  });

  it("averages across multiple sessions", () => {
    const result = computePersistence({
      s1: Array.from({ length: 20 }, () => makeResponse(true)), // all correct = 1.0
      s2: [makeResponse(false)], // quit immediately = 0.0
    });
    expect(result.signalValue).toBeGreaterThan(0);
    expect(result.signalValue).toBeLessThan(1);
  });

  it("is bounded between 0 and 1", () => {
    const result = computePersistence({
      s1: [makeResponse(false)],
    });
    expect(result.signalValue).toBeGreaterThanOrEqual(0);
    expect(result.signalValue).toBeLessThanOrEqual(1);
  });

  // --- Boundary condition tests ---

  it("handles empty responses array in a session", () => {
    const result = computePersistence({ s1: [] });
    // Empty session is skipped in the loop, totalPersistenceScore stays 0
    // but sessionIds.length = 1, so signalValue = 0/1 = 0
    expect(result.signalValue).toBe(0);
    expect(result.signalType).toBe("persistence");
  });

  it("handles session with exactly one correct response", () => {
    const result = computePersistence({ s1: [makeResponse(true)] });
    // All correct -> persistence = 1.0
    expect(result.signalValue).toBe(1);
  });

  it("handles session with exactly one incorrect response", () => {
    const result = computePersistence({ s1: [makeResponse(false)] });
    // firstWrongIndex = 0, itemsAfterFirstWrong = 0
    // maxRemainingItems = max(1, 25-0) = 25
    // sessionPersistence = 0/25 = 0
    expect(result.signalValue).toBe(0);
  });

  it("handles first wrong answer at very last position", () => {
    const responses = [
      ...Array.from({ length: 19 }, () => makeResponse(true)),
      makeResponse(false), // first wrong at index 19 (last item)
    ];
    const result = computePersistence({ s1: responses });
    // firstWrongIndex=19, itemsAfterFirstWrong=0
    // maxRemainingItems = max(1, 25-19) = 6
    // sessionPersistence = 0/6 = 0
    // But this counts as sessionsWithErrors, so total = 0/1 = 0
    // Wait, they had 19 correct first. The score should be 0 since they didn't continue after wrong
    expect(result.signalValue).toBe(0);
  });

  it("handles large number of sessions", () => {
    const sessions: Record<string, ResponseSummary[]> = {};
    for (let i = 0; i < 100; i++) {
      sessions[`s${i}`] = [
        makeResponse(false),
        ...Array.from({ length: 20 }, () => makeResponse(true)),
      ];
    }
    const result = computePersistence(sessions);
    expect(result.signalValue).toBeGreaterThan(0);
    expect(result.signalValue).toBeLessThanOrEqual(1);
    expect(result.rawData.sessionCount).toBe(100);
  });

  it("handles session where every response is wrong", () => {
    const result = computePersistence({
      s1: Array.from({ length: 15 }, () => makeResponse(false)),
    });
    // firstWrongIndex = 0, itemsAfterFirstWrong = 14
    // maxRemainingItems = max(1, 25-0) = 25
    // persistence = min(1, 14/25) = 0.56
    expect(result.signalValue).toBeGreaterThan(0.5);
    expect(result.signalValue).toBeLessThanOrEqual(1);
  });

  it("handles many sessions mixing all-correct and quit-early", () => {
    const sessions: Record<string, ResponseSummary[]> = {};
    // Half the sessions are all correct, half quit after first wrong
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        sessions[`s${i}`] = Array.from({ length: 20 }, () =>
          makeResponse(true)
        );
      } else {
        sessions[`s${i}`] = [makeResponse(false)];
      }
    }
    const result = computePersistence(sessions);
    // 5 sessions with score 1.0, 5 with score 0.0 = 5/10 = 0.5
    expect(result.signalValue).toBeCloseTo(0.5, 2);
  });

  it("persistence is exactly 1 when child continues max items after first wrong at index 0", () => {
    // firstWrongIndex = 0, maxRemainingItems = max(1, 25-0) = 25
    // Need 25 items after to hit min(1, 25/25) = 1.0
    const responses = [
      makeResponse(false),
      ...Array.from({ length: 25 }, () => makeResponse(true)),
    ];
    const result = computePersistence({ s1: responses });
    expect(result.signalValue).toBe(1);
  });

  it("returns correct rawData structure", () => {
    const result = computePersistence({
      s1: [makeResponse(false), makeResponse(true)],
      s2: Array.from({ length: 10 }, () => makeResponse(true)),
    });
    expect(result.rawData.sessionCount).toBe(2);
    expect(result.rawData.sessionsWithErrors).toBe(1);
  });
});
