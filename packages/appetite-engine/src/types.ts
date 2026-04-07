/** A completed session summary for appetite computation */
export interface SessionSummary {
  sessionId: string;
  sessionNumber: number;
  startedAt: Date;
  endedAt: Date;
  terminalTheta: number;
  itemsAttempted: number;
  itemsCorrect: number;
  voluntaryBonusRounds: number;
  durationSeconds: number;
}

/** A single response within a session */
export interface ResponseSummary {
  isCorrect: boolean;
  timeOnItemMs: number;
  idleTimeMs: number;
  presentedAt: Date;
}

/** Input data for computing all appetite signals for a child */
export interface AppetiteInput {
  sessions: SessionSummary[];
  /** Responses grouped by session ID */
  responsesBySession: Record<string, ResponseSummary[]>;
}

/** Result of a single signal computation */
export interface SignalResult {
  signalType: string;
  signalValue: number;
  rawData: Record<string, unknown>;
}

/** Aggregated appetite score with tier */
export interface AppetiteResult {
  signals: SignalResult[];
  compositeScore: number;
  tier: "high" | "very_high" | "exceptional" | null;
}
