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
});
