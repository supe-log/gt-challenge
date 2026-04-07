import type { SessionSummary, SignalResult } from "../types";

/**
 * Measures consistency of engagement via consecutive periods with activity.
 * A "period" is a calendar week. Target: 5 consecutive weeks with at least one session.
 */
export function computeStreak(sessions: SessionSummary[]): SignalResult {
  if (sessions.length === 0) {
    return {
      signalType: "streak",
      signalValue: 0,
      rawData: { currentStreak: 0, maxStreak: 0 },
    };
  }

  // Get the week number for each session's start date
  const weekKeys = sessions.map((s) => getWeekKey(s.startedAt));
  const uniqueWeeks = [...new Set(weekKeys)].sort();

  if (uniqueWeeks.length <= 1) {
    return {
      signalType: "streak",
      signalValue: Math.min(1, 1 / 5),
      rawData: { currentStreak: 1, maxStreak: 1 },
    };
  }

  // Find longest consecutive week streak
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueWeeks.length; i++) {
    if (areConsecutiveWeeks(uniqueWeeks[i - 1], uniqueWeeks[i])) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  const TARGET_WEEKS = 5;
  const signalValue = Math.min(1, maxStreak / TARGET_WEEKS);

  return {
    signalType: "streak",
    signalValue,
    rawData: {
      currentStreak,
      maxStreak,
      uniqueWeeks: uniqueWeeks.length,
    },
  };
}

/** Returns "YYYY-WW" for a given date (using UTC to avoid timezone issues) */
function getWeekKey(date: Date): string {
  const d = new Date(date.getTime());
  d.setUTCHours(0, 0, 0, 0);
  // Set to nearest Thursday (ISO week date) using UTC
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - yearStart.getTime()) / 86400000 -
        3 +
        ((yearStart.getUTCDay() + 6) % 7)) /
        7
    );
  return `${d.getUTCFullYear()}-${String(weekNum).padStart(2, "0")}`;
}

/** Checks if two "YYYY-WW" keys are consecutive weeks */
function areConsecutiveWeeks(a: string, b: string): boolean {
  const [yearA, weekA] = a.split("-").map(Number);
  const [yearB, weekB] = b.split("-").map(Number);

  if (yearA === yearB) return weekB === weekA + 1;
  // Handle year boundary (week 52/53 → week 1)
  if (yearB === yearA + 1 && weekB === 1 && weekA >= 52) return true;
  return false;
}
