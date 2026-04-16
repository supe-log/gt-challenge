/**
 * Badge definitions for the GT Challenge gamification system.
 *
 * Each badge has an earnedCheck that evaluates against a BadgeStats
 * object computed server-side from session and response data.
 */

export interface BadgeStats {
  sessionsCompleted: number;
  streakMax: number;
  bonusRoundsTotal: number;
  domains: Set<string>;
  thetaImproved: boolean;
  aptitudeTier: string | null;
  persistedAfterWrong: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** SVG path data for the badge icon */
  icon: string;
  earnedCheck: (stats: BadgeStats) => boolean;
}

/** All badges in the system, in display order */
export const BADGES: Badge[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first session",
    icon: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z",
    earnedCheck: (s) => s.sessionsCompleted >= 1,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Try all 4 domains",
    icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
    earnedCheck: (s) => {
      const required = new Set(["reasoning", "math", "verbal", "pattern_recognition"]);
      for (const d of required) {
        if (!s.domains.has(d)) return false;
      }
      return true;
    },
  },
  {
    id: "hot_streak",
    name: "Hot Streak",
    description: "Answer 5 in a row correctly",
    icon: "M13.5 0.67s0.74 2.65 0.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z",
    earnedCheck: (s) => s.streakMax >= 5,
  },
  {
    id: "persistent",
    name: "Persistent",
    description: "Keep going after getting 3 wrong",
    icon: "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z",
    earnedCheck: (s) => s.persistedAfterWrong,
  },
  {
    id: "bonus_seeker",
    name: "Bonus Seeker",
    description: "Accept a bonus round",
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z",
    earnedCheck: (s) => s.bonusRoundsTotal >= 1,
  },
  {
    id: "comeback_kid",
    name: "Comeback Kid",
    description: "Return for a 2nd session",
    icon: "M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
    earnedCheck: (s) => s.sessionsCompleted >= 2,
  },
  {
    id: "regular",
    name: "Regular",
    description: "Complete 3 sessions",
    icon: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
    earnedCheck: (s) => s.sessionsCompleted >= 3,
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete 5 sessions",
    icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
    earnedCheck: (s) => s.sessionsCompleted >= 5,
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Reach Very High aptitude",
    icon: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
    earnedCheck: (s) =>
      s.aptitudeTier === "very_high" || s.aptitudeTier === "exceptional",
  },
  {
    id: "climbing_higher",
    name: "Climbing Higher",
    description: "Improve your score across sessions",
    icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z",
    earnedCheck: (s) => s.thetaImproved,
  },
];

export const TOTAL_BADGES = BADGES.length;

/**
 * Evaluate which badges have been earned given the stats.
 * Returns a Set of badge IDs that are earned.
 */
export function evaluateEarnedBadges(stats: BadgeStats): Set<string> {
  const earned = new Set<string>();
  for (const badge of BADGES) {
    if (badge.earnedCheck(stats)) {
      earned.add(badge.id);
    }
  }
  return earned;
}

/**
 * Serializable badge result for passing from server to client.
 */
export interface BadgeResult {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

/**
 * Get all badges with earned status, suitable for passing to client components.
 */
export function getBadgeResults(stats: BadgeStats): BadgeResult[] {
  const earned = evaluateEarnedBadges(stats);
  return BADGES.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    icon: b.icon,
    earned: earned.has(b.id),
  }));
}
