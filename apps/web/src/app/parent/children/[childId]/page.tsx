import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { thetaToLabel, tierColor, SIGNAL_DISPLAY } from "@/lib/scoring";
import { getBadgeResults } from "@/lib/badges";
import type { BadgeStats } from "@/lib/badges";
import { BadgeGrid } from "@/components/badges";
import { ProgressMountain } from "@/components/progress-mountain";
import { thetaToPercentile, getPercentileLabel } from "@/lib/norms";
import { PercentileBadge } from "@/components/percentile-badge";

const DOMAIN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  reasoning: { label: "Reasoning", color: "bg-purple-500", bg: "bg-purple-50 text-purple-700" },
  math: { label: "Math", color: "bg-blue-500", bg: "bg-blue-50 text-blue-700" },
  verbal: { label: "Verbal", color: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700" },
  pattern_recognition: { label: "Patterns", color: "bg-amber-500", bg: "bg-amber-50 text-amber-700" },
};

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get child profile
  const { data: child } = await supabase
    .from("profiles")
    .select("id, display_name, age_band, created_at")
    .eq("id", childId)
    .single();

  if (!child) redirect("/parent");

  // Get sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, session_number, status, items_attempted, items_correct, terminal_theta, started_at, duration_seconds, voluntary_bonus_rounds")
    .eq("child_id", childId)
    .order("session_number", { ascending: false });

  // Get composite score
  const { data: score } = await supabase
    .from("composite_scores")
    .select("aptitude_theta, aptitude_se, aptitude_tier, appetite_score, appetite_tier, sessions_completed, proctor_eligible, computed_at")
    .eq("child_id", childId)
    .single();

  // Get appetite signals
  const { data: appetiteSignals } = await supabase
    .from("appetite_signals")
    .select("signal_type, signal_value, computed_at")
    .eq("child_id", childId)
    .order("computed_at", { ascending: false });

  // Get domain-level performance from responses
  const { data: responses } = await supabase
    .from("responses")
    .select("item_id, is_correct")
    .eq("child_id", childId)
    .not("is_correct", "is", null);

  const responseItemIds = responses?.map((r) => r.item_id) ?? [];
  let domainStats: Record<string, { correct: number; total: number }> = {};
  if (responseItemIds.length > 0) {
    const { data: items } = await supabase
      .from("items")
      .select("id, domain")
      .in("id", responseItemIds);

    const itemDomainMap = new Map<string, string>();
    for (const item of items ?? []) {
      itemDomainMap.set(item.id, item.domain);
    }

    for (const r of responses ?? []) {
      const domain = itemDomainMap.get(r.item_id);
      if (!domain) continue;
      if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
      domainStats[domain].total++;
      if (r.is_correct) domainStats[domain].correct++;
    }
  }

  const completedSessions = sessions?.filter((s) => s.status === "completed") ?? [];

  // ─── Badge stats computation ───────────────────────────────────
  // Compute streak max and persistence from responses grouped by session
  let streakMax = 0;
  let persistedAfterWrong = false;
  const bonusRoundsTotal = completedSessions.reduce(
    (sum, s) => sum + (s.voluntary_bonus_rounds ?? 0),
    0
  );

  // For each completed session, fetch responses in order to calculate streaks
  for (const sess of completedSessions) {
    const { data: sessionResponses } = await supabase
      .from("responses")
      .select("is_correct")
      .eq("session_id", sess.id)
      .not("is_correct", "is", null)
      .order("presented_at", { ascending: true });

    if (!sessionResponses) continue;

    let currentStreak = 0;
    let wrongCount = 0;
    let answeredAfterThreeWrong = false;

    for (const r of sessionResponses) {
      if (r.is_correct) {
        currentStreak++;
        if (currentStreak > streakMax) streakMax = currentStreak;
      } else {
        currentStreak = 0;
        wrongCount++;
      }
      if (wrongCount >= 3 && sessionResponses.indexOf(r) < sessionResponses.length - 1) {
        answeredAfterThreeWrong = true;
      }
    }

    if (answeredAfterThreeWrong) persistedAfterWrong = true;
  }

  // Check if theta improved across consecutive sessions
  const sortedSessions = [...completedSessions]
    .filter((s) => s.terminal_theta !== null)
    .sort((a, b) => a.session_number - b.session_number);
  let thetaImproved = false;
  for (let i = 1; i < sortedSessions.length; i++) {
    if ((sortedSessions[i].terminal_theta ?? 0) > (sortedSessions[i - 1].terminal_theta ?? 0)) {
      thetaImproved = true;
      break;
    }
  }

  const badgeStats: BadgeStats = {
    sessionsCompleted: completedSessions.length,
    streakMax,
    bonusRoundsTotal,
    domains: new Set(Object.keys(domainStats)),
    thetaImproved,
    aptitudeTier: score?.aptitude_tier ?? null,
    persistedAfterWrong,
  };

  const badgeResults = getBadgeResults(badgeStats);

  // Deduplicate signals (keep most recent per type)
  const latestSignals = new Map<string, { signal_type: string; signal_value: number }>();
  for (const signal of appetiteSignals ?? []) {
    if (!latestSignals.has(signal.signal_type)) {
      latestSignals.set(signal.signal_type, signal);
    }
  }

  const totalItems = completedSessions.reduce((sum, s) => sum + s.items_attempted, 0);
  const totalCorrect = completedSessions.reduce((sum, s) => sum + s.items_correct, 0);
  const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);

  // Milestones
  const milestones = [
    { label: "First session", done: completedSessions.length >= 1, target: "Complete 1 session" },
    { label: "Reliable score", done: completedSessions.length >= 2, target: "Complete 2 sessions" },
    { label: "Appetite signals", done: completedSessions.length >= 3, target: "Complete 3 sessions" },
    { label: "Full profile", done: completedSessions.length >= 5, target: "Complete 5 sessions" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/parent" className="text-sm text-indigo-600 hover:underline mb-2 block">
            &larr; Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold">{child.display_name}</h1>
          <p className="text-gray-500">
            {child.age_band ? `Grades ${child.age_band}` : "Age band not set"}
            {completedSessions.length > 0 && (
              <span> &middot; {completedSessions.length} session{completedSessions.length !== 1 ? "s" : ""} completed</span>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/session/new?child=${childId}`}
            className="inline-block text-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-colors shadow-sm"
          >
            Start New Challenge
          </Link>
          {completedSessions.length > 0 && (
            <Link
              href={`/parent/children/${childId}/report`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF Report
            </Link>
          )}
        </div>
      </div>

      {/* How They Compare — Percentile Ranking */}
      {score && score.aptitude_theta !== null && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <PercentileBadge theta={score.aptitude_theta} size="lg" />
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="font-semibold text-lg">How they compare</h2>
              <p className="text-gray-600">
                {child.display_name} scored higher than{" "}
                <span className="font-bold text-indigo-600">
                  {thetaToPercentile(score.aptitude_theta)}%
                </span>{" "}
                of peers in{" "}
                {child.age_band ? `Grades ${child.age_band}` : "their age band"}.
              </p>
              {score.sessions_completed < 2 && (
                <p className="text-xs text-amber-600 mt-2">
                  This estimate improves with more sessions.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {completedSessions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sessions", value: completedSessions.length },
            { label: "Items answered", value: totalItems },
            { label: "Overall accuracy", value: totalItems > 0 ? `${Math.round((totalCorrect / totalItems) * 100)}%` : "—" },
            { label: "Time invested", value: totalDuration > 0 ? `${Math.round(totalDuration / 60)}m` : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Score Summary — Aptitude + Appetite side by side */}
      {score && score.aptitude_theta !== null ? (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Aptitude Card */}
          <div className="rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Aptitude</h2>
              {score.aptitude_tier && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tierColor(score.aptitude_tier)}`}>
                  {score.aptitude_tier.replace("_", " ")}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {thetaToLabel(score.aptitude_theta)}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.max(5, ((score.aptitude_theta + 3) / 6) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{score.sessions_completed} session{score.sessions_completed !== 1 ? "s" : ""}</span>
              <span>Updated {new Date(score.computed_at).toLocaleDateString()}</span>
            </div>
            {score.sessions_completed < 2 && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                Complete at least 2 sessions for a reliable score.
              </p>
            )}
          </div>

          {/* Appetite Card */}
          <div className="rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Appetite</h2>
              {score.appetite_tier && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tierColor(score.appetite_tier)}`}>
                  {score.appetite_tier.replace("_", " ")}
                </span>
              )}
            </div>
            {score.appetite_score !== null ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {Math.round(score.appetite_score * 100)}%
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                    style={{ width: `${Math.max(5, score.appetite_score * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Needs more sessions to compute.</p>
            )}

            {/* Signal Breakdown */}
            {latestSignals.size > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {SIGNAL_DISPLAY.map(({ key, label, emoji }) => {
                  const signal = latestSignals.get(key);
                  const value = signal?.signal_value ?? 0;
                  return (
                    <div key={key} className="text-center p-2 rounded-lg bg-gray-50">
                      <div className="text-lg">{emoji}</div>
                      <div className="text-sm font-bold">{Math.round(value * 100)}%</div>
                      <div className="text-[10px] text-gray-400 leading-tight">{label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <div className="max-w-sm mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2">No scores yet</h3>
            <p className="text-gray-500 text-sm mb-4">Start a challenge session to begin building {child.display_name}&apos;s profile.</p>
            <Link
              href={`/session/new?child=${childId}`}
              className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Start First Challenge
            </Link>
          </div>
        </div>
      )}

      {/* Domain Breakdown */}
      {Object.keys(domainStats).length > 0 && (
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Performance by Domain</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
              const stats = domainStats[key];
              if (!stats || stats.total === 0) return null;
              const pct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-20 text-right">
                    <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${config.bg}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${config.color} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-12 text-right">{pct}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{stats.correct}/{stats.total} correct</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Theta Progression — SVG Line Chart */}
      {completedSessions.length >= 2 && (
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Progress Over Sessions</h2>
          <div className="relative h-40">
            <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="60" x2="400" y2="60" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="30" x2="400" y2="30" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />

              {/* Area fill */}
              <polygon
                fill="url(#areaGradient)"
                opacity="0.15"
                points={[
                  ...completedSessions
                    .slice()
                    .reverse()
                    .map((s, i, arr) => {
                      const x = arr.length === 1 ? 200 : (i / (arr.length - 1)) * 380 + 10;
                      const theta = s.terminal_theta ?? 0;
                      const y = 110 - ((theta + 3) / 6) * 100;
                      return `${x},${y}`;
                    }),
                  `390,110`,
                  `10,110`,
                ].join(" ")}
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="url(#thetaGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={completedSessions
                  .slice()
                  .reverse()
                  .map((s, i, arr) => {
                    const x = arr.length === 1 ? 200 : (i / (arr.length - 1)) * 380 + 10;
                    const theta = s.terminal_theta ?? 0;
                    const y = 110 - ((theta + 3) / 6) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Points */}
              {completedSessions
                .slice()
                .reverse()
                .map((s, i, arr) => {
                  const x = arr.length === 1 ? 200 : (i / (arr.length - 1)) * 380 + 10;
                  const theta = s.terminal_theta ?? 0;
                  const y = 110 - ((theta + 3) / 6) * 100;
                  return (
                    <circle key={s.id} cx={x} cy={y} r="5" fill="#6366f1" stroke="white" strokeWidth="2" />
                  );
                })}

              <defs>
                <linearGradient id="thetaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Session labels */}
            <div className="flex justify-between mt-1">
              {completedSessions
                .slice()
                .reverse()
                .map((s) => (
                  <span key={s.id} className="text-xs text-gray-400">
                    S{s.session_number}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges & Progress Mountain */}
      {completedSessions.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <ProgressMountain
            sessionsCompleted={completedSessions.length}
            childName={child.display_name}
          />
          <BadgeGrid badges={badgeResults} />
        </div>
      )}

      {/* Milestones */}
      <div className="rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg mb-4">Milestones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.map(({ label, done, target }) => (
            <div
              key={label}
              className={`rounded-lg p-4 text-center border ${
                done
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className={`text-2xl mb-1 ${done ? "" : "grayscale opacity-30"}`}>
                {done ? (
                  <svg className="w-6 h-6 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-6 h-6 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /></svg>
                )}
              </div>
              <p className={`text-xs font-semibold ${done ? "text-green-700" : "text-gray-500"}`}>{label}</p>
              {!done && <p className="text-[10px] text-gray-400 mt-1">{target}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Session History */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Session History</h2>
        {sessions && sessions.length > 0 ? (
          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Session</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Accuracy</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Bonus</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">#{s.session_number}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(s.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{s.items_attempted}</td>
                    <td className="px-4 py-3">
                      {s.items_attempted > 0
                        ? `${Math.round((s.items_correct / s.items_attempted) * 100)}%`
                        : "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.duration_seconds
                        ? `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`
                        : "\u2014"}
                    </td>
                    <td className="px-4 py-3">
                      {s.voluntary_bonus_rounds > 0 ? (
                        <span className="text-amber-600 font-medium">
                          {s.voluntary_bonus_rounds} round{s.voluntary_bonus_rounds !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-gray-300">\u2014</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : s.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : s.status === "abandoned"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No sessions yet. Start a challenge to see history here.</p>
        )}
      </div>
    </div>
  );
}
