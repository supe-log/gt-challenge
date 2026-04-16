/** Convert a theta value to a human-readable aptitude label */
export function thetaToLabel(theta: number): string {
  if (theta >= 1.5) return "Exceptional";
  if (theta >= 0.75) return "Very High";
  if (theta >= 0) return "High";
  if (theta >= -0.75) return "Average";
  return "Developing";
}

/** Get the emoji for a theta level */
export function thetaToEmoji(theta: number): string {
  if (theta >= 1.5) return "\u{1F680}"; // rocket
  if (theta >= 0.75) return "\u{1F31F}"; // star
  if (theta >= 0) return "\u2B50"; // star
  if (theta >= -0.75) return "\u{1F4AA}"; // flexed biceps
  return "\u{1F331}"; // seedling
}

/** Get badge color classes for a tier */
export function tierColor(tier: string): string {
  switch (tier) {
    case "exceptional": return "bg-purple-100 text-purple-700";
    case "very_high": return "bg-blue-100 text-blue-700";
    case "high": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

/** Appetite signal display configuration */
export const SIGNAL_DISPLAY = [
  { key: "return_visit", label: "Return Visits", emoji: "\u{1F504}" },
  { key: "persistence", label: "Persistence", emoji: "\u{1F4AA}" },
  { key: "voluntary_hard", label: "Bonus Rounds", emoji: "\u2B50" },
  { key: "learning_velocity", label: "Learning Speed", emoji: "\u{1F4C8}" },
  { key: "time_investment", label: "Time Invested", emoji: "\u23F1\uFE0F" },
  { key: "streak", label: "Consistency", emoji: "\u{1F525}" },
] as const;
