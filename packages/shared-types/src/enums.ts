export const Domain = {
  REASONING: "reasoning",
  MATH: "math",
  VERBAL: "verbal",
  PATTERN_RECOGNITION: "pattern_recognition",
} as const;
export type Domain = (typeof Domain)[keyof typeof Domain];

export const AgeBand = {
  K2: "K-2",
  BAND_3_5: "3-5",
  BAND_6_8: "6-8",
} as const;
export type AgeBand = (typeof AgeBand)[keyof typeof AgeBand];

export const Role = {
  CHILD: "child",
  PARENT: "parent",
  ADMIN: "admin",
  PSYCHOMETRICIAN: "psychometrician",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Relationship = {
  PARENT: "parent",
  GUARDIAN: "guardian",
  EDUCATOR: "educator",
} as const;
export type Relationship = (typeof Relationship)[keyof typeof Relationship];

export const ItemStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  RETIRED: "retired",
  FLAGGED: "flagged",
} as const;
export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

export const SessionStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
  INVALIDATED: "invalidated",
} as const;
export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export const AptitudeTier = {
  HIGH: "high",
  VERY_HIGH: "very_high",
  EXCEPTIONAL: "exceptional",
} as const;
export type AptitudeTier = (typeof AptitudeTier)[keyof typeof AptitudeTier];

export const AppetiteTier = {
  HIGH: "high",
  VERY_HIGH: "very_high",
  EXCEPTIONAL: "exceptional",
} as const;
export type AppetiteTier = (typeof AppetiteTier)[keyof typeof AppetiteTier];

export const SignalType = {
  RETURN_VISIT: "return_visit",
  PERSISTENCE: "persistence",
  VOLUNTARY_HARD: "voluntary_hard",
  LEARNING_VELOCITY: "learning_velocity",
  TIME_INVESTMENT: "time_investment",
  STREAK: "streak",
} as const;
export type SignalType = (typeof SignalType)[keyof typeof SignalType];
